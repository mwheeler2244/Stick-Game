"use client";

import { useState, useEffect, useCallback } from "react";
import { GameStats } from "@/types/game";

const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  perfectJumps: 0,
  longestStick: 0,
};

export function useGameStats() {
  const [gameStats, setGameStats] = useState<GameStats>(DEFAULT_STATS);
  const [highScore, setHighScore] = useState(0);

  // Load saved data on mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem("stickHeroHighScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }

    const savedStats = localStorage.getItem("stickHeroStats");
    if (savedStats) {
      try {
        setGameStats(JSON.parse(savedStats));
      } catch (e) {
        console.error("Failed to parse saved stats");
      }
    }
  }, []);

  // Save high score when it changes
  useEffect(() => {
    localStorage.setItem("stickHeroHighScore", highScore.toString());
  }, [highScore]);

  // Save stats when they change
  useEffect(() => {
    localStorage.setItem("stickHeroStats", JSON.stringify(gameStats));
  }, [gameStats]);

  const updateHighScore = useCallback((newScore: number) => {
    setHighScore((prev) => Math.max(prev, newScore));
  }, []);

  const incrementGamesPlayed = useCallback(() => {
    setGameStats((prev) => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
    }));
  }, []);

  const incrementPerfectJumps = useCallback(() => {
    setGameStats((prev) => ({
      ...prev,
      perfectJumps: prev.perfectJumps + 1,
    }));
  }, []);

  const updateLongestStick = useCallback((length: number) => {
    setGameStats((prev) => ({
      ...prev,
      longestStick: Math.max(prev.longestStick, length),
    }));
  }, []);

  return {
    gameStats,
    highScore,
    updateHighScore,
    incrementGamesPlayed,
    incrementPerfectJumps,
    updateLongestStick,
  };
}
