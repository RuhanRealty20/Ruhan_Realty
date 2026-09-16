import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
const source=fileURLToPath(new URL('../src/assets/miami-waterfront-hero.png',import.meta.url));
await Promise.all([
  sharp(source).resize({width:1920,withoutEnlargement:true}).webp({quality:80,smartSubsample:true}).toFile(fileURLToPath(new URL('../src/assets/miami-waterfront-hero.webp',import.meta.url))),
  sharp(source).resize({width:1920,withoutEnlargement:true}).avif({quality:55,effort:5}).toFile(fileURLToPath(new URL('../src/assets/miami-waterfront-hero.avif',import.meta.url))),
]);
console.log('Optimized hero WebP and AVIF assets.');
