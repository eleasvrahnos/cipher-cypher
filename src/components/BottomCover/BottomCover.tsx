import React, { useEffect, useState } from "react";
import IconList from "../IconList/IconList";
import { useUserContext } from "@/components/UserContext/UserContext"; // Import the context
import cookie from "js-cookie";
import axios from "axios";

// onPlay is called when Bottom Cover Play button is clicked
interface BottomCoverProps {
  isPlaying: boolean;
  onPlay: () => void;
}

const BottomCover: React.FC<BottomCoverProps> = ({ isPlaying, onPlay }) => {

  const { username, setUsername } = useUserContext(); // Use the context

  const [loading, setLoading] = useState<boolean>(true);

  // Checks if token exists and is valid
  const isLogin = async () => {
    try {
      const token = cookie.get("token");
      if (token) {
        const res = await axios.post("/api/auth/isLogin", { token });
        return res.data;
      }
    } catch (error) {
      console.error("Error checking login status:", error);

      // Optionally clear the token if there's an error with login
      cookie.remove("token");
    }
    return { auth: false };
  };

  // Occurs every time a new username is set
  useEffect(() => {
    const authenticate = async () => {
      const loggedIn = await isLogin();
      if (loggedIn.auth) {
        setUsername(loggedIn.data.username); // Set the username in the context
      }
    };
    authenticate();
    setTimeout(() => {
      setLoading(false);
    }, 250);
  }, [setUsername]);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 flex h-1/2 items-start justify-center bg-black p-4 text-white transition-transform duration-700 ${
        isPlaying && "translate-y-[100%]"
      }`}
    >
      <div className="flex h-12 flex-col items-center gap-5">
        <button
          className="w-auto rounded-xl border border-white p-2 transition hover:bg-white hover:text-black"
          onClick={onPlay}
        >
          Play as {loading ? "..." : (username ? username : "Guest")}
        </button>
        <IconList />
      </div>
    </div>
  );
};

export default BottomCover;
