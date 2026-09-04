import type { DataStore } from './persistence/store';
import type { Profile } from './types';

/**
 * One-time upgrade migration: copies whatever's currently in `localStore`
 * into `cloudStore`, flips the profile to `tier: 'pro'`, and persists that
 * choice in *both* stores — locally so the app remembers "this account is
 * Pro" even offline, in the cloud so it's the source of truth going
 * forward. Callers run this once, right after a Pro sign-in succeeds
 * (auth itself lives outside this package); the caller is then
 * responsible for switching the app's active store to `cloudStore`.
 */
export async function migrateLocalToCloud(
  localStore: DataStore,
  cloudStore: DataStore,
): Promise<Profile> {
  const draft = await localStore.load();
  await cloudStore.saveScores(draft.scores);
  await cloudStore.saveGoals(draft.goals);
  await cloudStore.saveReviews(draft.reviews);

  const proProfile: Profile = { ...draft.profile, tier: 'pro' };
  await cloudStore.saveProfile(proProfile);
  await cloudStore.saveLocale(draft.locale);
  await localStore.saveProfile(proProfile);

  return proProfile;
}
