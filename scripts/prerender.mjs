import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const ssrDir = join(root, 'dist-ssr');

const { render, getPageMeta, listRoutes, absoluteUrl } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href);

const template = await readFile(join(dist, 'index.html'), 'utf8');

const escape = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const managed = [
  /<title>[\s\S]*?<\/title>\s*/,
  /<meta\s+name="description"[\s\S]*?\/?>\s*/,
  /<meta\s+property="og:title"[\s\S]*?\/?>\s*/,
  /<meta\s+property="og:description"[\s\S]*?\/?>\s*/,
  /<meta\s+property="og:type"[\s\S]*?\/?>\s*/,
];

function page(path, meta) {
  const url = meta.found ? absoluteUrl(meta.path) : null;
  const head = [
    `<title>${escape(meta.title)}</title>`,
    `<meta name="description" content="${escape(meta.description)}" />`,
    `<meta property="og:title" content="${escape(meta.title)}" />`,
    `<meta property="og:description" content="${escape(meta.description)}" />`,
    `<meta property="og:type" content="${meta.type}" />`,
    `<meta name="robots" content="${meta.found ? 'index, follow' : 'noindex'}" />`,
    url && `<link rel="canonical" href="${escape(url)}" />`,
    url && `<meta property="og:url" content="${escape(url)}" />`,
  ]
    .filter(Boolean)
    .join('\n    ');

  let html = template;
  for (const re of managed) html = html.replace(re, '');
  return html
    .replace('</head>', () => `  ${head}\n  </head>`)
    .replace('<div id="root"></div>', () => `<div id="root" data-path="${escape(path)}">${render(path)}</div>`);
}

const routes = listRoutes();
for (const route of routes) {
  const meta = getPageMeta(route);
  if (!meta.found) throw new Error(`Route ${route} does not resolve to a page`);
  const file = route === '/' ? join(dist, 'index.html') : join(dist, route, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, page(route, meta));
}

await writeFile(join(dist, '404.html'), page('/404', getPageMeta('/404')));

const home = absoluteUrl('/');
const robots = ['User-agent: *', 'Allow: /'];
if (home) {
  const urls = routes.map((r) => `  <url><loc>${escape(absoluteUrl(r))}</loc></url>`).join('\n');
  await writeFile(
    join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  robots.push(`Sitemap: ${absoluteUrl('/sitemap.xml')}`);
} else {
  console.warn('prerender: profile.siteUrl is not set; skipping sitemap.xml and canonical links.');
}
await writeFile(join(dist, 'robots.txt'), `${robots.join('\n')}\n`);

await rm(ssrDir, { recursive: true, force: true });
console.log(`prerender: wrote ${routes.length} pages and 404.html`);
