import { describe, expect, it } from 'vitest';
import type { Goal, Review } from '../types';
import {
  goalToRow,
  idsToDelete,
  reviewToRow,
  rowToGoal,
  rowToReview,
} from './queries';

describe('idsToDelete', () => {
  it('returns ids that dropped out of the incoming set', () => {
    expect(idsToDelete(['a', 'b', 'c'], ['b', 'c'])).toEqual(['a']);
  });

  it('returns nothing when everything existing is still present', () => {
    expect(idsToDelete(['a', 'b'], ['a', 'b', 'c'])).toEqual([]);
  });

  it('returns everything existing when nothing is incoming (e.g. all deleted locally)', () => {
    expect(idsToDelete(['a', 'b'], [])).toEqual(['a', 'b']);
  });

  it('de-duplicates the existing set', () => {
    expect(idsToDelete(['a', 'a', 'b'], ['b'])).toEqual(['a']);
  });
});

describe('goal row mapping', () => {
  it('round-trips a goal through goalToRow -> rowToGoal', () => {
    const goal: Goal = {
      id: 'g1',
      parentId: 'g0',
      area: 3,
      title: 'Some goal',
      progress: 42,
      year: '2027',
      note: 'A note',
    };
    const row = goalToRow(goal, 'user-1');
    expect(row.user_id).toBe('user-1');
    expect(row.parent_id).toBe('g0');
    expect(rowToGoal(row)).toEqual(goal);
  });

  it('preserves a null parentId (root goal) through the round trip', () => {
    const goal: Goal = {
      id: 'g1',
      parentId: null,
      area: 0,
      title: 'Root goal',
      progress: 0,
      year: '2026',
      note: '',
    };
    expect(rowToGoal(goalToRow(goal, 'user-1'))).toEqual(goal);
  });
});

describe('review row mapping', () => {
  it('round-trips a review through reviewToRow -> rowToReview', () => {
    const review: Review = {
      id: 'r1',
      date: 'Aug 2026',
      createdAt: '2026-08-30T00:00:00.000Z',
      win: 'Win',
      lesson: 'Lesson',
      next: 'Next',
    };
    const row = reviewToRow(review, 'user-1');
    expect(row.user_id).toBe('user-1');
    expect(row.created_at).toBe(review.createdAt);
    expect(rowToReview(row)).toEqual(review);
  });
});
