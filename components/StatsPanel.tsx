"use client";

import { Gamepad, Zap, Trophy, Award, X } from "lucide-react";
import { Raleway } from "next/font/google";
import { GameStats } from "@/types/game";

const raleway = Raleway({
  weight: ["400", "600", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

interface StatsPanelProps {
  isVisible: boolean;
  gameStats: GameStats;
  highScore: number;
  onClose: () => void;
  onNewGame: () => void;
}

export default function StatsPanel({
  isVisible,
  gameStats,
  highScore,
  onClose,
  onNewGame,
}: StatsPanelProps) {
  if (!isVisible) return null;

  return (
    <div
      className={`panel stats-panel bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-xl backdrop-blur-xl w-[360px] animate-fadeIn border border-white/10 ${raleway.className}`}
    >
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Statistics
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
            aria-label="Close stats"
          >
            <X
              size={16}
              className="cursor-pointer text-gray-500 dark:text-gray-400"
            />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="stat-card">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Games
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                  {gameStats.gamesPlayed}
                </span>
                <Gamepad
                  size={14}
                  className="text-indigo-500 dark:text-indigo-400"
                />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Perfect
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                  {gameStats.perfectJumps}
                </span>
                <Zap
                  size={14}
                  className="text-yellow-500 dark:text-yellow-400"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="stat-card-full">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Longest Stick
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 dark:text-white font-semibold">
                  {Math.round(gameStats.longestStick)}
                </span>
                <Trophy
                  size={14}
                  className="text-blue-500 dark:text-blue-400"
                />
              </div>
            </div>
            <div className="mt-2 bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full w-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (gameStats.longestStick / 200) * 100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="stat-card-accent">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                High Score
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
                  {highScore}
                </span>
                <Award
                  size={16}
                  className="text-indigo-600 dark:text-indigo-400"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onNewGame}
          className="w-full py-2.5 mt-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer transition-colors duration-200"
        >
          New Game
        </button>
      </div>
    </div>
  );
}
