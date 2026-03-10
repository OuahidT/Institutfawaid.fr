import 'server-only';

import { getSupabasePublishableKey, getSupabaseUrl } from '@/lib/supabase/env';

function requireSecretEnv(name: 'SUPABASE_SECRET_KEY') {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variable d'environnement manquante: ${name}`);
  }

  return value;
}

export function getServerSupabaseConfig() {
  return {
    url: getSupabaseUrl(),
    publishableKey: getSupabasePublishableKey(),
    secretKey: requireSecretEnv('SUPABASE_SECRET_KEY'),
  };
}
