import fs from 'fs';
import path from 'path';

const jsonPath = './lib/static-businesses.json';
console.log('Reading file...', jsonPath);
const dataStr = fs.readFileSync(jsonPath, 'utf8');
console.log('Parsing JSON...');
const data = JSON.parse(dataStr);
console.log('Total businesses:', data.length);

const idsToFind = ['89349784', '5242642', 89349784, 5242642];

const found = data.filter((b: any) => {
  return idsToFind.includes(b.id) || idsToFind.includes(String(b.id));
});

console.log('Found businesses:', JSON.stringify(found, null, 2));
