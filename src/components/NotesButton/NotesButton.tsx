// NotesButton.tsx - Back button to get to previous screen

import React from "react";

interface NotesButtonProps {
  handleNotesClick: () => void;
}

const NotesButton: React.FC<NotesButtonProps> = ({ handleNotesClick }) => (
  <button
    onClick={handleNotesClick}
    className="absolute right-4 top-4 z-10 flex items-center justify-center rounded bg-white p-3 text-black"
  >
    Notes
  </button>
);

export default NotesButton;
