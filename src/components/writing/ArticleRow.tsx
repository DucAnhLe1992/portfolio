import { ArrowRight } from 'lucide-react';
import { Link } from '@/lib/router';
import type { Article } from '@/content/types';
import { formatDate } from '@/content/queries';

export function ArticleRow({ article }: { article: Article }) {
  return (
    <article className="group relative grid gap-3 rounded-card p-6 transition-colors duration-300 hover:bg-surface sm:grid-cols-[10rem_1fr] sm:gap-8 sm:p-8">
      <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-1">
        <time dateTime={article.published} className="label">
          {formatDate(article.published)}
        </time>
        <span className="label">{article.readingMinutes} min read</span>
      </div>
      <div className="space-y-3">
        <h3 className="text-xl font-semibold transition-colors group-hover:text-accent">
          <Link to={`/writing/${article.slug}`} className="after:absolute after:inset-0 focus-visible:ring-0">
            {article.title}
          </Link>
        </h3>
        <p className="leading-[1.65] text-muted">{article.summary}</p>
        <span className="inline-flex items-center gap-2 text-sm font-medium text-accent">
          Read note
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
