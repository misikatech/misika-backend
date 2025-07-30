const express = require('express');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Get cart endpoint - to be implemented' });
});

router.post('/add', (req, res) => {
  res.json({ success: true, message: 'Add to cart endpoint - to be implemented' });
});

module.exports = router;
