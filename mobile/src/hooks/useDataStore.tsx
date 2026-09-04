import {
  createCloudStore,
  createLocalStore,
  getCurrentUserId,
  migrateLocalToCloud,
  onAuthStateChange,
  requestMagicLink as requestMagicLinkQuery,
  signOut as signOutQuery,
  type DataStore,
  type Goal,
  type Locale,
  type Profile,
  type Review,
} from '@lifewheeluz/shared';
import * as Linking from 'expo-linking';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useAuthDeepLink } from './useAuthDeepLink';
import { getMobileSupabaseClient } from '../lib/supabaseClient';
import { mobileStorageEngine } from '../lib/storageEngine';

type UpgradeStatus = 'idle' | 'sending' | 'sent' | 'error';

type DraftContextValue = {
  hydrated: boolean;
  scores: number[];
  goals: Goal[];
  reviews: Review[];
  locale: Locale;
  profile: Profile;
  setScores: (scores: number[]) => void;
  setGoals: (goals: Goal[]) => void;
  setReviews: (reviews: Review[]) => void;
  setLocale: (locale: Locale) => void;
  setProfile: (profile: Profile) => void;
  hasSupabase: boolean;
  upgradeStatus: UpgradeStatus;
  requestUpgrade: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const DraftContext = createContext<DraftContextValue | null>(null);

export function DraftProvider({ children }: { children: ReactNode }) {
  const [scores, setScores] = useState<number[]>([]),
    [goals, setGoals] = useState<Goal[]>([]),
    [reviews, setReviews] = useState<Review[]>([]),
    [locale, setLocale] = useState<Locale>('uz'),
    [profile, setProfile] = useState<Profile>({
      name: 'Aziz Karimov',
      email: 'aziz@example.uz',
      tier: 'free',
    }),
    [userId, setUserId] = useState<string | null>(null),
    [upgradeStatus, setUpgradeStatus] = useState<UpgradeStatus>('idle'),
    [hydrated, setHydrated] = useState(false);

  const supabase = useMemo(() => getMobileSupabaseClient(), []);
  const localStore = useMemo(() => createLocalStore(mobileStorageEngine), []);
  const activeStore: DataStore = useMemo(
    () =>
      supabase && userId && profile.tier === 'pro'
        ? createCloudStore(supabase, userId)
        : localStore,
    [supabase, userId, profile.tier, localStore],
  );

  useAuthDeepLink(supabase);

  // Hydrate from the device first — instant, always available offline.
  useEffect(() => {
    let cancelled = false;
    localStore
      .load()
      .then((draft) => {
        if (cancelled) return;
        setScores(draft.scores);
        setGoals(draft.goals);
        setReviews(draft.reviews);
        setLocale(draft.locale);
        setProfile(draft.profile);
        setHydrated(true);
      })
      .catch((err: unknown) =>
        console.error('Failed to load local draft', err),
      );
    return () => {
      cancelled = true;
    };
  }, [localStore]);

  // Track the signed-in user, if any.
  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    getCurrentUserId(supabase)
      .then((id) => {
        if (!cancelled) setUserId(id);
      })
      .catch((err: unknown) => console.error('Failed to read session', err));
    const unsubscribe = onAuthStateChange(supabase, (id) => setUserId(id));
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [supabase]);

  // Already Pro + a session resolved: the cloud is the source of truth.
  useEffect(() => {
    if (!hydrated || !supabase || !userId || profile.tier !== 'pro') return;
    let cancelled = false;
    createCloudStore(supabase, userId)
      .load()
      .then((draft) => {
        if (cancelled) return;
        setScores(draft.scores);
        setGoals(draft.goals);
        setReviews(draft.reviews);
        setLocale(draft.locale);
        setProfile(draft.profile);
      })
      .catch((err: unknown) =>
        console.error('Failed to load cloud draft', err),
      );
    return () => {
      cancelled = true;
    };
  }, [hydrated, supabase, userId, profile.tier]);

  // A session just appeared on a still-free device: this is the upgrade.
  useEffect(() => {
    if (!hydrated || !supabase || !userId || profile.tier === 'pro') return;
    let cancelled = false;
    migrateLocalToCloud(localStore, createCloudStore(supabase, userId))
      .then((proProfile) => {
        if (cancelled) return;
        setProfile(proProfile);
        setUpgradeStatus('idle');
      })
      .catch((err: unknown) => {
        console.error('Failed to migrate to Pro', err);
        if (!cancelled) setUpgradeStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [hydrated, supabase, userId, profile.tier, localStore]);

  useEffect(() => {
    if (!hydrated) return;
    activeStore
      .saveScores(scores)
      .catch((err: unknown) => console.error('Failed to save scores', err));
  }, [hydrated, scores, activeStore]);
  useEffect(() => {
    if (!hydrated) return;
    activeStore
      .saveGoals(goals)
      .catch((err: unknown) => console.error('Failed to save goals', err));
  }, [hydrated, goals, activeStore]);
  useEffect(() => {
    if (!hydrated) return;
    activeStore
      .saveReviews(reviews)
      .catch((err: unknown) => console.error('Failed to save reviews', err));
  }, [hydrated, reviews, activeStore]);
  useEffect(() => {
    if (!hydrated) return;
    activeStore
      .saveProfile(profile)
      .catch((err: unknown) => console.error('Failed to save profile', err));
  }, [hydrated, profile, activeStore]);
  useEffect(() => {
    if (!hydrated) return;
    activeStore
      .saveLocale(locale)
      .catch((err: unknown) => console.error('Failed to save locale', err));
  }, [hydrated, locale, activeStore]);

  async function requestUpgrade(email: string) {
    if (!supabase) return;
    setUpgradeStatus('sending');
    const redirectTo = Linking.createURL('auth-callback'),
      { error } = await requestMagicLinkQuery(supabase, email, redirectTo);
    setUpgradeStatus(error ? 'error' : 'sent');
  }

  async function signOut() {
    if (!supabase) return;
    const freeProfile: Profile = { ...profile, tier: 'free' };
    await Promise.all([
      localStore.saveScores(scores),
      localStore.saveGoals(goals),
      localStore.saveReviews(reviews),
      localStore.saveLocale(locale),
      localStore.saveProfile(freeProfile),
    ]);
    await signOutQuery(supabase);
    setUserId(null);
    setProfile(freeProfile);
    setUpgradeStatus('idle');
  }

  const value: DraftContextValue = {
    hydrated,
    scores,
    goals,
    reviews,
    locale,
    profile,
    setScores,
    setGoals,
    setReviews,
    setLocale,
    setProfile,
    hasSupabase: !!supabase,
    upgradeStatus,
    requestUpgrade,
    signOut,
  };
  return (
    <DraftContext.Provider value={value}>{children}</DraftContext.Provider>
  );
}

export function useDraft(): DraftContextValue {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error('useDraft must be used within a DraftProvider');
  return ctx;
}
