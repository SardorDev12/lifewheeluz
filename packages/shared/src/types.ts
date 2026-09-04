export type Locale = 'uz' | 'en' | 'ru';

export type View = 'today' | 'life' | 'goals' | 'reviews' | 'settings';

// String (uuid) ids, not sequential numbers: goals/reviews created on the
// free tier still get a real crypto.randomUUID() so the id format is
// identical to Supabase's `uuid` primary keys, and migrateLocalToCloud
// (entitlement.ts) never needs to remap ids when upgrading to Pro.
export type Goal = {
  id: string;
  parentId: string | null;
  area: number;
  title: string;
  progress: number;
  year: string;
  note: string;
};

export type Review = {
  id: string;
  date: string;
  createdAt: string;
  win: string;
  lesson: string;
  next: string;
};

export type Tier = 'free' | 'pro';

export type Profile = {
  name: string;
  email: string;
  tier: Tier;
};

export type DraftState = {
  schemaVersion: 1;
  scores: number[];
  goals: Goal[];
  reviews: Review[];
  locale: Locale;
  profile: Profile;
};
