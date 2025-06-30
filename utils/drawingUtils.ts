import {
  GameData,
  Bird,
  Cloud,
  WeatherParticle,
  WeatherType,
} from "@/types/game";
import { GAME_CONFIG, COLORS } from "@/constants/gameConfig";
import { sinus } from "./gameUtils";

export function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.lineTo(x + width - radius, y + height);
  ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
  ctx.lineTo(x + width, y + radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.lineTo(x + radius, y);
  ctx.arcTo(x, y, x, y + radius, radius);
  ctx.fill();
}

export function drawHero(ctx: CanvasRenderingContext2D, gameData: GameData) {
  ctx.save();
  ctx.fillStyle = "black";
  ctx.translate(
    gameData.heroX - GAME_CONFIG.heroWidth / 2,
    gameData.heroY +
      GAME_CONFIG.canvasHeight -
      GAME_CONFIG.platformHeight -
      GAME_CONFIG.heroHeight / 2
  );

  drawRoundedRect(
    ctx,
    -GAME_CONFIG.heroWidth / 2,
    -GAME_CONFIG.heroHeight / 2,
    GAME_CONFIG.heroWidth,
    GAME_CONFIG.heroHeight - 4,
    5
  );

  const legDistance = 5;
  ctx.beginPath();
  ctx.arc(legDistance, 11.5, 3, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-legDistance, 11.5, 3, 0, Math.PI * 2, false);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.arc(5, -7, 3, 0, Math.PI * 2, false);
  ctx.fill();

  ctx.fillStyle = "red";
  ctx.fillRect(
    -GAME_CONFIG.heroWidth / 2 - 1,
    -12,
    GAME_CONFIG.heroWidth + 2,
    4.5
  );
  ctx.beginPath();
  ctx.moveTo(-9, -14.5);
  ctx.lineTo(-17, -18.5);
  ctx.lineTo(-14, -8.5);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-10, -10.5);
  ctx.lineTo(-15, -3.5);
  ctx.lineTo(-5, -7);
  ctx.fill();

  ctx.restore();
}

