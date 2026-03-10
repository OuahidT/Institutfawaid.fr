function requirePublicEnv(name: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variable d'environnement manquante: ${name}`);
  }

  return value;
}

export function getSupabaseUrl() {
  return requirePublicEnv('NEXT_PUBLIC_SUPABASE_URL');
}

export function getSupabasePublishableKey() {
  return requirePublicEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
}
