import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';

type RouterValue = { path: string; navigate: (to: string) => void };

type Location = { path: string; id: number; hash: string; scrollY: number | null };

const RouterContext = createContext<RouterValue | null>(null);

export function normalize(path: string) {
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

function focusTarget(el: HTMLElement) {
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

export function RouterProvider({ children, initialPath }: { children: ReactNode; initialPath?: string }) {
  const [loc, setLoc] = useState<Location>(() => ({
    path: normalize(initialPath ?? window.location.pathname),
    id: 0,
    hash: '',
    scrollY: null,
  }));
  const first = useRef(true);

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    const onPop = (e: PopStateEvent) => {
      const state = e.state as { scrollY?: number } | null;
      setLoc((prev) => ({
        path: normalize(window.location.pathname),
        id: prev.id + 1,
        hash: window.location.hash.slice(1),
        scrollY: typeof state?.scrollY === 'number' ? state.scrollY : 0,
      }));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    requestAnimationFrame(() => {
      const target = loc.hash ? document.getElementById(loc.hash) : null;
      if (loc.scrollY !== null) window.scrollTo({ top: loc.scrollY });
      else if (target) target.scrollIntoView();
      else window.scrollTo({ top: 0 });

      const focusEl = target ?? document.querySelector<HTMLElement>('main h1') ?? document.getElementById('main');
      if (focusEl) focusTarget(focusEl);
    });
  }, [loc]);

  const navigate = useCallback((to: string) => {
    const [pathname, hash = ''] = to.split('#');
    window.history.replaceState({ ...(window.history.state ?? {}), scrollY: window.scrollY }, '');
    window.history.pushState({ scrollY: 0 }, '', to);
    setLoc((prev) => ({ path: normalize(pathname || '/'), id: prev.id + 1, hash, scrollY: null }));
  }, []);

  return <RouterContext.Provider value={{ path: loc.path, navigate }}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used inside RouterProvider');
  return ctx;
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

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useRouter();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };
  return (
    <a href={to} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
