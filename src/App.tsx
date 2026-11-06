import { useEffect, type ReactNode } from 'react';
import { RouterProvider, useRouter } from '@/lib/router';
import { matchRoute } from '@/lib/paths';
import { usePageMeta } from '@/lib/seo';
import { getArticle, getProject } from '@/content/queries';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { HomePage } from '@/pages/HomePage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { ProjectPage } from '@/pages/ProjectPage';
import { WritingPage } from '@/pages/WritingPage';
import { ArticlePage } from '@/pages/ArticlePage';
import { AboutPage } from '@/pages/AboutPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

function resolve(path: string): ReactNode {
  const staticRoutes: Record<string, () => ReactNode> = {
    '/': () => <HomePage />,
    '/projects': () => <ProjectsPage />,
    '/writing': () => <WritingPage />,
    '/about': () => <AboutPage />,
    '/privacy': () => <PrivacyPage />,
  };
  if (staticRoutes[path]) return staticRoutes[path]();

  const projectMatch = matchRoute('/projects/:slug', path);
  if (projectMatch) {
    const project = getProject(projectMatch.slug);
    return project ? <ProjectPage key={project.slug} project={project} /> : <NotFoundPage />;
  }

  const articleMatch = matchRoute('/writing/:slug', path);
  if (articleMatch) {
    const article = getArticle(articleMatch.slug);
    return article ? <ArticlePage key={article.slug} article={article} /> : <NotFoundPage />;
  }

  return <NotFoundPage />;
}

function Shell() {
  const { path } = useRouter();
  usePageMeta(path);
  useEffect(() => {
    document.documentElement.dataset.hydrated = 'true';
  }, []);
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-ink px-4 py-2 text-canvas focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-wide flex-1 px-6 outline-none">
        {resolve(path)}
      </main>
      <Footer />
    </div>
  );
}

export default function App({ initialPath }: { initialPath?: string }) {
  return (
    <RouterProvider initialPath={initialPath}>
      <Shell />
    </RouterProvider>
  );
}
