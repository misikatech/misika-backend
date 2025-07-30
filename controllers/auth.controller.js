const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken
} = require('../utils/jwt');

const prisma = new PrismaClient();

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return ApiResponse.error(res, 'User already exists with this email', 400);
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create the new user
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword
    },
    select: {
      id: true,
      username: true,
      email: true,
      created_at: true
    }
  });

  // Generate tokens
  const accessToken = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  ApiResponse.success(
    res,
    { user, accessToken, refreshToken },
    'User registered successfully',
    201
  );
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return ApiResponse.error(res, 'Invalid credentials', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return ApiResponse.error(res, 'Invalid credentials', 401);
  }

  const accessToken = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  const { password: _, ...userWithoutPassword } = user;

  ApiResponse.success(
    res,
    { user: userWithoutPassword, accessToken, refreshToken },
    'Login successful'
  );
});

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    return ApiResponse.error(res, 'Refresh token is required', 400);
  }

  try {
    const decoded = verifyRefreshToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true
      }
    });

    if (!user) {
      return ApiResponse.error(res, 'Invalid refresh token', 401);
    }

    const newAccessToken = generateToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    ApiResponse.success(
      res,
      { user, accessToken: newAccessToken, refreshToken: newRefreshToken },
      'Token refreshed successfully'
    );
  } catch (error) {
    return ApiResponse.error(res, 'Invalid refresh token', 401);
  }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return ApiResponse.error(res, 'User not found with this email', 404);
  }

  // Simulate sending a reset email (to be implemented)
  ApiResponse.success(res, null, 'Password reset email sent');
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  // Simulate verifying token and updating password (to be implemented)
  ApiResponse.success(res, null, 'Password reset successful');
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  // JWT logout is client-side
  ApiResponse.success(res, null, 'Logout successful');
});

module.exports = {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  logout
};
