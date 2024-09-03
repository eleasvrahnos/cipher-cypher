// BottomCover.tsx - Bottom Cover component on website startup

import React from "react";
import IconList from "../IconList/IconList";

// onPlay is called when Bottom Cover Play button is clicked
interface BottomCoverProps {
  isPlaying: boolean;
  onPlay: () => void;
}

const BottomCover: React.FC<BottomCoverProps> = ({ isPlaying, onPlay }) => {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 flex h-1/2 items-start justify-center bg-black p-4 text-white transition-transform duration-700 ${
        isPlaying && "translate-y-[100%]"
      }`}
    >
      <div className="flex flex-col gap-5 h-12">
        <button className="border border-white p-2 rounded-xl hover:bg-white hover:text-black transition" onClick={onPlay}>Play</button>
        <IconList />
      </div>
    </div>
  );
};

export default BottomCover;
