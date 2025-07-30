require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test routes first
try {
  const testRoutes = require('./routes/test.routes.js');
  app.use('/api/test', testRoutes);
  console.log('✅ Test routes loaded');
} catch (error) {
  console.log('❌ Test routes failed:', error.message);
}

// Load other routes with error handling
const routes = [
  { path: '/api/auth', file: './routes/auth.routes', name: 'Auth' },
  { path: '/api/users', file: './routes/user.routes', name: 'User' },
  { path: '/api/products', file: './routes/product.routes', name: 'Product' },
  { path: '/api/categories', file: './routes/category.routes', name: 'Category' },
  { path: '/api/cart', file: './routes/cart.routes', name: 'Cart' },
  { path: '/api/orders', file: './routes/order.routes', name: 'Order' },
  { path: '/api/addresses', file: './routes/address.routes', name: 'Address' },
  { path: '/api/payments', file: './routes/payment.routes', name: 'Payment' },
  { path: '/api/contact', file: './routes/contact.routes', name: 'Contact' },
  { path: '/api/home', file: './routes/home.routes', name: 'Home' },
  { path: '/api/static', file: './routes/static.routes', name: 'Static' }
];

routes.forEach(({ path, file, name }) => {
  try {
    const route = require(file);
    app.use(path, route);
    console.log(`✅ ${name} routes loaded`);
  } catch (error) {
    console.log(`❌ ${name} routes failed:`, error.message);
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🔒 Security: Helmet enabled`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test/ping`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
