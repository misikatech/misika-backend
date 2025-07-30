const express = require('express');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// All user routes require authentication
router.use(protect);

router.get('/profile', (req, res) => {
  res.json({ success: true, message: 'User profile endpoint - to be implemented' });
});

router.put('/profile', (req, res) => {
  res.json({ success: true, message: 'Update profile endpoint - to be implemented' });
});

router.post('/change-password', (req, res) => {
  res.json({ success: true, message: 'Change password endpoint - to be implemented' });
});

module.exports = router;
