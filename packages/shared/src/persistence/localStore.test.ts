import { describe, expect, it } from 'vitest';
import { defaultProfile } from './draft';
import { createLocalStore } from './localStore';
import type { StorageEngine } from './store';

function createMemoryEngine(): StorageEngine {
  const map = new Map<string, string>();
  return {
    async getItem(key) {
      return map.get(key) ?? null;
    },
    async setItem(key, value) {
      map.set(key, value);
    },
  };
}

describe('createLocalStore', () => {
  it('loads defaults when nothing has been saved yet', async () => {
    const store = createLocalStore(createMemoryEngine());
    const draft = await store.load();
    expect(draft.scores).toEqual([6, 7, 5, 8, 7, 6, 4, 7]);
    expect(draft.goals.length).toBeGreaterThan(0);
    expect(draft.profile.tier).toBe('free');
  });

  it('round-trips saveScores without disturbing other fields', async () => {
    const store = createLocalStore(createMemoryEngine());
    await store.saveProfile({ ...defaultProfile(), name: 'Test User' });
    await store.saveScores([1, 2, 3, 4, 5, 6, 7, 8]);

    const draft = await store.load();
    expect(draft.scores).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(draft.profile.name).toBe('Test User');
  });

  it('round-trips saveGoals and saveReviews independently', async () => {
    const store = createLocalStore(createMemoryEngine());
    const goals = [
      {
        id: 'g1',
        parentId: null,
        area: 0,
        title: 'Test goal',
        progress: 0,
        year: '2026',
        note: '',
      },
    ];
    const reviews = [
      {
        id: 'r1',
        date: 'Sep 2026',
        createdAt: new Date().toISOString(),
        win: 'Shipped',
        lesson: 'Learned',
        next: 'Next',
      },
    ];
    await store.saveGoals(goals);
    await store.saveReviews(reviews);

    const draft = await store.load();
    expect(draft.goals).toEqual(goals);
    expect(draft.reviews).toEqual(reviews);
  });

  it('round-trips saveLocale', async () => {
    const store = createLocalStore(createMemoryEngine());
    await store.saveLocale('ru');
    const draft = await store.load();
    expect(draft.locale).toBe('ru');
  });

  it('two independent stores over the same engine see each others writes', async () => {
    const engine = createMemoryEngine();
    const storeA = createLocalStore(engine);
    const storeB = createLocalStore(engine);
    await storeA.saveScores([9, 9, 9, 9, 9, 9, 9, 9]);
    const draft = await storeB.load();
    expect(draft.scores).toEqual([9, 9, 9, 9, 9, 9, 9, 9]);
  });
});
