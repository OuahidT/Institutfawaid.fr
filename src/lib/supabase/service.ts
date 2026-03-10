import 'server-only';

import { createClient } from '@supabase/supabase-js';

import type { Database } from '@/lib/supabase/database.types';
import { getServerSupabaseConfig } from '@/lib/supabase/server-env';

let serviceClient: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseServiceClient() {
  if (!serviceClient) {
    const { url, secretKey } = getServerSupabaseConfig();

    serviceClient = createClient<Database>(url, secretKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return serviceClient;
}
