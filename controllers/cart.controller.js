const prisma = require('../utils/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/response');
const { addToCartSchema, updateCartSchema } = require('../validators/cart.validator');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId: req.user.id },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          salePrice: true,
          images: true,
          stock: true,
          isActive: true
        }
      }
    }
  });

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product.salePrice || item.product.price;
    return sum + (parseFloat(price) * item.quantity);
  }, 0);

  const cart = {
    items: cartItems,
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: subtotal.toFixed(2)
  };

  ApiResponse.success(res, cart, 'Cart fetched successfully');
});

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { error } = addToCartSchema.validate(req.body);
  if (error) {
    return ApiResponse.error(res, error.details[0].message, 400);
  }

  const { productId, quantity } = req.body;
  const userId = req.user.id;

  // Check if product exists and is active
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, stock: true, isActive: true }
  });

  if (!product || !product.isActive) {
    return ApiResponse.error(res, 'Product not found or inactive', 404);
  }

  if (product.stock < quantity) {
    return ApiResponse.error(res, 'Insufficient stock', 400);
  }

  // Check if item already exists in cart
  const existingCartItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  });

  let cartItem;

  if (existingCartItem) {
    // Update quantity
    const newQuantity = existingCartItem.quantity + quantity;
    
    if (product.stock < newQuantity) {
      return ApiResponse.error(res, 'Insufficient stock', 400);
    }

    cartItem = await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: { quantity: newQuantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            salePrice: true,
            images: true
          }
        }
      }
    });
  } else {
    // Create new cart item
    cartItem = await prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            salePrice: true,
            images: true
          }
        }
      }
    });
  }

  ApiResponse.success(res, cartItem, 'Item added to cart successfully');
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:id
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { error } = updateCartSchema.validate(req.body);
  if (error) {
    return ApiResponse.error(res, error.details[0].message, 400);
  }

  const { id } = req.params;
  const { quantity } = req.body;

  // Check if cart item belongs to user
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id,
      userId: req.user.id
    },
    include: {
      product: {
        select: { stock: true }
      }
    }
  });

  if (!cartItem) {
    return ApiResponse.error(res, 'Cart item not found', 404);
  }

  if (cartItem.product.stock < quantity) {
    return ApiResponse.error(res, 'Insufficient stock', 400);
  }

  const updatedCartItem = await prisma.cartItem.update({
    where: { id },
    data: { quantity },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          salePrice: true,
          images: true
        }
      }
    }
  });

  ApiResponse.success(res, updatedCartItem, 'Cart item updated successfully');
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:id
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if cart item belongs to user
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id,
      userId: req.user.id
    }
  });

  if (!cartItem) {
    return ApiResponse.error(res, 'Cart item not found', 404);
  }

  await prisma.cartItem.delete({
    where: { id }
  });

  ApiResponse.success(res, null, 'Item removed from cart successfully');
});

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  await prisma.cartItem.deleteMany({
    where: { userId: req.user.id }
  });

  ApiResponse.success(res, null, 'Cart cleared successfully');
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};