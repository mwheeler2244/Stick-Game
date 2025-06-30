"use client";

import { useRef, useCallback, useState } from "react";
import {
  GameData,
  GamePhase,
  Platform,
  Particle,
  WeatherType,
  VisualEffects,
} from "@/types/game";
import { GAME_CONFIG, COLORS, GENERATION_PARAMS } from "@/constants/gameConfig";
import {
  last,
  randomBetween,
  randomInt,
  randomChoice,
  getRandomWeather,
} from "@/utils/gameUtils";

interface UseGameLogicProps {
  onScoreUpdate: (score: number) => void;
  onPerfectHit: () => void;
  onGameOver: () => void;
  onLongestStickUpdate: (length: number) => void;
}

export function useGameLogic({
  onScoreUpdate,
  onPerfectHit,
  onGameOver,
  onLongestStickUpdate,
}: UseGameLogicProps) {
  const [score, setScore] = useState(0);
  const phaseRef = useRef<GamePhase>("waiting");

  // Create a stable score increment function
  const incrementScore = useCallback(
    (increment: number) => {
      setScore((prevScore) => {
        const newScore = prevScore + increment;
        onScoreUpdate(newScore);
        return newScore;
      });
    },
    [onScoreUpdate]
  );

  const gameData = useRef<GameData>({
    lastTimestamp: undefined,
    heroX: 0,
    heroY: 0,
    sceneOffset: 0,
    platforms: [],
    sticks: [],
    trees: [],
    birds: [],
    clouds: [],
    particles: [],
    weatherType: getRandomWeather(),
    weatherParticles: [],
    visualEffects: {
      cameraZoom: 1,
      flashEffect: {
        active: false,
        color: "#FFFFFF",
        opacity: 0,
        duration: 0,
        elapsed: 0,
      },
      heroTrail: [],
    },
    animationFrameId: null,
    isMouseDown: false,
    lastLandingX: 0,
  });

  const generateParticles = useCallback(
    (x: number, y: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 2;
        gameData.current.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          life: 1,
          maxLife: 1,
          size: 2 + Math.random() * 2,
          color: COLORS.PARTICLE,
        });
      }
    },
    []
  );

  const setPhase = useCallback((newPhase: GamePhase) => {
    console.log(`Phase changing from ${phaseRef.current} to ${newPhase}`);
    if (newPhase === "walking" && phaseRef.current === "turning") {
      if (
        Math.abs(gameData.current.heroX - gameData.current.lastLandingX) > 10
      ) {
        // Inline particle generation to avoid dependency chain
        for (let i = 0; i < 10; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1 + Math.random() * 2;
          gameData.current.particles.push({
            x: gameData.current.heroX,
            y: GAME_CONFIG.canvasHeight - GAME_CONFIG.platformHeight,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2,
            life: 1,
            maxLife: 1,
            size: 2 + Math.random() * 2,
            color: COLORS.PARTICLE,
          });
        }
        gameData.current.lastLandingX = gameData.current.heroX;
      }
    }
    phaseRef.current = newPhase;
  }, []);

  const generatePlatform = useCallback(() => {
    const { MINIMUM_GAP, MAXIMUM_GAP, MINIMUM_WIDTH, MAXIMUM_WIDTH } =
      GENERATION_PARAMS.PLATFORM;

    const platforms = gameData.current.platforms;
    const lastPlatform = platforms[platforms.length - 1];
    let furthestX = lastPlatform.x + lastPlatform.w;

    const x = furthestX + randomInt(MINIMUM_GAP, MAXIMUM_GAP);
    const w = randomInt(MINIMUM_WIDTH, MAXIMUM_WIDTH);

    // 15% chance for golden bonus platform (but not for the first few platforms)
    const isGolden = platforms.length > 3 && Math.random() < 0.15;

    platforms.push({ x, w, isGolden });
  }, []);

  const generateTree = useCallback(() => {
    const { MINIMUM_GAP, MAXIMUM_GAP } = GENERATION_PARAMS.TREE;

    const trees = gameData.current.trees;
    const lastTree = trees.length > 0 ? trees[trees.length - 1] : null;
    let furthestX = lastTree ? lastTree.x : 0;

    const x = furthestX + randomInt(MINIMUM_GAP, MAXIMUM_GAP);
    const color = randomChoice(COLORS.TREE_COLORS);

    trees.push({ x, color });
  }, []);

  const generateBird = useCallback(() => {
    const { MIN_SPEED, MAX_SPEED, MIN_SIZE, MAX_SIZE, MIN_Y, MAX_Y } =
      GENERATION_PARAMS.BIRD;

    const size = randomBetween(MIN_SIZE, MAX_SIZE);
    const x = randomBetween(0, window.innerWidth);
    const y = randomBetween(MIN_Y, MAX_Y);
    const speed = randomBetween(MIN_SPEED, MAX_SPEED);
    const color = randomChoice(COLORS.BIRD_COLORS);

    gameData.current.birds.push({
      x,
      y,
      speed,
      wingPosition: Math.random() * 20,
      wingDirection: 1,
      size,
      bobOffset: 0,
      bobSpeed: 0.02 + Math.random() * 0.03,
      color,
    });
  }, []);

  const generateCloud = useCallback(() => {
    const {
      MIN_WIDTH,
      MAX_WIDTH,
      MIN_HEIGHT,
      MAX_HEIGHT,
      MIN_SPEED,
      MAX_SPEED,
      MIN_Y,
      MAX_Y,
    } = GENERATION_PARAMS.CLOUD;

    const x = Math.random() * window.innerWidth;
    const y = randomBetween(MIN_Y, MAX_Y);
    const width = randomBetween(MIN_WIDTH, MAX_WIDTH);
    const height = randomBetween(MIN_HEIGHT, MAX_HEIGHT);
    const speed = randomBetween(MIN_SPEED, MAX_SPEED);
    const opacity = 0.5 + Math.random() * 0.4;

    gameData.current.clouds.push({
      x,
      y,
      width,
      height,
      speed: Math.random() < 0.5 ? speed : -speed,
      opacity,
    });
  }, []);

  const updateBirds = useCallback((timePassed: number) => {
    gameData.current.birds.forEach((bird) => {
      bird.x += bird.speed * (timePassed / 16);
      bird.wingPosition += bird.wingDirection * (timePassed / 60);

      if (bird.wingPosition > 15 || bird.wingPosition < -5) {
        bird.wingDirection *= -1;
      }

      bird.bobOffset += bird.bobSpeed * (timePassed / 16);
      if (bird.bobOffset > Math.PI * 2) {
        bird.bobOffset -= Math.PI * 2;
      }

      if (bird.x > window.innerWidth + 100) {
        bird.x = -100;
        bird.y = 50 + Math.random() * 100;
        bird.speed = 0.5 + Math.random() * 1.5;
      }
    });
  }, []);

  const updateClouds = useCallback((timePassed: number) => {
    gameData.current.clouds.forEach((cloud) => {
      cloud.x += cloud.speed * (timePassed / 16);

      if (cloud.speed > 0 && cloud.x > window.innerWidth + cloud.width) {
        cloud.x = -cloud.width;
        cloud.y = 5 + Math.random() * 195;
        cloud.opacity = 0.5 + Math.random() * 0.4;
      } else if (cloud.speed < 0 && cloud.x < -cloud.width) {
        cloud.x = window.innerWidth + cloud.width;
        cloud.y = 5 + Math.random() * 195;
        cloud.opacity = 0.5 + Math.random() * 0.4;
      }
    });
  }, []);

  const updateParticles = useCallback((timePassed: number) => {
    gameData.current.particles = gameData.current.particles.filter(
      (particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.1;
        particle.life -= 0.02;
        return particle.life > 0;
      }
    );
  }, []);

  const generateWeatherParticles = useCallback(() => {
    const weatherType = gameData.current.weatherType;
    const currentParticles = gameData.current.weatherParticles.length;
    const maxParticles =
      weatherType === "stormy"
        ? 200
        : weatherType === "rainy"
        ? 150
        : weatherType === "snowy"
        ? 100
        : weatherType === "foggy"
        ? 50
        : 0;

    if (currentParticles < maxParticles) {
      const particlesToAdd = Math.min(5, maxParticles - currentParticles);

      for (let i = 0; i < particlesToAdd; i++) {
        let particle;

        switch (weatherType) {
          case "rainy":
            particle = {
              x: Math.random() * (window.innerWidth + 200) - 100,
              y: -10,
              vx: randomBetween(-1, 1),
              vy: randomBetween(8, 15),
              size: randomBetween(1, 3),
              opacity: randomBetween(0.3, 0.8),
            };
            break;

          case "snowy":
            particle = {
              x: Math.random() * (window.innerWidth + 200) - 100,
              y: -10,
              vx: randomBetween(-2, 2),
              vy: randomBetween(1, 4),
              size: randomBetween(2, 6),
              opacity: randomBetween(0.4, 0.9),
              rotation: Math.random() * 360,
              rotationSpeed: randomBetween(-2, 2),
            };
            break;

          case "stormy":
            particle = {
              x: Math.random() * (window.innerWidth + 200) - 100,
              y: -10,
              vx: randomBetween(-3, 3),
              vy: randomBetween(12, 20),
              size: randomBetween(1, 4),
              opacity: randomBetween(0.2, 0.7),
            };
            break;

          case "foggy":
            particle = {
              x: Math.random() * (window.innerWidth + 200) - 100,
              y: randomBetween(0, window.innerHeight),
              vx: randomBetween(-0.5, 0.5),
              vy: randomBetween(-0.5, 0.5),
              size: randomBetween(20, 80),
              opacity: randomBetween(0.1, 0.3),
            };
            break;

          default:
            continue;
        }

        gameData.current.weatherParticles.push(particle);
      }
    }
  }, []);

  const updateWeatherParticles = useCallback(
    (timePassed: number) => {
      const weatherType = gameData.current.weatherType;

      gameData.current.weatherParticles =
        gameData.current.weatherParticles.filter((particle) => {
          particle.x += particle.vx * (timePassed / 16);
          particle.y += particle.vy * (timePassed / 16);

          if (
            particle.rotation !== undefined &&
            particle.rotationSpeed !== undefined
          ) {
            particle.rotation += particle.rotationSpeed * (timePassed / 16);
          }

          // Fog particles move slowly and randomly
          if (weatherType === "foggy") {
            particle.vx += randomBetween(-0.1, 0.1);
            particle.vy += randomBetween(-0.1, 0.1);
            particle.vx = Math.max(-1, Math.min(1, particle.vx));
            particle.vy = Math.max(-1, Math.min(1, particle.vy));
            return particle.opacity > 0.05;
          }

          // Remove particles that are off screen
          return (
            particle.y < window.innerHeight + 100 &&
            particle.x > -100 &&
            particle.x < window.innerWidth + 100
          );
        });

      // Generate new particles
      generateWeatherParticles();
    },
    [generateWeatherParticles]
  );

  // Visual effects functions
  const triggerFlashEffect = useCallback((color: string, duration: number) => {
    gameData.current.visualEffects.flashEffect = {
      active: true,
      color,
      opacity: 0.8,
      duration,
      elapsed: 0,
    };
  }, []);

  const updateHeroTrail = useCallback(() => {
    const heroTrail = gameData.current.visualEffects.heroTrail;

    // Add new trail point
    heroTrail.unshift({
      x: gameData.current.heroX,
      y:
        gameData.current.heroY +
        GAME_CONFIG.canvasHeight -
        GAME_CONFIG.platformHeight -
        GAME_CONFIG.heroHeight / 2,
      life: 1,
      maxLife: 1,
    });

    // Limit trail length
    if (heroTrail.length > 8) {
      heroTrail.pop();
    }

    // Update trail particles
    heroTrail.forEach((trail) => {
      trail.life -= 0.15;
    });

    // Remove dead trail particles
    gameData.current.visualEffects.heroTrail = heroTrail.filter(
      (trail) => trail.life > 0
    );
  }, []);

  const updateVisualEffects = useCallback(
    (timePassed: number) => {
      const effects = gameData.current.visualEffects;

      // Update flash effect
      if (effects.flashEffect.active) {
        effects.flashEffect.elapsed += timePassed;
        const progress =
          effects.flashEffect.elapsed / effects.flashEffect.duration;

        if (progress >= 1) {
          effects.flashEffect.active = false;
          effects.flashEffect.opacity = 0;
        } else {
          // Fade out effect
          effects.flashEffect.opacity = 0.8 * (1 - progress);
        }
      }

      // Update camera zoom (reset to 1)
      if (effects.cameraZoom !== 1) {
        effects.cameraZoom += (1 - effects.cameraZoom) * 0.1;
        if (Math.abs(effects.cameraZoom - 1) < 0.01) {
          effects.cameraZoom = 1;
        }
      }

      // Update hero trail only when moving
      if (phaseRef.current === "walking") {
        updateHeroTrail();
      }
    },
    [updateHeroTrail]
  );

  const thePlatformTheStickHits = useCallback((): [
    Platform | null,
    boolean
  ] => {
    const sticks = gameData.current.sticks;
    const platforms = gameData.current.platforms;
    const lastStick = last(sticks);

    if (lastStick.rotation !== 90) {
      return [null, false];
    }

    const stickFarX = lastStick.x + lastStick.length;

    const platformTheStickHits = platforms.find(
      (platform) =>
        platform.x < stickFarX && stickFarX < platform.x + platform.w
    );

    if (
      platformTheStickHits &&
      platformTheStickHits.x +
        platformTheStickHits.w / 2 -
        GAME_CONFIG.perfectAreaSize / 2 <
        stickFarX &&
      stickFarX <
        platformTheStickHits.x +
          platformTheStickHits.w / 2 +
          GAME_CONFIG.perfectAreaSize / 2
    ) {
      return [platformTheStickHits, true];
    }

    return [platformTheStickHits || null, false];
  }, []);

  const resetGame = useCallback(() => {
    if (gameData.current.animationFrameId) {
      cancelAnimationFrame(gameData.current.animationFrameId);
      gameData.current.animationFrameId = null;
    }

    setPhase("waiting");
    setScore(0);

    gameData.current = {
      lastTimestamp: undefined,
      heroX: 0,
      heroY: 0,
      sceneOffset: 0,
      platforms: [{ x: 50, w: 50 }],
      sticks: [],
      trees: [],
      birds: [],
      clouds: [],
      particles: [],
      weatherType: getRandomWeather(),
      weatherParticles: [],
      visualEffects: {
        cameraZoom: 1,
        flashEffect: {
          active: false,
          color: "#FFFFFF",
          opacity: 0,
          duration: 0,
          elapsed: 0,
        },
        heroTrail: [],
      },
      animationFrameId: null,
      isMouseDown: false,
      lastLandingX: 0,
    };

    // Generate initial game elements
    for (let i = 0; i < 4; i++) {
      generatePlatform();
    }

    gameData.current.sticks = [
      {
        x: gameData.current.platforms[0].x + gameData.current.platforms[0].w,
        length: 0,
        rotation: 0,
      },
    ];

    for (let i = 0; i < 10; i++) {
      generateTree();
    }

    for (let i = 0; i < 8; i++) {
      generateBird();
    }

    for (let i = 0; i < 7; i++) {
      generateCloud();
    }

    gameData.current.heroX =
      gameData.current.platforms[0].x +
      gameData.current.platforms[0].w -
      GAME_CONFIG.heroDistanceFromEdge;
    gameData.current.heroY = 0;
  }, [generatePlatform, generateTree, generateBird, generateCloud, setPhase]);

  const handleMouseDown = useCallback(() => {
    console.log("Mouse down detected");
    gameData.current.isMouseDown = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    console.log("Mouse up detected");
    gameData.current.isMouseDown = false;
  }, []);

  return {
    gameData: gameData.current,
    score,
    phase: phaseRef.current,
    phaseRef,
    resetGame,
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
    generateWeatherParticles,
    generatePlatform,
    generateTree,
    generateBird,
    generateCloud,
    onScoreUpdate: incrementScore,
    onPerfectHit,
    onGameOver,
    onLongestStickUpdate,
  };
}
