import type { SupabaseClient } from '@supabase/supabase-js';

export type RequestMagicLinkResult = { error: string | null };

/**
 * Sends a passwordless sign-in email. `redirectTo` is the URL/deep-link
 * Supabase redirects back to once the user taps the link — web passes its
 * own origin, mobile passes its registered `app.json` scheme.
 */
export async function requestMagicLink(
  client: SupabaseClient,
  email: string,
  redirectTo?: string,
): Promise<RequestMagicLinkResult> {
  const { error } = await client.auth.signInWithOtp({
    email,
    options: redirectTo ? { emailRedirectTo: redirectTo } : undefined,
  });
  return { error: error?.message ?? null };
}

export async function signOut(client: SupabaseClient): Promise<void> {
  await client.auth.signOut();
}

export async function getCurrentUserId(
  client: SupabaseClient,
): Promise<string | null> {
  const { data } = await client.auth.getSession();
  return data.session?.user.id ?? null;
}

/**
 * Thin wrapper around Supabase's auth listener, normalized to just the
 * one thing callers actually need here: the signed-in user id, or null
 * once signed out. Returns an unsubscribe function.
 */
export function onAuthStateChange(
  client: SupabaseClient,
  callback: (userId: string | null) => void,
): () => void {
  const {
    data: { subscription },
  } = client.auth.onAuthStateChange((_event, session) => {
    callback(session?.user.id ?? null);
  });
  return () => subscription.unsubscribe();
}
