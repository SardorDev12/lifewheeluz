import { DRAFT_STORAGE_KEY, parseDraft, serializeDraft } from './draft';
import type { DataStore, StorageEngine } from './store';

/**
 * Free-tier (and offline-fallback) store: everything lives in one blob
 * under `DRAFT_STORAGE_KEY` on whatever `StorageEngine` the platform
 * injects (`localStorage` on web, `AsyncStorage` on mobile). Each save
 * does a read-modify-write of that blob since the underlying storage has
 * no concept of partial updates.
 */
export function createLocalStore(engine: StorageEngine): DataStore {
  async function load() {
    return parseDraft(await engine.getItem(DRAFT_STORAGE_KEY));
  }
  async function persist(next: Awaited<ReturnType<typeof load>>) {
    await engine.setItem(DRAFT_STORAGE_KEY, serializeDraft(next));
  }
  return {
    load,
    async saveScores(scores) {
      await persist({ ...(await load()), scores });
    },
    async saveGoals(goals) {
      await persist({ ...(await load()), goals });
    },
    async saveReviews(reviews) {
      await persist({ ...(await load()), reviews });
    },
    async saveProfile(profile) {
      await persist({ ...(await load()), profile });
    },
  };
}
