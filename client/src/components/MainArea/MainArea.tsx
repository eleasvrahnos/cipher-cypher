// MainArea.tsx - Main area for players to interact with the puzzles

// IMPORTS - SeriesCardList, BackButton, PuzzleLayout, PuzzleView, Axios
import React, { useState, useEffect } from "react";
import SeriesCardList from "../SeriesCardList/SeriesCardList";
import Image from "next/image";
import BackButton from "../BackButton/BackButton";
import PuzzleLayout from "../PuzzleLayout/PuzzleLayout";
import PuzzleView from "../PuzzleView/PuzzleView";
import axios from "axios";
import { useUserContext } from "../UserContext/UserContext"; // Import the hook

interface MainAreaProps {
  activeTitle: (title: string) => void;
}

const MainArea: React.FC<MainAreaProps> = ({ activeTitle }) => {
  // Use the hook to get username
  const { username } = useUserContext();
  // seriesStart - Whether user has clicked into a new series
  const [seriesStart, setSeriesStart] = useState<boolean>(false);
  // activeSeries - The current series the user is on (0 default)
  const [activeSeries, setActiveSeries] = useState<number>(0);
  // newSeriesVisible - Whether the series puzzle buttons are visible (for delay, user experience purposes)
  const [newSeriesVisible, setNewSeriesVisible] = useState<boolean>(false);
  // puzzleVisible - Determines if and what puzzle is selected
  const [puzzleVisible, setPuzzleVisible] = useState<[boolean, number]>([
    false,
    0,
  ]);
  // puzzleStatuses - Preloads completion of puzzles in all of the series
  const [puzzleStatuses, setPuzzleStatuses] = useState<(boolean | null)[][]>([
    Array(9).fill(null),
    Array(18).fill(null),
    Array(23).fill(null),
  ]);

  // Occurs whenever seriesStart changes, affects transition time of background cards
  useEffect(() => {
    if (seriesStart) {
      setTimeout(() => {
        setNewSeriesVisible(true);
      }, 250);
    } else {
      setNewSeriesVisible(false);
    }
  }, [seriesStart]);

  useEffect(() => {
    if (!username) {
      setTimeout(() => {
        setPuzzleStatuses([
          Array(9).fill(null),
          Array(18).fill(null),
          Array(23).fill(null),
        ])
      }, 250);
    }
  }, [username]);
  
  // Occurs whenever activeSeries or username changes, layout status is updated for preloading
  useEffect(() => {
    const fetchAnswersForAllSeries = async () => {
      try {
        const updatedPuzzleStatuses = [...puzzleStatuses];
  
        // Loop through each series
        for (let seriesIndex = 0; seriesIndex < seriesPuzzleCount.length; seriesIndex++) {
          // If username exists, fetch puzzle statuses for the current series
          if (username) {
            const response = await axios.get(`${process.env.SERVER}/api/passcheck/layoutstatus`, {
              params: {
                activeSeries: seriesIndex, // Pass the current series index
                statusesToSend: JSON.stringify(puzzleStatuses[seriesIndex]),
                username,
              },
            });
  
            // Update the puzzle statuses for the current series
            updatedPuzzleStatuses[seriesIndex] = response.data.statuses;
          }
        }
  
        // Set the updated puzzle statuses for all series
        setPuzzleStatuses(updatedPuzzleStatuses);
  
      } catch (err: any) {
        console.error("Error fetching answers for all series:", err);
      }
    };
  
    // Delay the execution to ensure rendering happens only after the user is loaded
    const timer = setTimeout(() => {
      fetchAnswersForAllSeries();
    }, 200); // Set timeout for 200 milliseconds
  
    // Clean up the timeout if the component is unmounted or dependencies change
    return () => clearTimeout(timer);
  
  }, [username]);

  // handleCardClick - Starts a series when user clicks on a third card
  const handleCardClick = (seriesID: number) => {
    if (!seriesStart) {
      setActiveSeries(seriesID);
      setSeriesStart(true);
      activeTitle(seriesIDtoName(seriesID, false));
    }
  };

  // handleBackClick - Occurs when back button is clicked (puzzle to series, series to series select)
  const handleBackClick = () => {
    if (puzzleVisible[0]) {
      setPuzzleVisible([false, 0]);
    } else {
      setSeriesStart(false);
      activeTitle("CIPHER CYPHER");
    }
  };

  // handlePuzzleClick - Occurs when user selects a puzzle
  const handlePuzzleClick = (puzzleID: number) => {
    setPuzzleVisible([true, puzzleID]);
  };

  // How many puzzles (excluding metas) are included in each series, used for button generation

  const seriesPuzzleCount = [8, 17, 22];

  // seriesIDtoName - Converts a series ID to series name, either for title or for file purposes

  const seriesIDtoName = (seriesID: number, file: boolean) => {
    const names = ["MATH MANIA", "PUZZLE PARADISE", "RIDDLING REWIND"];
    return file
      ? names[seriesID].toLowerCase().replace(/\s/g, "")
      : names[seriesID];
  };

  // seriesNametoID - Converts a series name to series ID
  const seriesNametoID = (series: string) => {
    switch (series) {
      case "mathmania":
        return 0;
      case "puzzleparadise":
        return 1;
      case "riddlingrewind":
        return 2;    
      default:
        return 0;
    }
  };

  // handlePuzzleSolved - Updates a button or user solve state when a change occurs
  const handlePuzzleSolved = (
    activeSeries: string,
    puzzleNoVisible: number,
    newStatus: boolean | null,
  ) => {

    const seriesID = seriesNametoID(activeSeries);
    setPuzzleStatuses((puzzleStatuses) => {
      const updatedStatuses = [...puzzleStatuses];
      updatedStatuses[seriesID] = updatedStatuses[seriesID].map(
        (status, index) => (index === puzzleNoVisible - 1 ? newStatus : status),
      );
      return updatedStatuses;
    });

    if (newStatus && username) {
      updateDatabase(activeSeries, puzzleNoVisible);
    }
  };

  // updateDatabase - If user correctly solves, backend database is updated
  const updateDatabase = async (activeSeries: string, puzzleNoVisible: number) => {
    try {
      await axios.post(`${process.env.SERVER}/api/passcheck/puzzlesolved`, {
        activeSeries,
        puzzleNoVisible,
        username
      });

    } catch (err: any) {

      console.error("Database insertion error:", err);

    }
  };

  return (
    <div className="relative flex flex-grow">
      <SeriesCardList
        seriesStart={seriesStart}
        handleCardClick={handleCardClick}
        seriesIDtoName={seriesIDtoName}
        puzzleStatuses={puzzleStatuses}
      />
      <Image
        src={`/bg/${seriesIDtoName(activeSeries, true)}.jpg`}
        alt="Cover"
        fill
        className={`user-select-none pointer-events-none absolute inset-0 object-cover transition-opacity duration-500 ${!seriesStart ? "z-0 opacity-0" : `z-10 opacity-100 ${puzzleVisible[0] ? "brightness-50" : "brightness-100"}`}`}
      />
      {seriesStart && newSeriesVisible && (
        <div className="absolute z-20 flex h-full w-full flex-col items-center justify-center">
          <BackButton handleBackClick={handleBackClick} />
          {!puzzleVisible[0] ? (
            <PuzzleLayout
              seriesIDtoName={seriesIDtoName}
              seriesPuzzleCount={seriesPuzzleCount}
              activeSeries={activeSeries}
              handlePuzzleClick={handlePuzzleClick}
              puzzleStatuses={puzzleStatuses[activeSeries]}
            />
          ) : (
            <PuzzleView
              activeSeries={seriesIDtoName(activeSeries, true)}
              puzzleNoVisible={
                typeof puzzleVisible[1] === "number" ? puzzleVisible[1] : 0
              }
              onPuzzleSolved={handlePuzzleSolved}
              puzzleSolved={puzzleStatuses[activeSeries][puzzleVisible[1]-1]}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MainArea;
