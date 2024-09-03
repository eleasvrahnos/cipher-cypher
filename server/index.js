const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db'); // Import your connection function

require("dotenv").config();
const app = express();

app.use(cors({
  origin: 'https://ciphercypher.vercel.app/', // Adjust this to your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
}));

app.options('*', cors());
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Enable your routes
const authRoutes = require('/api/auth');
const passcheckRoutes = require('/api/passcheck');
const boardsRoutes = require('/api/boards');
app.use('/api/auth', authRoutes);
app.use('/api/passcheck', passcheckRoutes);
app.use('/api/boards', boardsRoutes);

app.get('/', (req, res) => {
  res.status(200).send('Server is running.');
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Fallback Route
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// For Vercel
module.exports = app;

// Start server (uncomment this part for local development)
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
