import { useEffect } from 'react';
import { matchRoute, normalize } from '@/lib/router';
import { getArticle, getArticles, getProject, getProjects } from '@/content/queries';
import { profile } from '@/data/profile';

const SITE = profile.name;

export type PageMeta = {
  path: string;
  title: string;
  description: string;
  type: 'website' | 'article';
  found: boolean;
};

const DEFAULT_DESCRIPTION =
  'Lê Đức Anh is a frontend-focused software engineer in Finland building thoughtful interfaces and reliable web applications with React and TypeScript.';

const staticPages: Record<string, { title: string | null; description: string }> = {
  '/': { title: null, description: DEFAULT_DESCRIPTION },
  '/projects': {
    title: 'Projects',
    description: 'Case studies in booking correctness, in-browser bundling and event-driven services.',
  },
  '/writing': {
    title: 'Writing',
    description: 'Engineering notes on payments, concurrency and the decisions behind my projects.',
  },
  '/about': {
    title: 'About',
    description: `${profile.name} is a ${profile.role.toLowerCase()} at ${profile.company} in ${profile.location}.`,
  },
  '/privacy': { title: 'Privacy', description: 'How this site handles data.' },
};

function fullTitle(title: string | null) {
  return title ? `${title} — ${SITE}` : `${SITE} — ${profile.role}`;
}

export function getPageMeta(rawPath: string): PageMeta {
  const path = normalize(rawPath);
  const page = staticPages[path];
  if (page) return { path, title: fullTitle(page.title), description: page.description, type: 'website', found: true };

  const pm = matchRoute('/projects/:slug', path);
  const project = pm && getProject(pm.slug);
  if (project) return { path, title: fullTitle(project.title), description: project.summary, type: 'article', found: true };

  const am = matchRoute('/writing/:slug', path);
  const article = am && getArticle(am.slug);
  if (article) return { path, title: fullTitle(article.title), description: article.summary, type: 'article', found: true };

  return { path, title: fullTitle('Page not found'), description: 'This page does not exist.', type: 'website', found: false };
}

export function listRoutes() {
  return [
    ...Object.keys(staticPages),
    ...getProjects().map((p) => `/projects/${p.slug}`),
    ...getArticles().map((a) => `/writing/${a.slug}`),
  ];
}

export function absoluteUrl(path: string) {
  return profile.siteUrl ? `${profile.siteUrl.replace(/\/$/, '')}${path === '/' ? '/' : path}` : null;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function usePageMeta(path: string) {
  useEffect(() => {
    const meta = getPageMeta(path);
    document.title = meta.title;
    setMeta('name', 'description', meta.description);
    setMeta('property', 'og:title', meta.title);
    setMeta('property', 'og:description', meta.description);
    setMeta('property', 'og:type', meta.type);
    setMeta('name', 'robots', meta.found ? 'index, follow' : 'noindex');
    const url = absoluteUrl(meta.path);
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (url) {
      setMeta('property', 'og:url', url);
      if (canonical) canonical.href = url;
      else {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = url;
        document.head.appendChild(link);
      }
    }
  }, [path]);
}
