import { AlertTriangle, FileCode2, Info } from 'lucide-react';
import type { Block, Section } from '@/content/types';

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) =>
    part.startsWith('`') && part.endsWith('`') ? (
      <code key={i} className="rounded bg-sunken px-1.5 py-0.5 font-mono text-[0.85em] [overflow-wrap:anywhere]">
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'p':
      return <p className="text-[1.05rem] leading-[1.75] text-muted">{renderInline(block.text)}</p>;
    case 'h3':
      return <h3 className="pt-4 text-lg font-semibold text-ink">{block.text}</h3>;
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <Tag className="space-y-3">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-4 text-[1.05rem] leading-[1.7] text-muted">
              {block.ordered ? (
                <span className="mt-[3px] grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-soft font-mono text-xs font-medium text-accent">
                  {i + 1}
                </span>
              ) : (
                <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              )}
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </Tag>
      );
    }
    case 'code':
      return (
        <figure className="overflow-hidden rounded-xl border border-line bg-[#141a17] text-[#dfe7e2]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/50">{block.lang ?? 'code'}</span>
            <span className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-white/15" />
              <span className="h-2 w-2 rounded-full bg-white/15" />
              <span className="h-2 w-2 rounded-full bg-white/15" />
            </span>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-[0.84rem] leading-[1.7]">
            <code>{block.code}</code>
          </pre>
          {block.caption && (
            <figcaption className="border-t border-white/10 px-4 py-2 text-xs text-white/55">{block.caption}</figcaption>
          )}
        </figure>
      );
    case 'table':
      return (
        <figure className="space-y-3">
          <div className="overflow-x-auto rounded-xl border border-line bg-surface">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead className="border-b border-line bg-sunken/60">
                <tr>
                  {block.head.map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-faint">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {block.rows.map((row, i) => (
                  <tr key={i} className="transition-colors hover:bg-sunken/40">
                    {row.map((cell, j) => (
                      <td key={j} className={`px-4 py-3 align-top leading-[1.55] ${j === 0 ? 'font-medium text-ink' : 'text-muted'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && <figcaption className="text-sm text-faint">{block.caption}</figcaption>}
        </figure>
      );
    case 'callout': {
      const caution = block.tone === 'caution';
      const Icon = caution ? AlertTriangle : Info;
      return (
        <aside
          className={`flex gap-4 rounded-xl border p-5 ${
            caution ? 'border-warn/30 bg-warn-soft' : 'border-info/25 bg-info-soft'
          }`}
        >
          <Icon size={18} className={`mt-0.5 shrink-0 ${caution ? 'text-warn' : 'text-info'}`} />
          <div className="space-y-1">
            <p className="font-semibold text-ink">{block.title}</p>
            <p className="leading-[1.65] text-muted">{block.text}</p>
          </div>
        </aside>
      );
    }
  }
}

export function SectionView({ section, index }: { section: Section; index?: number }) {
  return (
    <section id={section.id} className="scroll-mt-24 space-y-6">
      <h2 className="flex items-baseline gap-4 text-2xl font-semibold sm:text-[1.7rem]">
        {index !== undefined && <span className="font-mono text-sm font-normal text-accent">{String(index).padStart(2, '0')}</span>}
        {section.title}
      </h2>
      {section.blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
      {section.sources && section.sources.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <span className="label mr-1">Source</span>
          {section.sources.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-muted transition-colors hover:border-accent/40 hover:text-accent"
            >
              <FileCode2 size={13} aria-hidden="true" />
              {s.label}
              <span className="sr-only"> (opens GitHub at a pinned commit)</span>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
