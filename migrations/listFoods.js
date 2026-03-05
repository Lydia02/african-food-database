import fs from 'fs';

const data = JSON.parse(fs.readFileSync('migrations/.foods-cache.json', 'utf8'));

const noImage = data.filter(f => !f.imageUrl || !String(f.imageUrl).trim());
const hasWiki = data.filter(f => f.imageUrl && f.imageUrl.includes('wikipedia'));
const hasUnsplash = data.filter(f => f.imageUrl && f.imageUrl.includes('unsplash'));
const hasOther = data.filter(f => f.imageUrl && !f.imageUrl.includes('wikipedia') && !f.imageUrl.includes('unsplash'));

console.log('=== FOOD IMAGE AUDIT ===');
console.log('Total foods:', data.length);
console.log('Has imageUrl:', data.length - noImage.length);
console.log('  - Wikipedia URLs:', hasWiki.length);
console.log('  - Unsplash URLs:', hasUnsplash.length);
console.log('  - Other URLs:', hasOther.length);
console.log('No imageUrl (MISSING):', noImage.length);
console.log('');
console.log('--- ALL FOODS ---');
data.forEach((f, i) => {
  const source = !f.imageUrl ? 'MISSING'
    : f.imageUrl.includes('wikipedia') ? 'WIKI'
    : f.imageUrl.includes('unsplash') ? 'UNSPLASH'
    : 'OTHER';
  console.log(`${String(i+1).padStart(3, ' ')}. [${source.padEnd(8)}] ${f.name}`);
});

console.log('\n--- MISSING IMAGE FOODS ---');
noImage.forEach((f, i) => console.log(`${i+1}. ${f.name} (${f.countryName})`));

console.log('\n--- WIKIPEDIA IMAGE FOODS ---');
hasWiki.forEach((f, i) => console.log(`${i+1}. ${f.name} | ${f.imageUrl}`));
