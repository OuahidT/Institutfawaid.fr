import Link from 'next/link';

import { requireAdminUser } from '@/lib/auth/admin';
import { logoutAdminAction } from '@/lib/internal/admin-actions';

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdminUser();

  return (
    <div className="section-shell space-y-4 py-5 md:space-y-5 md:py-9">
      <div className="rounded-2xl border border-fawaid-border bg-white px-4 py-3 shadow-soft md:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-fawaid-accent2">Espace interne</p>
            <p className="font-heading text-lg font-semibold text-fawaid-text sm:text-xl">Administration Fawaid</p>
            <p className="break-all text-xs text-fawaid-muted sm:text-sm">{user.email}</p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <Link
              href="/admin"
              className="inline-flex w-full items-center justify-center rounded-full border border-fawaid-border bg-white px-4 py-2 text-sm font-semibold text-fawaid-accent transition hover:border-fawaid-accent sm:w-auto"
            >
              Dashboard
            </Link>
            <form action={logoutAdminAction}>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full border border-fawaid-border bg-white px-4 py-2 text-sm font-semibold text-fawaid-muted transition hover:border-fawaid-accent hover:text-fawaid-accent sm:w-auto"
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
