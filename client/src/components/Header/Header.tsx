// Header.tsx - Header for all of website, houses title, leaderboards, and login capabilities

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/components/UserContext/UserContext"; // Import the context
import cookie from "js-cookie";
import axios from "axios";

interface HeaderProps {
  isSeries: boolean;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ isSeries, title }) => {
  const { username, setUsername } = useUserContext(); // Use the context
  const router = useRouter();

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
  }, [setUsername]);

  // Logs user out by clearing username context and removing token
  const handleLogout = () => {
    cookie.remove("token");
    setUsername(""); // Clear the username in the context
    router.push("/");
  };

  // Redirects to leaderboards
  const handleBoards = () => {
    router.push("/boards");
  };

  return (
    <div className="relative flex h-[5%] items-center bg-black text-white">
      <button
        onClick={handleBoards}
        className="absolute left-5 rounded-lg border border-white px-1 hover:bg-white hover:text-black"
      >
        LEADERBOARDS
      </button>
      <h1 className="mx-auto text-2xl font-bold">
        {isSeries ? title : "CIPHER CYPHER"}
      </h1>
      {username ? (
        <div className="absolute right-5 flex flex-row gap-3">
          <h1>{username}</h1>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-white px-1 hover:bg-white hover:text-black"
          >
            LOGOUT
          </button>
        </div>
      ) : (
        <button
          onClick={() => router.push("/login")}
          className="absolute right-5 rounded-lg border border-white px-1 hover:bg-white hover:text-black"
        >
          LOGIN
        </button>
      )}
    </div>
  );
};

export default Header;
