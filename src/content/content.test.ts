import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getArticle, getArticles, getProject, getProjects } from '@/content/queries';
import type { Section } from '@/content/types';
import { profile } from '@/data/profile';

const PINNED = /^https:\/\/github\.com\/DucAnhLe1992\/[\w.-]+\/(blob|tree)\/[0-9a-f]{40}\//;

function sourceLinks(sections: Section[]) {
  return sections.flatMap((s) => s.sources ?? []);
}

describe('content integrity', () => {
  const projects = getProjects();
  const articles = getArticles();

  it('uses unique slugs', () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
    expect(new Set(articles.map((a) => a.slug)).size).toBe(articles.length);
  });

  it('uses unique section ids within each page', () => {
    for (const page of [...projects, ...articles]) {
      const ids = page.sections.map((s) => s.id);
      expect(new Set(ids).size, page.slug).toBe(ids.length);
    }
  });

  it('only links to writing and projects that exist', () => {
    for (const p of projects) for (const slug of p.relatedWriting ?? []) expect(getArticle(slug), slug).not.toBeNull();
    for (const a of articles) if (a.relatedProject) expect(getProject(a.relatedProject), a.relatedProject).not.toBeNull();
  });

  it('pins every source link to a commit', () => {
    const links = [...projects, ...articles].flatMap((page) => sourceLinks(page.sections));
    expect(links.length).toBeGreaterThan(0);
    for (const l of links) expect(l.href, l.label).toMatch(PINNED);
  });

  it('uses ISO dates and orders articles newest first', () => {
    for (const a of articles) expect(a.published).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const dates = articles.map((a) => a.published);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it('describes the overlap check with inclusive comparisons', () => {
    const article = getArticle('preventing-overlapping-reservations');
    const code = article?.sections.flatMap((s) => s.blocks).find((b) => b.type === 'code');
    expect(code && code.type === 'code' && code.code).toMatch(/start_date <= \$3[\s\S]*end_date\s+>= \$2/);
  });

  it('gives every project a substantive outcome', () => {
    for (const p of projects) {
      for (const [field, text] of Object.entries(p.outcome)) expect(text.length, `${p.slug}.${field}`).toBeGreaterThan(20);
    }
  });

  it('describes screenshots with local files, alt text, captions and dimensions', () => {
    for (const f of projects.flatMap((p) => p.screenshots ?? [])) {
      expect(f.src).toMatch(/^\/screenshots\/[\w.-]+\.(png|jpe?g|webp)$/);
      expect(f.alt.length, f.src).toBeGreaterThan(10);
      expect(f.caption.length, f.src).toBeGreaterThan(0);
      expect(f.width > 0 && f.height > 0, f.src).toBe(true);
      expect(existsSync(`public${f.src}`), `${f.src} is missing from public/`).toBe(true);
    }
  });

  it('links the CV to a PDF that ships with the site', () => {
    if (!profile.cvUrl) return;
    expect(profile.cvUrl).toMatch(/^\/[\w.-]+\.pdf$/);
    expect(existsSync(`public${profile.cvUrl}`), `${profile.cvUrl} is missing from public/`).toBe(true);
  });
});
