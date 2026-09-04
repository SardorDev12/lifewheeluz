import type { Goal } from '../types';

export function childrenOf(goals: Goal[], parentId: string) {
  return goals.filter((g) => g.parentId === parentId);
}

export function effectiveProgress(goal: Goal, goals: Goal[]): number {
  const kids = childrenOf(goals, goal.id);
  if (!kids.length) return goal.progress;
  return Math.round(
    kids.reduce((sum, k) => sum + effectiveProgress(k, goals), 0) / kids.length,
  );
}

export function descendantIds(goals: Goal[], id: string): string[] {
  return childrenOf(goals, id).flatMap((k) => [
    k.id,
    ...descendantIds(goals, k.id),
  ]);
}
