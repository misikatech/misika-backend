const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const ApiResponse = require('../utils/ApiResponse');

const prisma = new PrismaClient();

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for Bearer token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return ApiResponse.error(res, 'Not authorized, no token', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        created_at: true
      }
    });

    if (!user) {
      return ApiResponse.error(res, 'Not authorized, user not found', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return ApiResponse.error(res, 'Not authorized, token failed', 401);
  }
};

module.exports = { protect };
