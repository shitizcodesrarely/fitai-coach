import { clsx } from "clsx";

// Merge Tailwind class names conditionally
export function cn(...inputs) {
  return clsx(inputs);
}

// Format weight for display
export function formatWeight(kg) {
  return `${kg}kg`;
}

// Calculate BMI from weight and height
export function calculateBMI(weightKg, heightCm) {
  const heightM = heightCm / 100;
  return (weightKg / (heightM * heightM)).toFixed(1);
}

// Calculate total volume for a session (sets × reps × weight)
export function calculateVolume(logs) {
  return logs.reduce((total, log) => total + log.reps * log.weightKg, 0);
}

// Safe JSON parse - returns null instead of throwing
export function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

// Format duration in minutes to "1h 23m"
export function formatDuration(minutes) {
  if (!minutes) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
