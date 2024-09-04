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
        leaderboard = await User.aggregate([
          {
            $match: {
              mathmaniaSolved: { $not: { $size: 0 } }
            }
          },
          {
            $addFields: {
              mathmaniaSolvedCount: { $size: "$mathmaniaSolved" }
            }
          },
          {
            $sort: { mathmaniaSolvedCount: -1 }
          },
          {
            $limit: 10
          },
          {
            $project: {
              username: 1,
              mathmaniaSolved: 1
            }
          }
        ])
        break;

      case "puzzleparadise":
        leaderboard = await User.aggregate([
          {
            $match: {
              puzzleparadiseSolved: { $not: { $size: 0 } }
            }
          },
          {
            $addFields: {
              puzzleparadiseSolvedCount: { $size: "$puzzleparadiseSolved" }
            }
          },
          {
            $sort: { puzzleparadiseSolvedCount: -1 }
          },
          {
            $limit: 10
          },
          {
            $project: {
              username: 1,
              puzzleparadiseSolved: 1
            }
          }
        ])
        break;

      case "riddlingrewind":
        leaderboard = await User.aggregate([
          {
            $match: {
              riddlingrewindSolved: { $not: { $size: 0 } }
            }
          },
          {
            $addFields: {
              riddlingrewindSolvedCount: { $size: "$riddlingrewindSolved" }
            }
          },
          {
            $sort: { riddlingrewindSolvedCount: -1 }
          },
          {
            $limit: 10
          },
          {
            $project: {
              username: 1,
              riddlingrewindSolved: 1
            }
          }
        ])
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
