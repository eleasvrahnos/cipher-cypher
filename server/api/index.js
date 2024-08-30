const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Enable your routes
const boardsRoutes = require('./boards');
app.use('/api/boards', boardsRoutes);

// Handle 404
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// Export the Express app for Vercel
module.exports = app;