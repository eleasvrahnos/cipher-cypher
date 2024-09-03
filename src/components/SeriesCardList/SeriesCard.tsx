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
      className={`relative h-full w-1/3 transition-opacity duration-500 ${opacity}`}
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
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 border-4 border-white bg-black bg-opacity-0 p-4 text-center text-white opacity-0 transition-opacity duration-200 hover:cursor-pointer hover:bg-opacity-50 hover:opacity-100">
        <h1 className="text-5xl font-bold">{seriesInfo.title}</h1>
        <p className="italic">Released on {seriesInfo.releaseDate}</p>
        <p>{seriesInfo.description}</p>
        <div className="flex flex-row items-center gap-3">
          <p>Difficulty:</p>
          <img src={seriesInfo.difficultyRating} className="h-10" />
        </div>

        <div className="relative my-10 top-10 h-8 w-3/4 overflow-hidden rounded-full bg-gray-300">
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
