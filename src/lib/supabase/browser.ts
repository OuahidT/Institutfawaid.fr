'use client';

import { createBrowserClient } from '@supabase/ssr';

import type { Database } from '@/lib/supabase/database.types';
import { getSupabasePublishableKey, getSupabaseUrl } from '@/lib/supabase/env';

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createBrowserClient<Database>(getSupabaseUrl(), getSupabasePublishableKey());
  }

  return browserClient;
}
