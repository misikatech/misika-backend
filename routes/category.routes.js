const express = require('express');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/category.controller');
const { protect, admin } = require('../middlewares/auth');

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', getCategories);

// @route   POST /api/categories
// @desc    Create a new category
// @access  Private/Admin
router.post('/', protect, admin, createCategory);

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private/Admin
router.put('/:id', protect, admin, updateCategory);

// @route   DELETE /api/categories/:id
// @desc    Delete a category (soft delete)
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;
