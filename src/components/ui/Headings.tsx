import type { ReactNode } from 'react';

export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <header className="max-w-3xl animate-rise space-y-6 pb-16 pt-16 sm:pt-24">
      <p className="label text-accent">{eyebrow}</p>
      <h1 className="text-4xl font-semibold sm:text-5xl">{title}</h1>
      {children && <div className="text-lg leading-[1.7] text-muted">{children}</div>}
    </header>
  );
}

export function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-3">
        <p className="label text-accent">{eyebrow}</p>
        <h2 className="text-3xl font-semibold">{title}</h2>
      </div>
      {action}
    </div>
  );
}
