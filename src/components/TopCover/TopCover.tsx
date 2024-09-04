// TopCover.tsx - Top Cover component on website startup

import React from "react";

interface TopCoverProps {
  isPlaying: boolean;
}

const TopCover: React.FC<TopCoverProps> = ({ isPlaying }) => {
  return (
    <div
      className={`fixed left-0 right-0 top-0 z-50 flex h-[51%] flex-col justify-end bg-black p-4 text-center text-white transition-transform duration-700 ${
        isPlaying && "-translate-y-[100%]"
      }`}
    >
      <div>
        <h1 className="text-xl">Welcome to CIPHER CYPHER.</h1>
        <h1>50 visual puzzles designed to test your skills in math, cryptography, trivia, and wit.</h1>
        <h1>Ready to play?</h1>
      </div>
    </div>
  );
};

export default TopCover;
