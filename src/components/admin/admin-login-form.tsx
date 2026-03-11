'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getSupabaseBrowserClient } from '@/lib/supabase/browser';

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        const normalized = error.message.toLowerCase();

        if (normalized.includes('email not confirmed')) {
          setErrorMessage('Compte non confirmé. Confirmez l’utilisateur dans Supabase Auth.');
          return;
        }

        if (normalized.includes('invalid login credentials')) {
          setErrorMessage('Connexion impossible. Vérifiez vos identifiants.');
          return;
        }

        setErrorMessage(`Connexion impossible: ${error.message}`);
        return;
      }

      router.replace('/admin');
      router.refresh();
    } catch (error) {
      console.error('Admin login unexpected error:', error);
      const detail = error instanceof Error ? error.message : 'Erreur inconnue';
      setErrorMessage(`Connexion indisponible: ${detail}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-fawaid-border bg-white p-6 shadow-soft">
      <h1 className="font-heading text-2xl font-semibold text-fawaid-text">Connexion admin</h1>
      <p className="mt-2 text-sm text-fawaid-muted">Accès interne réservé à l’administration.</p>

      <form className="mt-5 space-y-4" onSubmit={onSubmit} noValidate>
        <div>
          <label htmlFor="admin-email" className="mb-1 block text-sm font-medium text-fawaid-text">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            className="w-full rounded-xl border border-fawaid-border bg-white px-3.5 py-2.5 text-sm text-fawaid-text transition hover:border-fawaid-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fawaid-accent"
          />
        </div>

        <div>
          <label htmlFor="admin-password" className="mb-1 block text-sm font-medium text-fawaid-text">
            Mot de passe
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            className="w-full rounded-xl border border-fawaid-border bg-white px-3.5 py-2.5 text-sm text-fawaid-text transition hover:border-fawaid-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fawaid-accent"
          />
        </div>

        {errorMessage ? (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-full border border-fawaid-accent bg-fawaid-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#033E8F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fawaid-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-75"
        >
          {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
