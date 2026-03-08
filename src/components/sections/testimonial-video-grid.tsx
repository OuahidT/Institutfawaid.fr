'use client';

import { Play, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { Testimonial } from '@/types/content';

type TestimonialVideoGridProps = {
  testimonials: Testimonial[];
};

export function TestimonialVideoGrid({ testimonials }: TestimonialVideoGridProps) {
  const [selected, setSelected] = useState<Testimonial | null>(null);

  useEffect(() => {
    if (!selected) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelected(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selected]);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article
            key={`${testimonial.name}-${testimonial.age}-${testimonial.location}`}
            className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-fawaid-border bg-white p-4 shadow-card"
          >
            <p className="text-sm leading-relaxed text-fawaid-muted">“{testimonial.quote}”</p>

            <div className="space-y-3 border-t border-fawaid-border/70 pt-3">
              <p className="text-sm font-semibold text-fawaid-text">
                {testimonial.name}, {testimonial.age} ans — {testimonial.location}
              </p>
              {testimonial.videoUrl ? (
                <button
                  type="button"
                  onClick={() => setSelected(testimonial)}
                  className="inline-flex items-center gap-2 rounded-full border border-fawaid-border bg-fawaid-surface/75 px-3.5 py-2 text-sm font-semibold text-fawaid-accent transition hover:border-fawaid-accent hover:bg-fawaid-accentSoft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fawaid-accent focus-visible:ring-offset-2"
                >
                  <Play className="h-4 w-4" />
                  Voir la vidéo
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      {selected?.videoUrl ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-[2px]"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Vidéo témoignage de ${selected.name}`}
        >
          <div
            className="w-full max-w-4xl rounded-2xl border border-fawaid-border bg-white p-3 shadow-soft md:p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-3 px-1">
              <p className="text-sm font-semibold text-fawaid-text md:text-base">
                {selected.name}, {selected.age} ans — {selected.location}
              </p>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-fawaid-border text-fawaid-muted transition hover:border-fawaid-accent hover:text-fawaid-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fawaid-accent focus-visible:ring-offset-2"
                aria-label="Fermer la vidéo"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <video
              key={selected.videoUrl}
              controls
              autoPlay
              playsInline
              preload="metadata"
              className="max-h-[75vh] w-full rounded-xl bg-black"
            >
              <source src={selected.videoUrl} type="video/mp4" />
              Votre navigateur ne peut pas lire cette vidéo.
            </video>
          </div>
        </div>
      ) : null}
    </>
  );
}
