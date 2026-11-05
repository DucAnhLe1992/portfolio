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
import { canonicalPath, entryKey, savedScrollY } from '@/lib/paths';

type RouterValue = { path: string; navigate: (to: string) => void };

type Location = { path: string; id: number; hash: string; scrollY: number | null };

const RouterContext = createContext<RouterValue | null>(null);

function focusTarget(el: HTMLElement) {
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

function newKey() {
  return Math.random().toString(36).slice(2, 10);
}

function currentKey() {
  const existing = entryKey(window.history.state);
  if (existing) return existing;
  const key = newKey();
  window.history.replaceState({ ...(window.history.state ?? {}), key }, '');
  return key;
}

export function RouterProvider({ children, initialPath }: { children: ReactNode; initialPath?: string }) {
  const [loc, setLoc] = useState<Location>(() => ({
    path: canonicalPath(initialPath ?? window.location.pathname),
    id: 0,
    hash: '',
    scrollY: null,
  }));
  const first = useRef(true);
  const keyRef = useRef<string | null>(null);
  const positions = useRef(new Map<string, number>());

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    keyRef.current = currentKey();
    // Positions are keyed by history entry so a pending save can never land on the entry that popstate just activated.
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      const key = keyRef.current;
      if (!key) return;
      positions.current.set(key, window.scrollY);
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (entryKey(window.history.state) !== key) return;
        window.history.replaceState({ ...window.history.state, scrollY: window.scrollY }, '');
      }, 120);
    };
    const onPop = (e: PopStateEvent) => {
      clearTimeout(timer);
      const known = entryKey(e.state);
      const key = known ?? currentKey();
      keyRef.current = key;
      // An entry without a key is a fresh in-page #anchor jump, which should scroll to its target.
      const scrollY = known ? (positions.current.get(key) ?? savedScrollY(e.state)) : null;
      setLoc((prev) => ({
        path: canonicalPath(window.location.pathname),
        id: prev.id + 1,
        hash: window.location.hash.slice(1),
        scrollY,
      }));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('popstate', onPop);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('popstate', onPop);
    };
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    requestAnimationFrame(() => {
      const target = loc.hash ? document.getElementById(loc.hash) : null;
      // Page changes jump; smooth scrolling is reserved for in-page anchor clicks.
      if (loc.scrollY !== null) window.scrollTo({ top: loc.scrollY, behavior: 'instant' });
      else if (target) target.scrollIntoView({ behavior: 'instant' });
      else window.scrollTo({ top: 0, behavior: 'instant' });

      const focusEl = target ?? document.querySelector<HTMLElement>('main h1') ?? document.getElementById('main');
      if (focusEl) focusTarget(focusEl);
    });
  }, [loc]);

  const navigate = useCallback((to: string) => {
    const [pathname, hash = ''] = to.split('#');
    window.history.replaceState({ ...(window.history.state ?? {}), scrollY: window.scrollY }, '');
    const key = newKey();
    window.history.pushState({ key, scrollY: 0 }, '', to);
    keyRef.current = key;
    setLoc((prev) => ({ path: canonicalPath(pathname || '/'), id: prev.id + 1, hash, scrollY: null }));
  }, []);

  return <RouterContext.Provider value={{ path: loc.path, navigate }}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used inside RouterProvider');
  return ctx;
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
