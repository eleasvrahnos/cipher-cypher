// boards.js - API designed to get data to populate leaderboards

const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Create indexes (you only need to do this once, not on every request)
User.createIndexes({ mathmaniaSolved: 1 });
User.createIndexes({ puzzleparadiseSolved: 1 });
User.createIndexes({ riddlingrewindSolved: 1 }); 

router.get("/fetchBoards", async (req, res) => {
  const category = req.query.category;

  console.log("Received request for category:", category);
  
  try {
    let leaderboard;

    switch (category) {
      case "mathmania":
        console.log("Querying mathmania leaderboard...");
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
            $limit: 10,
          },
          {
            $project: { username: 1, totalSolved: 1 },
          },
        ]);
        break;

      default:
        console.log("Invalid category:", category);
        return res.status(400).json({ error: "Invalid category" });
    }

    console.log("Query successful for category:", category);
    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
