const { ApiResponse } = require('../utils/ApiResponse');
const asyncHandler = require('express-async-handler');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  // For now, return empty cart
  ApiResponse.success(res, { 
    items: [],
    total: 0,
    itemCount: 0
  }, 'Cart retrieved successfully');
});

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  
  ApiResponse.success(res, { productId, quantity }, 'Item added to cart');
});

// @desc    Update cart item
// @route   PUT /api/cart/update/:itemId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  
  ApiResponse.success(res, { itemId, quantity }, 'Cart item updated');
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  
  ApiResponse.success(res, { itemId }, 'Item removed from cart');
});

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  ApiResponse.success(res, {}, 'Cart cleared successfully');
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
