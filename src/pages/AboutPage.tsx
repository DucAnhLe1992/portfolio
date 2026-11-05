import { ArrowUpRight, Briefcase, GraduationCap, MapPin, Music } from 'lucide-react';
import { usePageMeta } from '@/lib/seo';
import { learning, profile } from '@/data/profile';
import { ContactPanel } from '@/components/site/ContactPanel';

const principles = [
  { title: 'Put authority where the truth is', text: 'Payment state comes from the payment provider, availability from the database. The interface reflects; it does not decide.' },
  { title: 'Make the hard part visible', text: 'A case study is more useful when it explains one difficult decision than when it lists every feature.' },
  { title: 'Be honest about provenance', text: 'Course-derived work is labelled, and limitations sit next to achievements.' },
];

export function AboutPage() {
  usePageMeta('About', `${profile.name} is a software engineer in ${profile.location}.`);

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
              I am a software engineer based in {profile.location}, currently at {profile.company}. My day-to-day home is React and TypeScript, but
              the projects I enjoy most are the ones where a clean interface depends on something less visible being right: a transaction that
              cannot double-book, a webhook that must be trusted, a bundler running inside a browser tab.
            </p>
            <p>
              Much of what I know I learned by building, through structured programmes like Full Stack Open and Integrify, and through long
              stretches of independent study. I am now exploring applied AI, and I will write about it here when there is real work to show
              rather than before.
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
              <Briefcase size={16} className="text-accent" /> {profile.company}
            </li>
            <li className="flex items-center gap-3 text-muted">
              <Music size={16} className="text-accent" /> Music and sound, on and off the keyboard
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
        <p className="label mb-3 text-accent">Learning</p>
        <h2 className="mb-10 text-3xl font-semibold">Where the foundations came from</h2>
        <ol className="relative space-y-6 border-l border-line pl-8">
          {learning.map((l) => (
            <li key={l.title} className="relative">
              <span className="absolute -left-[41px] top-1 grid h-5 w-5 place-items-center rounded-full border border-line bg-canvas">
                <span className="h-2 w-2 rounded-full bg-accent" />
              </span>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <GraduationCap size={17} className="text-faint" /> {l.title}
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
