import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

// 1. Firebase configuration for PakBizBranches
const firebaseConfig = {
  apiKey: 'AIzaSyC1dRJtLFMhBqieIj6JrtZsd4j0jd1xM_Y',
  authDomain: 'branches-app-ff0a2.firebaseapp.com',
  projectId: 'branches-app-ff0a2',
  storageBucket: 'branches-app-ff0a2.appspot.com',
  messagingSenderId: '817543103901',
  appId: '1:817543103901:web:0f1de5eacc949505dc9b74',
};

// 2. Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. Define business data object (including normalized fields for app compatibility)
const newBusiness = {
  id: "biz-orange-line-metro-" + Date.now(),
  slug: "orange-line-metro-station-timing-and-routes",
  name: "Orange Line Metro Station Timings & Routes",
  businessName: "Orange Line Metro Station Timings & Routes",
  category: "logistics",
  categoryId: "logistics",
  categorySlug: "logistics",
  city: "Lahore",
  province: "Punjab",
  rating: 5.0,
  reviewCount: 124,
  verified: true,
  isClaimed: true,
  isFeatured: true,
  featured: true,
  status: "approved", // Bypass pending queue to publish immediately
  phone: "(042) 111-222-627",
  whatsapp: "9242111222627",
  email: "info@pma.punjab.gov.pk",
  website: "https://pma.punjab.gov.pk/",
  websiteUrl: "https://pma.punjab.gov.pk/",
  address: "Orange Line Metro Train Corridor, Raiwind Road to Dera Gujran, Lahore, Punjab",
  coverImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
  coverImageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
  logo: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=200&q=80",
  logoUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=200&q=80",
  description: "The Orange Line Metro Train (OLMT) is Pakistan's premier rapid transit system in Lahore, Punjab. Spanning a 27.1 km corridor across 26 modern stations from Dera Gujran to Ali Town, it serves over 250,000 daily passengers with air-conditioned transit, smart card ticketing, and reliable timing schedules.",
  services: [
    "Daily Passenger Rapid Transit",
    "Orange Line Train Timing Schedules",
    "Orange Line Station List & Route Navigation",
    "Metro Smart Card & Token Ticketing"
  ],
  operatingHours: { "Monday - Sunday": "06:00 AM - 10:00 PM" },
  features: ["26 Modern Stations", "Air Conditioned Coaches", "Wheelchair Accessible"],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// 4. Function to write to Firestore collection 'businesses' and sync local static DB
async function insertBusiness() {
  try {
    const docId = newBusiness.id;
    
    // Write to Firestore database
    await setDoc(doc(db, "businesses", docId), newBusiness);
    console.log("✅ Successfully added business to Firestore with ID:", docId);

    // Sync to local static JSON database if available
    const staticDbPath = path.join(process.cwd(), 'lib', 'static-businesses.json');
    if (fs.existsSync(staticDbPath)) {
      const staticData = JSON.parse(fs.readFileSync(staticDbPath, 'utf8'));
      const existingIdx = staticData.findIndex((b: any) => b.slug === newBusiness.slug);
      if (existingIdx > -1) {
        staticData[existingIdx] = { ...staticData[existingIdx], ...newBusiness };
        console.log("✅ Updated existing business entry in static-businesses.json");
      } else {
        staticData.unshift(newBusiness);
        console.log("✅ Added business to static-businesses.json");
      }
      fs.writeFileSync(staticDbPath, JSON.stringify(staticData, null, 2), 'utf8');
    }
  } catch (err) {
    console.error("❌ Error adding business:", err);
  } finally {
    process.exit(0);
  }
}

insertBusiness();
