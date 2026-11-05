import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from '@/lib/router';
import { usePageMeta } from '@/lib/seo';
import type { Article } from '@/content/types';
import { formatDate, getProject } from '@/content/queries';
import { SectionView } from '@/components/content/Blocks';
import { profile } from '@/data/profile';

export function ArticlePage({ article }: { article: Article }) {
  usePageMeta(article.title, article.summary);
  const project = article.relatedProject ? getProject(article.relatedProject) : null;

  return (
    <article className="mx-auto max-w-reading">
      <div className="animate-rise pt-12 sm:pt-16">
        <Link to="/writing" className="group mb-10 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink">
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" /> All writing
        </Link>
        <header className="space-y-6 border-b border-line pb-10">
          <ul className="flex flex-wrap gap-2">
            {article.tags.map((t) => (
              <li key={t} className="rounded-full bg-accent-soft px-3 py-1 font-mono text-[0.7rem] text-accent">
                {t}
              </li>
            ))}
          </ul>
          <h1 className="text-[2.1rem] font-semibold sm:text-5xl">{article.title}</h1>
          <p className="text-lg leading-[1.7] text-muted">{article.summary}</p>
          <div className="flex items-center gap-3 text-sm text-muted">
            <img src={profile.avatar} alt="" className="h-8 w-8 rounded-full ring-1 ring-line" />
            <span>{profile.name}</span>
            <span className="text-faint">·</span>
            <time dateTime={article.published}>{formatDate(article.published)}</time>
            <span className="text-faint">·</span>
            <span>{article.readingMinutes} min</span>
          </div>
        </header>
      </div>

      <div className="space-y-14 pt-12">
        {article.sections.map((s) => (
          <SectionView key={s.id} section={s} />
        ))}
      </div>

      {project && (
        <Link
          to={`/projects/${project.slug}`}
          className="group mt-16 block rounded-card border border-line bg-surface p-8 transition-colors hover:border-accent/40"
        >
          <p className="label mb-2">From the case study</p>
          <p className="flex items-center justify-between gap-4 text-2xl font-semibold">
            {project.title}
            <ArrowRight className="shrink-0 text-accent transition-transform group-hover:translate-x-1" />
          </p>
          <p className="mt-2 leading-[1.6] text-muted">{project.summary}</p>
        </Link>
      )}
    </article>
  );
}
