// api/index.js - The serverless function handler for API routes

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require("dotenv").config();

// Create an instance of Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Import routes
const boardsRoutes = require('./boards');
const authRoutes = require('./auth');
const passcheckRoutes = require('./passcheck');

// Use routes
app.use('/api/boards', boardsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/passcheck', passcheckRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).send("Not Found");
});

app.use('/', (req, res) => {
    res.send("Server is running.");
  });
  

// Export the handler function for serverless
module.exports = app;
