import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { AdminLoginForm } from '@/components/admin/admin-login-form';
import { getAdminUser } from '@/lib/auth/admin';

export const metadata: Metadata = {
  title: 'Connexion admin | Institut Fawaid',
  description: 'Connexion à l’espace interne de gestion Institut Fawaid.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  const user = await getAdminUser();

  if (user) {
    redirect('/admin');
  }

  return (
    <div className="section-shell flex min-h-[calc(100svh-11rem)] items-center py-6 md:min-h-[calc(100svh-14rem)] md:py-12">
      <AdminLoginForm />
    </div>
  );
}
