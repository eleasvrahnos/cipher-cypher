// auth.js - API designed to check register and login account verification and details

// IMPORTS - Express, Express router, User model, JWT, BCrypt, Validator and Nodemailer (for emails)
const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require('validator');
const nodemailer = require('nodemailer');

// Create a Nodemailer transporter object
const transporter = nodemailer.createTransport({
  service: 'gmail', // Replace with your email service provider
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or application-specific password
  },
});


// Register Auth route - executes when User clicks button confirming register information
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Case where a field is left blank (400 - Client Error)
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }
    // Validate Email Format using validator
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }
    // Password length requirement
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }
    // Case where Username or Email already exists in database (400 - Client Error)
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or Email already exists" });
    }
    // Otherwise, User can be successfully added to database
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Successful register (201 - Successful request with creation)
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    // Unsuccessful register (500 - Unsuccessful in fulfilling request)
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});

// Login Auth route - executes when User clicks button confirming login information
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Case where a field is left blank (400 - Client Error)
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Case where Email does not exist in the database (400 - Client Error)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Validate Password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // If successful, create a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token and user info
    res.status(200).json({
      token,
      user: {
        username: user.username,
        email: user.email,
        mathmaniaSolved: user.mathmaniaSolved,
        puzzleparadiseSolved: user.puzzleparadiseSolved,
        riddlingrewindSolved: user.riddlingrewindSolved,
      },
    });

  } catch (error) {
    // Unsuccessful login (500 - Unsuccessful in fulfilling request)
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in user", error: error.message });
  }
});

// isLogin Auth route - executes on startup, automatically logs in User if token is still valid
router.post("/isLogin", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(500).json({
      auth: false,
      data: "No Token Found in request",
    });
  }
  try {
    // Verify the token and decode it to get the user's ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Fetch the user data from the database using the userId
    const user = await User.findById(userId).select('-password'); // Exclude password from the returned data for security purposes

    // If user doesn't exist, return an error
    if (!user) {

      return res.status(500).json({
        auth: false,
        data: "User not found",
      });
    }

    // If everything is good, return the user's name
    return res.status(200).json({
      auth: true,
      data: {
        username: user.username,
      },
    });

  } catch (error) {
    // If token verification fails or any other error occurs
    return res.status(500).json({
      auth: false,
      data: error.message,
    });
  }
});

// Request password reset route
router.post("/passreset/request", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const isDev = process.env.NODE_ENV === 'development';
    resetLink = `${isDev ? "localhost:3000" : process.env.FRONTEND_URL}/password/resetForm?token=${token}`

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. If this was not you, ignore this message. Otherwise, click the following link to reset your password: ${resetLink}`,
      html: `<p>You requested a password reset. If this was not you, ignore this message. Otherwise, click the following link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Error sending password reset link:", error);
    res.status(500).json({ message: "Error sending reset link." });
  }
});

// POST route to validate token
router.get("/validate-token", async (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).json({ valid: false, message: "Token is required." });
  }

  try {
    // Verify the token and decode it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Check if the user exists in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ valid: false, message: "User not found." });
    }

    // Token is valid and user exists
    res.status(200).json({ valid: true });
  } catch (error) {
    console.error("Error validating token:", error);
    res.status(500).json({ valid: false, message: "Invalid or expired token." });
  }
});

// Password reset route
router.post("/passreset/reset", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the new password is the same as the old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: "New password cannot be the same as the old password." });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password." });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Password length check
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    // Check if the new password is the same as the existing one
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: 'New password cannot be the same as the existing password.' });
    }

    // Update the user's password
    user.password = password;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Token has expired.' });
    }
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});



module.exports = router;
