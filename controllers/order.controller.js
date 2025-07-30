const prisma = require('../utils/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/response');
const { sendEmail, emailTemplates } = require('../utils/email');
const { checkoutSchema, createOrderSchema } = require('../validators/order.validator');

// @desc    Initiate checkout
// @route   POST /api/orders/checkout
// @access  Private
const initiateCheckout = asyncHandler(async (req, res) => {
  const { error } = checkoutSchema.validate(req.body);
  if (error) {
    return ApiResponse.error(res, error.details[0].message, 400);
  }

  const { addressId, paymentMethod, notes } = req.body;
  const userId = req.user.id;

  // Get cart items
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          salePrice: true,
          stock: true,
          isActive: true
        }
      }
    }
  });

  if (cartItems.length === 0) {
    return ApiResponse.error(res, 'Cart is empty', 400);
  }

  // Validate stock and calculate totals
  let subtotal = 0;
  for (const item of cartItems) {
    if (!item.product.isActive) {
      return ApiResponse.error(res, `Product ${item.product.name} is no longer available`, 400);
    }
    
    if (item.product.stock < item.quantity) {
      return ApiResponse.error(res, `Insufficient stock for ${item.product.name}`, 400);
    }

    const price = item.product.salePrice || item.product.price;
    subtotal += parseFloat(price) * item.quantity;
  }

  // Calculate shipping and tax
  const shippingCost = subtotal >= 999 ? 0 : 50; // Free shipping above ₹999
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shippingCost + tax;

  // Verify address belongs to user
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId
    }
  });

  if (!address) {
    return ApiResponse.error(res, 'Invalid address', 400);
  }

  const checkoutData = {
    items: cartItems,
    subtotal: subtotal.toFixed(2),
    shippingCost: shippingCost.toFixed(2),
    tax: tax.toFixed(2),
    total: total.toFixed(2),
    address,
    paymentMethod
  };

  ApiResponse.success(res, checkoutData, 'Checkout initiated successfully');
});

// @desc    Create order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { error } = createOrderSchema.validate(req.body);
  if (error) {
    return ApiResponse.error(res, error.details[0].message, 400);
  }

  const { addressId, paymentMethod, paymentIntentId, notes } = req.body;
  const userId = req.user.id;

  // Get cart items
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          salePrice: true,
          stock: true,
          isActive: true
        }
      }
    }
  });

  if (cartItems.length === 0) {
    return ApiResponse.error(res, 'Cart is empty', 400);
  }

  // Calculate totals
  let subtotal = 0;
  for (const item of cartItems) {
    const price = item.product.salePrice || item.product.price;
    subtotal += parseFloat(price) * item.quantity;
  }

  const shippingCost = subtotal >= 999 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shippingCost + tax;

  // Generate order number
  const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

  try {
    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId,
          addressId,
          orderNumber,
          paymentMethod,
          subtotal,
          shippingCost,
          tax,
          total,
          notes,
          status: paymentMethod === 'COD' ? 'CONFIRMED' : 'PENDING'
        }
      });

      // Create order items
      const orderItems = await Promise.all(
        cartItems.map(item => {
          const price = item.product.salePrice || item.product.price;
          return tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.productId,
              quantity: item.quantity,
              price,
              total: parseFloat(price) * item.quantity
            }
          });
        })
      );

      // Create payment record
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          paymentMethod,
          amount: total,
          status: paymentMethod === 'COD' ? 'COMPLETED' : 'PENDING',
          stripePaymentId: paymentIntentId
        }
      });

      // Update product stock
      await Promise.all(
        cartItems.map(item =>
          tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          })
        )
      );

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { userId }
      });

      return newOrder;
    });

    // Send confirmation email
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true, email: true }
      });

      await sendEmail({
        email: user.email,
        subject: 'Order Confirmation',
        html: emailTemplates.orderConfirmation(order, user)
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // Don't fail the order if email fails
    }

    ApiResponse.success(res, order, 'Order created successfully', 201);
  } catch (error) {
    console.error('Order creation error:', error);
    return ApiResponse.error(res, 'Failed to create order', 500);
  }
});

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true
              }
            }
          }
        },
        address: true
      },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    }),
    prisma.order.count({
      where: { userId: req.user.id }
    })
  ]);

  const pagination = {
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / parseInt(limit)),
    totalItems: total,
    hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
    hasPrev: parseInt(page) > 1
  };

  ApiResponse.paginated(res, orders, pagination, 'Orders fetched successfully');
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await prisma.order.findFirst({
    where: {
      id,
      userId: req.user.id
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
              price: true,
              salePrice: true
            }
          }
        }
      },
      address: true,
      payment: true
    }
  });

  if (!order) {
    return ApiResponse.error(res, 'Order not found', 404);
  }

  ApiResponse.success(res, order, 'Order fetched successfully');
});

// @desc    Cancel order
// @route   POST /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await prisma.order.findFirst({
    where: {
      id,
      userId: req.user.id
    },
    include: {
      items: true
    }
  });

  if (!order) {
    return ApiResponse.error(res, 'Order not found', 404);
  }

  if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
    return ApiResponse.error(res, 'Order cannot be cancelled', 400);
  }

  await prisma.$transaction(async (tx) => {
    // Update order status
    await tx.order.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    // Restore product stock
    await Promise.all(
      order.items.map(item =>
        tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        })
      )
    );
  });

  ApiResponse.success(res, null, 'Order cancelled successfully');
});

module.exports = {
  initiateCheckout,
  createOrder,
  getUserOrders,
  getOrder,
  cancelOrder
};