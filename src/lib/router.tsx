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
import { normalize, savedScrollY } from '@/lib/paths';

type RouterValue = { path: string; navigate: (to: string) => void };

type Location = { path: string; id: number; hash: string; scrollY: number | null };

const RouterContext = createContext<RouterValue | null>(null);

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
    // popstate fires after the entry has changed, so the position must be saved while scrolling.
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        window.history.replaceState({ ...(window.history.state ?? {}), scrollY: window.scrollY }, '');
      }, 120);
    };
    const onPop = (e: PopStateEvent) => {
      clearTimeout(timer);
      setLoc((prev) => ({
        path: normalize(window.location.pathname),
        id: prev.id + 1,
        hash: window.location.hash.slice(1),
        scrollY: savedScrollY(e.state),
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
