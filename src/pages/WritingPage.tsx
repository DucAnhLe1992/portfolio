import { getArticles } from '@/content/queries';
import { ArticleRow } from '@/components/writing/ArticleRow';
import { PageIntro } from '@/components/ui/Headings';

export function WritingPage() {
  const articles = getArticles();

  return (
    <>
      <PageIntro eyebrow="Explain" title="Engineering notes.">
        <p>Short, specific write-ups of problems I have actually worked through. Each one links back to the code it came from.</p>
      </PageIntro>
      <div className="-mx-6 divide-y divide-line border-y border-line sm:mx-0">
        {articles.map((a) => (
          <ArticleRow key={a.slug} article={a} />
        ))}
      </div>
    </>
  );
}
