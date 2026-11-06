import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/lib/router';
import type { Project } from '@/content/types';
import { kindLabel } from '@/content/queries';
import { ProjectVisual } from '@/components/projects/ProjectVisual';

export function ProjectCard({ project, headingLevel = 3 }: { project: Project; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-[0_1px_2px_rgb(0_0_0/0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_18px_40px_-20px_rgb(var(--accent)/0.35)]">
      <ProjectVisual
        kind={project.visual}
        className="aspect-[2/1] border-b border-line"
      />
      <div className="flex flex-1 flex-col gap-4 p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="label text-accent">{project.label}</span>
          <span className="text-faint">·</span>
          <span className="label">{kindLabel[project.kind]}</span>
        </div>
        <Heading className="text-2xl font-semibold">
          <Link to={`/projects/${project.slug}`} className="after:absolute after:inset-0 focus-visible:ring-0">
            {project.title}
          </Link>
        </Heading>
        <p className="leading-[1.65] text-muted">{project.summary}</p>
        <p className="border-l-2 border-accent/40 pl-4 text-[0.95rem] italic leading-[1.6] text-ink/80">{project.hardProblem}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <ul className="flex flex-wrap gap-1.5">
            {project.stack.slice(0, 4).map((s) => (
              <li key={s} className="rounded-full bg-sunken px-2.5 py-1 font-mono text-[0.7rem] text-muted">
                {s}
              </li>
            ))}
          </ul>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-muted transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-canvas">
            <ArrowUpRight size={18} />
          </span>
        </div>
      </div>
    </article>
  );
}
