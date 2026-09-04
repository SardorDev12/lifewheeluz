export type WheelRideTier = 'smooth' | 'uneven' | 'rough';

export type WheelRideStats = {
  avg: number;
  stdDev: number;
  bounce: number;
  duration: number;
  tier: WheelRideTier;
};

export function computeWheelRideStats(scores: number[]): WheelRideStats {
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length,
    stdDev = Math.sqrt(
      scores.reduce((a, b) => a + (b - avg) ** 2, 0) / scores.length,
    ),
    bounce = Math.min(14, stdDev * 3.2),
    duration = Math.min(9, 3.5 + stdDev * 2),
    tier: WheelRideTier =
      stdDev < 0.9 ? 'smooth' : stdDev < 2 ? 'uneven' : 'rough';
  return { avg, stdDev, bounce, duration, tier };
}
