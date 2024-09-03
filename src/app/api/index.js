const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('auth');
const passcheckRoutes = require('passcheck');
const boardsRoutes = require('boards');
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json()); // For parsing application/json
app.use(cookieParser());

// Use the boards router
app.use('/api/auth', authRoutes);
app.use('/api/passcheck', passcheckRoutes);
app.use('/api/boards', boardsRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});

module.exports = app;