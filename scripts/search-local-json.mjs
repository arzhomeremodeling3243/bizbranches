import fs from 'fs';
import path from 'path';

const staticData = JSON.parse(fs.readFileSync('lib/static-businesses.json', 'utf8'));

console.log('Total static businesses in JSON:', staticData.length);

const hospital = staticData.filter(b => (b.slug && b.slug.includes('hospital')) || (b.businessName && b.businessName.toLowerCase().includes('hospital')));
console.log('Static businesses with hospital:', hospital.map(b => ({ slug: b.slug, name: b.businessName, city: b.city })));

const fit = staticData.filter(b => (b.slug && b.slug.includes('fit')) || (b.businessName && b.businessName.toLowerCase().includes('fit')));
console.log('Static businesses with fit:', fit.map(b => ({ slug: b.slug, name: b.businessName, city: b.city })));

const modernHospital3 = staticData.find(b => b.slug === 'the-modern-hospital-karachi-3');
console.log('Has the-modern-hospital-karachi-3?:', !!modernHospital3);

const fitVibe = staticData.find(b => b.slug === 'fit-vibe-female-personal-trainer-lahore-lahore');
console.log('Has fit-vibe-female-personal-trainer-lahore-lahore?:', !!fitVibe);
