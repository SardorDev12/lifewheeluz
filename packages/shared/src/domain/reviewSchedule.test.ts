import { describe, expect, it } from 'vitest';
import type { Review } from '../types';
import { hasReviewedThisMonth, monthlyLabelFor } from './reviewSchedule';

function review(overrides: Partial<Review> & { id: string }): Review {
  return {
    id: overrides.id,
    date: overrides.date ?? '',
    createdAt: overrides.createdAt ?? new Date().toISOString(),
    win: overrides.win ?? '',
    lesson: overrides.lesson ?? '',
    next: overrides.next ?? '',
  };
}

describe('monthlyLabelFor', () => {
  it('labels the month before the given date, capitalized, per locale', () => {
    // September 4 -> reviews August
    expect(monthlyLabelFor(new Date('2026-09-04'), 'uz')).toBe(
      'Avgust oyi tahlili',
    );
    expect(monthlyLabelFor(new Date('2026-09-04'), 'en')).toBe(
      'August analysis',
    );
    expect(monthlyLabelFor(new Date('2026-09-04'), 'ru')).toBe(
      'Анализ за август',
    );
  });

  it('wraps around the year boundary (January reviews December)', () => {
    expect(monthlyLabelFor(new Date('2026-01-15'), 'en')).toBe(
      'December analysis',
    );
  });

  it('returns an empty string for an invalid date', () => {
    expect(monthlyLabelFor(new Date('not-a-date'), 'en')).toBe('');
  });
});

describe('hasReviewedThisMonth', () => {
  it('is false with no reviews', () => {
    expect(hasReviewedThisMonth([])).toBe(false);
  });

  it('is true when a review was created in the given month', () => {
    const now = new Date('2026-09-04');
    const reviews = [review({ id: '1', createdAt: '2026-09-01T00:00:00Z' })];
    expect(hasReviewedThisMonth(reviews, now)).toBe(true);
  });

  it('is false when the only review is from a different month', () => {
    const now = new Date('2026-09-04');
    const reviews = [review({ id: '1', createdAt: '2026-08-15T00:00:00Z' })];
    expect(hasReviewedThisMonth(reviews, now)).toBe(false);
  });
});
