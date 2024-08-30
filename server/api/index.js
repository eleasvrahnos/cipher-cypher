// /api/index.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Initialize Express
const app = express();
// Middleware for CORS
app.use(cors({
    origin: 'https://ciphercypher.vercel.app/',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization']
  }));
app.use(express.json());
app.use(cookieParser());

// Import routes
const boardsRoutes = require('./boards');

// Use routes
app.use('/api/boards', boardsRoutes);

app.use((req, res) => {
    res.status(404).send("Not Found");
  });

// Export handler
module.exports = app;