// index.js - The file that runs the server, which hosts the database and user authentication routes

// IMPORTS - Express, Mongoose, CORS, Cookie Parser
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Allow environment variables and start Express
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

// Enable auth routes
const authRoutes = require('../server/api/auth');
const passcheckRoutes = require('../server/api/passcheck');
const boardsRoutes = require('./api/boards');
app.use('/api/auth', authRoutes);
app.use('/api/passcheck', passcheckRoutes);
app.use('/api/boards', boardsRoutes);
app.use('/', (req, res) => {
  res.send("Server is running.");
});


// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

