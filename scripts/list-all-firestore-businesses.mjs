import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfigProject = {
  apiKey: 'AIzaSyC1dRJtLFMhBqieIj6JrtZsd4j0jd1xM_Y',
  authDomain: 'branches-app-ff0a2.firebaseapp.com',
  projectId: 'branches-app-ff0a2',
  storageBucket: 'branches-app-ff0a2.appspot.com',
  messagingSenderId: '817543103901',
  appId: '1:817543103901:web:0f1de5eacc949505dc9b74',
};

const app = initializeApp(firebaseConfigProject);
const db = getFirestore(app);

async function checkAll() {
  console.log('Fetching all businesses from Firestore (branches-app-ff0a2)...');
  const snap = await getDocs(collection(db, 'businesses'));
  console.log(`Total documents found: ${snap.size}`);

  const byStatus = {};
  const list = [];

  snap.forEach((docSnap) => {
    const data = docSnap.data();
    const status = data.status || 'NO_STATUS';
    byStatus[status] = (byStatus[status] || 0) + 1;
    list.push({
      docId: docSnap.id,
      name: data.businessName || data.name || 'Unnamed',
      slug: data.slug,
      status: data.status,
      city: data.city,
      category: data.category,
      createdAt: data.createdAt,
    });
  });

  console.log('Counts by status:', JSON.stringify(byStatus, null, 2));

  console.log('\n--- Specific checks ---');
  const matchHospital = list.filter(b => (b.slug && b.slug.includes('hospital')) || (b.name && b.name.toLowerCase().includes('hospital')));
  console.log('Hospital matches:', matchHospital);

  const matchFit = list.filter(b => (b.slug && b.slug.includes('fit')) || (b.name && b.name.toLowerCase().includes('fit')));
  console.log('Fit / Trainer matches:', matchFit);

  console.log('\n--- ALL BUSINESSES SUMMARY ---');
  list.forEach((b, idx) => {
    console.log(`${idx + 1}. [${b.status}] "${b.name}" | slug: ${b.slug} | city: ${b.city} | docId: ${b.docId}`);
  });
}

checkAll().catch(console.error);
