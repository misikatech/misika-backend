const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const ApiResponse = require('../utils/ApiResponse');

const prisma = new PrismaClient();

const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return ApiResponse.error(res, 'Not authorized, no token', 401);
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          isVerified: true,
        },
      });

      if (!user) {
        return ApiResponse.error(res, 'Not authorized, user not found', 401);
      }

      req.user = user;
      next();
    } catch (error) {
      return ApiResponse.error(res, 'Not authorized, token failed', 401);
    }
  } catch (error) {
    return ApiResponse.error(res, 'Server error in auth middleware', 500);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return ApiResponse.error(res, 'Not authorized for this resource', 403);
    }
    next();
  };
};

module.exports = { protect, authorize };
