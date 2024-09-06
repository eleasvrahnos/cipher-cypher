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
import NotesButton from "../NotesButton/NotesButton";

interface MainAreaProps {
  activeTitle: (title: string) => void;
}

interface Hint {
  [key: number]: {
    bullet: string;
    date: string;
  };
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
  // notesOpen - Whether the user has Notes opened within a series
  const [notesOpen, setNotesOpen] = useState<boolean>(false);
  // Notes data
  const notesData = [
    [{ bullet: "No notes to display.", date: "" }],
    [ { bullet: "Hints added for 4, 8, 13, 14", date: "2024-09-06" } ],
    [
      { bullet: "Errors fixed in 2, 7, 17", date: "2024-09-03" },
      { bullet: "Errors fixed in 16", date: "2024-09-05" },
      { bullet: "Spelling error fixed in Meta", date: "2024-09-06" },
      { bullet: "Hints added for 3, 18, 22", date: "2024-09-06" }
    ],
  ];

  const hintsData = [
    [{ 0: { bullet: "placeholder", date: "" } }],
    [
      {
        4: {
          bullet:
            "First is a puzzle for the eyes, second is a puzzle for the brain.",
          date: "2024-09-06",
        },
      },
      {
        8: {
          bullet:
            "Firstly, you must do to the lock what has been done to the key.",
          date: "2024-09-06",
        },
      },
      {
        13: {
          bullet: "Each symbol directs you in some way. What to do in special cases is clarified below.",
          date: "2024-09-06",
        },
      },
      {
        14: {
          bullet:
            "In order to solve a puzzle, you must first put the pieces together.",
          date: "2024-09-06",
        },
      },
    ],
    [
      {
        3: {
          bullet: "The wheels have the same method, but differently measured.",
          date: "2024-09-06",
        },
      },
      {
        18: {
          bullet: "Different letters can represent the same property.",
          date: "2024-09-06",
        },
      },
      {
        22: {
          bullet: "All mazes are created equal.",
          date: "2024-09-06",
        },
      },
    ],
  ];

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
        ]);
      }, 250);
    }
  }, [username, puzzleVisible]);

  // Occurs whenever activeSeries or username changes, layout status is updated for preloading
  useEffect(() => {
    const fetchAnswersForAllSeries = async () => {
      try {
        const updatedPuzzleStatuses = [...puzzleStatuses];
        // Loop through each series
        for (
          let seriesIndex = 0;
          seriesIndex < seriesPuzzleCount.length;
          seriesIndex++
        ) {
          // If username exists, fetch puzzle statuses for the current series
          if (username) {
            const response = await axios.post("/api/passcheck/layoutstatus", {
              activeSeries: seriesIndex, // Pass the current series index
              statusesToSend: JSON.stringify(puzzleStatuses[seriesIndex]),
              username,
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

  // handleNotesClick - Occurs when NOTES button is clicked (shows errata and hints)
  const handleNotesClick = () => {
    setNotesOpen(true);
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
          <NotesButton
            puzzleVisible={puzzleVisible[0]}
            handleNotesClick={handleNotesClick}
          />
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
              puzzleSolved={puzzleStatuses[activeSeries][puzzleVisible[1] - 1]}
            />
          )}
        </div>
      )}
      {/* Notes Modal */}
      {notesOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-75">
          <div className="w-5/6 max-w-sm rounded-md bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">
              {puzzleVisible[0] ? "Hints" : "Notes"}
            </h2>
            <ul>
              {puzzleVisible[0] ? (
                // Check if hintsData[activeSeries] is an array and has items
                hintsData[activeSeries]?.length ? (
                  // Determine if puzzleVisible[1] exists in any hint object
                  hintsData[activeSeries]?.some(
                    (hint) => (hint as Hint)[puzzleVisible[1]],
                  ) ? (
                    hintsData[activeSeries]?.map((hint, index) => {
                      // Type assertion to indicate that hint conforms to the Hint interface
                      const typedHint = hint as Hint;

                      // Access the key-value pair where the key matches puzzleVisible[1]
                      const bulletData = typedHint[puzzleVisible[1]];

                      if (bulletData) {
                        return (
                          <li key={index} className="mb-2 flex flex-col">
                            <span className="text-sm text-gray-500">
                              {bulletData.date || "No date available"}
                            </span>
                            <strong>
                              {bulletData.bullet || "No hints available."}
                            </strong>
                          </li>
                        );
                      } else {
                        // This will not be reached due to the previous check
                        return null;
                      }
                    })
                  ) : (
                    <li>No hints to display.</li>
                  )
                ) : (
                  <li>No hints to display.</li>
                )
              ) : (
                // Mapping for notesData when puzzleVisible[0] is false
                notesData[activeSeries]?.map((note, index) => (
                  <li key={index} className="mb-2 flex flex-col">
                    <span className="text-sm text-gray-500">{note.date}</span>
                    <strong>{note.bullet}</strong>
                  </li>
                )) || <li>No notes available for this series</li>
              )}
            </ul>
            <button
              onClick={() => setNotesOpen(false)}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainArea;
