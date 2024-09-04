// Footer.tsx - Footer for all of website, houses social information like icons

import React from "react";
import IconList from "../IconList/IconList";

const Footer = () => {
  return (
    <div
      className="flex items-center justify-center bg-black text-2xl text-white"
      style={{
        height: `calc(5% + env(safe-area-inset-bottom))`, // Adjusts height to account for the bottom safe area
        paddingBottom: "env(safe-area-inset-bottom)", // Adds padding at the bottom for iOS safe area
      }}
    >
      <IconList />
    </div>
  );
};

export default Footer;
