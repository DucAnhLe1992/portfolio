import { usePageMeta } from '@/lib/seo';
import { getProjects } from '@/content/queries';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { PageIntro } from '@/components/ui/Headings';

export function ProjectsPage() {
  usePageMeta('Projects', 'Case studies in booking correctness, in-browser bundling and event-driven services.');
  const projects = getProjects();

  return (
    <>
      <PageIntro eyebrow="Build" title="Projects, with the reasoning left in.">
        <p>
          Each case study focuses on one hard problem, the decisions I made around it, how it was checked, and what is still missing. Course-derived
          work is labelled as such.
        </p>
      </PageIntro>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <div key={p.slug} className="animate-rise" style={{ animationDelay: `${i * 80}ms` }}>
            <ProjectCard project={p} />
          </div>
        ))}
      </div>
    </>
  );
}
