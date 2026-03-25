import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import * as ts from 'typescript';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

function loadTsModule(tsFilePath) {
  const absPath = path.resolve(tsFilePath);
  const source = fs.readFileSync(absPath, 'utf8');

  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;

  const moduleObj = { exports: {} };
  const sandbox = {
    module: moduleObj,
    exports: moduleObj.exports,
    require,
    __dirname: path.dirname(absPath),
  };

  vm.runInNewContext(transpiled, sandbox, { filename: absPath });
  return sandbox.module.exports;
}

const projectRoot = process.cwd();

const bnbExports = loadTsModule(path.join(projectRoot, 'src/app/core/config/bnb.config.ts'));
const pagesExports = loadTsModule(path.join(projectRoot, 'src/app/core/config/pages-seo.config.ts'));

const bnbConfig = bnbExports.bnbConfig;
const pagesSeoConfig = pagesExports.pagesSeoConfig;

if (!bnbConfig?.seo?.urlSite) {
  throw new Error('generate-seo-assets: bnb.config.ts non contiene seo.urlSite');
}
if (!pagesSeoConfig) {
  throw new Error('generate-seo-assets: pages-seo.config.ts non contiene pagesSeoConfig');
}

const baseUrl = bnbConfig.seo.urlSite.replace(/\/+$/, '');

const routeOrder = [
  'home',
  'rooms',
  'about',
  'gallery',
  'contacts',
  'blog',
  'legal.privacy',
  'legal.cookie',
];

const publicRoutes = routeOrder
  .filter((k) => pagesSeoConfig[k])
  .map((k) => ({ key: k, cfg: pagesSeoConfig[k] }));

const formatLoc = (p) => `${baseUrl}${p.startsWith('/') ? p : `/${p}`}`;

const now = new Date().toISOString().slice(0, 10);

const sitemapUrlsXml = publicRoutes
  .map(({ key, cfg }) => {
    const loc = formatLoc(cfg.canonicalPath);
    const priority = key === 'home' ? '1.0' : '0.8';
    const changefreq = key === 'home' ? 'daily' : 'weekly';
    // lastmod opzionale: usiamo la data generazione per coerenza.
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${now}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n');
  })
  .join('\n');

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrlsXml}\n</urlset>\n`;

const robotsTxt = [
  'User-agent: *',
  'Allow: /',
  'Disallow: /admin/',
  `Sitemap: ${baseUrl}/sitemap.xml`,
  '',
].join('\n');

const outSitemapPath = path.join(projectRoot, 'src/assets/sitemap.xml');
const outRobotsPath = path.join(projectRoot, 'src/assets/robots.txt');

fs.writeFileSync(outSitemapPath, sitemapXml, 'utf8');
fs.writeFileSync(outRobotsPath, robotsTxt, 'utf8');

console.log('[seo-assets] generated', {
  sitemap: outSitemapPath,
  robots: outRobotsPath,
});

