// IconList.tsx - List of Icons shown to other pages or links

import { useRouter } from "next/navigation";
import React from "react";

const IconList = () => {

  const router = useRouter();

  const handleInfo = () => {
    router.push("/info");
  };

  return (
    <div className="flex h-full items-center space-x-3">
      <img
        src="/icons/info.png"
        className="h-5/6 object-contain transition duration-200 hover:scale-110 hover:cursor-pointer"
        onClick={handleInfo}
      />
      <a
        href="https://discord.gg/yPJR55J"
        target="_blank"
        rel="noopener noreferrer"
        className="h-5/6"
      >
        <img
          src="/icons/discord.png"
          className="h-full object-contain transition duration-200 hover:scale-110 hover:cursor-pointer"
        />
      </a>
    </div>
  );
};

export default IconList;
