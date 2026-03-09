'use client';

import Script from 'next/script';
import { useCallback, useEffect, useRef } from 'react';

declare global {
  interface Window {
    Trustpilot?: {
      loadFromElement?: (element: HTMLElement, forceReload?: boolean) => void;
    };
  }
}

const TRUSTPILOT_SCRIPT_ID = 'trustpilot-widget-bootstrap';
const TRUSTPILOT_SCRIPT_SRC = 'https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';

export function TrustpilotWidget() {
  const widgetRef = useRef<HTMLDivElement>(null);

  const initializeWidget = useCallback(() => {
    if (!widgetRef.current || typeof window === 'undefined') return;

    const trustpilot = window.Trustpilot;
    if (typeof trustpilot?.loadFromElement === 'function') {
      trustpilot.loadFromElement(widgetRef.current, true);
    }
  }, []);

  useEffect(() => {
    initializeWidget();
  }, [initializeWidget]);

  return (
    <section className="section-card py-4 md:py-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-fawaid-text">Avis vérifiés sur Trustpilot</p>
        <a
          href="https://fr.trustpilot.com/review/institutfawaid.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-fawaid-accent transition hover:text-[#033E8F]"
        >
          Voir la page Trustpilot
        </a>
      </div>

      <div className="mt-3 rounded-2xl border border-fawaid-border bg-fawaid-bg/50 px-3 py-3 md:px-4">
        <Script
          id={TRUSTPILOT_SCRIPT_ID}
          src={TRUSTPILOT_SCRIPT_SRC}
          strategy="lazyOnload"
          onLoad={initializeWidget}
        />

        <div
          ref={widgetRef}
          className="trustpilot-widget"
          data-locale="fr-FR"
          data-template-id="56278e9abfbbba0bdcd568bc"
          data-businessunit-id="69ae554de76eb21905083d34"
          data-style-height="52px"
          data-style-width="100%"
          data-token="edcd9ea3-0799-470b-9f18-9afd2de04145"
        >
          <a href="https://fr.trustpilot.com/review/institutfawaid.fr" target="_blank" rel="noopener noreferrer">
            Trustpilot
          </a>
        </div>
      </div>
    </section>
  );
}
