import 'server-only';

import { redirect } from 'next/navigation';

import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function getAdminUser() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireAdminUser() {
  const user = await getAdminUser();

  if (!user) {
    redirect('/admin/login');
  }

  return user;
}
