import { useEffect, useRef, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { Link, useRouter } from '@/lib/router';
import { profile } from '@/data/profile';

const nav = [
  { to: '/projects', label: 'Projects' },
  { to: '/writing', label: 'Writing' },
  { to: '/about', label: 'About' },
];

function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      /* storage unavailable */
    }
  };
  return { dark, toggle };
}

export function Header() {
  const { path } = useRouter();
  const { dark, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (to: string) => path === to || path.startsWith(`${to}/`);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open ? 'border-b border-line bg-canvas/85 backdrop-blur-md' : 'border-b border-transparent bg-canvas'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-wide items-center justify-between px-6">
        <Link to="/" className="group flex items-center gap-3" aria-label={`${profile.name}, home`}>
          <img
            src={profile.avatar}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover ring-1 ring-line transition-transform duration-300 group-hover:scale-105"
          />
          <span className="hidden text-[0.95rem] font-semibold sm:inline">{profile.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1 rounded-full border border-line bg-surface/70 px-2 py-1 shadow-sm">
            {nav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  aria-current={isActive(item.to) ? 'page' : undefined}
                  className={`relative block rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    isActive(item.to) ? 'text-accent' : 'text-muted hover:text-ink'
                  }`}
                >
                  {item.label}
                  {isActive(item.to) && (
                    <span className="absolute inset-x-4 -bottom-[5px] h-px bg-gradient-to-r from-accent/0 via-accent to-accent/0" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface/70 text-muted shadow-sm transition-colors hover:text-ink"
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface/70 text-muted shadow-sm transition-colors hover:text-ink md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line px-6 pb-6 pt-2 md:hidden">
          <ul className="animate-rise">
            {[{ to: '/', label: 'Home' }, ...nav].map((item) => (
              <li key={item.to} className="border-b border-line last:border-none">
                <Link
                  to={item.to}
                  aria-current={path === item.to ? 'page' : undefined}
                  className={`block py-4 text-lg font-medium ${path === item.to ? 'text-accent' : 'text-ink'}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
