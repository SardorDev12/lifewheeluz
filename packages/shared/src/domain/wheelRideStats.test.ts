import { describe, expect, it } from 'vitest';
import { computeWheelRideStats } from './wheelRideStats';

describe('computeWheelRideStats', () => {
  it('classifies perfectly even scores as smooth', () => {
    const stats = computeWheelRideStats([7, 7, 7, 7, 7, 7, 7, 7]);
    expect(stats.tier).toBe('smooth');
    expect(stats.stdDev).toBe(0);
    expect(stats.avg).toBe(7);
  });

  it('classifies moderately spread scores as uneven', () => {
    const stats = computeWheelRideStats([6, 7, 5, 8, 7, 6, 4, 7]);
    expect(stats.tier).toBe('uneven');
  });

  it('classifies widely spread scores as rough', () => {
    const stats = computeWheelRideStats([1, 10, 1, 10, 1, 10, 1, 10]);
    expect(stats.tier).toBe('rough');
  });

  it('caps bounce and duration at their maximums for extreme variance', () => {
    const stats = computeWheelRideStats([1, 10, 1, 10, 1, 10, 1, 10]);
    expect(stats.bounce).toBeLessThanOrEqual(14);
    expect(stats.duration).toBeLessThanOrEqual(9);
  });
});
