// Leaderboards.tsx - Gives leaderboards for all users and for all series

"use client";

// IMPORTS - Axios, Cookie, UserContext, BackButton, Router
import React, { useState, useEffect } from "react";
import axios from "axios";
import cookie from "js-cookie";
import { useUserContext } from "../UserContext/UserContext";
import BackButton from "../BackButton/BackButton";
import { useRouter } from "next/navigation";

// Define the interface for the user data
interface User {
  _id: string;
  username: string;
  mathmaniaSolved: number[];
  puzzleparadiseSolved: number[];
  riddlingrewindSolved: number[];
  totalSolved?: number; // Optional, assuming this is calculated on the server
  [key: string]: any; // Allows indexing with any string key
}

// Define the interface for the category data
interface Category {
  key: string;
  label: string;
  totalCount: number;
}

const Leaderboards: React.FC = () => {
  // Use the hook to get username
  const { username, setUsername } = useUserContext();
  // activeCategory - Keeps track of what leaderboard category is selected
  const [activeCategory, setActiveCategory] = useState("total");
  // data - Keeps track of data to display for the category's leaderboard
  const [data, setData] = useState<User[]>([]);
  // previousData - Holds data on category change, for skeleton loaders
  const [previousData, setPreviousData] = useState<User[]>([]);
  // loading - A loading state to take care of leaderboard transitions, used for skeleton loaders
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const categories: Category[] = [
    { key: "mathmania", label: "Math Mania", totalCount: 9 },
    { key: "puzzleparadise", label: "Puzzle Paradise", totalCount: 18 },
    { key: "riddlingrewind", label: "Riddling Rewind", totalCount: 23 },
    { key: "total", label: "Total Puzzles Solved", totalCount: 50 },
  ];

  // Get the total count for the active category
  const getTotalCount = (key: string) => {
    const category = categories.find((cat) => cat.key === key);
    return category ? category.totalCount : 0;
  };

  // Fetch leaderboard data and handle transitions
  const fetchLeaderboard = async (category: string) => {
    setLoading(true);
    try {
      const response = await axios.get<User[]>("/api/boards/fetchBoards", {
        params: { category },
      });
      setPreviousData(data); // Save current data before updating
      setData(response.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetches leaderboard on category change
  useEffect(() => {
    fetchLeaderboard(activeCategory);
  }, [activeCategory]);

  // Checks if token exists and is valid
  const isLogin = async () => {
    try {
      const token = cookie.get("token");
      if (token) {
        const res = await axios.post("/apiList/auth/isLogin", { token });
        return res.data;
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    }
    return { auth: false };
  };

  // Occurs everytime a new username is set
  useEffect(() => {
    const authenticate = async () => {
      const loggedIn = await isLogin();
      if (loggedIn.auth) {
        setUsername(loggedIn.data.username); // Set the username in the context
      }
    };
    authenticate();
  }, [setUsername]);

  const isArray = (value: any): value is number[] => Array.isArray(value);

  // Determine the solved count for display
  const getSolvedCount = (user: User) => {
    if (activeCategory === "total") {
      return `${user.totalSolved ?? 0} / ${getTotalCount("total")}`;
    } else if (isArray(user[`${activeCategory}Solved`])) {
      return `${user[`${activeCategory}Solved`].length} / ${getTotalCount(activeCategory)}`;
    } else {
      return `0 / ${getTotalCount(activeCategory)}`;
    }
  };

  // Check if the user has completed all puzzles in the active category
  const completedCategory = (user: User) => {
    if (activeCategory === "total") {
      return (user.totalSolved ?? 0) >= getTotalCount("total");
    } else if (isArray(user[`${activeCategory}Solved`])) {
      return (
        user[`${activeCategory}Solved`].length >= getTotalCount(activeCategory)
      );
    } else {
      return false;
    }
  };

  // Redirects to home pages
  const handleBackClick = () => {
    router.push("/");
  };

  // Determine the number of rows to display for skeleton loaders
  const rowCount = loading ? data.length || previousData.length : data.length;

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-900 p-8 text-white">
      <BackButton handleBackClick={handleBackClick} />
      <h1 className="mb-8 text-4xl font-bold">Leaderboards</h1>
      <div className="w-full max-w-3xl">
        <div className="mb-3">
          <button
            onClick={() => setActiveCategory("total")}
            className={`w-full rounded px-6 py-2 transition-colors ${
              activeCategory === "total"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white"
            }`}
            aria-pressed={activeCategory === "total"}
          >
            Total Puzzles Solved
          </button>
        </div>
        <div className="mb-8 flex space-x-4">
          {categories.slice(0, -1).map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`flex-1 rounded px-6 py-2 transition-colors ${
                activeCategory === category.key
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white"
              }`}
              aria-pressed={activeCategory === category.key}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
      <div className="relative w-full max-w-3xl">
        <table className="w-full table-auto overflow-hidden rounded-lg bg-gray-800 text-left shadow-lg">
          <thead>
            <tr>
              <th className="bg-gray-700 px-4 py-2">Rank</th>
              <th className="bg-gray-700 px-4 py-2">Username</th>
              <th className="bg-gray-700 px-4 py-2">Solved</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: rowCount }, (_, index) => (
                <tr key={index} className="border-t border-gray-700">
                  <td className="px-4 py-2">
                    <div className="h-6 w-1/4 animate-pulse rounded bg-gray-700"></div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-6 w-1/2 animate-pulse rounded bg-gray-700"></div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-6 w-1/3 animate-pulse rounded bg-gray-700"></div>
                  </td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-2 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((user, index) => (
                <tr
                  key={user._id}
                  className={`border-t border-gray-700 ${user.username === username ? "text-green-500" : ""} ${
                    ((activeCategory === "total" && completedCategory(user)) ||
                      (activeCategory !== "total" &&
                        completedCategory(user))) &&
                    user.username !== username
                      ? "text-yellow-500"
                      : ""
                  }`}
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{getSolvedCount(user)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboards;
