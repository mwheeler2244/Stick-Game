"use client";

import { Raleway, Bangers } from "next/font/google";

const raleway = Raleway({
  weight: ["400", "600", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

interface GameOverlaysProps {
  showIntroduction: boolean;
  showPerfect: boolean;
  showGolden: boolean;
  showRestart: boolean;
  score: number;
  highScore: number;
  onRestart: () => void;
}

export default function GameOverlays({
  showIntroduction,
  showPerfect,
  showGolden,
  showRestart,
  score,
  highScore,
  onRestart,
}: GameOverlaysProps) {
  return (
    <>
      {showIntroduction && (
        <div id="introduction" className={raleway.className}>
          Hold down the mouse to stretch out a stick
        </div>
      )}

      {showPerfect && (
        <div id="perfect" className={bangers.className}>
          DOUBLE SCORE
        </div>
      )}

      {showGolden && (
        <div id="golden" className={bangers.className}>
          🏆 GOLDEN BONUS! 🏆
        </div>
      )}

      {showRestart && (
        <div id="game-over-screen">
          <div className={`game-over-content ${raleway.className}`}>
            <h1 className={`game-over-title ${bangers.className}`}>
              GAME OVER
            </h1>

            <div className="score-display">
              <div className="final-score">
                <span className="score-label">Final Score</span>
                <span className={`score-value ${bangers.className}`}>
                  {score}
                </span>
              </div>

              {score === highScore && score > 0 && (
                <div className="new-high-score">🎉 NEW HIGH SCORE! 🎉</div>
              )}

              {score < highScore && (
                <div className="high-score-display">
                  <span className="score-label">Best</span>
                  <span className={`score-value ${bangers.className}`}>
                    {highScore}
                  </span>
                </div>
              )}
            </div>

            <button
              id="restart"
              className={`restart-button ${bangers.className}`}
              onClick={onRestart}
            >
              TRY AGAIN
            </button>

            <div className="restart-hint">
              Press SPACE, R, ENTER or click anywhere to restart
            </div>
          </div>

          {/* Invisible full-screen clickable area */}
          <div
            className="restart-overlay"
            onClick={onRestart}
            aria-label="Click to restart"
          />
        </div>
      )}

      <style jsx>{`
        #game-over-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          animation: fadeIn 0.5s ease-out;
        }

        .game-over-content {
          background: rgba(255, 255, 255, 0.95);
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          max-width: 400px;
          width: 90%;
          position: relative;
          z-index: 101;
          border: 3px solid #ff3a3a;
        }

        .game-over-title {
          font-size: 3em;
          color: #ff3a3a;
          margin: 0 0 30px 0;
          text-shadow: 2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff,
            -2px 2px 0 #fff;
          animation: pulse 2s infinite;
        }

        .score-display {
          margin: 20px 0 30px 0;
        }

        .final-score,
        .high-score-display {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 10px 0;
          padding: 10px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 8px;
        }

        .score-label {
          font-size: 1.1em;
          font-weight: 600;
          color: #333;
        }

        .score-value {
          font-size: 1.8em;
          color: #ff3a3a;
        }

        .new-high-score {
          color: #ff6b35;
          font-weight: bold;
          font-size: 1.2em;
          margin: 15px 0;
          animation: bounce 1s infinite;
        }

        .restart-button {
          width: 200px;
          height: 60px;
          border-radius: 30px;
          color: white;
          background: linear-gradient(135deg, #ff3a3a, #ff6b35);
          border: none;
          font-size: 1.4em;
          cursor: pointer;
          margin: 20px 0 15px 0;
          box-shadow: 0 6px 0 #c02020, 0 8px 15px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
          letter-spacing: 1px;
        }

        .restart-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 0 #c02020, 0 12px 20px rgba(0, 0, 0, 0.4);
        }

        .restart-button:active {
          transform: translateY(2px);
          box-shadow: 0 4px 0 #c02020, 0 6px 10px rgba(0, 0, 0, 0.3);
        }

        .restart-hint {
          font-size: 0.9em;
          color: #666;
          font-style: italic;
        }

        .restart-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
          z-index: 99;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        #golden {
          position: absolute;
          font-weight: bold;
          font-size: 2.5em;
          color: #ffd700;
          z-index: 10;
          text-shadow: 2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff,
            -2px 2px 0 #fff, 0 0 20px rgba(255, 215, 0, 0.8);
          animation: goldenPulse 0.6s ease-in-out;
          pointer-events: none;
          transform: translateY(-50px);
        }

        @keyframes goldenPulse {
          0% {
            transform: translateY(-50px) scale(0.8);
            opacity: 0;
          }
          50% {
            transform: translateY(-60px) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translateY(-50px) scale(1);
            opacity: 1;
          }
        }

        @media (max-width: 640px) {
          .game-over-content {
            padding: 30px 20px;
            margin: 20px;
          }

          .game-over-title {
            font-size: 2.5em;
          }

          .restart-button {
            width: 180px;
            height: 50px;
            font-size: 1.2em;
          }
        }
      `}</style>
    </>
  );
}
