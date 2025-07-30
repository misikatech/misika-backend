const prisma = require('../utils/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/response');
const { createProductSchema, updateProductSchema } = require('../validators/product.validator');

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    category,
    minPrice,
    maxPrice,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const where = {
    isActive: true,
    ...(category && {
      category: {
        slug: category
      }
    }),
    ...(minPrice || maxPrice) && {
      price: {
        ...(minPrice && { gte: parseFloat(minPrice) }),
        ...(maxPrice && { lte: parseFloat(maxPrice) })
      }
    },
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    })
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: {
          select: { name: true, slug: true }
        },
        reviews: {
          select: { rating: true }
        }
      },
      skip,
      take: parseInt(limit),
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.product.count({ where })
  ]);

  // Calculate average rating for each product
  const productsWithRating = products.map(product => ({
    ...product,
    averageRating: product.reviews.length > 0 
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0,
    reviewCount: product.reviews.length,
    reviews: undefined // Remove reviews from response
  }));

  const pagination = {
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / parseInt(limit)),
    totalItems: total,
    hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
    hasPrev: parseInt(page) > 1
  };

  ApiResponse.paginated(res, productsWithRating, pagination, 'Products fetched successfully');
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        select: { name: true, slug: true }
      },
      reviews: {
        include: {
          user: {
            select: { firstName: true, lastName: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!product) {
    return ApiResponse.error(res, 'Product not found', 404);
  }

  // Calculate average rating
  const averageRating = product.reviews.length > 0 
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0;

  const productWithRating = {
    ...product,
    averageRating,
    reviewCount: product.reviews.length
  };

  ApiResponse.success(res, productWithRating, 'Product fetched successfully');
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { error } = createProductSchema.validate(req.body);
  if (error) {
    return ApiResponse.error(res, error.details[0].message, 400);
  }

  const { name, description, price, salePrice, sku, stock, images, categoryId, isFeatured } = req.body;

  // Check if SKU already exists
  const existingSku = await prisma.product.findUnique({ where: { sku } });
  if (existingSku) {
    return ApiResponse.error(res, 'Product with this SKU already exists', 400);
  }

  // Generate slug from name
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price,
      salePrice,
      sku,
      stock,
      images,
      categoryId,
      isFeatured: isFeatured || false
    },
    include: {
      category: {
        select: { name: true, slug: true }
      }
    }
  });

  ApiResponse.success(res, product, 'Product created successfully', 201);
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { error } = updateProductSchema.validate(req.body);
  if (error) {
    return ApiResponse.error(res, error.details[0].message, 400);
  }

  const { id } = req.params;
  const updateData = req.body;

  // Generate new slug if name is being updated
  if (updateData.name) {
    updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  const product = await prisma.product.update({
    where: { id },
    data: updateData,
    include: {
      category: {
        select: { name: true, slug: true }
      }
    }
  });

  ApiResponse.success(res, product, 'Product updated successfully');
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Soft delete by setting isActive to false
  await prisma.product.update({
    where: { id },
    data: { isActive: false }
  });

  ApiResponse.success(res, null, 'Product deleted successfully');
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};