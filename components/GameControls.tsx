"use client";

import { Raleway } from "next/font/google";

const raleway = Raleway({
  weight: ["400", "600", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

interface GameControlsProps {
  onToggleStats: () => void;
}

export default function GameControls({ onToggleStats }: GameControlsProps) {
  return (
    <div className="controls">
      <button
        className={`icon-button ${raleway.className}`}
        onClick={onToggleStats}
        aria-label="Statistics"
      >
        📊
      </button>
    </div>
  );
}
