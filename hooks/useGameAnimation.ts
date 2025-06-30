"use client";

import { useCallback, useRef } from "react";
import { GameData, GamePhase } from "@/types/game";
import { GAME_CONFIG } from "@/constants/gameConfig";
import { last } from "@/utils/gameUtils";

interface UseGameAnimationProps {
  gameData: GameData;
  phaseRef: React.MutableRefObject<GamePhase>;
  score: number;
  setPhase: (phase: GamePhase) => void;
  thePlatformTheStickHits: () => [any, boolean];
  updateBirds: (timePassed: number) => void;
  updateClouds: (timePassed: number) => void;
  updateParticles: (timePassed: number) => void;
  updateWeatherParticles: (timePassed: number) => void;
  updateVisualEffects: (timePassed: number) => void;
  triggerFlashEffect: (color: string, duration: number) => void;
  onScoreUpdate: (increment: number) => void;
  onPerfectHit: () => void;
  onGoldenPlatformHit: () => void;
  onGameOver: () => void;
  onLongestStickUpdate: (length: number) => void;
  generatePlatform: () => void;
  generateTree: () => void;
  draw: () => void;
}

export function useGameAnimation({
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
  onPerfectHit,
  onGoldenPlatformHit,
  onGameOver,
  onLongestStickUpdate,
  generatePlatform,
  generateTree,
  draw,
}: UseGameAnimationProps) {
  const animate = useCallback(
    (timestamp: number) => {
      if (!gameData.lastTimestamp) {
        gameData.lastTimestamp = timestamp;
        gameData.animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const timePassed = timestamp - gameData.lastTimestamp;
      const currentPhase = phaseRef.current;

      updateBirds(timePassed);
      updateClouds(timePassed);
      updateParticles(timePassed);
      updateWeatherParticles(timePassed);
      updateVisualEffects(timePassed);

      switch (currentPhase) {
        case "waiting":
          if (gameData.isMouseDown) {
            setPhase("stretching");
          } else {
            gameData.lastTimestamp = timestamp;
            gameData.animationFrameId = requestAnimationFrame(animate);
            return;
          }
          break;

        case "stretching": {
          const sticks = gameData.sticks;
          const lastStick = last(sticks);

          if (gameData.isMouseDown) {
            lastStick.length += timePassed / GAME_CONFIG.stretchingSpeed;
            onLongestStickUpdate(lastStick.length);
          } else {
            setPhase("turning");
          }
          break;
        }

        case "turning": {
          const sticks = gameData.sticks;
          const lastStick = last(sticks);
          lastStick.rotation += timePassed / GAME_CONFIG.turningSpeed;

          if (lastStick.rotation > 90) {
            lastStick.rotation = 90;

            const [nextPlatform, perfectHit] = thePlatformTheStickHits();

            // Add stick bending effect when it hits
            if (nextPlatform) {
              lastStick.bendAmount = perfectHit ? 15 : 25; // Less bend for perfect hits
              lastStick.bendDirection = Math.random() > 0.5 ? 1 : -1;

              // Gradually reduce bend over time
              setTimeout(() => {
                if (lastStick.bendAmount) {
                  const reduceInterval = setInterval(() => {
                    if (lastStick.bendAmount && lastStick.bendAmount > 0) {
                      lastStick.bendAmount *= 0.8;
                      if (lastStick.bendAmount < 1) {
                        lastStick.bendAmount = 0;
                        lastStick.bendDirection = 0;
                        clearInterval(reduceInterval);
                      }
                    } else {
                      clearInterval(reduceInterval);
                    }
                  }, 50);
                }
              }, 100);
            }

            if (nextPlatform) {
              let scoreIncrement = perfectHit ? 2 : 1;

              // Golden platform bonus: 3x multiplier
              if (nextPlatform.isGolden) {
                scoreIncrement *= 3;
              }

              onScoreUpdate(scoreIncrement);

              // Trigger visual effects for landing
              if (perfectHit) {
                onPerfectHit();
                triggerFlashEffect("#00FF00", 300); // Green flash for perfect hit
                gameData.visualEffects.cameraZoom = 1.1; // Slight zoom in
              }

              // Special effects for golden platforms
              if (nextPlatform.isGolden) {
                triggerFlashEffect("#FFD700", 400); // Golden flash
              }

              // Generate enhanced particles based on hit type
              const particleX = nextPlatform.x + nextPlatform.w / 2;
              const particleY =
                GAME_CONFIG.canvasHeight - GAME_CONFIG.platformHeight;

              if (nextPlatform.isGolden) {
                onGoldenPlatformHit();

                // Create spectacular golden particle explosion
                for (let i = 0; i < 25; i++) {
                  const angle = Math.random() * Math.PI * 2;
                  const speed = 2 + Math.random() * 4;
                  const sparkle = Math.random() > 0.7;

                  gameData.particles.push({
                    x: particleX,
                    y: particleY,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 3,
                    life: 1,
                    maxLife: 1,
                    size: sparkle
                      ? 5 + Math.random() * 4
                      : 3 + Math.random() * 3,
                    color: sparkle ? "#FFFFFF" : "#FFD700", // Mix of gold and white sparkles
                  });
                }
              } else if (perfectHit) {
                // Perfect hit gets green particles
                for (let i = 0; i < 15; i++) {
                  const angle = Math.random() * Math.PI * 2;
                  const speed = 1.5 + Math.random() * 2.5;
                  gameData.particles.push({
                    x: particleX,
                    y: particleY,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 2,
                    life: 1,
                    maxLife: 1,
                    size: 2 + Math.random() * 3,
                    color: "#00FF88", // Bright green
                  });
                }
              } else {
                // Normal hit gets smaller blue particles
                for (let i = 0; i < 8; i++) {
                  const angle = Math.random() * Math.PI * 2;
                  const speed = 1 + Math.random() * 2;
                  gameData.particles.push({
                    x: particleX,
                    y: particleY,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 1.5,
                    life: 1,
                    maxLife: 1,
                    size: 1.5 + Math.random() * 2,
                    color: "#4A90E2", // Blue
                  });
                }
              }

              generatePlatform();
              generateTree();
              generateTree();
            }

            setPhase("walking");
          }
          break;
        }

        case "walking": {
          gameData.heroX += timePassed / GAME_CONFIG.walkingSpeed;

          const [nextPlatform] = thePlatformTheStickHits();
          if (nextPlatform) {
            const maxHeroX =
              nextPlatform.x +
              nextPlatform.w -
              GAME_CONFIG.heroDistanceFromEdge;
            if (gameData.heroX > maxHeroX) {
              gameData.heroX = maxHeroX;
              setPhase("transitioning");
            }
          } else {
            const lastStick = last(gameData.sticks);
            const maxHeroX =
              lastStick.x + lastStick.length + GAME_CONFIG.heroWidth;
            if (gameData.heroX > maxHeroX) {
              gameData.heroX = maxHeroX;
              setPhase("falling");
            }
          }
          break;
        }

        case "transitioning": {
          gameData.sceneOffset += timePassed / GAME_CONFIG.transitioningSpeed;

          const [nextPlatform] = thePlatformTheStickHits();
          if (
            nextPlatform &&
            gameData.sceneOffset >
              nextPlatform.x + nextPlatform.w - GAME_CONFIG.paddingX
          ) {
            gameData.sticks.push({
              x: nextPlatform.x + nextPlatform.w,
              length: 0,
              rotation: 0,
            });
            setPhase("waiting");
          }
          break;
        }

        case "falling": {
          const lastStick = last(gameData.sticks);
          if (lastStick.rotation < 180) {
            lastStick.rotation += timePassed / GAME_CONFIG.turningSpeed;
          }

          gameData.heroY += timePassed / GAME_CONFIG.fallingSpeed;
          const maxHeroY =
            GAME_CONFIG.platformHeight +
            100 +
            (window.innerHeight - GAME_CONFIG.canvasHeight) / 2;

          if (gameData.heroY > maxHeroY) {
            // Trigger dramatic effects for game over
            triggerFlashEffect("#FF0000", 500); // Red flash for game over
            onGameOver();
            gameData.lastTimestamp = timestamp;
            return;
          }
          break;
        }

        default:
          console.error("Wrong phase:", currentPhase);
          break;
      }

      draw();
      gameData.lastTimestamp = timestamp;
      gameData.animationFrameId = requestAnimationFrame(animate);
    },
    [
      gameData,
      phaseRef,
      score,
      setPhase,
      thePlatformTheStickHits,
      updateBirds,
      updateClouds,
      updateParticles,
      onScoreUpdate,
      onPerfectHit,
      onGoldenPlatformHit,
      onGameOver,
      onLongestStickUpdate,
      generatePlatform,
      generateTree,
      draw,
    ]
  );

  const startAnimation = useCallback(() => {
    if (!gameData.animationFrameId) {
      console.log("Starting animation loop");
      gameData.lastTimestamp = undefined;
      gameData.animationFrameId = requestAnimationFrame(animate);
    }
  }, [animate, gameData]);

  const stopAnimation = useCallback(() => {
    if (gameData.animationFrameId) {
      cancelAnimationFrame(gameData.animationFrameId);
      gameData.animationFrameId = null;
    }
  }, [gameData]);

  return {
    animate,
    startAnimation,
    stopAnimation,
  };
}
