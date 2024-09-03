import mongoose from 'mongoose';
import User from '@/models/User'; // Ensure User model is correctly typed
import { NextRequest, NextResponse } from 'next/server'; // Import necessary types
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
const connectToDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
};

interface RequestBody {
  activeSeries: string;
  puzzleNoVisible: number;
  username: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { activeSeries, puzzleNoVisible, username }: RequestBody = await request.json(); // Extract data from request body
  const storedAnswers: Record<string, string[]> = JSON.parse(process.env.ANSWER_KEY as string); // Parse stored answers

  const activeSeriesCheck = typeof activeSeries === 'string'; // Ensure activeSeries is a string
  const puzzleNoVisibleCheck = typeof puzzleNoVisible === 'number'; // Ensure puzzleNo is a number

  await connectToDatabase(); // Ensure database connection

  try {
    // Ensure the answer is actually in the database first
    let answerObtained = false;

    const user = await User.findOne({ username: username });

    if (user) {
      if (activeSeries === "mathmania" && user.mathmaniaSolved.includes(puzzleNoVisible)) {
        answerObtained = true;
      } else if (activeSeries === "puzzleparadise" && user.puzzleparadiseSolved.includes(puzzleNoVisible)) {
        answerObtained = true;
      } else if (activeSeries === "riddlingrewind" && user.riddlingrewindSolved.includes(puzzleNoVisible)) {
        answerObtained = true;
      }
    }

    const isValid =
      activeSeriesCheck &&
      storedAnswers[activeSeries] &&
      puzzleNoVisibleCheck &&
      puzzleNoVisible > 0 &&
      puzzleNoVisible <= storedAnswers[activeSeries].length;

    if (isValid && answerObtained && storedAnswers[activeSeries][puzzleNoVisible - 1]) {
      const correctAnswer = storedAnswers[activeSeries][puzzleNoVisible - 1];
      return new NextResponse(JSON.stringify({ answer: correctAnswer }), { status: 200, headers: { "Content-Type": "application/json" } });
    } else {
      return new NextResponse(JSON.stringify({ error: "Answer not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
  } catch (error) {
    console.error("Error retrieving answer:", error);
    return new NextResponse(JSON.stringify({ error: "Error retrieving answer" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
