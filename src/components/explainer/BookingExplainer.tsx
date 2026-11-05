import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import { scenarios, type BookingState, type Tone } from '@/components/explainer/scenarios';

const stateStyle: Record<Exclude<BookingState, 'none'>, { label: string; on: string }> = {
  pending_payment: { label: 'pending_payment', on: 'border-ochre bg-ochre-soft text-ochre' },
  confirmed: { label: 'confirmed', on: 'border-ok bg-ok-soft text-ok' },
  cancelled: { label: 'cancelled', on: 'border-danger bg-danger-soft text-danger' },
  rejected: { label: '409 rejected', on: 'border-danger bg-danger-soft text-danger' },
};

const toneDot: Record<Tone, string> = {
  neutral: 'bg-faint',
  info: 'bg-info',
  ok: 'bg-ok',
  warn: 'bg-warn',
  danger: 'bg-danger',
};

const diagramStates: Exclude<BookingState, 'none' | 'rejected'>[] = ['pending_payment', 'confirmed', 'cancelled'];

export function BookingExplainer() {
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const logRef = useRef<HTMLOListElement>(null);

  const scenario = scenarios.find((s) => s.id === scenarioId) ?? scenarios[0];
  const current = scenario.steps[step];
  const last = scenario.steps.length - 1;
  const activeStates = new Set(Object.values(current.bookings));

  useEffect(() => {
    if (!playing) return;
    if (step >= last) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 1600);
    return () => clearTimeout(t);
  }, [playing, step, last]);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [step]);

  const choose = (id: string) => {
    setScenarioId(id);
    setStep(0);
    setPlaying(false);
  };

  const togglePlay = () => {
    if (step >= last) setStep(0);
    setPlaying((p) => !p);
  };

  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface">
      <div className="space-y-2 border-b border-line p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-semibold">Booking lifecycle explainer</h2>
          <span className="rounded-full bg-sunken px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-wider text-muted">Illustrative</span>
        </div>
        <p className="text-sm leading-[1.6] text-muted">
          Step through how the API responds in four situations. This is a scripted visualisation of the documented design, not a live system.
        </p>
      </div>

      <div role="tablist" aria-label="Scenarios" className="flex gap-1 overflow-x-auto border-b border-line bg-sunken/40 p-2">
        {scenarios.map((s) => (
          <button
            key={s.id}
            role="tab"
            type="button"
            aria-selected={s.id === scenarioId}
            onClick={() => choose(s.id)}
            className={`shrink-0 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              s.id === scenarioId ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink'
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div className="grid gap-px bg-line md:grid-cols-2">
        <div className="notebook-grid space-y-6 bg-canvas p-6">
          <p className="text-sm font-medium italic text-muted">{scenario.question}</p>
          <div className="flex flex-col items-start gap-3" aria-label="Booking state diagram">
            {diagramStates.map((st, i) => {
              const on = activeStates.has(st);
              return (
                <div key={st} className="flex items-center gap-3">
                  {i > 0 && <span className="ml-4 h-px w-4 bg-line" />}
                  <span
                    className={`rounded-lg border px-3 py-2 font-mono text-xs transition-all duration-500 ${
                      on ? `${stateStyle[st].on} scale-105 shadow-sm` : 'border-line bg-surface text-faint'
                    }`}
                  >
                    {stateStyle[st].label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="space-y-2">
            {Object.entries(current.bookings).map(([id, st]) => (
              <div key={id} className="flex items-center justify-between rounded-lg border border-line bg-surface px-3 py-2 text-sm">
                <span className="font-medium">Booking {id}</span>
                <span
                  className={`rounded-md border px-2 py-0.5 font-mono text-[0.7rem] transition-colors duration-500 ${
                    st === 'none' ? 'border-line text-faint' : stateStyle[st].on
                  }`}
                >
                  {st === 'none' ? 'not created' : stateStyle[st].label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col bg-surface">
          <p className="label border-b border-line px-6 py-3">Event log</p>
          <ol ref={logRef} aria-live="polite" className="max-h-80 flex-1 space-y-4 overflow-y-auto p-6">
            {scenario.steps.slice(0, step + 1).map((s, i) => (
              <li key={`${scenario.id}-${i}`} className={`flex gap-3 ${i === step ? 'animate-rise' : 'opacity-60'}`}>
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${toneDot[s.tone]}`} />
                <div className="min-w-0 space-y-1">
                  <p className="font-mono text-xs">
                    <span className="text-faint">{s.actor}</span> <span className="text-ink">{s.message}</span>
                  </p>
                  <p className="text-sm leading-[1.55] text-muted">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-line p-4">
        <span className="font-mono text-xs text-faint">
          step {step + 1} / {last + 1}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setStep(0);
            }}
            aria-label="Restart"
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:text-ink"
          >
            <RotateCcw size={15} />
          </button>
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            aria-label="Previous step"
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:text-ink disabled:opacity-40"
          >
            <ChevronLeft size={17} />
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-canvas transition-colors hover:bg-accent"
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
            {playing ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(last, s + 1))}
            disabled={step === last}
            aria-label="Next step"
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:text-ink disabled:opacity-40"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
