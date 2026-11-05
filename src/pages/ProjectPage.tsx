import { ArrowLeft, ArrowRight, ArrowUpRight, Github, Package, Scale } from 'lucide-react';
import { Link } from '@/lib/router';
import type { Project } from '@/content/types';
import { getArticle, getProjects, kindLabel } from '@/content/queries';
import { ProjectVisual } from '@/components/projects/ProjectVisual';
import { SectionView } from '@/components/content/Blocks';
import { BookingExplainer } from '@/components/explainer/BookingExplainer';

const statusTone: Record<Project['status'], string> = {
  maintained: 'bg-ok-soft text-ok',
  experimental: 'bg-info-soft text-info',
  archived: 'bg-sunken text-muted',
};

export function ProjectPage({ project }: { project: Project }) {
  const all = getProjects();
  const next = all[(all.findIndex((p) => p.slug === project.slug) + 1) % all.length];
  const related = (project.relatedWriting ?? []).map(getArticle).filter((a) => a !== null);

  const toc = [
    { id: 'overview', title: 'Overview' },
    ...project.sections.map((s) => ({ id: s.id, title: s.title })),
    ...(project.hasExplainer ? [{ id: 'explainer', title: 'Booking explainer' }] : []),
    { id: 'decisions', title: 'Engineering decisions' },
    { id: 'limitations', title: 'Limitations' },
  ];

  return (
    <article>
      <div className="animate-rise pt-12 sm:pt-16">
        <Link to="/projects" className="group mb-10 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink">
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" /> All projects
        </Link>
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <header className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="label text-accent">{project.label}</span>
              <span className={`rounded-full px-2.5 py-0.5 font-mono text-[0.68rem] uppercase tracking-wider ${statusTone[project.status]}`}>
                {project.status}
              </span>
            </div>
            <h1 className="text-4xl font-semibold sm:text-6xl">{project.title}</h1>
            <p className="max-w-2xl text-lg leading-[1.7] text-muted">{project.summary}</p>
            <div className="flex flex-wrap gap-3">
              {project.evidence.repository && (
                <a
                  href={project.evidence.repository}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-canvas transition-colors hover:bg-accent"
                >
                  <Github size={16} /> View source
                </a>
              )}
              {project.evidence.package && (
                <a
                  href={project.evidence.package}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium transition-colors hover:border-ink/30"
                >
                  <Package size={16} /> npm package
                </a>
              )}
              {project.evidence.demo && (
                <a
                  href={project.evidence.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium transition-colors hover:border-ink/30"
                >
                  <ArrowUpRight size={16} /> Live demo
                </a>
              )}
            </div>
          </header>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line text-sm">
            {[
              ['Context', kindLabel[project.kind]],
              ['Role', project.role],
            ].map(([k, v]) => (
              <div key={k} className="bg-surface p-5">
                <dt className="label mb-2">{k}</dt>
                <dd className="leading-[1.55]">{v}</dd>
              </div>
            ))}
            <div className="col-span-2 bg-surface p-5">
              <dt className="label mb-3">Stack</dt>
              <dd className="flex flex-wrap gap-1.5">
                {project.stack.map((s) => (
                  <span key={s} className="rounded-full bg-sunken px-2.5 py-1 font-mono text-[0.7rem] text-muted">
                    {s}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>
        <ProjectVisual kind={project.visual} className="mt-12 aspect-[2/1] rounded-card border border-line sm:aspect-[5/2]" />
        <p className="mt-3 text-sm text-faint">Simplified diagram. Screenshots of the running application will be added.</p>
      </div>

      <div className="mt-20 grid gap-16 lg:grid-cols-[13rem_1fr]">
        <nav aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-24 space-y-3">
            <p className="label">On this page</p>
            <ul className="space-y-2 border-l border-line text-sm">
              {toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="-ml-px block border-l border-transparent pl-4 text-muted transition-colors hover:border-accent hover:text-ink">
                    {t.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="min-w-0 max-w-reading space-y-16">
          <section id="overview" className="scroll-mt-24 space-y-6">
            <p className="label text-accent">The question</p>
            <p className="text-2xl font-medium leading-[1.45] text-ink">{project.hardProblem}</p>
            <p className="text-[1.05rem] leading-[1.75] text-muted">{project.overview}</p>
          </section>

          {project.sections.map((s, i) => (
            <SectionView key={s.id} section={s} index={i + 1} />
          ))}

          {project.hasExplainer && (
            <section id="explainer" className="scroll-mt-24">
              <BookingExplainer />
            </section>
          )}

          <section id="decisions" className="scroll-mt-24 space-y-6">
            <h2 className="flex items-center gap-3 text-2xl font-semibold sm:text-[1.7rem]">
              <Scale size={22} className="text-accent" /> Engineering decisions
            </h2>
            <div className="space-y-4">
              {project.decisions.map((d) => (
                <details key={d.title} className="group rounded-card border border-line bg-surface transition-colors open:border-accent/40">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 [&::-webkit-details-marker]:hidden">
                    <span className="space-y-1">
                      <span className="block font-semibold">{d.title}</span>
                      <span className="block text-sm text-muted">{d.choice}</span>
                    </span>
                    <ArrowRight size={18} className="shrink-0 text-faint transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="grid gap-4 border-t border-line p-6 sm:grid-cols-2">
                    <div className="rounded-xl bg-sunken/60 p-4">
                      <p className="label mb-2">Considered instead</p>
                      <p className="text-sm leading-[1.6] text-muted">{d.alternative}</p>
                    </div>
                    <div className="rounded-xl bg-accent-soft p-4">
                      <p className="label mb-2 text-accent">Why</p>
                      <p className="text-sm leading-[1.6] text-ink/85">{d.why}</p>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section id="limitations" className="scroll-mt-24 space-y-6">
            <h2 className="text-2xl font-semibold sm:text-[1.7rem]">Limitations and next steps</h2>
            <ul className="space-y-3">
              {project.limitations.map((l) => (
                <li key={l} className="flex gap-4 leading-[1.65] text-muted">
                  <span className="mt-[10px] h-1.5 w-3 shrink-0 rounded-full bg-warn/60" />
                  {l}
                </li>
              ))}
            </ul>
          </section>

          {related.length > 0 && (
            <section className="space-y-4">
              <p className="label">Related writing</p>
              {related.map((a) => (
                <Link
                  key={a.slug}
                  to={`/writing/${a.slug}`}
                  className="group flex items-center justify-between gap-4 rounded-card border border-line bg-surface p-5 transition-colors hover:border-accent/40"
                >
                  <span className="font-medium">{a.title}</span>
                  <ArrowRight size={17} className="shrink-0 text-accent transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </section>
          )}

          <Link
            to={`/projects/${next.slug}`}
            className="group block rounded-card border border-line p-8 transition-colors hover:border-accent/40 hover:bg-surface"
          >
            <p className="label mb-2">Next project</p>
            <p className="flex items-center justify-between text-2xl font-semibold">
              {next.title}
              <ArrowRight className="text-accent transition-transform group-hover:translate-x-1" />
            </p>
          </Link>
        </div>
      </div>
    </article>
  );
}
