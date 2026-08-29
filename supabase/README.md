# Supabase setup

1. Create a Supabase project in the production region closest to the target users.
2. Run `schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env.local` and add the project URL and keys.
4. Enable email authentication and configure the production Site URL plus callback URLs.
5. Keep the service role key server-only. Never expose it through a `NEXT_PUBLIC_` variable.

The private `user-files` bucket stores objects under `{user_id}/...`; storage policies prevent access across users.
