// PuzzleButton.tsx - Puzzle button for user to select a puzzle

import React from "react";

interface PuzzleButtonProps {
  meta?: boolean;
  completed: boolean | null;
  seriesName: string;
  puzzleID: number;
  handlePuzzleClick: (puzzleID: number) => void;
}

const PuzzleButton: React.FC<PuzzleButtonProps> = ({
  meta,
  completed,
  seriesName,
  puzzleID,
  handlePuzzleClick,
}) => (
  <button
    key={puzzleID}
    className={`relative aspect-square rounded-lg text-4xl font-bold text-white transition-colors duration-150 hover:text-opacity-0 ${meta ? "h-28 sm:h-36" : "flex h-16 sm:h-20 lg:h-24 xl:h-28 items-center justify-center"} ${completed ? "bg-green-500 hover:bg-green-700" : "bg-blue-500 hover:bg-blue-700"}`}
    onClick={() => handlePuzzleClick(puzzleID)}
  >
    {meta ? "META" : puzzleID}
    <div className="absolute inset-0 flex items-center justify-center p-3 opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100">
      <img
        src={`/puzzles/${seriesName}/${puzzleID}-icon.png`}
        alt={`${seriesName} - Puzzle ${puzzleID} Icon`}
      />
    </div>
  </button>
);

export default PuzzleButton;
