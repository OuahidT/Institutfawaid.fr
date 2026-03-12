'use client';

import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import {
  createDefaultAvailabilities,
  REGISTRATION_AVAILABILITY_SLOTS,
  REGISTRATION_COURSE_TYPE_OPTIONS,
  REGISTRATION_DAY_KEYS,
  REGISTRATION_DAY_LABELS,
  REGISTRATION_HOURS_OPTIONS,
  REGISTRATION_LEVEL_OPTIONS,
  REGISTRATION_PAYMENT_OPTIONS,
  REGISTRATION_SLOT_LABELS,
  type RegistrationAvailabilities,
  type RegistrationAvailabilitySlot,
  type RegistrationDayKey,
} from '@/lib/registration/constants';

type RegistrationFormState = {
  email: string;
  fullName: string;
  gender: string;
  age: string;
  whatsappNumber: string;
  arabicLevel: string;
  courseType: string;
  hoursPerWeek: string;
  paymentMethod: string;
  discoverySource: string;
  applicantNote: string;
  availabilities: RegistrationAvailabilities;
};

const STEP_TITLES = [
  'Informations personnelles',
  'Besoin de formation',
  'Disponibilités et remarques',
] as const;

function createInitialFormState(): RegistrationFormState {
  return {
    email: '',
    fullName: '',
    gender: '',
    age: '',
    whatsappNumber: '',
    arabicLevel: '',
    courseType: '',
    hoursPerWeek: '',
    paymentMethod: '',
    discoverySource: '',
    applicantNote: '',
    availabilities: createDefaultAvailabilities(),
  };
}

