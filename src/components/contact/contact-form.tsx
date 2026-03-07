'use client';

import { MessageCircle, Send } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';

import { siteConfig } from '@/config/site';

type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  level: string;
  objective: string;
  formula: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  fullName: '',
  email: '',
  phone: '',
  level: '',
  objective: '',
  formula: '',
  message: '',
};

const levelOptions = ['Débutant', 'Intermédiaire', 'Avancé', 'Je ne sais pas encore'];
const formulaOptions = ['Solo', 'Duo', 'Groupe +3', 'Je souhaite être orienté'];

function isEmailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [attempted, setAttempted] = useState(false);

  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  const validate = (currentValues: FormValues) => {
    const nextErrors: FormErrors = {};

    if (!currentValues.fullName.trim()) nextErrors.fullName = 'Veuillez renseigner votre prénom et nom.';
    if (!isEmailValid(currentValues.email)) nextErrors.email = 'Veuillez saisir un email valide.';
    if (!currentValues.phone.trim()) nextErrors.phone = 'Veuillez renseigner un numéro de téléphone ou WhatsApp.';
    if (!currentValues.level) nextErrors.level = 'Veuillez indiquer votre niveau actuel.';
    if (!currentValues.objective.trim()) nextErrors.objective = 'Veuillez préciser votre objectif.';
    if (!currentValues.formula) nextErrors.formula = 'Veuillez choisir une formule souhaitée.';
    if (!currentValues.message.trim()) nextErrors.message = 'Veuillez saisir votre message.';

    return nextErrors;
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setAttempted(false);
      return;
    }

    const subject = `Demande d'orientation - ${values.fullName}`;
    const bodyLines = [
      `Prénom et nom : ${values.fullName}`,
      `Email : ${values.email}`,
      `Téléphone / WhatsApp : ${values.phone}`,
      `Niveau actuel : ${values.level}`,
      `Objectif : ${values.objective}`,
      `Formule souhaitée : ${values.formula}`,
      '',
      'Message :',
      values.message,
    ];

    const mailto = `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      bodyLines.join('\n')
    )}`;

    setAttempted(true);
    window.location.href = mailto;
  };

  const inputClass =
    'w-full rounded-xl border border-fawaid-border bg-white px-3.5 py-2.5 text-sm text-fawaid-text placeholder:text-fawaid-muted/60 transition hover:border-fawaid-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fawaid-accent';

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
              onChange={(event) => setValues((prev) => ({ ...prev, fullName: event.target.value }))}
              className={inputClass}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
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
              onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
              className={inputClass}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
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
              onChange={(event) => setValues((prev) => ({ ...prev, phone: event.target.value }))}
              className={inputClass}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
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
              onChange={(event) => setValues((prev) => ({ ...prev, level: event.target.value }))}
              className={inputClass}
              aria-invalid={Boolean(errors.level)}
              aria-describedby={errors.level ? 'level-error' : undefined}
            >
              <option value="">Sélectionner</option>
              {levelOptions.map((option) => (
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
              onChange={(event) => setValues((prev) => ({ ...prev, objective: event.target.value }))}
              className={inputClass}
              aria-invalid={Boolean(errors.objective)}
              aria-describedby={errors.objective ? 'objective-error' : undefined}
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
              onChange={(event) => setValues((prev) => ({ ...prev, formula: event.target.value }))}
              className={inputClass}
              aria-invalid={Boolean(errors.formula)}
              aria-describedby={errors.formula ? 'formula-error' : undefined}
            >
              <option value="">Sélectionner</option>
              {formulaOptions.map((option) => (
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
            onChange={(event) => setValues((prev) => ({ ...prev, message: event.target.value }))}
            className={inputClass}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
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
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-fawaid-accent bg-fawaid-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#033E8F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fawaid-accent focus-visible:ring-offset-2 sm:w-auto"
          >
            <Send className="h-4 w-4" />
            Préparer l’email
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
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Merci de corriger les champs signalés avant de continuer.
          </p>
        ) : null}

        {attempted ? (
          <p className="rounded-xl border border-fawaid-border bg-fawaid-surface px-4 py-3 text-sm text-fawaid-muted">
            Votre application email devrait s’ouvrir avec un message prérempli. Si rien ne s’ouvre, copiez les
            informations et contactez-nous directement via WhatsApp.
          </p>
        ) : null}
      </form>
    </div>
  );
}
