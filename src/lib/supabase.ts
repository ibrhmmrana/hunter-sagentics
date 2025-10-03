/**
 * Supabase browser client configuration
 * Read-only access using anon key for client-side operations
 */

import { createClient } from '@supabase/supabase-js';
import { assertEnv } from '@/config/env';

const { url, anon } = assertEnv();

export const supabase = createClient(url, anon, {
  db: { schema: 'public' },
  auth: { persistSession: true, autoRefreshToken: true },
});
