import { describe, expect, it } from 'vitest';
import type { Goal } from '../types';
import { childrenOf, descendantIds, effectiveProgress } from './goalTree';

function goal(overrides: Partial<Goal> & { id: string }): Goal {
  return {
    id: overrides.id,
    parentId: overrides.parentId ?? null,
    area: overrides.area ?? 0,
    title: overrides.title ?? `goal-${overrides.id}`,
    progress: overrides.progress ?? 0,
    year: overrides.year ?? '2026',
    note: overrides.note ?? '',
  };
}

describe('childrenOf', () => {
  it('returns only direct children of a parent', () => {
    const goals = [
      goal({ id: '1', parentId: null }),
      goal({ id: '2', parentId: '1' }),
      goal({ id: '3', parentId: '1' }),
      goal({ id: '4', parentId: '2' }),
    ];
    expect(childrenOf(goals, '1').map((g) => g.id)).toEqual(['2', '3']);
    expect(childrenOf(goals, '2').map((g) => g.id)).toEqual(['4']);
  });
});

describe('effectiveProgress', () => {
  it('returns the goal own progress when it has no children (leaf)', () => {
    const goals = [goal({ id: '1', progress: 42 })];
    expect(effectiveProgress(goals[0], goals)).toBe(42);
  });

  it('averages direct children progress for a parent goal', () => {
    const goals = [
      goal({ id: '1', progress: 0 }),
      goal({ id: '2', parentId: '1', progress: 100 }),
      goal({ id: '3', parentId: '1', progress: 0 }),
    ];
    expect(effectiveProgress(goals[0], goals)).toBe(50);
  });

  it('recursively rolls up progress through multiple levels', () => {
    const goals = [
      goal({ id: '1', progress: 0 }),
      goal({ id: '2', parentId: '1', progress: 0 }),
      goal({ id: '3', parentId: '2', progress: 100 }),
      goal({ id: '4', parentId: '2', progress: 0 }),
    ];
    // goal 2 rolls up to 50 (avg of 100, 0); goal 1 has a single child (goal 2) so rolls up to 50
    expect(effectiveProgress(goals[0], goals)).toBe(50);
  });

  it('ignores manual progress on non-leaf goals in favor of the rollup', () => {
    const goals = [
      goal({ id: '1', progress: 90 }),
      goal({ id: '2', parentId: '1', progress: 10 }),
    ];
    expect(effectiveProgress(goals[0], goals)).toBe(10);
  });
});

describe('descendantIds', () => {
  it('returns an empty array for a leaf goal', () => {
    const goals = [goal({ id: '1' })];
    expect(descendantIds(goals, '1')).toEqual([]);
  });

  it('returns all nested descendant ids, not just direct children', () => {
    const goals = [
      goal({ id: '1' }),
      goal({ id: '2', parentId: '1' }),
      goal({ id: '3', parentId: '1' }),
      goal({ id: '4', parentId: '2' }),
      goal({ id: '5', parentId: '4' }),
    ];
    expect(descendantIds(goals, '1').sort()).toEqual(['2', '3', '4', '5']);
  });
});
