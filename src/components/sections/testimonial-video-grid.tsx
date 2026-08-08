'use client';

import { Play, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import type { Testimonial } from '@/types/content';

type TestimonialVideoGridProps = {
  testimonials: Testimonial[];
  layout?: 'full' | 'preview';
};

export function TestimonialVideoGrid({
  testimonials,
  layout = 'full',
}: TestimonialVideoGridProps) {
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
      <div
        className={`grid gap-4 ${
          layout === 'preview' ? 'md:grid-cols-3' : 'md:grid-cols-2 xl:grid-cols-3'
        }`}
      >
        {testimonials.map((testimonial) => (
          <article
            key={`${testimonial.name}-${testimonial.age}-${testimonial.location}`}
            className="flex h-full flex-col overflow-hidden rounded-2xl border border-fawaid-border bg-white shadow-card"
          >
            {testimonial.videoUrl ? (
              <button
                type="button"
                onClick={() => setSelected(testimonial)}
                className="group relative block aspect-[4/5] w-full overflow-hidden bg-fawaid-surface text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fawaid-accent"
                aria-label={`Voir la vidéo témoignage de ${testimonial.name}, ${testimonial.age} ans, ${testimonial.location}`}
              >
                {testimonial.posterUrl ? (
                  <Image
                    src={testimonial.posterUrl}
                    alt=""
                    fill
                    sizes={layout === 'preview' ? '(min-width: 768px) 30vw, 100vw' : '(min-width: 1280px) 28vw, (min-width: 768px) 45vw, 100vw'}
                    className="object-cover transition duration-300 group-hover:scale-[1.025]"
                  />
                ) : null}
                <span className="absolute inset-0 bg-gradient-to-t from-[#0b241e]/95 via-black/5 to-black/5" />
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.11em] text-fawaid-accent shadow-sm">
                  Témoignage vidéo
                </span>
                <span className="absolute left-1/2 top-1/2 inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-fawaid-accent shadow-soft transition group-hover:scale-105">
                  <Play className="ml-1 h-7 w-7 fill-current" />
                </span>
                <span className="absolute inset-x-5 bottom-4 text-white">
                  <span className="block text-base font-bold md:text-lg">
                    {testimonial.name}, {testimonial.age} ans
                  </span>
                  <span className="mt-0.5 block text-sm text-white/85">{testimonial.location}</span>
                </span>
              </button>
            ) : null}

            <div className="flex flex-1 items-start p-4">
              <p className="text-sm leading-relaxed text-fawaid-muted">“{testimonial.quote}”</p>
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
              poster={selected.posterUrl}
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
