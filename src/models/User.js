// User.js - Defines a user schema for the MongoDB database using Mongoose, and sets methods available to each user

// IMPORTS - Mongoose, BCrypt
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// SCHEMA - Every user has Username, Email, Password (encrypted), and puzzles solved for each series
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Removes extra spaces from input
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true, // Ensures emails are stored in lowercase
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: true,
  },
  mathmaniaSolved: {
    type: [Number],
    default: [],
  },
  puzzleparadiseSolved: {
    type: [Number],
    default: [],
  },
  riddlingrewindSolved: {
    type: [Number],
    default: [],
  },
});

// Add indexes to optimize queries
userSchema.index({ mathmaniaSolved: -1 });
userSchema.index({ puzzleparadiseSolved: -1 });
userSchema.index({ riddlingrewindSolved: -1 });

// Mongoose middleware that runs before a document is saved to the database, in case password was modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10); // Generates a salt with 10 rounds
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Custom compare password method, to validate for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

// Create the model
let User;

try {
  // Try to get the model if it's already compiled
  User = mongoose.model('User');
  console.log("CONNECTION IN USER, RECONNECT");
} catch (error) {
  // If the model is not compiled, create it
  User = mongoose.model('User', userSchema);
  console.log("CONNECTION IN USER, CONNECT");
}

module.exports = User;
