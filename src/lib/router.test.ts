import { describe, expect, it } from 'vitest';
import { matchRoute, normalize } from '@/lib/router';

describe('matchRoute', () => {
  it('extracts and decodes params', () => {
    expect(matchRoute('/projects/:slug', '/projects/car-rental')).toEqual({ slug: 'car-rental' });
    expect(matchRoute('/writing/:slug', '/writing/a%20b')).toEqual({ slug: 'a b' });
  });

  it('rejects paths with a different shape', () => {
    expect(matchRoute('/projects/:slug', '/projects')).toBeNull();
    expect(matchRoute('/projects/:slug', '/writing/car-rental')).toBeNull();
    expect(matchRoute('/projects/:slug', '/projects/a/b')).toBeNull();
  });

  it('returns null instead of throwing on malformed encoding', () => {
    expect(() => matchRoute('/projects/:slug', '/projects/%E0%A4%A')).not.toThrow();
    expect(matchRoute('/projects/:slug', '/projects/%E0%A4%A')).toBeNull();
  });
});

describe('normalize', () => {
  it('strips trailing slashes but keeps the root', () => {
    expect(normalize('/projects/')).toBe('/projects');
    expect(normalize('/projects//')).toBe('/projects');
    expect(normalize('/')).toBe('/');
  });
});
