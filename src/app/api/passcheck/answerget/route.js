import mongoose from 'mongoose';
require("dotenv").config();

// Connect to MongoDB
const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
};

export async function POST(request) {
  const { activeSeries, puzzleNoVisible } = await request.json(); // Extract data from request body
  const storedAnswers = JSON.parse(process.env.ANSWER_KEY);

  await connectToDatabase(); // Ensure database connection

  try {
    if (storedAnswers[activeSeries] && storedAnswers[activeSeries][puzzleNoVisible - 1]) {
      const correctAnswer = storedAnswers[activeSeries][puzzleNoVisible - 1];
      return new Response(JSON.stringify({ answer: correctAnswer }), { status: 200, headers: { "Content-Type": "application/json" } });
    } else {
      return new Response(JSON.stringify({ error: "Answer not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
  } catch (error) {
    console.error("Error retrieving answer:", error);
    return new Response(JSON.stringify({ error: "Error retrieving answer" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
