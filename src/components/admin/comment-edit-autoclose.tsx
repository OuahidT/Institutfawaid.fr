'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type CommentEditAutoCloseProps = {
  enabled: boolean;
};

export function CommentEditAutoClose({ enabled }: CommentEditAutoCloseProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!enabled) return;

    document.querySelectorAll<HTMLDetailsElement>('[data-comment-edit]').forEach((details) => {
      details.removeAttribute('open');
    });

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete('comment_update');
    const nextQuery = nextParams.toString();

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [enabled, pathname, router, searchParams]);

  return null;
}
