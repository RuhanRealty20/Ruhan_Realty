import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { mkdir } from 'node:fs/promises';

const assets = [
  ['miami-waterfront-hero', 1920],
  ['brickell-waterfront-editorial', 1600],
  ['miami-beach-editorial', 1600],
  ['coconut-grove-editorial', 1600],
  ['luxury-interior-editorial', 1600],
  ['ruhan-syed-color-portrait', 1800],
];

await Promise.all(assets.flatMap(([name,width]) => {
  const source=fileURLToPath(new URL(`../src/assets/${name}.png`,import.meta.url));
  return [
    sharp(source).resize({width,withoutEnlargement:true}).webp({quality:80,smartSubsample:true}).toFile(fileURLToPath(new URL(`../src/assets/${name}.webp`,import.meta.url))),
    sharp(source).resize({width,withoutEnlargement:true}).avif({quality:55,effort:5}).toFile(fileURLToPath(new URL(`../src/assets/${name}.avif`,import.meta.url))),
  ];
}));
const publicImages=fileURLToPath(new URL('../public/images/',import.meta.url));
await mkdir(publicImages,{recursive:true});
const favicon=fileURLToPath(new URL('../public/favicon.svg',import.meta.url));
await Promise.all([
  sharp(fileURLToPath(new URL('../src/assets/ruhan-syed-color-portrait.png',import.meta.url))).resize({width:1200,withoutEnlargement:true}).webp({quality:82,smartSubsample:true}).toFile(fileURLToPath(new URL('../public/images/ruhan-syed-miami-realtor.webp',import.meta.url))),
  sharp(fileURLToPath(new URL('../src/assets/miami-waterfront-hero.png',import.meta.url))).resize(1200,630,{fit:'cover',position:'center'}).jpeg({quality:84,progressive:true}).toFile(fileURLToPath(new URL('../public/og-default.jpg',import.meta.url))),
  sharp(favicon).resize(32,32).png().toFile(fileURLToPath(new URL('../public/favicon-32.png',import.meta.url))),
  sharp(favicon).resize(180,180).png().toFile(fileURLToPath(new URL('../public/apple-touch-icon.png',import.meta.url))),
  sharp(favicon).resize(192,192).png().toFile(fileURLToPath(new URL('../public/icon-192.png',import.meta.url))),
  sharp(favicon).resize(512,512).png().toFile(fileURLToPath(new URL('../public/icon-512.png',import.meta.url))),
]);
console.log(`Optimized ${assets.length} editorial images and generated application icons.`);
