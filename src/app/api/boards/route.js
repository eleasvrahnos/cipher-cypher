const mongoose = require('mongoose');
const User = require("@/models/User");
require("dotenv").config();

// Connect to MongoDB
const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
};

export async function POST(request) {
  const { category } = await request.json(); // Extract category from the request body
  console.log("Received category:", category);

  await connectToDatabase(); // Ensure database connection

  try {
    let leaderboard;

    switch (category) {
      case "mathmania":
        console.log("Querying mathmania leaderboard...");
        console.log("User model:", User);
        leaderboard = await User.find({
          mathmaniaSolved: { $exists: true, $not: { $size: 0 } },
        })
          .sort({ mathmaniaSolved: -1 })
          .limit(10)
          .select("username mathmaniaSolved")
          .lean();
        break;

      case "puzzleparadise":
        console.log("Querying puzzleparadise leaderboard...");
        leaderboard = await User.find({
          puzzleparadiseSolved: { $exists: true, $not: { $size: 0 } },
        })
          .sort({ puzzleparadiseSolved: -1 })
          .limit(10)
          .select("username puzzleparadiseSolved")
          .lean();
        break;

      case "riddlingrewind":
        console.log("Querying riddlingrewind leaderboard...");
        leaderboard = await User.find({
          riddlingrewindSolved: { $exists: true, $not: { $size: 0 } },
        })
          .sort({ riddlingrewindSolved: -1 })
          .limit(10)
          .select("username riddlingrewindSolved")
          .lean();
        break;

      case "total":
        console.log("Querying total leaderboard...");
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
            $limit: 10 },
          {
            $project: { username: 1, totalSolved: 1 },
          },
        ]);
        break;

      default:
        console.log("Invalid category:", category);
        return new Response(JSON.stringify({ error: "Invalid category" }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
    }

    console.log("Query successful for category:", category);
    return new Response(JSON.stringify(leaderboard), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
