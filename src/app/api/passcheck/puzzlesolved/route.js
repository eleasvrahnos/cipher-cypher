// puzzlesolved.js
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
  const { activeSeries, puzzleNoVisible, username } = await request.json(); // Extract data from request body

  await connectToDatabase(); // Ensure database connection

  try {
    const user = await User.findOne({ username: username });

    if (user) {
      if (activeSeries === "mathmania") {
        if (!user.mathmaniaSolved.includes(puzzleNoVisible)) {
          user.mathmaniaSolved.push(puzzleNoVisible);
        }
      } else if (activeSeries === "puzzleparadise") {
        if (!user.puzzleparadiseSolved.includes(puzzleNoVisible)) {
          user.puzzleparadiseSolved.push(puzzleNoVisible);
        }
      } else if (activeSeries === "riddlingrewind") {
        if (!user.riddlingrewindSolved.includes(puzzleNoVisible)) {
          user.riddlingrewindSolved.push(puzzleNoVisible);
        }
      }

      await user.save();
    }

    return new Response(JSON.stringify({ message: "Puzzle status updated successfully" }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error checking solved status:", error);
    return new Response(JSON.stringify({ error: "Error checking solved status" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
