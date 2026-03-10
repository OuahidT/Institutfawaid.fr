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
    <div className="section-shell py-8 md:py-12">
      <AdminLoginForm />
    </div>
  );
}
