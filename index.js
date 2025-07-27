const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const pool = require('./config/db'); 


// Initialize Express app
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// API Routes
app.use('/api', userRoutes);


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
