'use client';

import { MessageCircle, Send } from 'lucide-react';
import { FormEvent, useState } from 'react';

import { siteConfig } from '@/config/site';
import {
  CONTACT_FORMULA_OPTIONS,
  CONTACT_LEVEL_OPTIONS,
  ContactFormErrors,
  ContactFormPayload,
  normalizeContactPayload,
  validateContactPayload,
} from '@/lib/contact';

type SubmitState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

type ContactApiResponse = {
  success: boolean;
  message?: string;
  errors?: ContactFormErrors;
};

const initialValues: ContactFormPayload = {
  fullName: '',
  email: '',
  phone: '',
  level: '',
  objective: '',
  formula: '',
  message: '',
};

export function ContactForm() {
  const [values, setValues] = useState<ContactFormPayload>(initialValues);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasErrors = Object.keys(errors).length > 0;

  const handleFieldChange = (field: keyof ContactFormPayload, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }

    if (submitState.status !== 'idle') {
      setSubmitState({ status: 'idle' });
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedValues = normalizeContactPayload(values);
    const nextErrors = validateContactPayload(normalizedValues);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitState({ status: 'idle' });
      return;
    }

    setIsSubmitting(true);
    setSubmitState({ status: 'idle' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(normalizedValues),
      });

      const result = (await response.json().catch(() => null)) as ContactApiResponse | null;

      if (!response.ok || !result?.success) {
        if (result?.errors) {
          setErrors(result.errors);
        }

        setSubmitState({
          status: 'error',
          message: result?.message ?? 'Une erreur est survenue. Veuillez réessayer dans quelques instants.',
        });
        return;
      }

      setValues(initialValues);
      setErrors({});
      setSubmitState({
        status: 'success',
        message: result.message ?? 'Votre message a bien été envoyé. Nous vous répondrons rapidement.',
      });
    } catch {
      setSubmitState({
        status: 'error',
        message: 'Envoi impossible pour le moment. Veuillez réessayer ou nous contacter via WhatsApp.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-fawaid-border bg-white px-3.5 py-2.5 text-sm text-fawaid-text placeholder:text-fawaid-muted/60 transition hover:border-fawaid-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fawaid-accent disabled:cursor-not-allowed disabled:opacity-70';

  return (
    <div className="rounded-3xl border border-fawaid-border bg-white p-5 shadow-soft md:p-6">
      <form className="space-y-3.5" onSubmit={onSubmit} noValidate>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-fawaid-text">
              Prénom et nom
            </label>
            <input
              id="fullName"
              name="fullName"
              value={values.fullName}
              onChange={(event) => handleFieldChange('fullName', event.target.value)}
              className={inputClass}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              disabled={isSubmitting}
              autoComplete="name"
            />
            {errors.fullName ? (
              <p id="fullName-error" className="mt-1 text-xs text-red-600">
                {errors.fullName}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-fawaid-text">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={values.email}
              onChange={(event) => handleFieldChange('email', event.target.value)}
              className={inputClass}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              disabled={isSubmitting}
              autoComplete="email"
            />
            {errors.email ? (
              <p id="email-error" className="mt-1 text-xs text-red-600">
                {errors.email}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium text-fawaid-text">
              Téléphone / WhatsApp
            </label>
            <input
              id="phone"
              name="phone"
              value={values.phone}
              onChange={(event) => handleFieldChange('phone', event.target.value)}
              className={inputClass}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              disabled={isSubmitting}
              autoComplete="tel"
            />
            {errors.phone ? (
              <p id="phone-error" className="mt-1 text-xs text-red-600">
                {errors.phone}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="level" className="mb-1 block text-sm font-medium text-fawaid-text">
              Niveau actuel
            </label>
            <select
              id="level"
              name="level"
              value={values.level}
              onChange={(event) => handleFieldChange('level', event.target.value)}
              className={inputClass}
              aria-invalid={Boolean(errors.level)}
              aria-describedby={errors.level ? 'level-error' : undefined}
              disabled={isSubmitting}
            >
              <option value="">Sélectionner</option>
              {CONTACT_LEVEL_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.level ? (
              <p id="level-error" className="mt-1 text-xs text-red-600">
                {errors.level}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="objective" className="mb-1 block text-sm font-medium text-fawaid-text">
              Objectif
            </label>
            <input
              id="objective"
              name="objective"
              value={values.objective}
              onChange={(event) => handleFieldChange('objective', event.target.value)}
              className={inputClass}
              aria-invalid={Boolean(errors.objective)}
              aria-describedby={errors.objective ? 'objective-error' : undefined}
              disabled={isSubmitting}
            />
            {errors.objective ? (
              <p id="objective-error" className="mt-1 text-xs text-red-600">
                {errors.objective}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="formula" className="mb-1 block text-sm font-medium text-fawaid-text">
              Formule souhaitée
            </label>
            <select
              id="formula"
              name="formula"
              value={values.formula}
              onChange={(event) => handleFieldChange('formula', event.target.value)}
              className={inputClass}
              aria-invalid={Boolean(errors.formula)}
              aria-describedby={errors.formula ? 'formula-error' : undefined}
              disabled={isSubmitting}
            >
              <option value="">Sélectionner</option>
              {CONTACT_FORMULA_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.formula ? (
              <p id="formula-error" className="mt-1 text-xs text-red-600">
                {errors.formula}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="message" className="mb-1 block text-sm font-medium text-fawaid-text">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={values.message}
            onChange={(event) => handleFieldChange('message', event.target.value)}
            className={inputClass}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
            disabled={isSubmitting}
          />
          {errors.message ? (
            <p id="message-error" className="mt-1 text-xs text-red-600">
              {errors.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-fawaid-accent bg-fawaid-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#033E8F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fawaid-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-80 sm:w-auto"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
          </button>
          <a
            href={siteConfig.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-fawaid-border bg-white px-5 py-2.5 text-sm font-semibold text-fawaid-accent transition hover:border-fawaid-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fawaid-accent focus-visible:ring-offset-2 sm:w-auto"
          >
            <MessageCircle className="h-4 w-4" />
            Parler sur WhatsApp
          </a>
        </div>

        {hasErrors ? (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Merci de corriger les champs signalés avant de continuer.
          </p>
        ) : null}

        {submitState.status === 'success' ? (
          <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {submitState.message}
          </p>
        ) : null}

        {submitState.status === 'error' ? (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitState.message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
