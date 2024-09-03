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
  const { activeSeries, username } = await request.json();
  const arrayLengths = [9, 18, 23];

  await connectToDatabase(); // Ensure database connection

  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      return new Response(
        JSON.stringify({ statuses: Array(arrayLengths[parseInt(activeSeries)]).fill(null) }), 
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    let statuses = Array(arrayLengths[parseInt(activeSeries)]).fill(null);
    let completedArray = [];
    
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

    return new Response(
      JSON.stringify({ statuses }), 
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error fetching layout statuses:", err);
    return new Response(
      JSON.stringify({ error: "Server error" }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
