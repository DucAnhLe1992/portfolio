import { useEffect } from 'react';

const SITE = 'Lê Đức Anh';

export function usePageMeta(title: string | null, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE}` : `${SITE} — Software Engineer`;
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    }
  }, [title, description]);
}
