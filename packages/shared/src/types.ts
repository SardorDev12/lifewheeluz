export type Locale = 'uz' | 'en' | 'ru';

export type View = 'today' | 'life' | 'goals' | 'reviews' | 'settings';

export type Goal = {
  id: number;
  parentId: number | null;
  area: number;
  title: string;
  progress: number;
  year: string;
  note: string;
};

export type Review = {
  id: number;
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
