import { describe, expect, it } from 'vitest';
import { getPageMeta, listRoutes } from '@/lib/seo';

describe('page metadata', () => {
  it('gives every listed route a unique title and description', () => {
    const metas = listRoutes().map(getPageMeta);
    expect(metas.every((m) => m.found)).toBe(true);
    expect(new Set(metas.map((m) => m.title)).size).toBe(metas.length);
    for (const m of metas) expect(m.description.length).toBeGreaterThan(20);
  });

  it('marks unknown and malformed paths as not found', () => {
    expect(getPageMeta('/nope').found).toBe(false);
    expect(getPageMeta('/projects/unknown').found).toBe(false);
    expect(getPageMeta('/writing/%E0%A4%A').found).toBe(false);
  });

  it('treats a trailing slash as the same page', () => {
    expect(getPageMeta('/projects/car-rental/').title).toBe(getPageMeta('/projects/car-rental').title);
  });
});
