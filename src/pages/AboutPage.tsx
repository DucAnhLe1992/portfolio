import { ArrowUpRight, Briefcase, Github, GraduationCap, Mail, MapPin } from 'lucide-react';
import { education, experience, learning, profile } from '@/data/profile';
import { ContactPanel } from '@/components/site/ContactPanel';

const principles = [
  { title: 'Put authority where the truth is', text: 'Payment state comes from the payment provider, availability from the database. The interface reflects; it does not decide.' },
  { title: 'Make the hard part visible', text: 'A case study is more useful when it explains one difficult decision than when it lists every feature.' },
  { title: 'Be honest about provenance', text: 'Course-derived and AI-assisted work is labelled, and limitations sit next to achievements.' },
];

export function AboutPage() {
  return (
    <>
      <section className="grid gap-12 pb-24 pt-16 sm:pt-24 lg:grid-cols-[1fr_20rem] lg:gap-20">
        <div className="animate-rise space-y-8">
          <p className="label text-accent">About</p>
          <h1 className="text-4xl font-semibold sm:text-5xl">
            I am {profile.name}. I build interfaces and like knowing what happens behind them.
          </h1>
          <div className="max-w-reading space-y-5 text-[1.05rem] leading-[1.75] text-muted">
            <p>
              I am a software engineer based in {profile.location}, working as a {profile.jobTitle.toLowerCase()} at {profile.company} since
              December 2022. Most of my day is spent on data-heavy enterprise interfaces in React and TypeScript, such as Gantt and Kanban
              schedulers and multi-step wizards, and I add the Java, GraphQL and SQL work behind them when a feature needs it.
            </p>
            <p>
              Outside work, the projects I enjoy most are the ones where a clean interface depends on something less visible being right: a
              transaction that cannot double-book, a webhook that must be trusted, a bundler running inside a browser tab.
            </p>
            <p>
              I studied software engineering at VAMK in Vaasa, and I am now doing a master’s in artificial intelligence at the University of
              Lübeck alongside work. I will write about AI here once there is real work to show.
            </p>
            <p>
              My name is pronounced <span className="font-mono text-ink">{profile.pronunciation}</span>, and Duc Anh works perfectly well too.
            </p>
          </div>
        </div>
        <aside className="animate-rise space-y-4 [animation-delay:120ms]">
          <div className="overflow-hidden rounded-card border border-line bg-surface p-2">
            <img src={profile.avatar} alt={`Portrait of ${profile.name}`} className="aspect-square w-full rounded-[1rem] object-cover" />
          </div>
          <ul className="space-y-3 rounded-card border border-line bg-surface p-5 text-sm">
            <li className="flex items-center gap-3 text-muted">
              <MapPin size={16} className="text-accent" /> {profile.location}
            </li>
            <li className="flex items-center gap-3 text-muted">
              <Briefcase size={16} className="text-accent" /> {profile.jobTitle}, {profile.company}
            </li>
            <li className="flex items-center gap-3 text-muted">
              <GraduationCap size={16} className="text-accent" /> MSc AI student, Lübeck (online)
            </li>
            {profile.email && (
              <li>
                <a href={`mailto:${profile.email}`} className="flex items-center gap-3 break-all text-muted transition-colors hover:text-accent">
                  <Mail size={16} className="shrink-0 text-accent" /> {profile.email}
                </a>
              </li>
            )}
            <li>
              <a href={profile.links.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-muted transition-colors hover:text-accent">
                <Github size={16} className="text-accent" /> DucAnhLe1992 on GitHub
              </a>
            </li>
          </ul>
        </aside>
      </section>

      <section className="pb-24">
        <p className="label mb-3 text-accent">How I work</p>
        <h2 className="mb-10 text-3xl font-semibold">Three habits</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {principles.map((p, i) => (
            <div key={p.title} className="rounded-card border border-line bg-surface p-6">
              <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mb-3 mt-4 text-lg font-semibold">{p.title}</h3>
              <p className="leading-[1.65] text-muted">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-24">
        <p className="label mb-3 text-accent">Experience</p>
        <h2 className="mb-10 text-3xl font-semibold">Where I have worked</h2>
        <ol className="space-y-4">
          {experience.map((e) => (
            <li key={`${e.org}-${e.role}`} className="rounded-card border border-line bg-surface p-6 transition-colors hover:border-accent/30 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{e.role}</h3>
                  <p className="text-muted">
                    {e.org} &middot; {e.location}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-xs ${
                    e.current ? 'bg-accent-soft text-accent' : 'bg-sunken text-muted'
                  }`}
                >
                  {e.current && <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-ok" aria-hidden="true" />}
                  {e.period}
                </span>
              </div>
              <ul className="mt-5 space-y-2.5">
                {e.points.map((pt) => (
                  <li key={pt} className="flex gap-3 leading-[1.65] text-muted">
                    <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="pb-24">
        <p className="label mb-3 text-accent">Education</p>
        <h2 className="mb-10 text-3xl font-semibold">Degrees</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {education.map((ed) => (
            <div key={ed.title} className="flex flex-col rounded-card border border-line bg-surface p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
                  <GraduationCap size={19} aria-hidden="true" />
                </span>
                {ed.status && <span className="rounded-full bg-ochre-soft px-3 py-1 font-mono text-xs text-ochre">{ed.status}</span>}
              </div>
              <h3 className="text-lg font-semibold">{ed.title}</h3>
              <p className="mt-1 text-muted">{ed.org}</p>
              <p className="label mt-1">{ed.period}</p>
              <p className="mt-4 border-t border-line pt-4 leading-[1.65] text-muted">{ed.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-24">
        <p className="label mb-3 text-accent">Also</p>
        <h2 className="mb-10 text-3xl font-semibold">Courses with public coursework</h2>
        <ol className="relative space-y-6 border-l border-line pl-8">
          {learning.map((l) => (
            <li key={l.title} className="relative">
              <span className="absolute -left-[41px] top-1 grid h-5 w-5 place-items-center rounded-full border border-line bg-canvas">
                <span className="h-2 w-2 rounded-full bg-accent" />
              </span>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <GraduationCap size={17} className="text-muted" /> {l.title}
                </h3>
                <span className="label">{l.org}</span>
              </div>
              <p className="mt-2 max-w-reading leading-[1.65] text-muted">{l.note}</p>
              {l.repo && (
                <a href={l.repo} target="_blank" rel="noreferrer" className="link mt-2 inline-flex items-center gap-1 text-sm">
                  Coursework on GitHub <ArrowUpRight size={14} />
                </a>
              )}
            </li>
          ))}
        </ol>
      </section>

      <ContactPanel />
    </>
  );
}
