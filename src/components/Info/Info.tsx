// Info.tsx - Gives more information about Cipher Cypher, with reference links

"use client";

import BackButton from "@/components/BackButton/BackButton";
import { useRouter } from "next/navigation";
import React from "react";

const Info = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-b from-gray-900 to-black font-sans text-white">
      <BackButton handleBackClick={handleBackClick} />
      <div className="mt-10 flex flex-col items-center p-8">
        <div className="flex flex-col items-center justify-center space-y-3">
          <h1 className="text-center text-3xl font-bold tracking-wide sm:text-5xl">
            WELCOME TO CIPHER CYPHER
          </h1>
          <p className="italic">Created by @ded010 on Discord</p>
          <img
            className="h-16 w-16 animate-pulse"
            src="/icons/puzzlepiece.png"
            alt="Puzzle Piece"
          />
        </div>
      </div>
      <div className="px-8 pb-8">
        <div className="mx-auto max-w-4xl space-y-16 rounded-lg bg-gray-800 bg-opacity-70 px-10 py-8 shadow-lg">
          <div className="space-y-4">
            <h2 className="text-center text-4xl font-semibold">
              What is Cipher Cypher?
            </h2>
            <p className="text-lg leading-relaxed">
              Interested in puzzle solving, critical thinking, math, secret
              codes, and more? Then you have come to the right place.
            </p>
            <p className="text-lg leading-relaxed">
              Cipher Cypher is a collection of 50 visual puzzles that require
              thinking outside of the box. Try your hand at these challenges,
              and see if you will be the first to complete any of them! Join the{" "}
              <a
                className="text-blue-400 underline hover:text-blue-600"
                href="https://discord.gg/yPJR55J"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cipher Cypher Discord
              </a>{" "}
              for discussion with others, hints, and more!
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-center text-4xl font-semibold">
              How can I learn how to solve these?
            </h2>
            <p className="text-lg leading-relaxed">
              These puzzles take inspiration from many places, including{" "}
              <a
                className="text-blue-400 underline hover:text-blue-600"
                href="https://minervallux.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Raitlin&apos;s Challenge
              </a>{" "}
              and{" "}
              <a
                className="text-blue-400 underline hover:text-blue-600"
                href="https://ae27ff.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                ae27ff
              </a>
              . They almost all rely on basic ARG principles and ciphers, though
              some are harder than others.
            </p>
            <p className="text-lg leading-relaxed">
              For further resources, check out{" "}
              <a
                className="text-blue-400 underline hover:text-blue-600"
                href="https://www.dcode.fr/en"
                target="_blank"
                rel="noopener noreferrer"
              >
                dCode
              </a>
              ,{" "}
              <a
                className="text-blue-400 underline hover:text-blue-600"
                href="https://gchq.github.io/CyberChef/"
                target="_blank"
                rel="noopener noreferrer"
              >
                CyberChef
              </a>
              , or the{" "}
              <a
                className="text-blue-400 underline hover:text-blue-600"
                href="https://wiki.gamedetectives.net/index.php?title=ARG_Toolbox"
                target="_blank"
                rel="noopener noreferrer"
              >
                Game Detectives ARG Toolbox
              </a>{" "}
              for online decoders and places to start researching.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-center text-4xl font-semibold">
              How do I play?
            </h2>
            <p className="text-lg leading-relaxed">
              There are three released series of puzzles, each with its own
              difficulty, puzzle collection and a meta puzzle to tie the series
              together. It is recommended to make an account to save your
              progress. Hovering over the puzzles reveal icons that can act as
              hints to either the solving method or the answer.
            </p>
            <p className="text-lg leading-relaxed">
              Additionally, all puzzles are purely visual, and there is no
              metadata or secrets hidden within the images. What you see is what
              you get. All puzzle answers may or may not be related to the
              puzzle content itself.
            </p>
            <p className="text-lg leading-relaxed">
              Math Mania includes puzzles that involve mathematics in some way.
              Solved puzzle answers should be entered and submitted manually.
              Answers for Math Mania count{" "}
              <span className="font-bold text-yellow-300">
                only alphanumeric characters, the decimal point, and the
                negative sign
              </span>{" "}
              as valid characters.
            </p>
            <p className="text-lg leading-relaxed">
              For Puzzle Paradise and Riddling Rewind, the answer&apos;s
              character count is given in the top left corner. Puzzle answers
              are submitted automatically when the character count is reached.
              Answers for these two series count{" "}
              <span className="font-bold text-yellow-300">
                only alphanumeric characters and spaces
              </span>{" "}
              as valid characters.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-center text-4xl font-semibold">
              Help, I&apos;m stuck! Or I&apos;ve found a bug!
            </h2>
            <p className="text-lg leading-relaxed">
              Try looking in the official{" "}
              <a
                className="text-blue-400 underline hover:text-blue-600"
                href="https://discord.gg/yPJR55J"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cipher Cypher Discord
              </a>
              ! Hints for some puzzles are given, and you can collaborate with
              others and ask for help to progress. DM @ded010 on Discord if
              there are any bugs or questions, however I will not give out
              answers for free (but maybe hints if you&apos;re nice).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
