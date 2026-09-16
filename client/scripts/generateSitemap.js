import { writeFile } from 'node:fs/promises';
const base='https://ruhanrealty.com';
const staticRoutes=['','properties','buy','sell','rent','landlord','invest','relocate','new-construction','contact','ny-nj-to-miami','areas','market-today','about','insights','privacy','terms','cookies'];
const areas=['brickell','downtown-miami','miami-beach','south-beach','edgewater','coconut-grove','coral-gables','key-biscayne','fisher-island','sunny-isles','bal-harbour','aventura','north-miami-beach','fort-lauderdale'];
const urls=[...staticRoutes.map(path=>`${base}/${path}`),...areas.map(path=>`${base}/areas/${path}`)];
const xml=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url=>`  <url><loc>${url}</loc><changefreq>${url.includes('/areas/')?'weekly':'monthly'}</changefreq></url>`).join('\n')}\n</urlset>\n`;
await writeFile(new URL('../public/sitemap.xml',import.meta.url),xml);
console.log(`Generated sitemap with ${urls.length} URLs.`);
