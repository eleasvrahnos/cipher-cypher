// SeriesCard.tsx - Series card for series selection screen

import React from "react";
import Image from "next/image";

interface SeriesCardProps {
  opacity: string;
  onClick: () => void;
  imageSrc: string;
  seriesInfo: {
    title: string;
    description: string;
    difficultyRating: string;
    releaseDate: string;
    current: number;
    total: number;
  };
}

const SeriesCard: React.FC<SeriesCardProps> = ({
  opacity,
  onClick,
  imageSrc,
  seriesInfo,
}) => {
  const current = seriesInfo.current;
  const total = seriesInfo.total;
  const percentage = (current / total) * 100;

  return (
    <div
      className={`relative w-full sm:h-full h-1/3 sm:w-1/3 transition-opacity duration-500 ${opacity}`}
      onClick={onClick}
    >
      <Image
        src={imageSrc}
        alt="Series Image"
        fill
        style={{ objectFit: "cover" }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="absolute inset-0"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 sm:gap-5 border-4 border-white bg-black bg-opacity-0 p-4 text-center text-white opacity-0 transition-opacity duration-200 hover:cursor-pointer hover:bg-opacity-50 hover:opacity-100">
        <div className="flex flex-row sm:flex-col items-center space-x-5 space-y-0 sm:space-y-2 sm:space-x-0">
          <h1 className="text-lg  sm:text-5xl font-bold">{seriesInfo.title}</h1>
          <p className="text-sm sm:text-md italic">{seriesInfo.releaseDate}</p>
        </div>
        <p className="text-sm sm:text-lg">{seriesInfo.description}</p>
        <div className="text-sm sm:text-md flex flex-row sm:flex-col items-center gap-3">
          <p>Difficulty:</p>
          <img src={seriesInfo.difficultyRating} className="h-6 sm:h-10" />
        </div>

        <div className="relative mb-0 mt-1 sm:mb-10 h-8 w-5/6 overflow-hidden rounded-full bg-gray-400">
          {/* Filled portion of the progress bar */}
          <div
            className={`h-full ${percentage === 100 ? "bg-green-500" : "bg-blue-500"}`}
            style={{ width: `${percentage}%` }}
          ></div>
          {/* Text on top of the progress bar */}
          <div className="absolute inset-0 flex items-center justify-center font-bold text-white">
            {`${current} / ${total}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesCard;
