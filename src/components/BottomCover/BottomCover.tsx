import React, { useState, useEffect } from "react";
import IconList from "../IconList/IconList";

// onPlay is called when Bottom Cover Play button is clicked
interface BottomCoverProps {
  isPlaying: boolean;
  onPlay: () => void;
}

const BottomCover: React.FC<BottomCoverProps> = ({ isPlaying, onPlay }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check the screen width and update state
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // Assuming 768px is the breakpoint for mobile devices
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 flex h-1/2 items-start justify-center bg-black p-4 text-white transition-transform duration-700 ${
        isPlaying && "translate-y-[100%]"
      }`}
    >
      <div className="flex flex-col items-center gap-5 h-12">
        {isMobile ? (
          <p className="text-center">Please use a desktop device to play.</p>
        ) : (
          <button
            className="border border-white p-2 rounded-xl w-20 hover:bg-white hover:text-black transition"
            onClick={onPlay}
          >
            Play
          </button>
        )}
        <IconList />
      </div>
    </div>
  );
};

export default BottomCover;
