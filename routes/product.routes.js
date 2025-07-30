const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Products list endpoint - to be implemented' });
});

router.get('/:id', (req, res) => {
  res.json({ success: true, message: 'Product detail endpoint - to be implemented' });
});

module.exports = router;
