const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db'); // Import your connection function

require("dotenv").config();
const app = express();

app.use(cors({
  origin: 'http://localhost:3001', // Adjust this to the URL of your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Include cookies in the requests
}));
app.options('*', cors());
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Enable your routes
const authRoutes = require('./api/auth');
const passcheckRoutes = require('./api/passcheck');
const boardsRoutes = require('./api/boards');
app.use('/api/auth', authRoutes);
app.use('/api/passcheck', passcheckRoutes);
app.use('/api/boards', boardsRoutes);

app.get('/', (req, res) => {
  res.status(200).send('Server is running.');
});

app.use((req, res) => {
  res.status(404).send("Not Found");
});

// For Vercel
module.exports = app;

// Start server (uncomment this part for local development)
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
