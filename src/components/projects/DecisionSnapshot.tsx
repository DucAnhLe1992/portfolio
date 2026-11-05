import { ArrowRight, Check, FileCode2, X } from 'lucide-react';
import { Link } from '@/lib/router';
import { getProject } from '@/content/queries';

const WEBHOOK_SRC =
  'https://github.com/DucAnhLe1992/CarRental/blob/f526e0efdce465fb0286b911974af9e627124bf5/backend/src/controllers/webhookController.ts';

const signals = [
  { from: 'Success redirect', by: 'Customer’s browser', may: 'Show status only', trusted: false },
  { from: 'checkout.session.completed', by: 'Stripe, signed', may: 'pending → confirmed', trusted: true },
  { from: 'checkout.session.expired', by: 'Stripe, signed', may: 'pending → cancelled', trusted: true },
];

export function DecisionSnapshot() {
  const project = getProject('car-rental');
  const decision = project?.decisions[0];
  if (!project || !decision) return null;

  return (
    <aside
      aria-labelledby="snapshot-title"
      className="relative min-w-0 animate-rise rounded-card border border-line bg-surface p-2 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.25)] [animation-delay:120ms]"
    >
      <div className="notebook-grid space-y-6 rounded-[1rem] bg-canvas p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <span className="label">Decision · {project.title}</span>
          <span className="rounded-full bg-accent-soft px-2.5 py-1 font-mono text-[0.68rem] text-accent">from the code</span>
        </div>

        <div className="space-y-2">
          <h2 id="snapshot-title" className="text-xl font-semibold">
            {decision.title}
          </h2>
          <p className="text-sm leading-[1.6] text-muted">{decision.choice}</p>
        </div>

        <ul className="space-y-2">
          {signals.map((s) => (
            <li
              key={s.from}
              className={`flex items-start gap-3 rounded-xl border p-3 transition-colors ${
                s.trusted ? 'border-ok/30 bg-surface/90' : 'border-line bg-sunken/60'
              }`}
            >
              <span
                className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md ${
                  s.trusted ? 'bg-ok-soft text-ok' : 'bg-danger-soft text-danger'
                }`}
              >
                {s.trusted ? <Check size={14} aria-hidden="true" /> : <X size={14} aria-hidden="true" />}
                <span className="sr-only">{s.trusted ? 'Can change booking state' : 'Cannot change booking state'}</span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs text-ink [overflow-wrap:anywhere]">{s.from}</p>
                <p className="text-xs text-muted">
                  {s.by} · {s.may}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <p className="rounded-xl border border-warn/30 bg-warn-soft p-3 text-xs leading-[1.55] text-muted">
          <span className="font-semibold text-ink">Known gap: </span>
          the event id is recorded before the booking update, so a crash in between can leave a paid booking pending.
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-sm">
          <Link to={`/projects/${project.slug}#payments`} className="group inline-flex items-center gap-1.5 font-medium text-accent">
            Read the case study <ArrowRight size={15} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href={WEBHOOK_SRC}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-accent"
          >
            <FileCode2 size={13} aria-hidden="true" /> webhookController.ts
          </a>
        </div>
      </div>
    </aside>
  );
}
