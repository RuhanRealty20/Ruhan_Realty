import { writeFile } from 'node:fs/promises';

const base=(process.env.VITE_SITE_URL||'https://ruhanrealty.com').replace(/\/$/,'');
const staticRoutes=['','properties','buy','sell','rent','landlord','invest','relocate','new-construction','contact','ny-nj-to-miami','areas','about'];
// Area detail pages stay out of the sitemap until each page has substantive,
// broker-reviewed copy and approved live data. This prevents thin placeholder
// pages from entering the search index.
const urls=staticRoutes.map(path=>`${base}/${path}`);
const lastmod=new Date().toISOString().slice(0,10);
const xml=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url=>`  <url><loc>${url}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')}\n</urlset>\n`;
const robots=`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nDisallow: /*?*utm_*\nDisallow: /properties?*\n\nSitemap: ${base}/sitemap.xml\n`;
await Promise.all([
  writeFile(new URL('../public/sitemap.xml',import.meta.url),xml),
  writeFile(new URL('../public/robots.txt',import.meta.url),robots),
]);
console.log(`Generated SEO files with ${urls.length} canonical URLs.`);
