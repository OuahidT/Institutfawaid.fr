'use client';

import Script from 'next/script';
import { useCallback, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

declare global {
  interface Window {
    Trustpilot?: {
      loadFromElement?: (element: HTMLElement, forceReload?: boolean) => void;
    };
  }
}

const TRUSTPILOT_SCRIPT_ID = 'trustpilot-widget-bootstrap';
const TRUSTPILOT_SCRIPT_SRC = 'https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';

type TrustpilotWidgetProps = {
  className?: string;
};

export function TrustpilotWidget({ className }: TrustpilotWidgetProps) {
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
    <div className={cn('w-full max-w-[300px] min-h-[52px]', className)}>
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
  );
}
