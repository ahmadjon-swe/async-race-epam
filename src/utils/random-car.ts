import { CAR_BRANDS, CAR_MODELS } from './constants';

function randomHex(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomCarName(): string {
  return `${randomItem(CAR_BRANDS)} ${randomItem(CAR_MODELS)}`;
}

export function randomCarColor(): string {
  return randomHex();
}
