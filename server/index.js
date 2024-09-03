const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db'); // Import your connection function

require("dotenv").config();
const app = express();

const allowedOrigins = ['http://localhost:3001']; // Replace with your client domain(s)

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (e.g., mobile apps, Postman)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'X-Requested-With, Content-Type, Authorization',
  credentials: true // Allow credentials (cookies)
}));
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
