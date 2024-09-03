// answercheck.js
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
  const { activeSeries, puzzleNoVisible, answer, userId } = await request.json(); // Extract data from request body
  const storedAnswers = JSON.parse(process.env.ANSWER_KEY);
  const lowerAnswer = answer.toLowerCase();

  await connectToDatabase(); // Ensure database connection

  try {
    if (storedAnswers[activeSeries] && storedAnswers[activeSeries][puzzleNoVisible - 1] === lowerAnswer) {
      let updateField;
      if (activeSeries === "mathmania") {
        updateField = { $addToSet: { mathmaniaSolved: puzzleNoVisible } };
      } else if (activeSeries === "puzzleparadise") {
        updateField = { $addToSet: { puzzleparadiseSolved: puzzleNoVisible } };
      } else if (activeSeries === "riddlingrewind") {
        updateField = { $addToSet: { riddlingrewindSolved: puzzleNoVisible } };
      }

      await User.findOneAndUpdate({ username: userId }, updateField);
      return new Response(JSON.stringify({ solvedStatus: true }), { status: 200, headers: { "Content-Type": "application/json" } });
    } else {
      return new Response(JSON.stringify({ solvedStatus: false }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
  } catch (error) {
    console.error("Submission error:", error);
    return new Response(JSON.stringify({ error: "Submission error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
