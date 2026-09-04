import type { DraftState, Goal, Locale, Profile, Review } from '../types';

/**
 * A place the app's data lives. `localStore` (device-only) and `cloudStore`
 * (Supabase-backed, Pro only) both implement this so screens never need to
 * know which one is active — `useDataStore()` on each platform picks based
 * on `profile.tier`.
 */
export interface DataStore {
  load(): Promise<DraftState>;
  saveScores(scores: number[]): Promise<void>;
  saveGoals(goals: Goal[]): Promise<void>;
  saveReviews(reviews: Review[]): Promise<void>;
  saveProfile(profile: Profile): Promise<void>;
  saveLocale(locale: Locale): Promise<void>;
}

/**
 * The minimal async key-value contract both `localStorage` (web) and
 * `AsyncStorage` (mobile) can satisfy. `localStorage` is synchronous, so
 * platform adapters just wrap its return value in a resolved promise.
 */
export interface StorageEngine {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}
