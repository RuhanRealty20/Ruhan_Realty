import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const dist=path.join(root,'client','dist');
const required=['index.html','robots.txt','sitemap.xml','site.webmanifest','favicon.svg','favicon-32.png','apple-touch-icon.png','icon-192.png','icon-512.png','about/index.html','properties/index.html','areas/miami-beach/index.html','.well-known/security.txt'];
const failures=[];
await Promise.all(required.map(async file=>{try{await access(path.join(dist,file))}catch{failures.push(`Missing production artifact: ${file}`)}}));

async function textFiles(directory){
  const entries=await readdir(directory,{withFileTypes:true});
  const nested=await Promise.all(entries.map(async entry=>{const full=path.join(directory,entry.name);if(entry.isDirectory())return textFiles(full);return /\.(?:html|js|css|json|xml|txt|webmanifest|map)$/i.test(entry.name)?[full]:[]}));
  return nested.flat();
}

const files=await textFiles(dist);
for(const file of files){
  const contents=await readFile(file,'utf8');
  if(contents.includes('http://localhost:5000'))failures.push(`Development API URL found in ${path.relative(dist,file)}`);
  if(/mongodb\+srv:|GEMINI_API_KEY|IDX_API_KEY|JWT_ACCESS_SECRET/.test(contents))failures.push(`Server credential marker found in ${path.relative(dist,file)}`);
  if(file.endsWith('.html')&&!contents.includes('<link rel="canonical"'))failures.push(`Canonical missing from ${path.relative(dist,file)}`);
}
if(files.some(file=>file.endsWith('.map')))failures.push('Production source maps must not be published.');
const sitemap=await readFile(path.join(dist,'sitemap.xml'),'utf8');
if(!sitemap.includes('https://ruhanrealty.com/properties'))failures.push('Properties landing page is missing from sitemap.xml.');
if(sitemap.includes('/areas/miami-beach'))failures.push('Placeholder area detail pages must not be published in sitemap.xml.');
const areaHtml=await readFile(path.join(dist,'areas','miami-beach','index.html'),'utf8');
if(!areaHtml.includes('noindex,nofollow'))failures.push('Placeholder area detail pages must remain noindex until reviewed content is published.');
const robots=await readFile(path.join(dist,'robots.txt'),'utf8');
if(!robots.includes('Disallow: /admin/')||!robots.includes('Sitemap: https://ruhanrealty.com/sitemap.xml'))failures.push('robots.txt is missing required admin or sitemap rules.');
if(failures.length){console.error(failures.map(item=>`- ${item}`).join('\n'));process.exit(1)}
console.log(`Production artifact check passed (${files.length} text assets inspected).`);
