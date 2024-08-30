// /api/index.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Import routes
const boardsRoutes = require('./boards');

// Use routes
app.use('/api/boards', boardsRoutes);

// Export handler
module.exports = app;