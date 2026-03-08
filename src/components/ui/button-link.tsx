import Link from 'next/link';
import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

type ButtonLinkProps = PropsWithChildren<{
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  target?: '_blank' | '_self';
  rel?: string;
}>;

const variants: Record<NonNullable<ButtonLinkProps['variant']>, string> = {
  primary:
    'bg-fawaid-accent text-white border border-fawaid-accent hover:bg-[#033E8F] hover:border-[#033E8F] focus-visible:ring-fawaid-accent',
  secondary:
    'bg-white text-fawaid-accent border border-fawaid-border hover:border-fawaid-accent hover:text-[#033E8F] focus-visible:ring-fawaid-accent',
  ghost:
    'bg-transparent text-fawaid-accent border border-fawaid-border hover:bg-fawaid-surface focus-visible:ring-fawaid-accent',
};

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  className,
  target,
  rel,
}: ButtonLinkProps) {
  const isInternalRoute = href.startsWith('/');

  return (
    <Link
      href={href}
      scroll={isInternalRoute}
      target={target}
      rel={rel}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold tracking-tight transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        variants[variant],
        className
      )}
    >
      {children}
    </Link>
  );
}
