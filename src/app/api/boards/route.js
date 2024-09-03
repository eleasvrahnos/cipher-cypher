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
  const { category } = await request.json(); // Extract category from the request body

  await connectToDatabase(); // Ensure database connection

  try {
    let leaderboard;

    switch (category) {
      case "mathmania":
        leaderboard = await User.find({
          mathmaniaSolved: { $not: { $size: 0 } },
        })
          .select("username mathmaniaSolved")
          .sort({ mathmaniaSolved: -1 })
          .limit(10)
          .lean();
        break;

      case "puzzleparadise":
        leaderboard = await User.find({
          puzzleparadiseSolved: { $exists: true, $not: { $size: 0 } },
        })
          .sort({ puzzleparadiseSolved: -1 })
          .limit(10)
          .select("username puzzleparadiseSolved")
          .lean();
        break;

      case "riddlingrewind":
        leaderboard = await User.find({
          riddlingrewindSolved: { $exists: true, $not: { $size: 0 } },
        })
          .sort({ riddlingrewindSolved: -1 })
          .limit(10)
          .select("username riddlingrewindSolved")
          .lean();
        break;

      case "total":
        leaderboard = await User.aggregate([
          {
            $addFields: {
              totalSolved: {
                $add: [
                  { $size: "$mathmaniaSolved" },
                  { $size: "$puzzleparadiseSolved" },
                  { $size: "$riddlingrewindSolved" },
                ],
              },
            },
          },
          {
            $match: { totalSolved: { $gt: 0 } },
          },
          {
            $sort: { totalSolved: -1 },
          },
          {
            $limit: 10,
          },
          {
            $project: { username: 1, totalSolved: 1 },
          },
        ]);
        break;

      default:
        return new Response(JSON.stringify({ error: "Invalid category" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(leaderboard), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
