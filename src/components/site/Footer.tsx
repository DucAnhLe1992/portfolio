import { Github, Linkedin } from 'lucide-react';
import { Link } from '@/lib/router';
import { profile } from '@/data/profile';

export function Footer() {
  return (
    <footer className="mt-32 border-t border-line">
      <div className="mx-auto flex max-w-wide flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="font-semibold">{profile.name}</p>
          <p className="text-sm text-muted">
            {profile.role} · {profile.location}
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
          <Link to="/projects" className="transition-colors hover:text-ink">Projects</Link>
          <Link to="/writing" className="transition-colors hover:text-ink">Writing</Link>
          <Link to="/about" className="transition-colors hover:text-ink">About</Link>
          <Link to="/privacy" className="transition-colors hover:text-ink">Privacy</Link>
          <span className="hidden h-4 w-px bg-line md:block" />
          <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="transition-colors hover:text-ink">
            <Github size={18} />
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-ink">
            <Linkedin size={18} />
          </a>
        </nav>
      </div>
      <div className="mx-auto max-w-wide px-6 pb-10">
        <p className="label">© {new Date().getFullYear()} {profile.latinName} · Designed and built from scratch</p>
      </div>
    </footer>
  );
}
