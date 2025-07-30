const express = require('express');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// All order routes require authentication
router.use(protect);

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Orders list endpoint - to be implemented' });
});

router.post('/', (req, res) => {
  res.json({ success: true, message: 'Create order endpoint - to be implemented' });
});

module.exports = router;
