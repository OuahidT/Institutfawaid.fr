import Link from 'next/link';

import { requireAdminUser } from '@/lib/auth/admin';
import { logoutAdminAction } from '@/lib/internal/admin-actions';

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdminUser();

  return (
    <div className="section-shell space-y-5 py-6 md:py-9">
      <div className="rounded-2xl border border-fawaid-border bg-white px-4 py-3 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-fawaid-accent2">Espace interne</p>
            <p className="font-heading text-xl font-semibold text-fawaid-text">Administration Fawaid</p>
            <p className="text-sm text-fawaid-muted">{user.email}</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-full border border-fawaid-border bg-white px-4 py-2 text-sm font-semibold text-fawaid-accent transition hover:border-fawaid-accent"
            >
              Dashboard
            </Link>
            <form action={logoutAdminAction}>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full border border-fawaid-border bg-white px-4 py-2 text-sm font-semibold text-fawaid-muted transition hover:border-fawaid-accent hover:text-fawaid-accent"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
