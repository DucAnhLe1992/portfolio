import { useState } from 'react';
import { ArrowUpRight, Check, Copy, FileText, Github, Linkedin, Mail } from 'lucide-react';
import { profile } from '@/data/profile';

export function ContactPanel() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    if (!profile.email) return;
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const links = [
    { href: profile.links.linkedin, label: 'LinkedIn', sub: 'ducanhle92', icon: Linkedin },
    { href: profile.links.github, label: 'GitHub', sub: 'DucAnhLe1992', icon: Github },
    ...(profile.cvUrl ? [{ href: profile.cvUrl, label: 'CV', sub: 'Download PDF', icon: FileText }] : []),
  ];

  return (
    <section id="contact" className="scroll-mt-24">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-[#16302a] px-6 py-14 text-[#eef3ef] sm:px-12 sm:py-16">
        <div className="notebook-grid pointer-events-none absolute inset-0 opacity-[0.08]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div className="min-w-0 space-y-5">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[#9fd8c8]">Contact</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">Open to conversations about frontend and full-stack work.</h2>
            <p className="max-w-lg leading-[1.7] text-[#c5d3cc]">
              The quickest way to reach me is LinkedIn. If you are reviewing a project, every case study links to its source.
            </p>
            {profile.email && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label={`Copy email address ${profile.email}`}
                  title="Copy email address"
                  className="inline-flex max-w-full items-center gap-3 rounded-full bg-[#eef3ef] px-5 py-3 text-left font-medium text-[#16302a] transition-transform hover:-translate-y-0.5"
                >
                  <Mail size={17} className="shrink-0" aria-hidden="true" />
                  <span className="min-w-0 break-all">{profile.email}</span>
                  {copied ? (
                    <Check size={16} className="shrink-0" aria-hidden="true" />
                  ) : (
                    <Copy size={16} className="shrink-0 opacity-60" aria-hidden="true" />
                  )}
                </button>
                <p role="status" aria-live="polite" className="min-h-5 pl-5 text-sm text-[#9fd8c8]">
                  {copied ? 'Email copied to clipboard' : ''}
                </p>
              </div>
            )}
          </div>
          <ul className="min-w-0 space-y-3">
            {links.map(({ href, label, sub, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-white/25 hover:bg-white/[0.08]"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{label}</span>
                    <span className="block text-sm text-[#a9bbb2]">{sub}</span>
                  </span>
                  <ArrowUpRight size={18} className="text-[#a9bbb2] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
