import React from "react";

interface SubmitButtonProps {
  onClick: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick }) => {
  return <button onClick={onClick} className="p-4 bg-white rounded-lg ml-2">SUBMIT</button>;
};

export default SubmitButton;
