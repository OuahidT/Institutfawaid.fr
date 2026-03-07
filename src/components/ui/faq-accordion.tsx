'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import type { FaqItem } from '@/types/content';
import { cn } from '@/lib/utils';

type FaqAccordionProps = {
  items: FaqItem[];
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-2.5">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;

        return (
          <div
            key={item.question}
            className={cn(
              'overflow-hidden rounded-2xl border bg-white transition',
              isOpen ? 'border-fawaid-accent/40 shadow-card' : 'border-fawaid-border'
            )}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-[15px] font-medium text-fawaid-text transition hover:bg-fawaid-surface/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fawaid-accent focus-visible:ring-inset md:px-5"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={cn('h-5 w-5 shrink-0 text-fawaid-accent transition', isOpen && 'rotate-180')}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                'grid transition-all duration-300 ease-out',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              )}
            >
              <div className="overflow-hidden">
                <p className="px-4 pb-4 text-sm leading-relaxed text-fawaid-muted md:px-5 md:pb-5">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
