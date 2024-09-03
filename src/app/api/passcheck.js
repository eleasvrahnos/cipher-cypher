// passcheck.js - API designed to check or get puzzle answer info

const express = require("express");
const router = express.Router();
const User = require("../../models/User");

// Answer Auth route - executes when user clicks button confirming puzzle answer
router.post("/answercheck", async (req, res) => { 
    try {
        const { activeSeries, puzzleNoVisible, answer, userId } = req.body;  // Assuming `userId` is passed in the request
        const storedAnswers = JSON.parse(process.env.ANSWER_KEY);
        const lowerAnswer = answer.toLowerCase();

        // Comparison to answer, returns if correct
        if (storedAnswers[activeSeries] && storedAnswers[activeSeries][puzzleNoVisible - 1] === lowerAnswer) {
            // Determine the correct field to update based on activeSeries
            let updateField;
            if (activeSeries === "mathmania") {
                updateField = { $addToSet: { mathmaniaSolved: puzzleNoVisible } };
            } else if (activeSeries === "puzzleparadise") {
                updateField = { $addToSet: { puzzleparadiseSolved: puzzleNoVisible } };
            } else if (activeSeries === "riddlingrewind") {
                updateField = { $addToSet: { riddlingrewindSolved: puzzleNoVisible } };
            }

            // Update the user's document
            await User.findOneAndUpdate({ username: userId }, updateField);

            res.status(200).json({ solvedStatus: true });
        } else {
            res.status(200).json({ solvedStatus: false });
        }

    } catch (error) {
        // Handle error
        console.error("Submission error:", error);
        res.status(500).json({ error: "Submission error" });
    }
});

// Puzzle Solved Auth route - executes when user has correct answer, updates database
router.post("/puzzlesolved", async (req, res) => {
    try {
        const { activeSeries, puzzleNoVisible, username } = req.body;

        // Fetch the user from the database
        const user = await User.findOne({ username: username });

        // Update the user's solved puzzles based on the active series
        if (user) {
            if (activeSeries === "mathmania") {
                if (!user.mathmaniaSolved.includes(puzzleNoVisible)) {
                    user.mathmaniaSolved.push(puzzleNoVisible);
                }
            } else if (activeSeries === "puzzleparadise") {
                if (!user.puzzleparadiseSolved.includes(puzzleNoVisible)) {
                    user.puzzleparadiseSolved.push(puzzleNoVisible);
                }
            } else if (activeSeries === "riddlingrewind") {
                if (!user.riddlingrewindSolved.includes(puzzleNoVisible)) {
                    user.riddlingrewindSolved.push(puzzleNoVisible);
                }
            }

            await user.save();
        }

        res.status(200).json({ message: "Puzzle status updated successfully" });

    } catch (error) {

        console.error("Error checking solved status:", error);
        res.status(500).json({ error: "Error checking solved status" });

    }
});

// Answer Get Auth route - executes when user opens a puzzle that they have already solved, so the puzzle stays in its solved state
router.get("/answerget", async (req, res) => {
    try {
        const { activeSeries, puzzleNoVisible } = req.query;

        const storedAnswers = JSON.parse(process.env.ANSWER_KEY);

        if (storedAnswers[activeSeries] && storedAnswers[activeSeries][puzzleNoVisible - 1]) {
            const correctAnswer = storedAnswers[activeSeries][puzzleNoVisible - 1];
            res.status(200).json({ answer: correctAnswer });
        } else {
            res.status(404).json({ error: "Answer not found" });
        }

    } catch (error) {
        
        console.error("Error retrieving answer:", error);
        res.status(500).json({ error: "Error retrieving answer" });
    }
});

// Layout Status route - fetches puzzle statuses for the active series and user
router.get("/layoutstatus", async (req, res) => {
  try {
    const { activeSeries, username } = req.query;
    const arrayLengths = [9, 18, 23];
    const user = await User.findOne({ username: username });

    if (!user) {
        return res.status(200).json({ statuses: Array(arrayLengths[parseInt(activeSeries)]).fill(null) })
    }
    
    let statuses = Array(arrayLengths[parseInt(activeSeries)]).fill(null);
    let completedArray = [];

    if (activeSeries === "0") {
      completedArray = user.mathmaniaSolved; // Assuming this is the correct array name
    } else if (activeSeries === "1") {
        completedArray = user.puzzleparadiseSolved; // Assuming this is the correct array name
    } else if (activeSeries === "2") {
        completedArray = user.riddlingrewindSolved; // Assuming this is the correct array name
    }

    completedArray.forEach((index) => {
        // Ensure the index is within bounds
          statuses[index-1] = true;
      });

    res.json({ statuses });
  } catch (err) {
    console.error("Error fetching layout statuses:", err);
    res.status(500).send("Server error");
  }
});


module.exports = router;
