'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function RouteScrollReset() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}
