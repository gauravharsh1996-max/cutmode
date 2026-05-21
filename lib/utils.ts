import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKcal(value: number) {
  return `${Math.round(value).toLocaleString()} kcal`;
}

export function formatGrams(value: number) {
  return `${Math.round(value)}g`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function toPercent(value: number, target: number) {
  if (!target) return 0;
  return clamp(Math.round((value / target) * 100), 0, 999);
}
