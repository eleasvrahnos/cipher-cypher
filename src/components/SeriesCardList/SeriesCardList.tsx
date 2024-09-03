// SeriesCardList.tsx - Series selection screen

// IMPORTS - SeriesCard
import React from "react";
import SeriesCard from "./SeriesCard";

interface SeriesCardListProps {
  seriesStart: boolean;
  handleCardClick: (seriesID: number) => void;
  seriesIDtoName: (seriesID: number, file: boolean) => string;
  puzzleStatuses: (boolean | null)[][];
}

// Generates three even series cards with their corresponding information
const SeriesCardList: React.FC<SeriesCardListProps> = ({
  seriesStart,
  handleCardClick,
  seriesIDtoName,
  puzzleStatuses
}) => {

  const seriesInfo: Record<number, { title: string, description: string, difficultyRating: string, releaseDate: string, current: number, total: number, }> = {
    0: { title: "Math Mania", description: "For those with an interest in math and puzzles, this is the crossover you've always wanted! See if you can be the first to beat these math-related puzzles.", difficultyRating: "/difficulty/mathmania.png", releaseDate: "April 11, 2020", current: puzzleStatuses[0].filter(element => element === true).length, total: 9,  },
    1: { title: "Puzzle Paradise", description: "For those who have a good foundational understanding of ciphers and critical thinking. Will you be the first to decode them all?", difficultyRating: "/difficulty/puzzleparadise.png", releaseDate: "April 12, 2022", current: puzzleStatuses[1].filter(element => element === true).length, total: 18, },
    2: { title: "Riddling Rewind", description: "For those who want to challenge their cipher and cryptography knowledge. Thinking outside the box is required to be the first one to complete this brutal set of puzzles.", difficultyRating: "/difficulty/riddlingrewind.png", releaseDate: "August 22, 2022", current: puzzleStatuses[2].filter(element => element === true).length, total: 23, },
  };

  return (
    <div className="flex h-full w-full flex-row">
      {Array.from({ length: 3 }, (_, index) => (
        <SeriesCard
          key={index}
          opacity={seriesStart ? "opacity-0 z-0" : "opacity-100 z-10"}
          onClick={() => handleCardClick(index)}
          imageSrc={`/bg/${seriesIDtoName(index, true)}-third.jpg`}
          seriesInfo={seriesInfo[index]}
        />
      ))}
    </div>
  );
};

export default SeriesCardList;
