export interface Platform {
  x: number;
  w: number;
  isGolden?: boolean;
}

export interface Stick {
  x: number;
  length: number;
  rotation: number;
  bendAmount?: number;
  bendDirection?: number;
}

export interface Tree {
  x: number;
  color: string;
}

export interface Bird {
  x: number;
  y: number;
  speed: number;
  wingPosition: number;
  wingDirection: number;
  size: number;
  bobOffset: number;
  bobSpeed: number;
  color: string;
}

export interface Cloud {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  opacity: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export type WeatherType =
  | "sunny"
  | "rainy"
  | "snowy"
  | "cloudy"
  | "foggy"
  | "stormy";

export interface WeatherParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  rotation?: number;
  rotationSpeed?: number;
}

export interface VisualEffects {
  cameraZoom: number;
  flashEffect: {
    active: boolean;
    color: string;
    opacity: number;
    duration: number;
    elapsed: number;
  };
  heroTrail: Array<{
    x: number;
    y: number;
    life: number;
    maxLife: number;
  }>;
}

export interface GameData {
  lastTimestamp: number | undefined;
  heroX: number;
  heroY: number;
  sceneOffset: number;
  platforms: Platform[];
  sticks: Stick[];
  trees: Tree[];
  birds: Bird[];
  clouds: Cloud[];
  particles: Particle[];
  weatherType: WeatherType;
  weatherParticles: WeatherParticle[];
  visualEffects: VisualEffects;
  animationFrameId: number | null;
  isMouseDown: boolean;
  lastLandingX: number;
}

export interface GameStats {
  gamesPlayed: number;
  perfectJumps: number;
  longestStick: number;
}

export type GamePhase =
  | "waiting"
  | "stretching"
  | "turning"
  | "walking"
  | "transitioning"
  | "falling";
