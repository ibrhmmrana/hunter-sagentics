/**
 * Environment variable helpers for Vite-based configuration
 * Supports both VITE_ and NEXT_PUBLIC_ prefixes for backward compatibility
 */

export function getEnv(key?: string) {
  if (key) {
    return import.meta.env[key];
  }
  const url = import.meta.env.VITE_SUPABASE_URL ?? import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY ?? import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { url, anon };
}

export function assertEnv(): { url: string; anon: string } {
  const { url, anon } = getEnv();
  if (!url || !anon) {
    const msg = 'Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env';
    console.warn(msg);
    // Return placeholder values to prevent app crash
    return { 
      url: 'https://placeholder.supabase.co', 
      anon: 'placeholder-key' 
    };
  }
  return { url: url as string, anon: anon as string };
}

export const SITE_URL = (typeof window !== 'undefined' ? window.location.origin : getEnv('VITE_SITE_URL') || 'http://localhost:8080');

export function getWebhookUrl() {
  return getEnv('VITE_N8N_WEBHOOK') || 'https://n8n.intakt.co.za/webhook/maps-lead-gen';
}
