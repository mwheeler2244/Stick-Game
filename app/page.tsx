"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Head from "next/head";
import { Poppins } from "next/font/google";

// Import custom components
import {
  GameCanvas,
  GameCanvasRef,
  GameTopBar,
  GameControls,
  GameOverlays,
  StatsPanel,
} from "@/components";

// Import custom hooks
import { useGameStats, useGameLogic, useGameAnimation } from "@/hooks";

const poppins = Poppins({
  weight: ["400", "600", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  // UI state
  const [showIntroduction, setShowIntroduction] = useState(true);
  const [showPerfect, setShowPerfect] = useState(false);
  const [showGolden, setShowGolden] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Game statistics hook
  const {
    gameStats,
    highScore,
    updateHighScore,
    incrementGamesPlayed,
    incrementPerfectJumps,
    updateLongestStick,
  } = useGameStats();

  // Canvas ref
  const canvasRef = useRef<GameCanvasRef>(null);

  // Game logic hook
  const {
    gameData,
    score,
    resetGame: resetGameLogic,
    handleMouseDown,
    handleMouseUp,
    setPhase,
    thePlatformTheStickHits,
    updateBirds,
    updateClouds,
    updateParticles,
    updateWeatherParticles,
    updateVisualEffects,
    triggerFlashEffect,
    generatePlatform,
    generateTree,
    phaseRef,
    onScoreUpdate,
  } = useGameLogic({
    onScoreUpdate: (newScore) => {
      updateHighScore(newScore);
    },
    onPerfectHit: () => {
      setShowPerfect(true);
      setTimeout(() => setShowPerfect(false), 1000);
      incrementPerfectJumps();
    },
    onGameOver: () => {
      setShowRestart(true);
    },
    onLongestStickUpdate: updateLongestStick,
  });

  // Animation hook
  const { startAnimation } = useGameAnimation({
    gameData,
    phaseRef,
    score,
    setPhase,
    thePlatformTheStickHits,
    updateBirds,
    updateClouds,
    updateParticles,
    updateWeatherParticles,
    updateVisualEffects,
    triggerFlashEffect,
    onScoreUpdate,
    onPerfectHit: () => {
      setShowPerfect(true);
      setTimeout(() => setShowPerfect(false), 1000);
      incrementPerfectJumps();
    },
    onGoldenPlatformHit: () => {
      setShowGolden(true);
      setTimeout(() => setShowGolden(false), 1500);
    },
    onGameOver: () => {
      setShowRestart(true);
    },
    onLongestStickUpdate: updateLongestStick,
    generatePlatform,
    generateTree,
    draw: () => canvasRef.current?.draw(),
  });

  // Stable reset function that doesn't cause infinite loops
  const resetGame = useCallback(() => {
    // Stop any running animation
    if (gameData.animationFrameId) {
      cancelAnimationFrame(gameData.animationFrameId);
      gameData.animationFrameId = null;
    }

    // Reset game logic
    resetGameLogic();

    // Reset UI state
    setShowIntroduction(true);
    setShowPerfect(false);
    setShowGolden(false);
    setShowRestart(false);
    setShowStats(false);

    // Increment games played for stats
    incrementGamesPlayed();

    // Draw initial state after a short delay
    setTimeout(() => {
      canvasRef.current?.draw();
    }, 0);
  }, [resetGameLogic, incrementGamesPlayed, gameData]);

  const toggleStats = useCallback(() => {
    setShowStats((prev) => !prev);
  }, []);

  const handleMouseDownWrapper = useCallback(() => {
    // Don't handle game input when restart screen is showing
    if (showRestart) {
      return;
    }

    handleMouseDown();
    setShowIntroduction(false);
    startAnimation();
  }, [handleMouseDown, startAnimation, showRestart]);

  const handleMouseUpWrapper = useCallback(() => {
    // Don't handle game input when restart screen is showing
    if (showRestart) {
      return;
    }

    handleMouseUp();
  }, [handleMouseUp, showRestart]);

  // Initialize game only once on mount
  useEffect(() => {
    // Initialize UI state
    setShowIntroduction(true);
    setShowPerfect(false);
    setShowRestart(false);
    setShowStats(false);

    // Initialize game logic and draw initial state
    resetGameLogic();
    setTimeout(() => {
      canvasRef.current?.draw();
    }, 100);
  }, [resetGameLogic]); // Include resetGameLogic to satisfy the linter

  // Setup event listeners - separate from game initialization
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      // Allow restart with multiple keys
      if (
        event.key === " " ||
        event.key === "r" ||
        event.key === "R" ||
        event.key === "Enter"
      ) {
        event.preventDefault();

        // If showing restart screen, always allow restart
        if (showRestart) {
          resetGame();
          return;
        }

        // Otherwise, only space key restarts during normal gameplay
        if (event.key === " ") {
          resetGame();
        }
      }
    };

    window.addEventListener("keydown", keyDownHandler);

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
      // Clean up animation on unmount
      if (gameData.animationFrameId) {
        cancelAnimationFrame(gameData.animationFrameId);
      }
    };
  }, [resetGame, gameData, showRestart]);

  return (
    <>
      <Head>
        <title>Sticky Hero Game</title>
        <meta
          name="description"
          content="A fun Sticky Hero game built with Next.js"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>

      <div className={`container ${poppins.className}`}>
        <GameTopBar
          score={score}
          highScore={highScore}
          weatherType={gameData.weatherType}
        />

        <GameCanvas
          ref={canvasRef}
          gameData={gameData}
          onMouseDown={handleMouseDownWrapper}
          onMouseUp={handleMouseUpWrapper}
        />

        <GameOverlays
          showIntroduction={showIntroduction}
          showPerfect={showPerfect}
          showGolden={showGolden}
          showRestart={showRestart}
          score={score}
          highScore={highScore}
          onRestart={resetGame}
        />

        <GameControls onToggleStats={toggleStats} />

        <StatsPanel
          isVisible={showStats}
          gameStats={gameStats}
          highScore={highScore}
          onClose={toggleStats}
          onNewGame={resetGame}
        />
      </div>

      <style jsx global>{`
        html,
        body {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
          cursor: pointer;
        }

        * {
          box-sizing: border-box;
          transition: background-color 0.3s ease, color 0.3s ease;
        }
      `}</style>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100vw;
          position: relative;
          overflow: hidden;
          max-width: 100%;
        }

        #introduction {
          position: absolute;
          font-weight: 600;
          font-size: 1.2em;
          text-align: center;
          z-index: 1;
          padding: 15px 20px;
          border-radius: 15px;
          background-color: rgba(255, 255, 255, 0.9);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
          animation: float 3s ease-in-out infinite;
          border: 2px solid rgba(149, 198, 41, 0.5);
          color: #333;
          max-width: 90%;
          width: 300px;
          margin: 0 auto;
          transform: translateY(-80px);
        }

        @keyframes float {
          0% {
            transform: translateY(-80px);
          }
          50% {
            transform: translateY(-90px);
          }
          100% {
            transform: translateY(-80px);
          }
        }

        #restart {
          width: 120px;
          height: 120px;
          position: absolute;
          border-radius: 50%;
          color: white;
          background-color: #ff3a3a;
          border: none;
          font-weight: 700;
          font-size: 1.4em;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 6px 0 #c02020, 0 8px 10px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
          letter-spacing: 1px;
        }

        #restart:hover {
          transform: translateY(-3px);
          box-shadow: 0 9px 0 #c02020, 0 12px 15px rgba(0, 0, 0, 0.3);
          background-color: #ff5252;
        }

        #restart:active {
          transform: translateY(3px);
          box-shadow: 0 3px 0 #c02020, 0 4px 5px rgba(0, 0, 0, 0.3);
        }

        #perfect {
          position: absolute;
          font-weight: bold;
          font-size: 2em;
          color: #ff3a3a;
          z-index: 10;
          text-shadow: 2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff,
            -2px 2px 0 #fff;
          animation: pulse 0.5s infinite alternate;
        }

        .controls {
          position: absolute;
          top: 30px;
          left: 30px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          z-index: 10;
        }

        .icon-button {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.8);
          border: none;
          font-size: 1.2em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        .icon-button:hover {
          transform: scale(1.1);
        }

        .icon-button:active {
          transform: scale(0.95);
        }

        .panel {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 20;
        }

        .stat-card {
          @apply p-4 bg-gray-50 dark:bg-gray-800/80 rounded-xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800;
        }

        .stat-card-full {
          @apply p-4 bg-gray-50 dark:bg-gray-800/80 rounded-xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800;
        }

        .stat-card-accent {
          @apply p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/30 transition-all duration-200;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -48%) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }

        @media (max-width: 640px) {
          .panel {
            width: 90% !important;
            max-width: 360px;
          }
        }

        @keyframes pulse {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.1);
          }
        }
      `}</style>
    </>
  );
}
