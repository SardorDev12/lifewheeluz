import { initialGoals, initialScores } from '../domain/seedData';
import type { DraftState, Profile } from '../types';

export const DRAFT_STORAGE_KEY = 'muvozanat-draft';

export function defaultProfile(): Profile {
  return { name: 'Aziz Karimov', email: 'aziz@example.uz', tier: 'free' };
}

export function defaultDraft(): DraftState {
  return {
    schemaVersion: 1,
    scores: initialScores,
    goals: initialGoals,
    reviews: [],
    locale: 'uz',
    profile: defaultProfile(),
  };
}

export function serializeDraft(state: DraftState): string {
  return JSON.stringify(state);
}

/**
 * Parses a stored draft, falling back field-by-field to defaults — mirrors
 * the `?? initialScores` / `?? initialGoals` / `?? []` merge the app has
 * always used, so old (even pre-schemaVersion) local data keeps loading.
 */
export function parseDraft(raw: string | null): DraftState {
  if (!raw) return defaultDraft();
  try {
    const parsed = JSON.parse(raw) as Partial<DraftState> & {
      profile?: Partial<Profile>;
    };
    const profile = parsed.profile
      ? { ...defaultProfile(), ...parsed.profile }
      : defaultProfile();
    return {
      schemaVersion: 1,
      scores: parsed.scores ?? initialScores,
      goals: parsed.goals ?? initialGoals,
      reviews: parsed.reviews ?? [],
      locale: parsed.locale ?? 'uz',
      profile,
    };
  } catch {
    return defaultDraft();
  }
}
