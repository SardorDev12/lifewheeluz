import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;
let attempted = false;

/**
 * Returns null when Supabase isn't configured (no EXPO_PUBLIC_SUPABASE_*
 * env vars) — the free tier never needs this. Mirrors web's
 * createBrowserSupabaseClient() in lib/supabase/client.ts, but with the
 * mobile-specific auth options: AsyncStorage for session persistence,
 * and detectSessionInUrl off since there's no browser URL to inspect —
 * the magic-link callback instead comes in via the app's registered
 * deep-link scheme (see app.json's "scheme" and useAuthDeepLink).
 */
export function getMobileSupabaseClient(): SupabaseClient | null {
  if (attempted) return client;
  attempted = true;
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL,
    anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  client = createClient(url, anonKey, {
    auth: {
      storage: AsyncStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
  return client;
}
