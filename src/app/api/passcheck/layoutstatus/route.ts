import mongoose from 'mongoose';
import User from '@/models/User'; // Ensure User model is correctly typed
import { NextRequest, NextResponse } from 'next/server'; // Import necessary types
require("dotenv").config();

// Connect to MongoDB
const connectToDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { activeSeries, username }: { activeSeries: number; username: string } = await request.json();

  const activeSeriesCheck = typeof activeSeries === 'number'; // Ensure activeSeries is a number

  const arrayLengths = [9, 18, 23];

  await connectToDatabase(); // Ensure database connection

  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ statuses: Array(arrayLengths[activeSeries]).fill(null) }), 
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else if (activeSeriesCheck && activeSeries >= 0 && activeSeries <= 2) {

      let statuses = Array(arrayLengths[activeSeries]).fill(null);
      let completedArray: number[] = [];
      
      if (activeSeries === 0) {
        completedArray = user.mathmaniaSolved; // Assuming this is the correct array name
      } else if (activeSeries === 1) {
        completedArray = user.puzzleparadiseSolved; // Assuming this is the correct array name
      } else if (activeSeries === 2) {
        completedArray = user.riddlingrewindSolved; // Assuming this is the correct array name
      }

      completedArray.forEach((index) => {
        // Ensure the index is within bounds
        if (index > 0 && index <= statuses.length) {
          statuses[index - 1] = true;
        }
      });

      return new NextResponse(
        JSON.stringify({ statuses }), 
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (err) {
    console.error("Error fetching layout statuses:", err);
    return new NextResponse(
      JSON.stringify({ error: "Server error" }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // If it falls through without returning, send a generic error response
  return new NextResponse(
    JSON.stringify({ error: "Invalid request" }), 
    { status: 400, headers: { "Content-Type": "application/json" } }
  );
}
