"use client";

import { Raleway, Bangers } from "next/font/google";
import { useEffect, useState } from "react";
import { WeatherType } from "@/types/game";

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

interface GameTopBarProps {
  score: number;
  highScore: number;
  weatherType: WeatherType;
}

const getWeatherEmoji = (weatherType: WeatherType): string => {
  switch (weatherType) {
    case "sunny":
      return "☀️";
    case "rainy":
      return "🌧️";
    case "snowy":
      return "❄️";
    case "cloudy":
      return "☁️";
    case "foggy":
      return "🌫️";
    case "stormy":
      return "⛈️";
    default:
      return "☀️";
  }
};

const getWeatherLabel = (weatherType: WeatherType): string => {
  switch (weatherType) {
    case "sunny":
      return "Sunny";
    case "rainy":
      return "Rainy";
    case "snowy":
      return "Snowy";
    case "cloudy":
      return "Cloudy";
    case "foggy":
      return "Foggy";
    case "stormy":
      return "Stormy";
    default:
      return "Sunny";
  }
};

export default function GameTopBar({
  score,
  highScore,
  weatherType,
}: GameTopBarProps) {
  const [previousScore, setPreviousScore] = useState(score);
  const [scoreChanged, setScoreChanged] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  useEffect(() => {
    if (score !== previousScore) {
      setScoreChanged(true);
      setPreviousScore(score);

      // Check if this is a new high score
      if (score > highScore && score > 0) {
        setIsNewHighScore(true);
      } else {
        setIsNewHighScore(false);
      }

      // Reset animation after delay
      const timer = setTimeout(() => {
        setScoreChanged(false);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [score, previousScore, highScore]);

  return (
    <div className="live-score-preview">
      <div className="score-container">
        <div className="score-label">SCORE</div>
        <div
          className={`current-score ${scoreChanged ? "score-animate" : ""} ${
            bangers.className
          }`}
        >
          {score}
        </div>
      </div>

      <div className="weather-indicator">
        <div className={`weather-badge ${raleway.className}`}>
          <span className="weather-emoji">{getWeatherEmoji(weatherType)}</span>
          <span className="weather-label">{getWeatherLabel(weatherType)}</span>
        </div>
      </div>

      <div className="high-score-container">
        <div
          className={`high-score-badge ${
            isNewHighScore ? "new-high-score" : ""
          } ${raleway.className}`}
        >
          <span className="high-score-label">BEST</span>
          <span className={`high-score-value ${bangers.className}`}>
            {highScore}
          </span>
        </div>
      </div>

      <style jsx>{`
        .live-score-preview {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 15;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }

        .score-container {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.95),
            rgba(255, 255, 255, 0.85)
          );
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 16px 20px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border: 2px solid rgba(255, 58, 58, 0.2);
          min-width: 120px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .score-container:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
        }

        .score-label {
          font-size: 0.75em;
          font-weight: 600;
          color: #666;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }

        .current-score {
          font-size: 2.8em;
          font-weight: 900;
          color: #ff3a3a;
          line-height: 1;
          text-shadow: 2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff,
            -2px 2px 0 #fff;
          transition: all 0.3s ease;
        }

        .score-animate {
          animation: scoreChange 0.6s ease-out;
          color: #ff6b35;
        }

        .weather-indicator {
          display: flex;
          justify-content: flex-end;
        }

        .weather-badge {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          padding: 8px 14px;
          border-radius: 20px;
          font-size: 0.8em;
          font-weight: 600;
          color: #333;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.3s ease;
        }

        .weather-badge:hover {
          transform: scale(1.05);
        }

        .weather-emoji {
          font-size: 1.2em;
        }

        .weather-label {
          font-size: 0.85em;
          opacity: 0.8;
          letter-spacing: 0.3px;
        }

        .high-score-container {
          display: flex;
          justify-content: flex-end;
        }

        .high-score-badge {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.85em;
          font-weight: 600;
          color: #333;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .high-score-badge:hover {
          transform: scale(1.05);
        }

        .high-score-label {
          font-size: 0.8em;
          opacity: 0.7;
          letter-spacing: 0.5px;
        }

        .high-score-value {
          font-size: 1.2em;
          color: #ff3a3a;
          font-weight: 700;
        }

        .new-high-score {
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          border: 2px solid #ff6b35;
          animation: newHighScorePulse 2s infinite;
          color: #333;
        }

        .new-high-score .high-score-value {
          color: #d97706;
        }

        @keyframes scoreChange {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
            text-shadow: 3px 3px 0 #fff, -3px -3px 0 #fff, 3px -3px 0 #fff,
              -3px 3px 0 #fff, 0 0 20px rgba(255, 107, 53, 0.6);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes newHighScorePulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
          }
        }

        @media (max-width: 640px) {
          .live-score-preview {
            top: 15px;
            right: 15px;
            gap: 8px;
          }

          .score-container {
            padding: 12px 16px;
            min-width: 100px;
          }

          .current-score {
            font-size: 2.2em;
          }

          .score-label {
            font-size: 0.7em;
          }

          .high-score-badge {
            padding: 6px 12px;
            font-size: 0.8em;
            gap: 6px;
          }

          .high-score-value {
            font-size: 1.1em;
          }
        }

        @media (max-width: 480px) {
          .current-score {
            font-size: 1.8em;
          }

          .score-container {
            padding: 10px 14px;
            min-width: 90px;
          }
        }
      `}</style>
    </div>
  );
}
