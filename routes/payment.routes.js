const express = require('express');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// All payment routes require authentication
router.use(protect);

router.post('/stripe/create-intent', (req, res) => {
  res.json({ success: true, message: 'Create payment intent endpoint - to be implemented' });
});

module.exports = router;
