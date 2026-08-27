import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { syncApprovedBusinesses } from './sync-approved-businesses.mjs';

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

async function cleanAndSync() {
  console.log('--- Step 1: Scanning Firestore businesses ---');
  const snap = await getDocs(collection(db, 'businesses'));
  console.log(`Total documents found in Firestore: ${snap.size}`);

  const toDelete = [];
  const approved = [];

  snap.forEach(docSnap => {
    const data = docSnap.data();
    const status = (data.status || '').toLowerCase().trim();
    if (status !== 'approved') {
      toDelete.push({
        id: docSnap.id,
        name: data.businessName || data.name || 'Unnamed',
        slug: data.slug,
        status: data.status,
      });
    } else {
      approved.push({
        id: docSnap.id,
        name: data.businessName || data.name || 'Unnamed',
        slug: data.slug,
      });
    }
  });

  console.log(`\nFound ${toDelete.length} pending / unapproved businesses to delete.`);
  console.log(`Found ${approved.length} approved businesses to retain.\n`);

  console.log('--- Step 2: Deleting pending businesses from Firestore ---');
  let deletedCount = 0;
  for (const item of toDelete) {
    try {
      await deleteDoc(doc(db, 'businesses', item.id));
      deletedCount++;
      console.log(`🗑️ Deleted [${deletedCount}/${toDelete.length}]: "${item.name}" (docId: ${item.id}, slug: ${item.slug})`);
    } catch (err) {
      console.error(`❌ Failed to delete ${item.id}:`, err);
    }
  }

  console.log(`\n✅ Deleted ${deletedCount} pending businesses from Firestore.`);

  console.log('\n--- Step 3: Syncing approved businesses to static-businesses.json ---');
  await syncApprovedBusinesses();

  console.log('\n--- Step 4: Final verification scan ---');
  const verifySnap = await getDocs(collection(db, 'businesses'));
  console.log(`Remaining documents in Firestore: ${verifySnap.size}`);
  verifySnap.forEach((docSnap, idx) => {
    const data = docSnap.data();
    console.log(`${idx + 1}. [${data.status}] "${data.businessName || data.name}" | slug: ${data.slug}`);
  });

  console.log('\n🎉 Cleanup and sync completed successfully!');
}

cleanAndSync().catch(console.error);
