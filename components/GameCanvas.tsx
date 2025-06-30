"use client";

import {
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { GameData } from "@/types/game";
import { GAME_CONFIG, COLORS } from "@/constants/gameConfig";
import {
  drawHero,
  drawPlatforms,
  drawSticks,
  drawHill,
  drawTree,
  drawBird,
  drawCloud,
  drawSun,
  drawMountain,
  drawParticles,
  drawWeatherParticles,
  drawWeatherOverlay,
  getWeatherBackgroundColor,
  drawHeroTrail,
  drawFlashEffect,
} from "@/utils/drawingUtils";

interface GameCanvasProps {
  gameData: GameData;
  onMouseDown: () => void;
  onMouseUp: () => void;
}

export interface GameCanvasRef {
  draw: () => void;
}

const GameCanvas = forwardRef<GameCanvasRef, GameCanvasProps>(
  ({ gameData, onMouseDown, onMouseUp }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawBackground = useCallback(
      (ctx: CanvasRenderingContext2D) => {
        // Get weather-appropriate background color
        const weatherBgColor = getWeatherBackgroundColor(gameData.weatherType);

        const skyGradient = ctx.createLinearGradient(
          0,
          0,
          0,
          window.innerHeight
        );

        // Modify gradient based on weather
        if (gameData.weatherType === "sunny") {
          skyGradient.addColorStop(0, COLORS.SKY_GRADIENT.START);
          skyGradient.addColorStop(0.5, COLORS.SKY_GRADIENT.MIDDLE);
          skyGradient.addColorStop(1, COLORS.SKY_GRADIENT.END);
        } else {
          // Use weather-appropriate colors
          skyGradient.addColorStop(0, weatherBgColor);
          skyGradient.addColorStop(0.5, COLORS.SKY_GRADIENT.MIDDLE);
          skyGradient.addColorStop(1, COLORS.SKY_GRADIENT.END);
        }

        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        // Only draw sun for sunny weather
        if (gameData.weatherType === "sunny") {
          drawSun(ctx);
        }

        gameData.clouds.forEach((cloud) => drawCloud(ctx, gameData, cloud));

        drawMountain(
          ctx,
          gameData,
          GAME_CONFIG.mountain1BaseHeight,
          GAME_CONFIG.mountain1Amplitude,
          GAME_CONFIG.mountain1Stretch,
          COLORS.MOUNTAINS.MOUNTAIN1,
          COLORS.MOUNTAINS.MOUNTAIN1_GRADIENT
        );

        drawMountain(
          ctx,
          gameData,
          GAME_CONFIG.mountain2BaseHeight,
          GAME_CONFIG.mountain2Amplitude,
          GAME_CONFIG.mountain2Stretch,
          COLORS.MOUNTAINS.MOUNTAIN2,
          COLORS.MOUNTAINS.MOUNTAIN2_GRADIENT
        );

        drawHill(
          ctx,
          gameData,
          GAME_CONFIG.hill1BaseHeight,
          GAME_CONFIG.hill1Amplitude,
          GAME_CONFIG.hill1Stretch,
          COLORS.HILLS.HILL1,
          COLORS.HILLS.HILL1_GRADIENT
        );

        drawHill(
          ctx,
          gameData,
          GAME_CONFIG.hill2BaseHeight,
          GAME_CONFIG.hill2Amplitude,
          GAME_CONFIG.hill2Stretch,
          COLORS.HILLS.HILL2,
          COLORS.HILLS.HILL2_GRADIENT
        );

        drawHill(
          ctx,
          gameData,
          GAME_CONFIG.hill3BaseHeight,
          GAME_CONFIG.hill3Amplitude,
          GAME_CONFIG.hill3Stretch,
          COLORS.HILLS.HILL3,
          COLORS.HILLS.HILL3_GRADIENT
        );

        gameData.trees.forEach((tree) =>
          drawTree(ctx, gameData, tree.x, tree.color)
        );

        gameData.birds.forEach((bird) => drawBird(ctx, gameData, bird));
      },
      [gameData]
    );

    const draw = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.save();
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Apply camera zoom
      const zoom = gameData.visualEffects.cameraZoom;
      if (zoom !== 1) {
        ctx.scale(zoom, zoom);
        ctx.translate(
          (window.innerWidth * (1 - zoom)) / (2 * zoom),
          (window.innerHeight * (1 - zoom)) / (2 * zoom)
        );
      }

      drawBackground(ctx);

      ctx.translate(
        (window.innerWidth - GAME_CONFIG.canvasWidth) / 2 -
          gameData.sceneOffset,
        (window.innerHeight - GAME_CONFIG.canvasHeight) / 2
      );

      // Draw hero trail behind everything
      drawHeroTrail(ctx, gameData);

      drawPlatforms(ctx, gameData);
      drawHero(ctx, gameData);
      drawSticks(ctx, gameData);
      drawParticles(ctx, gameData);

      ctx.restore();

      // Draw weather effects on top of everything (not affected by scene offset or shake)
      drawWeatherParticles(ctx, gameData);
      drawWeatherOverlay(ctx, gameData);

      // Draw flash effect on top of everything
      drawFlashEffect(ctx, gameData);
    }, [drawBackground, gameData]);

    useImperativeHandle(ref, () => ({
      draw,
    }));

    const handleResize = useCallback(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width = "100vw";
        canvas.style.height = "100vh";
        canvas.style.display = "block";
        draw();
      }
    }, [draw]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const mouseDownHandler = (e: MouseEvent) => {
        e.preventDefault();
        onMouseDown();
      };

      const mouseUpHandler = (e: MouseEvent) => {
        e.preventDefault();
        onMouseUp();
      };

      const touchStartHandler = (e: TouchEvent) => {
        e.preventDefault();
        onMouseDown();
      };

      const touchEndHandler = (e: TouchEvent) => {
        e.preventDefault();
        onMouseUp();
      };

      canvas.addEventListener("mousedown", mouseDownHandler);
      canvas.addEventListener("mouseup", mouseUpHandler);
      canvas.addEventListener("touchstart", touchStartHandler);
      canvas.addEventListener("touchend", touchEndHandler);
      window.addEventListener("mouseup", mouseUpHandler);
      window.addEventListener("resize", handleResize);

      return () => {
        canvas.removeEventListener("mousedown", mouseDownHandler);
        canvas.removeEventListener("mouseup", mouseUpHandler);
        canvas.removeEventListener("touchstart", touchStartHandler);
        canvas.removeEventListener("touchend", touchEndHandler);
        window.removeEventListener("mouseup", mouseUpHandler);
        window.removeEventListener("resize", handleResize);
      };
    }, [onMouseDown, onMouseUp, handleResize]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width = "100vw";
        canvas.style.height = "100vh";
        canvas.style.display = "block";
      }
    }, []);

    return (
      <canvas
        ref={canvasRef}
        id="game"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "block",
        }}
      />
    );
  }
);

GameCanvas.displayName = "GameCanvas";

export default GameCanvas;
