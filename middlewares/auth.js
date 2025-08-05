const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const pool = require('../config/db');
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

    let user = null;

    // First try to find user in Prisma User table (for /api/auth/login users)
    try {
      const prismaUser = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          username: true,
          email: true,
          created_at: true
        }
      });

      if (prismaUser) {
        user = prismaUser;
      }
    } catch (error) {
      // If Prisma fails, continue to PostgreSQL check
    }

    // If not found in Prisma, check in userquery table (PostgreSQL) for /api/users/login users
    if (!user) {
      try {
        const result = await pool.query("SELECT id, name, email, mobile_number, city, created_at FROM userquery WHERE id = $1", [decoded.id]);

        if (result.rows.length > 0) {
          user = result.rows[0];
        }
      } catch (error) {
        // If PostgreSQL also fails, user not found
      }
    }

    if (!user) {
      return ApiResponse.error(res, 'Not authorized, user not found', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return ApiResponse.error(res, 'Not authorized, token failed', 401);
  }
};

// Middleware to check admin role
const admin = (req, res, next) => {
  // Check if the user email contains 'admin' or if they have admin role
  // This works for both user systems
  if (req.user && req.user.email &&
      (req.user.email.includes('admin') || req.user.role === 'ADMIN')) {
    next();
  } else {
    return ApiResponse.error(res, 'Not authorized as admin', 403);
  }
};

module.exports = { protect, admin };
