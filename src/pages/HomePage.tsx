import { ArrowDown, ArrowRight, Github, Linkedin, MapPin } from 'lucide-react';
import { Link } from '@/lib/router';
import { profile, skills } from '@/data/profile';
import { getArticles, getFeaturedProjects } from '@/content/queries';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { DecisionSnapshot } from '@/components/projects/DecisionSnapshot';
import { ArticleRow } from '@/components/writing/ArticleRow';
import { SectionHeading } from '@/components/ui/Headings';
import { ContactPanel } from '@/components/site/ContactPanel';

export function HomePage() {
  const featured = getFeaturedProjects();
  const articles = getArticles();

  return (
    <>
      <section className="relative grid gap-12 pb-24 pt-16 sm:pt-24 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-16">
        <div className="animate-rise space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-muted shadow-sm">
            <span className="h-2 w-2 animate-pulseDot rounded-full bg-ok" />
            {profile.role} at {profile.company}
          </div>
          <h1 className="text-[2.6rem] font-semibold leading-[1.08] sm:text-6xl">
            Building thoughtful interfaces and <span className="text-accent">reliable</span> web applications.
          </h1>
          <p className="max-w-xl text-lg leading-[1.7] text-muted">
            I am {profile.name}, a frontend-focused engineer who cares about the systems behind the interface. I work mostly in React and
            TypeScript, and my projects follow the data all the way down: to locks, payment webhooks and event streams.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-medium text-canvas transition-all hover:bg-accent"
            >
              Explore selected work
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-6 py-3 font-medium transition-colors hover:border-ink/30"
            >
              Get in touch
            </a>
          </div>
          <div className="flex items-center gap-5 pt-2 text-muted">
            <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="transition-colors hover:text-ink">
              <Github size={20} />
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-ink">
              <Linkedin size={20} />
            </a>
            <span className="inline-flex items-center gap-1.5 text-sm">
              <MapPin size={15} /> {profile.location}
            </span>
          </div>
        </div>

        <DecisionSnapshot />
      </section>

      <a href="#work" className="mx-auto mb-8 hidden w-fit items-center gap-2 text-sm text-faint transition-colors hover:text-ink sm:flex">
        <ArrowDown size={15} /> Selected work
      </a>

      <section id="work" className="scroll-mt-24 pb-24">
        <SectionHeading
          eyebrow="Build"
          title="Selected work"
          action={
            <Link to="/projects" className="group inline-flex items-center gap-2 text-sm font-medium text-accent">
              All projects <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          }
        />
        <div className="grid gap-6 md:grid-cols-2">
          {featured.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      <section className="pb-24">
        <SectionHeading
          eyebrow="Explain"
          title="Engineering notes"
          action={
            <Link to="/writing" className="group inline-flex items-center gap-2 text-sm font-medium text-accent">
              All writing <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          }
        />
        <div className="-mx-6 divide-y divide-line border-y border-line sm:mx-0">
          {articles.map((a) => (
            <ArticleRow key={a.slug} article={a} />
          ))}
        </div>
      </section>

      <section className="pb-24">
        <SectionHeading eyebrow="Explore" title="Skills, shown through work" />
        <div className="grid gap-6 md:grid-cols-3">
          {skills.map((s) => (
            <div key={s.area} className="rounded-card border border-line bg-surface p-6 transition-colors hover:border-accent/30">
              <p className="mb-4 font-semibold">{s.area}</p>
              <ul className="mb-6 flex flex-wrap gap-1.5">
                {s.items.map((i) => (
                  <li key={i} className="rounded-full bg-sunken px-2.5 py-1 font-mono text-[0.72rem] text-muted">
                    {i}
                  </li>
                ))}
              </ul>
              <p className="border-t border-line pt-4 text-sm leading-[1.55] text-faint">
                <span className="text-muted">Seen in:</span> {s.evidence}
              </p>
            </div>
          ))}
        </div>
      </section>

      <ContactPanel />
    </>
  );
}
