import type { SupabaseClient } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { useEffect } from 'react';

/**
 * Completes the magic-link PKCE flow when the app is opened via its
 * registered deep link (app.json's "scheme" + "auth-callback", matching
 * the emailRedirectTo passed to requestMagicLink). Once
 * exchangeCodeForSession resolves, onAuthStateChange picks up the new
 * session on its own — this hook doesn't need to touch React state.
 */
export function useAuthDeepLink(supabase: SupabaseClient | null) {
  useEffect(() => {
    if (!supabase) return;
    const handleUrl = (url: string) => {
      if (!url.includes('auth-callback')) return;
      supabase.auth
        .exchangeCodeForSession(url)
        .catch((err: unknown) => console.error('Failed to sign in', err));
    };
    Linking.getInitialURL()
      .then((url) => {
        if (url) handleUrl(url);
      })
      .catch((err: unknown) =>
        console.error('Failed to read initial URL', err),
      );
    const subscription = Linking.addEventListener('url', ({ url }) =>
      handleUrl(url),
    );
    return () => subscription.remove();
  }, [supabase]);
}
