import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

const firebaseConfig = {
  apiKey: 'AIzaSyC1dRJtLFMhBqieIj6JrtZsd4j0jd1xM_Y',
  authDomain: 'branches-app-ff0a2.firebaseapp.com',
  projectId: 'branches-app-ff0a2',
  storageBucket: 'branches-app-ff0a2.appspot.com',
  messagingSenderId: '817543103901',
  appId: '1:817543103901:web:0f1de5eacc949505dc9b74',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function serializeDate(val) {
  if (!val) return new Date().toISOString();
  if (val.toDate && typeof val.toDate === 'function') {
    return val.toDate().toISOString();
  }
  if (val.seconds) {
    return new Date(val.seconds * 1000).toISOString();
  }
  if (typeof val === 'string') {
    return val;
  }
  return new Date().toISOString();
}

export async function syncApprovedBusinesses() {
  console.log('🔄 Syncing approved businesses from Firestore to static-businesses.json...');
  const jsonPath = path.join(process.cwd(), 'lib', 'static-businesses.json');
  let staticList = [];
  if (fs.existsSync(jsonPath)) {
    staticList = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  }

  const staticMap = new Map();
  staticList.forEach(item => {
    if (item.slug) {
      staticMap.set(item.slug.toLowerCase().trim(), item);
    }
  });

  const q = query(collection(db, 'businesses'), where('status', '==', 'approved'));
  const snap = await getDocs(q);
  console.log(`Found ${snap.size} approved businesses in Firestore.`);

  let addedCount = 0;
  let updatedCount = 0;

  snap.forEach(docSnap => {
    const data = docSnap.data();
    const slug = (data.slug || docSnap.id).toLowerCase().trim();
    const businessName = data.businessName || data.name || 'Business';
    const city = data.city || 'Pakistan';
    const category = data.category || 'business';
    const categoryId = data.categoryId || category;
    const categorySlug = data.categorySlug || categoryId;

    const formatted = {
      id: docSnap.id,
      businessName: businessName,
      name: businessName,
      slug: slug,
      city: city,
      category: category,
      categoryId: categoryId,
      categorySlug: categorySlug,
      description: data.description || `Verified ${category} in ${city}, Pakistan.`,
      phone: data.phone || '',
      logoUrl: data.logoUrl || data.logo || '',
      coverImage: data.coverImage || data.coverImageUrl || '',
      status: 'approved',
      isFeatured: !!(data.isFeatured || data.featured),
      featured: !!(data.isFeatured || data.featured),
      createdAt: serializeDate(data.createdAt),
      updatedAt: serializeDate(data.updatedAt || data.createdAt),
      rating: typeof data.rating === 'number' ? data.rating : 5,
      reviewCount: typeof data.reviewCount === 'number' ? data.reviewCount : 1,
      websiteUrl: data.websiteUrl || data.website || '',
      facebookPage: data.facebookPage || '',
      address: data.address || `${city}, Pakistan`,
      whatsapp: data.whatsapp || data.phone || '',
      email: data.email || '',
      youtubeChannel: data.youtubeChannel || '',
      subCategory: data.subCategory || '',
      verified: true,
      isClaimed: true,
    };

    if (staticMap.has(slug)) {
      staticMap.set(slug, { ...staticMap.get(slug), ...formatted });
      updatedCount++;
    } else {
      staticMap.set(slug, formatted);
      addedCount++;
    }
  });

  const updatedArray = Array.from(staticMap.values());
  fs.writeFileSync(jsonPath, JSON.stringify(updatedArray, null, 2), 'utf8');
  console.log(`✅ Sync complete! Added: ${addedCount}, Updated: ${updatedCount}, Total in JSON: ${updatedArray.length}`);
}

// Run if called directly
if (process.argv[1]?.endsWith('sync-approved-businesses.mjs')) {
  syncApprovedBusinesses().then(() => process.exit(0)).catch(err => {
    console.error('Error syncing approved businesses:', err);
    process.exit(1);
  });
}
