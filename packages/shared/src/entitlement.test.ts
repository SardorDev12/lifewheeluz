import { describe, expect, it } from 'vitest';
import { migrateLocalToCloud } from './entitlement';
import { defaultDraft } from './persistence/draft';
import { createLocalStore } from './persistence/localStore';
import type { DataStore, StorageEngine } from './persistence/store';
import type { DraftState, Goal, Profile, Review } from './types';

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

/** A trivial in-memory DataStore standing in for cloudStore in tests. */
function createMockCloudStore() {
  let draft: DraftState = defaultDraft();
  const calls: string[] = [];
  const store: DataStore = {
    async load() {
      return draft;
    },
    async saveScores(scores) {
      calls.push('saveScores');
      draft = { ...draft, scores };
    },
    async saveGoals(goals: Goal[]) {
      calls.push('saveGoals');
      draft = { ...draft, goals };
    },
    async saveReviews(reviews: Review[]) {
      calls.push('saveReviews');
      draft = { ...draft, reviews };
    },
    async saveProfile(profile: Profile) {
      calls.push('saveProfile');
      draft = { ...draft, profile };
    },
  };
  return { store, calls, getDraft: () => draft };
}

describe('migrateLocalToCloud', () => {
  it('copies local scores, goals, and reviews into the cloud store', async () => {
    const localStore = createLocalStore(createMemoryEngine());
    const goals: Goal[] = [
      {
        id: 1,
        parentId: null,
        area: 2,
        title: 'Migrated goal',
        progress: 50,
        year: '2027',
        note: '',
      },
    ];
    const reviews: Review[] = [
      {
        id: 1,
        date: 'Aug 2026',
        createdAt: new Date().toISOString(),
        win: 'Win',
        lesson: 'Lesson',
        next: 'Next',
      },
    ];
    await localStore.saveScores([1, 2, 3, 4, 5, 6, 7, 8]);
    await localStore.saveGoals(goals);
    await localStore.saveReviews(reviews);

    const { store: cloudStore, getDraft } = createMockCloudStore();
    await migrateLocalToCloud(localStore, cloudStore);

    const migrated = getDraft();
    expect(migrated.scores).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(migrated.goals).toEqual(goals);
    expect(migrated.reviews).toEqual(reviews);
  });

  it('flips the profile tier to pro in both the cloud and local store', async () => {
    const localStore = createLocalStore(createMemoryEngine());
    const { store: cloudStore, getDraft } = createMockCloudStore();

    const result = await migrateLocalToCloud(localStore, cloudStore);

    expect(result.tier).toBe('pro');
    expect(getDraft().profile.tier).toBe('pro');
    expect((await localStore.load()).profile.tier).toBe('pro');
  });

  it('preserves the rest of the profile (name, email) across the upgrade', async () => {
    const localStore = createLocalStore(createMemoryEngine());
    await localStore.saveProfile({
      name: 'Aziz K.',
      email: 'aziz@upgraded.uz',
      tier: 'free',
    });
    const { store: cloudStore, getDraft } = createMockCloudStore();

    await migrateLocalToCloud(localStore, cloudStore);

    expect(getDraft().profile).toEqual({
      name: 'Aziz K.',
      email: 'aziz@upgraded.uz',
      tier: 'pro',
    });
  });

  it('writes each field exactly once (no redundant round-trips)', async () => {
    const localStore = createLocalStore(createMemoryEngine());
    const { store: cloudStore, calls } = createMockCloudStore();

    await migrateLocalToCloud(localStore, cloudStore);

    expect(calls).toEqual([
      'saveScores',
      'saveGoals',
      'saveReviews',
      'saveProfile',
    ]);
  });
});
