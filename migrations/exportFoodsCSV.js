import fs from 'fs';

const data = JSON.parse(fs.readFileSync('migrations/.foods-cache.json', 'utf8'));

const lines = ['id,name'];
data.forEach(f => {
  const name = f.name.replace(/"/g, '""'); // escape quotes
  lines.push(`${f.id},"${name}"`);
});

fs.writeFileSync('migrations/foods.csv', lines.join('\n'), 'utf8');
console.log(`Exported ${data.length} foods to migrations/foods.csv`);
