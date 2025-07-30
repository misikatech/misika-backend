const express = require('express');
const router = express.Router();

// Simple middleware to simulate auth (for testing)
const simpleAuth = (req, res, next) => {
  // For testing, we'll just add a fake user
  req.user = { id: 1, email: 'test@example.com' };
  next();
};

// Simple response helper
const sendResponse = (res, data, message = 'Success', status = 200) => {
  res.status(status).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

// All address routes require authentication
router.use(simpleAuth);

// Get all addresses
router.get('/', (req, res) => {
  sendResponse(res, [], 'Addresses retrieved successfully');
});

// Create new address
router.post('/', (req, res) => {
  sendResponse(res, { id: 1, ...req.body }, 'Address created successfully', 201);
});

// Update address
router.put('/:id', (req, res) => {
  sendResponse(res, { id: req.params.id, ...req.body }, 'Address updated successfully');
});

// Delete address
router.delete('/:id', (req, res) => {
  sendResponse(res, null, 'Address deleted successfully');
});

// Set default address
router.post('/:id/default', (req, res) => {
  sendResponse(res, { id: req.params.id, isDefault: true }, 'Default address updated successfully');
});

module.exports = router;
