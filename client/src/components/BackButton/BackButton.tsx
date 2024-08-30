// BackButton.tsx - Back button to get to previous screen

import React from "react";

interface BackButtonProps {
  handleBackClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ handleBackClick }) => (
  <button
    onClick={handleBackClick}
    className="absolute left-4 top-4 z-10 flex items-center justify-center rounded bg-white p-3 text-black"
  >
    Back
  </button>
);

export default BackButton;
