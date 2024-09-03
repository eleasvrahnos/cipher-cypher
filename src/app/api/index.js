const express = require('express');
const mongoose = require('mongoose');
const boardsRouter = require('./api/boards'); // Adjust the path as necessary
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json()); // For parsing application/json

// Use the boards router
app.use('/api/boards', boardsRouter); // Mount router on /api

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});

module.exports = app;


// const express = require('express');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const connectDB = require('./db'); // Import your connection function

// require("dotenv").config();
// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(cookieParser());

// // Connect to MongoDB
// connectDB();

// // Enable your routes
// const authRoutes = require('auth');
// const passcheckRoutes = require('passcheck');
// const boardsRoutes = require('boards');
// app.use('/api/auth', authRoutes);
// app.use('/api/passcheck', passcheckRoutes);
// app.use('/api/boards', boardsRoutes);

// app.get('/', (req, res) => {
//   res.status(200).send('Server is running.');
// });

// // Error Handling
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

// // Fallback Route
// app.use((req, res) => {
//   res.status(404).send("Not Found");
// });

// // For Vercel
// module.exports = app;

// // Start server (uncomment this part for local development)
// // const PORT = process.env.PORT || 3000;
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
