// PuzzleLayout.tsx - Puzzle buttons button layout when user selects series

// IMPORTS - PuzzleButton
import React, { useEffect } from "react";
import PuzzleButton from "./PuzzleButton";

interface PuzzleLayoutProps {
  seriesIDtoName: (seriesID: number, file: boolean) => string;
  seriesPuzzleCount: number[];
  activeSeries: number;
  handlePuzzleClick: (puzzleID: number) => void;
  puzzleStatuses: (boolean | null)[];
}

const PuzzleLayout: React.FC<PuzzleLayoutProps> = ({
  seriesIDtoName,
  seriesPuzzleCount,
  activeSeries,
  handlePuzzleClick,
  puzzleStatuses,
}) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="mb-8 flex flex-wrap justify-center gap-4 px-8">
        {Array.from({ length: seriesPuzzleCount[activeSeries] }, (_, index) => (
          <PuzzleButton
            key={index + 1}
            seriesName={seriesIDtoName(activeSeries, true)}
            puzzleID={index + 1}
            handlePuzzleClick={handlePuzzleClick}
            completed={puzzleStatuses[index] === true}
          />
        ))}
      </div>
      <PuzzleButton
        key={seriesPuzzleCount[activeSeries] + 1}
        seriesName={seriesIDtoName(activeSeries, true)}
        puzzleID={seriesPuzzleCount[activeSeries] + 1}
        handlePuzzleClick={handlePuzzleClick}
        meta={true}
        completed={puzzleStatuses[seriesPuzzleCount[activeSeries]] === true}
      />
    </div>
  );
};

export default PuzzleLayout;
