// NotesButton.tsx - Back button to get to previous screen

import React from "react";

interface NotesButtonProps {
  puzzleVisible: boolean;
  handleNotesClick: () => void;
}

const NotesButton: React.FC<NotesButtonProps> = ({ puzzleVisible, handleNotesClick }) => (
  <button
    onClick={handleNotesClick}
    className="absolute right-4 top-4 z-10 flex items-center justify-center rounded bg-white p-3 text-black"
  >
    {puzzleVisible ? "Hints" : "Notes"}
  </button>
);

export default NotesButton;
