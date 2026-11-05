import { ArrowRight } from 'lucide-react';
import { Link } from '@/lib/router';

export function NotFoundPage() {
  return (
    <div className="grid place-items-center py-24 text-center sm:py-32">
      <div className="max-w-md animate-rise space-y-6">
        <p className="font-mono text-sm text-accent">404 · pending_payment → cancelled</p>
        <h1 className="text-4xl font-semibold">This page does not exist.</h1>
        <p className="leading-[1.7] text-muted">The link may be old or mistyped. These are good places to continue:</p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { to: '/', label: 'Home' },
            { to: '/projects', label: 'Projects' },
            { to: '/writing', label: 'Writing' },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent/40"
            >
              {l.label} <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
