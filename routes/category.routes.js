const express = require('express');
const { getCategories, createCategory } = require('../controllers/category.controller');
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

module.exports = router;
