const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
  res.json({ success: true, message: 'Contact form endpoint - to be implemented' });
});

module.exports = router;
