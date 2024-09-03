// validate-token.js
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '@/models/User';
require("dotenv").config();

// Connect to MongoDB
const connectToDatabase = async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
  };
  
  export async function POST(request) {
    const { token } = await request.json(); // Extract token from the request body
  
    if (!token) {
      return new Response(
        JSON.stringify({ valid: false, message: "Token is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  
    await connectToDatabase(); // Ensure database connection
  
    try {
      // Verify the token and decode it
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
  
      // Check if the user exists in the database
      const user = await User.findById(userId);
      if (!user) {
        return new Response(
          JSON.stringify({ valid: false, message: "User not found." }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
  
      // Token is valid and user exists
      return new Response(
        JSON.stringify({ valid: true }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error validating token:", error);
      return new Response(
        JSON.stringify({ valid: false, message: "Invalid or expired token." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }