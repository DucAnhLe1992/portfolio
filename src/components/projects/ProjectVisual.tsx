import { useId } from 'react';
import type { ProjectMeta } from '@/content/types';

function Node({ x, y, w = 112, label, tone = 'base' }: { x: number; y: number; w?: number; label: string; tone?: 'base' | 'accent' | 'ok' | 'danger' | 'ochre' }) {
  const tones = {
    base: 'fill-surface stroke-line',
    accent: 'fill-accent-soft stroke-accent/50',
    ok: 'fill-ok-soft stroke-ok/50',
    danger: 'fill-danger-soft stroke-danger/40',
    ochre: 'fill-ochre-soft stroke-ochre/40',
  };
  return (
    <g>
      <rect x={x} y={y} width={w} height={34} rx={9} className={`${tones[tone]} stroke-[1.2]`} />
      <text x={x + w / 2} y={y + 21.5} textAnchor="middle" className="fill-ink font-mono text-[10.5px]">
        {label}
      </text>
    </g>
  );
}

function Edge({ d, dashed, marker }: { d: string; dashed?: boolean; marker: string }) {
  return <path d={d} className="fill-none stroke-faint stroke-[1.2]" strokeDasharray={dashed ? '4 4' : undefined} markerEnd={`url(#${marker})`} />;
}

function StateMachine({ marker }: { marker: string }) {
  return (
    <>
      <circle cx={34} cy={110} r={6} className="fill-ink" />
      <Edge marker={marker} d="M42 110 H78" />
      <Node x={82} y={93} w={128} label="pending_payment" tone="ochre" />
      <Edge marker={marker} d="M210 102 C240 80 250 62 272 58" />
      <Edge marker={marker} d="M210 118 C240 140 250 158 272 162" />
      <Node x={276} y={41} label="confirmed" tone="ok" />
      <Node x={276} y={145} label="cancelled" tone="danger" />
      <Edge marker={marker} d="M332 75 V141" dashed />
      <text x={226} y={66} className="fill-faint font-mono text-[9px]">webhook ✓</text>
      <text x={226} y={163} className="fill-faint font-mono text-[9px]">expired</text>
      <text x={340} y={112} className="fill-faint font-mono text-[9px]">refund</text>
    </>
  );
}

function Pipeline({ marker }: { marker: string }) {
  const steps = [
    { label: 'edit', tone: 'base' as const },
    { label: 'esbuild·wasm', tone: 'accent' as const },
    { label: 'iframe', tone: 'ok' as const },
  ];
  return (
    <>
      {steps.map((s, i) => (
        <g key={s.label}>
          <Node x={20 + i * 132} y={60} w={104} label={s.label} tone={s.tone} />
          {i < steps.length - 1 && <Edge marker={marker} d={`M${124 + i * 132} 77 H${148 + i * 132}`} />}
        </g>
      ))}
      <Edge marker={marker} d="M72 94 V140 H160" dashed />
      <Node x={164} y={124} w={128} label="local-api → file" tone="ochre" />
      <text x={72} y={44} textAnchor="middle" className="fill-faint font-mono text-[9px]">cells</text>
      <text x={336} y={44} textAnchor="middle" className="fill-faint font-mono text-[9px]">preview</text>
    </>
  );
}

function Services() {
  const svc = ['auth', 'tickets', 'orders', 'payments', 'expiry'];
  return (
    <>
      <rect x={20} y={100} width={360} height={22} rx={11} className="fill-accent-soft stroke-accent/40 stroke-[1.2]" />
      <text x={200} y={115} textAnchor="middle" className="fill-accent font-mono text-[10px]">NATS streaming · event bus</text>
      {svc.map((s, i) => {
        const x = 24 + i * 72;
        return (
          <g key={s}>
            <Node x={x} y={40} w={64} label={s} tone={i === 2 ? 'ochre' : 'base'} />
            <path d={`M${x + 32} 74 V98`} className="fill-none stroke-faint stroke-[1.2]" strokeDasharray="3 3" />
            <rect x={x + 18} y={140} width={28} height={18} rx={4} className="fill-sunken stroke-line" />
            <path d={`M${x + 32} 124 V138`} className="fill-none stroke-line stroke-[1.2]" />
          </g>
        );
      })}
      <text x={200} y={182} textAnchor="middle" className="fill-faint font-mono text-[9px]">one database per service</text>
    </>
  );
}

function TokenRotation({ marker }: { marker: string }) {
  const tokens = ['refresh 1', 'refresh 2', 'refresh 3'];
  return (
    <>
      <Node x={16} y={50} w={72} label="sign in" tone="accent" />
      {tokens.map((t, i) => (
        <g key={t}>
          <Edge marker={marker} d={`M${i === 0 ? 88 : 98 + i * 96} 67 H${108 + i * 96}`} />
          <Node x={112 + i * 96} y={50} w={82} label={t} tone={i === tokens.length - 1 ? 'ok' : 'base'} />
        </g>
      ))}
      <text x={248} y={40} textAnchor="middle" className="fill-faint font-mono text-[9px]">each token works once</text>
      <Edge marker={marker} d="M153 84 V144 H226" dashed />
      <text x={160} y={120} className="fill-faint font-mono text-[9px]">replayed later</text>
      <Node x={230} y={127} w={150} label="revoke every session" tone="danger" />
    </>
  );
}

export function ProjectVisual({ kind, className = '' }: { kind: ProjectMeta['visual']; className?: string }) {
  const marker = `arrow-${useId().replace(/:/g, '')}`;
  return (
    <div className={`notebook-grid relative overflow-hidden bg-sunken/50 ${className}`}>
      <svg viewBox="0 0 400 200" role="img" aria-label={`Simplified ${kind.replace('-', ' ')} diagram`} className="h-full w-full">
        <defs>
          <marker id={marker} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" className="fill-faint" />
          </marker>
        </defs>
        {kind === 'state-machine' && <StateMachine marker={marker} />}
        {kind === 'pipeline' && <Pipeline marker={marker} />}
        {kind === 'services' && <Services />}
        {kind === 'token-rotation' && <TokenRotation marker={marker} />}
      </svg>
    </div>
  );
}
