export function last<T>(array: T[]): T {
  return array[array.length - 1];
}

export const sinus = (degree: number): number =>
  Math.sin((degree / 180) * Math.PI);

export function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max));
}

export function randomChoice<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomWeather() {
  const weatherTypes = [
    "sunny",
    "rainy",
    "snowy",
    "cloudy",
    "foggy",
    "stormy",
  ] as const;
  const weatherWeights = [0.3, 0.2, 0.15, 0.2, 0.1, 0.05]; // Sunny is most common, stormy is rare

  const random = Math.random();
  let cumulative = 0;

  for (let i = 0; i < weatherTypes.length; i++) {
    cumulative += weatherWeights[i];
    if (random <= cumulative) {
      return weatherTypes[i];
    }
  }

  return "sunny"; // fallback
}
