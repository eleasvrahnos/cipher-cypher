// boards.js - API designed to get data to populate leaderboards

const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Boards Auth route - executes when leaderboards are visited (default is TOTAL) and when leaderboard category is changed
router.get("/fetchBoards", async (req, res) => {
  const category = req.query.category;
  
  try {
    let leaderboard;

    switch (category) {
      case "mathmania":
        leaderboard = await User.find({
          mathmaniaSolved: { $exists: true, $not: { $size: 0 } },
        })
          .sort({ mathmaniaSolved: -1 })
          .limit(10)
          .select("username mathmaniaSolved")
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
        return res.status(400).json({ error: "Invalid category" });
    }

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
