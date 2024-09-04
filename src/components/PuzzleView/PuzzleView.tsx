// PuzzleView.tsx - Shows the answer field and puzzle when user clicks on a puzzle

// IMPORTS - SubmitButton (MM only), Axios
import React, { useEffect, useState } from "react";
import Image from "next/image";
import SubmitButton from "../SubmitButton/SubmitButton";
import axios from "axios";
import { useUserContext } from "../UserContext/UserContext";

interface PuzzleViewProps {
  activeSeries: string;
  puzzleNoVisible: number;
  onPuzzleSolved: (activeSeries: string, puzzleNoVisible: number, newStatus: boolean | null) => void; // Add this prop
  puzzleSolved: boolean | null;
}

const PuzzleView: React.FC<PuzzleViewProps> = ({
  activeSeries,
  puzzleNoVisible,
  onPuzzleSolved, // Destructure this prop
  puzzleSolved
}) => {

  const { username } = useUserContext(); // Use the hook to get username

  const ppLengths = [
    9, 14, 12, 6, 9, 10, 12, 11, 13, 14, 11, 12, 10, 10, 7, 9, 7, 17,
  ];
  const rrLengths = [
    9, 16, 8, 13, 13, 14, 10, 13, 27, 15, 11, 17, 73, 8, 12, 15, 19, 6, 11, 10,
    21, 22, 29,
  ];
  
  // answer - current state within answer text field
  const [answer, setAnswer] = useState<string>("");
  // currLength - current length of inputted answer
  const [currLength, setCurrLength] = useState<number>(
    activeSeries === "puzzleparadise"
      ? ppLengths[puzzleNoVisible - 1]
      : rrLengths[puzzleNoVisible - 1],
  );

  // Auto tracks how many characters the user has put in, shows character count at beginning for PP and RR
  useEffect(() => {
    const lenList = activeSeries === "puzzleparadise" ? ppLengths : rrLengths;
    setCurrLength(lenList[puzzleNoVisible - 1] - answer.length);
    if (
      activeSeries !== "mathmania" &&
      answer.length >= lenList[puzzleNoVisible - 1]
    ) {
      handleSubmit();
    } else if (puzzleSolved === false) {
      onPuzzleSolved(activeSeries, puzzleNoVisible, null);
    }
  }, [answer]);

  // Fetches answer to auto-fill text field if user has already solved puzzle, clears input field on logout
  useEffect(() => {
    const fetchAnswer = async () => {
      if (username && puzzleSolved) {
        try {

          const response = await axios.post("/api/passcheck/answerget", {
            activeSeries,
            puzzleNoVisible,
            username
          });
          setAnswer(response.data.answer);

        } catch (err: any) {

          console.error("Error fetching answer:", err);

        }
      }
    };


    fetchAnswer();
  }, [puzzleSolved]);

  // Allows user to press 'Enter' to submit puzzle answer (MM only)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Checks if the answer is correct on submit (MM) or auto-submit (PP and RR)
  const handleSubmit = async () => {
    if (answer) {
      try {

        const response = await axios.post("/api/passcheck/answercheck", {
          activeSeries,
          puzzleNoVisible,
          answer,
          username,
        });

        if (response.data.solvedStatus) {
          onPuzzleSolved(activeSeries, puzzleNoVisible, true);
        } else {
          onPuzzleSolved(activeSeries, puzzleNoVisible, false);
        }

      } catch (err: any) {

        console.error("Answer submission error:", err);

      }
    }
  };

  return (
    <div className="flex h-full w-full flex-col justify-center">
      <div className="relative flex flex-grow">
        <Image
          src={`/puzzles/${activeSeries}/${puzzleNoVisible}.${activeSeries === "puzzleparadise" && puzzleNoVisible === 7 ? "gif" : "png"}`}
          alt={`${activeSeries} Puzzle No. ${puzzleNoVisible}`}
          fill
          className="object-contain"
        />
      </div>
      <div className="flex flex-row justify-center pb-5 mx-3">
        <div className="relative flex flex-col items-center">
          <div className="absolute left-0 top-0 p-2">
            {!puzzleSolved && activeSeries !== "mathmania" && currLength}
          </div>
          <input
            type="text"
            value={answer}
            onChange={(e) => {
              const alphanumericInput = (activeSeries === "mathmania" ? e.target.value.replace(/[^a-zA-Z0-9.-]/g, "") : e.target.value.replace(/[^a-zA-Z0-9 ]/g, "") )
              setAnswer(alphanumericInput);
            }}
            onKeyDown={handleKeyDown}
            readOnly={puzzleSolved === true}
            spellCheck={false}
            maxLength={100}
            className={`w-full rounded-lg p-4 text-center text-lg shadow focus:outline-none ${
              puzzleSolved === true
                ? "bg-green-400"
                : puzzleSolved === false
                  ? "bg-red-400"
                  : "bg-white"
            }`}
            placeholder="Type your answer"
            style={{ lineHeight: "1.5" }}
          />
        </div>
        {activeSeries === "mathmania" && !puzzleSolved && (
          <SubmitButton onClick={handleSubmit} />
        )}
      </div>
    </div>
  );
};

export default PuzzleView;
