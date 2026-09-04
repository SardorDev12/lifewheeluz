import type { SupabaseClient } from '@supabase/supabase-js';
import type { Goal, Locale, Profile, Review, Tier } from '../types';

function unwrap<T>(result: { data: T; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  return result.data;
}

/**
 * Ids present in `existingIds` but not `incomingIds` — what a
 * replace-the-whole-set save (saveGoals/saveReviews) needs to delete.
 * Pulled out on its own since it's the one piece of real logic in this
 * file that doesn't require a network call to test.
 */
export function idsToDelete(
  existingIds: Iterable<string>,
  incomingIds: Iterable<string>,
): string[] {
  const incoming = new Set(incomingIds);
  return [...new Set(existingIds)].filter((id) => !incoming.has(id));
}

// --- wheel_scores ---------------------------------------------------

export async function fetchWheelScores(
  client: SupabaseClient,
  userId: string,
): Promise<number[] | null> {
  const { data, error } = await client
    .from('wheel_scores')
    .select('scores')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data?.scores as number[] | undefined) ?? null;
}

export async function saveWheelScores(
  client: SupabaseClient,
  userId: string,
  scores: number[],
): Promise<void> {
  unwrap(
    await client
      .from('wheel_scores')
      .upsert({ user_id: userId, scores }, { onConflict: 'user_id' }),
  );
}

// --- goals ------------------------------------------------------------

type GoalRow = {
  id: string;
  parent_id: string | null;
  area: number;
  title: string;
  progress: number;
  year: string;
  note: string;
};

export function rowToGoal(row: GoalRow): Goal {
  return {
    id: row.id,
    parentId: row.parent_id,
    area: row.area,
    title: row.title,
    progress: row.progress,
    year: row.year,
    note: row.note,
  };
}

export function goalToRow(goal: Goal, userId: string) {
  return {
    id: goal.id,
    user_id: userId,
    parent_id: goal.parentId,
    area: goal.area,
    title: goal.title,
    progress: goal.progress,
    year: goal.year,
    note: goal.note,
  };
}

export async function fetchGoals(
  client: SupabaseClient,
  userId: string,
): Promise<Goal[]> {
  const { data, error } = await client
    .from('goals')
    .select('id, parent_id, area, title, progress, year, note')
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToGoal);
}

/**
 * Replaces the full goal set for `userId` to match `goals`, mirroring how
 * the app always hands over the whole array on every edit: upserts
 * everything present, deletes whatever's no longer there. A single call
 * covers create, edit, and delete (including cascade-deleted descendants
 * the caller already dropped from the array).
 */
export async function saveGoals(
  client: SupabaseClient,
  userId: string,
  goals: Goal[],
): Promise<void> {
  const { data: existing, error: fetchError } = await client
    .from('goals')
    .select('id')
    .eq('user_id', userId);
  if (fetchError) throw new Error(fetchError.message);

  const toDelete = idsToDelete(
    (existing ?? []).map((r: { id: string }) => r.id),
    goals.map((g) => g.id),
  );

  if (goals.length) {
    unwrap(
      await client.from('goals').upsert(
        goals.map((g) => goalToRow(g, userId)),
        { onConflict: 'id' },
      ),
    );
  }
  if (toDelete.length) {
    unwrap(await client.from('goals').delete().in('id', toDelete));
  }
}

// --- reviews ------------------------------------------------------------

type ReviewRow = {
  id: string;
  date: string;
  win: string;
  lesson: string;
  next: string;
  created_at: string;
};

export function rowToReview(row: ReviewRow): Review {
  return {
    id: row.id,
    date: row.date,
    createdAt: row.created_at,
    win: row.win,
    lesson: row.lesson,
    next: row.next,
  };
}

export function reviewToRow(review: Review, userId: string) {
  return {
    id: review.id,
    user_id: userId,
    date: review.date,
    win: review.win,
    lesson: review.lesson,
    next: review.next,
    created_at: review.createdAt,
  };
}

export async function fetchReviews(
  client: SupabaseClient,
  userId: string,
): Promise<Review[]> {
  const { data, error } = await client
    .from('reviews')
    .select('id, date, win, lesson, next, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToReview);
}

/** Same upsert-present/delete-missing approach as saveGoals. */
export async function saveReviews(
  client: SupabaseClient,
  userId: string,
  reviews: Review[],
): Promise<void> {
  const { data: existing, error: fetchError } = await client
    .from('reviews')
    .select('id')
    .eq('user_id', userId);
  if (fetchError) throw new Error(fetchError.message);

  const toDelete = idsToDelete(
    (existing ?? []).map((r: { id: string }) => r.id),
    reviews.map((r) => r.id),
  );

  if (reviews.length) {
    unwrap(
      await client.from('reviews').upsert(
        reviews.map((r) => reviewToRow(r, userId)),
        {
          onConflict: 'id',
        },
      ),
    );
  }
  if (toDelete.length) {
    unwrap(await client.from('reviews').delete().in('id', toDelete));
  }
}

// --- profiles ------------------------------------------------------------

type ProfileRow = {
  name: string;
  email: string;
  tier: string;
  locale: string;
};

export async function fetchProfile(
  client: SupabaseClient,
  userId: string,
): Promise<{ profile: Profile; locale: Locale } | null> {
  const { data, error } = await client
    .from('profiles')
    .select('name, email, tier, locale')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const row = data as ProfileRow;
  return {
    profile: { name: row.name, email: row.email, tier: row.tier as Tier },
    locale: row.locale as Locale,
  };
}

/**
 * Upserts name/email/tier only — deliberately omits `locale` so this
 * never clobbers it; use saveLocale for that. On first call (no row yet,
 * e.g. during migrateLocalToCloud) this is what creates the profile row,
 * with locale falling back to the column's default until saveLocale runs.
 */
export async function saveProfile(
  client: SupabaseClient,
  userId: string,
  profile: Profile,
): Promise<void> {
  unwrap(
    await client.from('profiles').upsert(
      {
        id: userId,
        name: profile.name,
        email: profile.email,
        tier: profile.tier,
      },
      { onConflict: 'id' },
    ),
  );
}

/**
 * Updates (not upserts) — assumes the profile row already exists, which
 * holds for the whole time a user is on the cloud store (that row is what
 * "being Pro" means here). Call saveProfile first if that's ever not true.
 */
export async function saveLocale(
  client: SupabaseClient,
  userId: string,
  locale: Locale,
): Promise<void> {
  unwrap(await client.from('profiles').update({ locale }).eq('id', userId));
}