export function RegistrationForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formState, setFormState] = useState<RegistrationFormState>(createInitialFormState);

  const stepProgressLabel = useMemo(() => `Étape ${step} sur ${STEP_TITLES.length}`, [step]);

  function updateField<K extends keyof RegistrationFormState>(key: K, value: RegistrationFormState[K]) {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function updateAvailability(day: RegistrationDayKey, slot: RegistrationAvailabilitySlot) {
    setFormState((prev) => ({
      ...prev,
      availabilities: {
        ...prev.availabilities,
        [day]: slot,
      },
    }));
  }

  function validateCurrentStep() {
    if (step === 1) {
      if (!formState.email || !formState.fullName || !formState.whatsappNumber) {
        setErrorMessage('Merci de compléter email, nom et WhatsApp avant de continuer.');
        return false;
      }
    }

    if (step === 2) {
      if (!formState.arabicLevel || !formState.courseType || !formState.hoursPerWeek || !formState.paymentMethod) {
        setErrorMessage('Merci de compléter le niveau, le type de cours, le volume horaire et le paiement.');
        return false;
      }
    }

    setErrorMessage(null);
    return true;
  }

  function goToNextStep() {
    if (!validateCurrentStep()) return;
    setStep((prev) => Math.min(prev + 1, STEP_TITLES.length));
  }

  function goToPreviousStep() {
    setErrorMessage(null);
    setStep((prev) => Math.max(prev - 1, 1));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateCurrentStep()) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formState.email,
          fullName: formState.fullName,
          gender: formState.gender,
          age: formState.age,
          whatsappNumber: formState.whatsappNumber,
          arabicLevel: formState.arabicLevel,
          courseType: formState.courseType,
          hoursPerWeek: formState.hoursPerWeek,
          paymentMethod: formState.paymentMethod,
          discoverySource: formState.discoverySource,
          applicantNote: formState.applicantNote,
          availabilities: formState.availabilities,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Impossible d’enregistrer votre inscription pour le moment.");
      }

      router.push('/inscription/confirmation');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Une erreur est survenue, merci de réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fawaid-accent2">{stepProgressLabel}</p>
        <div className="grid grid-cols-3 gap-2">
          {STEP_TITLES.map((title, index) => {
            const stepNumber = index + 1;
            const active = stepNumber === step;
            const done = stepNumber < step;

            return (
              <div
                key={title}
                className={`rounded-xl border px-3 py-2 text-xs ${
                  active
                    ? 'border-fawaid-accent bg-fawaid-accentSoft text-fawaid-accent'
                    : done
                      ? 'border-green-200 bg-green-50 text-green-700'
                      : 'border-fawaid-border bg-fawaid-bg text-fawaid-muted'
                }`}
              >
                <p className="font-semibold">Étape {stepNumber}</p>
                <p className="mt-0.5 line-clamp-2">{title}</p>
              </div>
            );
          })}
        </div>
      </div>

      {step === 1 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-fawaid-text">E-mail</label>
            <input
              type="email"
              required
              value={formState.email}
              onChange={(event) => updateField('email', event.target.value)}
              className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
              placeholder="votre@email.com"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-fawaid-text">Nom, prénom ou kunyah</label>
            <input
              required
              value={formState.fullName}
              onChange={(event) => updateField('fullName', event.target.value)}
              className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
              placeholder="Ex: Abou X"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-fawaid-text">Genre</label>
            <select
              value={formState.gender}
              onChange={(event) => updateField('gender', event.target.value)}
              className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
            >
              <option value="">Sélectionner</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-fawaid-text">Âge</label>
            <input
              type="number"
              min={0}
              value={formState.age}
              onChange={(event) => updateField('age', event.target.value)}
              className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
              placeholder="Ex: 27"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-fawaid-text">Numéro WhatsApp</label>
            <input
              required
              value={formState.whatsappNumber}
              onChange={(event) => updateField('whatsappNumber', event.target.value)}
              className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
              placeholder="Ex: +33 6 12 34 56 78"
            />
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-fawaid-text">Niveau en arabe</label>
            <select
              required
              value={formState.arabicLevel}
              onChange={(event) => updateField('arabicLevel', event.target.value)}
              className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
            >
              <option value="">Sélectionner</option>
              {REGISTRATION_LEVEL_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-fawaid-text">Type de cours</label>
            <select
              required
              value={formState.courseType}
              onChange={(event) => updateField('courseType', event.target.value)}
              className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
            >
              <option value="">Sélectionner</option>
              {REGISTRATION_COURSE_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-fawaid-text">Heures de cours / semaine</label>
            <select
              required
              value={formState.hoursPerWeek}
              onChange={(event) => updateField('hoursPerWeek', event.target.value)}
              className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
            >
              <option value="">Sélectionner</option>
              {REGISTRATION_HOURS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option === 'autre' ? 'Autre' : option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-fawaid-text">Moyen de paiement</label>
            <select
              required
              value={formState.paymentMethod}
              onChange={(event) => updateField('paymentMethod', event.target.value)}
              className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
            >
              <option value="">Sélectionner</option>
              {REGISTRATION_PAYMENT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-fawaid-text">Disponibilités hebdomadaires</p>
            <p className="mt-1 text-sm text-fawaid-muted">
              Choisissez le créneau principal pour chaque jour. Vous pourrez ensuite préciser avec l’équipe.
            </p>
          </div>

          <div className="space-y-3">
            {REGISTRATION_DAY_KEYS.map((day) => (
              <fieldset key={day} className="rounded-xl border border-fawaid-border p-3">
                <legend className="px-1 text-sm font-semibold text-fawaid-text">{REGISTRATION_DAY_LABELS[day]}</legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {REGISTRATION_AVAILABILITY_SLOTS.map((slot) => {
                    const active = formState.availabilities[day] === slot;
                    return (
                      <label
                        key={`${day}-${slot}`}
                        className={`cursor-pointer rounded-lg border px-3 py-2 text-sm transition ${
                          active
                            ? 'border-fawaid-accent bg-fawaid-accentSoft text-fawaid-accent'
                            : 'border-fawaid-border bg-white text-fawaid-muted hover:border-fawaid-accent'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`availability-${day}`}
                          className="sr-only"
                          checked={active}
                          onChange={() => updateAvailability(day as RegistrationDayKey, slot as RegistrationAvailabilitySlot)}
                        />
                        {REGISTRATION_SLOT_LABELS[slot]}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-fawaid-text">Comment avez-vous connu l’institut ?</label>
              <input
                value={formState.discoverySource}
                onChange={(event) => updateField('discoverySource', event.target.value)}
                className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
                placeholder="Ex: bouche à oreille"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-fawaid-text">Remarque ou demande particulière</label>
              <textarea
                rows={4}
                value={formState.applicantNote}
                onChange={(event) => updateField('applicantNote', event.target.value)}
                className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
                placeholder="Précisez votre besoin..."
              />
            </div>
          </div>
        </div>
      ) : null}

      {errorMessage ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <button
          type="button"
          onClick={goToPreviousStep}
          disabled={step === 1 || submitting}
          className="inline-flex h-11 items-center justify-center rounded-full border border-fawaid-border bg-white px-4 text-sm font-semibold text-fawaid-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Précédent
        </button>

        {step < STEP_TITLES.length ? (
          <button
            type="button"
            onClick={goToNextStep}
            disabled={submitting}
            className="inline-flex h-11 items-center justify-center rounded-full border border-fawaid-accent bg-fawaid-accent px-4 text-sm font-semibold text-white transition hover:bg-[#033E8F] disabled:cursor-not-allowed disabled:opacity-70"
          >
            Suivant
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-11 items-center justify-center rounded-full border border-fawaid-accent bg-fawaid-accent px-4 text-sm font-semibold text-white transition hover:bg-[#033E8F] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-1.5 h-4 w-4" />}
            Envoyer ma demande
          </button>
        )}
      </div>
    </form>
  );
}
