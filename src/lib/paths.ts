export function normalize(path: string) {
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

// Maps the prerendered file aliases (/route.html, /route/index.html) onto the clean route.
export function canonicalPath(path: string) {
  const stripped = path.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  return normalize(stripped || '/');
}

export function matchRoute(pattern: string, path: string): Record<string, string> | null {
  const p = pattern.split('/');
  const a = path.split('/');
  if (p.length !== a.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) {
      try {
        params[p[i].slice(1)] = decodeURIComponent(a[i]);
      } catch {
        return null;
      }
    } else if (p[i] !== a[i]) return null;
  }
  return params;
}

export function savedScrollY(state: unknown) {
  const y = (state as { scrollY?: unknown } | null)?.scrollY;
  return typeof y === 'number' && Number.isFinite(y) ? y : 0;
}

export function entryKey(state: unknown) {
  const key = (state as { key?: unknown } | null)?.key;
  return typeof key === 'string' && key.length > 0 ? key : null;
}
