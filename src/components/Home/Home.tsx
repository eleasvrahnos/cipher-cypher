// Home.tsx - Home component that outlines the page seen at startup

"use client";

// IMPORTS - Top and Bottom sliding cover, Main Area, Header and Footer
import React, { useEffect, useState } from "react";
import TopCover from "../TopCover/TopCover";
import BottomCover from "../BottomCover/BottomCover";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import MainArea from "../MainArea/MainArea";

export default function Home() {
  // isPlaying - Whether user is in the main area, moves top/bottom covers out if True
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  // isSeries - Whether user is within a puzzle selection screen for a series, changes header title to series title
  const [isSeries, setIsSeries] = useState<{ isSeries: boolean; title: string }>({
    isSeries: false,
    title: "CIPHER CYPHER"
  });

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleSeries = (title: string) => {
    setIsSeries({ isSeries: true, title });
  };

  return (
    <div className={`flex flex-col w-full max-h-screen ${isPlaying ? "touch-auto" : "touch-none"}`}>
      <TopCover isPlaying={isPlaying} />
      <div className="flex h-screen flex-col">
      <Header isSeries={isSeries.isSeries} title={isSeries.title} />
      <MainArea activeTitle={handleSeries} />
      <Footer />
      </div>
      <BottomCover isPlaying={isPlaying} onPlay={handlePlay} />
    </div>
  );
}
