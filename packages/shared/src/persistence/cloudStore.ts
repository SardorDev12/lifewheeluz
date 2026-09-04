import type { SupabaseClient } from '@supabase/supabase-js';
import {
  fetchGoals,
  fetchProfile,
  fetchReviews,
  fetchWheelScores,
  saveGoals as saveGoalsQuery,
  saveLocale as saveLocaleQuery,
  saveProfile as saveProfileQuery,
  saveReviews as saveReviewsQuery,
  saveWheelScores,
} from '../api/queries';
import { initialGoals, initialScores } from '../domain/seedData';
import type { DataStore } from './store';

/**
 * Pro-tier store: reads/writes Supabase directly (no local caching layer
 * in Phase 1 — see the plan). Bound to one `userId`; the platform's
 * useDataStore() hook re-creates this whenever the signed-in user changes.
 */
export function createCloudStore(
  client: SupabaseClient,
  userId: string,
): DataStore {
  return {
    async load() {
      const [scores, goals, reviews, profileResult] = await Promise.all([
        fetchWheelScores(client, userId),
        fetchGoals(client, userId),
        fetchReviews(client, userId),
        fetchProfile(client, userId),
      ]);
      return {
        schemaVersion: 1,
        scores: scores ?? initialScores,
        goals: goals.length ? goals : initialGoals,
        reviews,
        locale: profileResult?.locale ?? 'uz',
        profile: profileResult?.profile ?? {
          name: 'Aziz Karimov',
          email: '',
          tier: 'pro',
        },
      };
    },
    saveScores: (scores) => saveWheelScores(client, userId, scores),
    saveGoals: (goals) => saveGoalsQuery(client, userId, goals),
    saveReviews: (reviews) => saveReviewsQuery(client, userId, reviews),
    saveProfile: (profile) => saveProfileQuery(client, userId, profile),
    saveLocale: (locale) => saveLocaleQuery(client, userId, locale),
  };
}