export function drawPlatforms(
  ctx: CanvasRenderingContext2D,
  gameData: GameData
) {
  const platforms = gameData.platforms;
  const sticks = gameData.sticks;

  platforms.forEach(({ x, w, isGolden }) => {
    // Draw platform with golden color if it's a golden platform
    if (isGolden) {
      // Create golden gradient
      const gradient = ctx.createLinearGradient(
        x,
        GAME_CONFIG.canvasHeight - GAME_CONFIG.platformHeight,
        x,
        GAME_CONFIG.canvasHeight
      );
      gradient.addColorStop(0, "#FFD700"); // Gold
      gradient.addColorStop(0.5, "#FFA500"); // Orange-gold
      gradient.addColorStop(1, "#FF8C00"); // Dark orange
      ctx.fillStyle = gradient;

      // Add a golden border/glow effect
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 10;
    } else {
      ctx.fillStyle = COLORS.PLATFORM;
      ctx.shadowBlur = 0;
    }

    ctx.fillRect(
      x,
      GAME_CONFIG.canvasHeight - GAME_CONFIG.platformHeight,
      w,
      GAME_CONFIG.platformHeight +
        (window.innerHeight - GAME_CONFIG.canvasHeight) / 2
    );

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw perfect area indicator
    if (sticks.length > 0 && sticks[sticks.length - 1].x < x) {
      ctx.fillStyle = isGolden ? "#FFFF00" : COLORS.PERFECT_AREA; // Brighter yellow for golden platforms
      ctx.fillRect(
        x + w / 2 - GAME_CONFIG.perfectAreaSize / 2,
        GAME_CONFIG.canvasHeight - GAME_CONFIG.platformHeight,
        GAME_CONFIG.perfectAreaSize,
        GAME_CONFIG.perfectAreaSize
      );
    }

    // Add golden sparkle effect for golden platforms
    if (isGolden) {
      const time = Date.now() * 0.01;
      const sparkleCount = 3;

      for (let i = 0; i < sparkleCount; i++) {
        const sparkleX = x + (w * (i + 1)) / (sparkleCount + 1);
        const sparkleY =
          GAME_CONFIG.canvasHeight - GAME_CONFIG.platformHeight - 5;
        const sparkleSize = 2 + Math.sin(time + i) * 1;

        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
}

export function drawSticks(ctx: CanvasRenderingContext2D, gameData: GameData) {
  const sticks = gameData.sticks;

  sticks.forEach((stick) => {
    ctx.save();
    ctx.translate(
      stick.x,
      GAME_CONFIG.canvasHeight - GAME_CONFIG.platformHeight
    );
    ctx.rotate((Math.PI / 180) * stick.rotation);

    ctx.strokeStyle = "#8B4513"; // Brown color for wood
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    // Draw stick with bending effect if it has bend properties
    if (stick.bendAmount && stick.bendDirection && stick.rotation === 90) {
      // Draw a curved stick using quadratic curve
      ctx.beginPath();
      ctx.moveTo(0, 0);

      const midX = stick.bendDirection * stick.bendAmount;
      const midY = -stick.length / 2;
      const endX = 0;
      const endY = -stick.length;

      ctx.quadraticCurveTo(midX, midY, endX, endY);
      ctx.stroke();

      // Add a slight shadow for depth
      ctx.save();
      ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
      ctx.lineWidth = 1;
      ctx.translate(1, 1);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(midX, midY, endX, endY);
      ctx.stroke();
      ctx.restore();
    } else {
      // Draw normal straight stick
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -stick.length);
      ctx.stroke();

      // Add a slight shadow for depth
      ctx.save();
      ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
      ctx.lineWidth = 1;
      ctx.translate(1, 1);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -stick.length);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  });
}

export function getHillY(
  gameData: GameData,
  windowX: number,
  baseHeight: number,
  amplitude: number,
  stretch: number
) {
  const sineBaseY = window.innerHeight - baseHeight;
  return (
    sinus(
      (gameData.sceneOffset * GAME_CONFIG.backgroundSpeedMultiplier + windowX) *
        stretch
    ) *
      amplitude +
    sineBaseY
  );
}

export function getTreeY(x: number, baseHeight: number, amplitude: number) {
  const sineBaseY = window.innerHeight - baseHeight;
  return sinus(x) * amplitude + sineBaseY;
}

export function drawHill(
  ctx: CanvasRenderingContext2D,
  gameData: GameData,
  baseHeight: number,
  amplitude: number,
  stretch: number,
  color: string,
  gradientColor: string
) {
  ctx.beginPath();
  ctx.moveTo(0, window.innerHeight);
  ctx.lineTo(0, getHillY(gameData, 0, baseHeight, amplitude, stretch));

  for (let i = 0; i < window.innerWidth; i++) {
    ctx.lineTo(i, getHillY(gameData, i, baseHeight, amplitude, stretch));
  }

  ctx.lineTo(window.innerWidth, window.innerHeight);

  const gradient = ctx.createLinearGradient(
    0,
    window.innerHeight - baseHeight - amplitude,
    0,
    window.innerHeight
  );
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, gradientColor);

  ctx.fillStyle = gradient;
  ctx.fill();
}

export function drawTree(
  ctx: CanvasRenderingContext2D,
  gameData: GameData,
  x: number,
  color: string
) {
  ctx.save();
  ctx.translate(
    (-gameData.sceneOffset * GAME_CONFIG.backgroundSpeedMultiplier + x) *
      GAME_CONFIG.hill1Stretch,
    getTreeY(x, GAME_CONFIG.hill1BaseHeight, GAME_CONFIG.hill1Amplitude)
  );

  const treeTrunkHeight = 5;
  const treeTrunkWidth = 2;
  const treeCrownHeight = 25;
  const treeCrownWidth = 10;

  ctx.fillStyle = COLORS.TREE_TRUNK;
  ctx.fillRect(
    -treeTrunkWidth / 2,
    -treeTrunkHeight,
    treeTrunkWidth,
    treeTrunkHeight
  );

  ctx.beginPath();
  ctx.moveTo(-treeCrownWidth / 2, -treeTrunkHeight);
  ctx.lineTo(0, -(treeTrunkHeight + treeCrownHeight));
  ctx.lineTo(treeCrownWidth / 2, -treeTrunkHeight);
  ctx.fillStyle = color;
  ctx.fill();

  ctx.restore();
}

export function drawBird(
  ctx: CanvasRenderingContext2D,
  gameData: GameData,
  bird: Bird
) {
  const wingSpan = bird.wingPosition;
  const bobEffect = Math.sin(bird.bobOffset) * 3;

  ctx.save();
  ctx.translate(
    bird.x - gameData.sceneOffset * GAME_CONFIG.backgroundSpeedMultiplier * 0.6,
    bird.y + bobEffect
  );

  ctx.fillStyle = bird.color;
  ctx.beginPath();
  ctx.ellipse(0, 0, bird.size, bird.size / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#555";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(bird.size, -wingSpan, bird.size * 2, 0);
  ctx.quadraticCurveTo(bird.size, wingSpan / 2, 0, 0);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-bird.size, -wingSpan, -bird.size * 2, 0);
  ctx.quadraticCurveTo(-bird.size, wingSpan / 2, 0, 0);
  ctx.fill();

  ctx.fillStyle = bird.color;
  ctx.beginPath();
  ctx.arc(bird.size, -bird.size / 2, bird.size / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f6cb5b";
  ctx.beginPath();
  ctx.moveTo(bird.size * 1.5, -bird.size / 2);
  ctx.lineTo(bird.size * 2, -bird.size / 2);
  ctx.lineTo(bird.size * 1.5, -bird.size / 4);
  ctx.fill();

  ctx.restore();
}

export function drawCloud(
  ctx: CanvasRenderingContext2D,
  gameData: GameData,
  cloud: Cloud
) {
  ctx.save();

  const parallaxOffset =
    gameData.sceneOffset * GAME_CONFIG.backgroundSpeedMultiplier * 0.2;

  ctx.translate(cloud.x - parallaxOffset, cloud.y);

  ctx.fillStyle = `rgba(255, 255, 255, ${cloud.opacity})`;

  const radiusX = cloud.width / 4;
  const radiusY = cloud.height / 3;

  ctx.beginPath();
  ctx.ellipse(0, 0, radiusX * 2, radiusY, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(-radiusX, -radiusY / 2, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(radiusX, -radiusY / 2, radiusX * 1.2, radiusY, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(
    radiusX * 0.5,
    radiusY / 2,
    radiusX,
    radiusY * 0.8,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(
    -radiusX * 0.5,
    radiusY / 2,
    radiusX * 0.7,
    radiusY * 0.8,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.restore();
}

export function drawSun(ctx: CanvasRenderingContext2D) {
  ctx.save();

  const sunX = window.innerWidth * 0.85;
  const sunY = window.innerHeight * 0.2;
  const sunRadius = 40;

  const gradient = ctx.createRadialGradient(
    sunX,
    sunY,
    sunRadius * 0.5,
    sunX,
    sunY,
    sunRadius * 2
  );
  gradient.addColorStop(0, "rgba(255, 255, 190, 0.8)");
  gradient.addColorStop(1, "rgba(255, 255, 190, 0)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius * 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = COLORS.SUN;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = COLORS.SUN;
  ctx.lineWidth = 3;

  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI * 2) / 12;
    const innerRadius = sunRadius * 1.2;
    const outerRadius = sunRadius * 1.8;

    ctx.beginPath();
    ctx.moveTo(
      sunX + Math.cos(angle) * innerRadius,
      sunY + Math.sin(angle) * innerRadius
    );
    ctx.lineTo(
      sunX + Math.cos(angle) * outerRadius,
      sunY + Math.sin(angle) * outerRadius
    );
    ctx.stroke();
  }

  ctx.restore();
}

export function drawMountain(
  ctx: CanvasRenderingContext2D,
  gameData: GameData,
  baseHeight: number,
  amplitude: number,
  stretch: number,
  color: string,
  gradientColor: string
) {
  const snowHeight = 40;

  ctx.beginPath();
  ctx.moveTo(0, window.innerHeight);
  ctx.lineTo(0, getHillY(gameData, 0, baseHeight, amplitude, stretch));

  for (let i = 0; i < window.innerWidth; i++) {
    ctx.lineTo(i, getHillY(gameData, i, baseHeight, amplitude, stretch));
  }

  ctx.lineTo(window.innerWidth, window.innerHeight);

  const gradient = ctx.createLinearGradient(
    0,
    window.innerHeight - baseHeight - amplitude,
    0,
    window.innerHeight
  );
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, gradientColor);

  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.beginPath();
  for (let i = 0; i < window.innerWidth; i++) {
    const y = getHillY(gameData, i, baseHeight, amplitude, stretch);
    if (y < window.innerHeight - baseHeight - amplitude + snowHeight) {
      ctx.lineTo(i, y);
    }
  }
  ctx.lineTo(
    window.innerWidth,
    getHillY(gameData, window.innerWidth, baseHeight, amplitude, stretch)
  );
  ctx.lineTo(0, getHillY(gameData, 0, baseHeight, amplitude, stretch));

  const snowGradient = ctx.createLinearGradient(
    0,
    window.innerHeight - baseHeight - amplitude,
    0,
    window.innerHeight - baseHeight - amplitude + snowHeight
  );
  snowGradient.addColorStop(0, "#ffffff");
  snowGradient.addColorStop(1, "#f0f0f0");

  ctx.fillStyle = snowGradient;
  ctx.fill();
}

export function drawParticles(
  ctx: CanvasRenderingContext2D,
  gameData: GameData
) {
  gameData.particles.forEach((particle) => {
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = particle.life;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

export function getWeatherBackgroundColor(weatherType: WeatherType): string {
  switch (weatherType) {
    case "rainy":
      return "#4A5568"; // Darker gray-blue
    case "snowy":
      return "#718096"; // Light gray
    case "stormy":
      return "#2D3748"; // Very dark gray
    case "cloudy":
      return "#A0AEC0"; // Medium gray
    case "foggy":
      return "#E2E8F0"; // Very light gray
    case "sunny":
    default:
      return "#87CEEB"; // Sky blue
  }
}

export function drawWeatherParticles(
  ctx: CanvasRenderingContext2D,
  gameData: GameData
) {
  const weatherType = gameData.weatherType;

  gameData.weatherParticles.forEach((particle) => {
    ctx.save();
    ctx.globalAlpha = particle.opacity;

    switch (weatherType) {
      case "rainy":
      case "stormy":
        // Draw rain drops as lines
        ctx.strokeStyle = weatherType === "stormy" ? "#4A5568" : "#87CEEB";
        ctx.lineWidth = particle.size;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(particle.x + particle.vx * 2, particle.y + particle.vy * 2);
        ctx.stroke();
        break;

      case "snowy":
        // Draw snowflakes
        ctx.fillStyle = "#FFFFFF";
        if (particle.rotation !== undefined) {
          ctx.translate(particle.x, particle.y);
          ctx.rotate((particle.rotation * Math.PI) / 180);

          // Draw snowflake shape
          const size = particle.size;
          ctx.beginPath();
          ctx.moveTo(-size / 2, 0);
          ctx.lineTo(size / 2, 0);
          ctx.moveTo(0, -size / 2);
          ctx.lineTo(0, size / 2);
          ctx.moveTo(-size / 3, -size / 3);
          ctx.lineTo(size / 3, size / 3);
          ctx.moveTo(-size / 3, size / 3);
          ctx.lineTo(size / 3, -size / 3);
          ctx.lineWidth = 1;
          ctx.stroke();

          // Center dot
          ctx.beginPath();
          ctx.arc(0, 0, size / 4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      case "foggy":
        // Draw fog as blurred circles
        ctx.fillStyle = "#F7FAFC";
        ctx.filter = "blur(3px)";
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        break;

      default:
        break;
    }

    ctx.restore();
  });
}

export function drawWeatherOverlay(
  ctx: CanvasRenderingContext2D,
  gameData: GameData
) {
  const weatherType = gameData.weatherType;

  // Add subtle color overlays for different weather
  ctx.save();

  switch (weatherType) {
    case "rainy":
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = "#4A5568";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      break;

    case "stormy":
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "#2D3748";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Add lightning flashes occasionally
      if (Math.random() < 0.002) {
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }
      break;

    case "snowy":
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = "#E2E8F0";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      break;

    case "cloudy":
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = "#A0AEC0";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      break;

    case "foggy":
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = "#E2E8F0";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      break;

    case "sunny":
    default:
      // No overlay for sunny weather
      break;
  }

  ctx.restore();
}

export function drawHeroTrail(
  ctx: CanvasRenderingContext2D,
  gameData: GameData
) {
  const trail = gameData.visualEffects.heroTrail;

  trail.forEach((point, index) => {
    ctx.save();
    ctx.globalAlpha = point.life * 0.6;

    const size = 3 + point.life * 2;
    const gradient = ctx.createRadialGradient(
      point.x,
      point.y,
      0,
      point.x,
      point.y,
      size
    );
    gradient.addColorStop(0, "#FF6B35");
    gradient.addColorStop(1, "rgba(255, 107, 53, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  });
}

export function drawFlashEffect(
  ctx: CanvasRenderingContext2D,
  gameData: GameData
) {
  const flash = gameData.visualEffects.flashEffect;

  if (flash.active && flash.opacity > 0) {
    ctx.save();
    ctx.globalAlpha = flash.opacity;
    ctx.fillStyle = flash.color;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
  }
}
