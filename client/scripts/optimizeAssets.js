import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const assets = [
  ['miami-waterfront-hero', 1920],
  ['brickell-waterfront-editorial', 1600],
  ['miami-beach-editorial', 1600],
  ['coconut-grove-editorial', 1600],
  ['luxury-interior-editorial', 1600],
];

await Promise.all(assets.flatMap(([name,width]) => {
  const source=fileURLToPath(new URL(`../src/assets/${name}.png`,import.meta.url));
  return [
    sharp(source).resize({width,withoutEnlargement:true}).webp({quality:80,smartSubsample:true}).toFile(fileURLToPath(new URL(`../src/assets/${name}.webp`,import.meta.url))),
    sharp(source).resize({width,withoutEnlargement:true}).avif({quality:55,effort:5}).toFile(fileURLToPath(new URL(`../src/assets/${name}.avif`,import.meta.url))),
  ];
}));
console.log(`Optimized ${assets.length} editorial images to WebP and AVIF.`);
