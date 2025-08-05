const prisma = require('../utils/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/response');
const { createCategorySchema } = require('../validators/product.validator');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  ApiResponse.success(res, categories, 'Categories fetched successfully');
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { error } = createCategorySchema.validate(req.body);
  if (error) {
    return ApiResponse.error(res, error.details[0].message, 400);
  }

  const { name, description, image } = req.body;

  // Generate slug from name
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description,
      image
    }
  });

  ApiResponse.success(res, category, 'Category created successfully', 201);
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { error } = createCategorySchema.validate(req.body);
  if (error) {
    return ApiResponse.error(res, error.details[0].message, 400);
  }

  const { id } = req.params;
  const { name, description, image } = req.body;

  // Check if category exists
  const existingCategory = await prisma.category.findUnique({ where: { id } });
  if (!existingCategory) {
    return ApiResponse.error(res, 'Category not found', 404);
  }

  // Generate new slug if name is being updated
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const category = await prisma.category.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      image
    }
  });

  ApiResponse.success(res, category, 'Category updated successfully');
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if category exists
  const existingCategory = await prisma.category.findUnique({ where: { id } });
  if (!existingCategory) {
    return ApiResponse.error(res, 'Category not found', 404);
  }

  // Soft delete by setting isActive to false
  await prisma.category.update({
    where: { id },
    data: { isActive: false }
  });

  ApiResponse.success(res, null, 'Category deleted successfully');
});

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};