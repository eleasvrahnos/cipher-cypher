import mongoose from 'mongoose';
import User from '@/models/User';
require("dotenv").config();

interface RequestBody {
  activeSeries: string;
  puzzleNoVisible: number;
  answer: string;
  username: string;
}

// Connect to MongoDB
const connectToDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
};

export async function POST(request: Request): Promise<Response> {
  const { activeSeries, puzzleNoVisible, answer, username }: RequestBody = await request.json(); // Extract data from request body
  const storedAnswers: Record<string, string[]> = JSON.parse(process.env.ANSWER_KEY as string);

  // Type Validations
  const activeSeriesCheck = typeof activeSeries === 'string' ? true : false; // Ensure activeSeries is a string
  const lowerAnswer = typeof answer === 'string' ? answer.toLowerCase() : ''; // Ensure answer is a string and convert to lowercase
  const puzzleNoVisibleCheck = typeof puzzleNoVisible === 'number' ? true : false; // Ensure puzzleNo is a number

  await connectToDatabase(); // Ensure database connection

  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Ensure puzzleNoVisible is a number and within the valid index range
    const isValid =
      activeSeriesCheck &&
      storedAnswers[activeSeries] &&
      puzzleNoVisibleCheck &&
      puzzleNoVisible > 0 &&
      puzzleNoVisible <= storedAnswers[activeSeries].length;

    // Validate activeSeries, puzzleNoVisible, and answer
    if (isValid && storedAnswers[activeSeries][puzzleNoVisible - 1] === lowerAnswer) {
      const user = await User.findOne({ username: username }).session(session);
      if (user) {
        let updateRequired = false;
        if (activeSeries === "mathmania") {
          if (!user.mathmaniaSolved.includes(puzzleNoVisible)) {
            user.mathmaniaSolved.push(puzzleNoVisible);
            updateRequired = true;
          }
        } else if (activeSeries === "puzzleparadise") {
          if (!user.puzzleparadiseSolved.includes(puzzleNoVisible)) {
            user.puzzleparadiseSolved.push(puzzleNoVisible);
            updateRequired = true;
          }
        } else if (activeSeries === "riddlingrewind") {
          if (!user.riddlingrewindSolved.includes(puzzleNoVisible)) {
            user.riddlingrewindSolved.push(puzzleNoVisible);
            updateRequired = true;
          }
        }

        if (updateRequired) {
          await user.save({ session });
        }
      }

      await session.commitTransaction();
      session.endSession();

      return new Response(JSON.stringify({ solvedStatus: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      await session.abortTransaction();
      session.endSession();

      return new Response(JSON.stringify({ solvedStatus: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error('Submission error:', error);
    return new Response(JSON.stringify({ error: 'Submission error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
