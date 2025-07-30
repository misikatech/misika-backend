const bcrypt = require('bcryptjs');
const prisma = require('../utils/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/response');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      username: true,
      email: true,
      created_at: true,
    },
  });

  if (!user) {
    return ApiResponse.error(res, 'User not found', 404);
  }

  ApiResponse.success(res, user, 'Profile fetched successfully');
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { username, email } = req.body;

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      username,
      email,
    },
    select: {
      id: true,
      username: true,
      email: true,
      created_at: true,
    },
  });

  ApiResponse.success(res, user, 'Profile updated successfully');
});

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    return ApiResponse.error(res, 'User not found', 404);
  }

  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isCurrentPasswordValid) {
    return ApiResponse.error(res, 'Current password is incorrect', 400);
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashedNewPassword },
  });

  ApiResponse.success(res, null, 'Password changed successfully');
});

// @desc    Get user dashboard stats
// @route   GET /api/users/dashboard
// @access  Private
const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Simulate if orders/carts/wishlist tables don't yet exist
  const [orderCount, cartItemCount, wishlistCount] = await Promise.all([
    prisma.order?.count({ where: { userId } }) ?? 0,
    prisma.cartItem?.count({ where: { userId } }) ?? 0,
    prisma.wishlistItem?.count({ where: { userId } }) ?? 0,
  ]);

  const recentOrders = await prisma.order?.findMany({
    where: { userId },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              images: true,
            },
          },
        },
      },
    },
  }) ?? [];

  const stats = {
    totalOrders: orderCount,
    cartItems: cartItemCount,
    wishlistItems: wishlistCount,
    recentOrders,
  };

  ApiResponse.success(res, stats, 'Dashboard data fetched successfully');
});

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getDashboard,
};
