/**
 * Supabase Client Configuration for PooKar Production
 */

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://pbyecrxvauafejxxygaz.supabase.co";

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBieWVjcnh2YXVhZmVqeHh5Z2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNjA4NzksImV4cCI6MjEwNDYzNjg3OX0.8L3ECxlejSrjYFxvxRzCFENQKRx4I-Om5EY5dsJocYk";

/**
 * Initiates Supabase Google OAuth Redirect flow with forced account selection
 */
export function signInWithSupabaseGoogle() {
  const redirectUri = `${window.location.origin}/auth/callback`;
  const oauthUrl = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(
    redirectUri
  )}&prompt=select_account&access_type=offline`;

  window.location.href = oauthUrl;
}
