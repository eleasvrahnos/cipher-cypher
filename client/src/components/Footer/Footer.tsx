// Footer.tsx - Footer for all of website, houses social information like icons

import React from "react";
import IconList from "../IconList/IconList";

const Footer = () => {

  return (
    <div className="flex h-[5%] items-center justify-center bg-black text-2xl text-white">
      <IconList />
    </div>
  );
};

export default Footer;
