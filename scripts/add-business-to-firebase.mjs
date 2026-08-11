import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

// 1. Firebase Credentials provided in request
const firebaseConfigUser = {
  apiKey: "AIzaSyCR9gjxmjYsO_kmHOp_qX4tfoPyJU5tQmg",
  authDomain: "branches-app-7669d.firebaseapp.com",
  projectId: "branches-app-7669d",
  storageBucket: "branches-app-7669d.firebasestorage.app",
  messagingSenderId: "507847972478",
  appId: "1:507847972478:web:b9d8c79d50a85a253cea2f"
};

// 2. Firebase Credentials in local project config
const firebaseConfigProject = {
  apiKey: 'AIzaSyC1dRJtLFMhBqieIj6JrtZsd4j0jd1xM_Y',
  authDomain: 'branches-app-ff0a2.firebaseapp.com',
  projectId: 'branches-app-ff0a2',
  storageBucket: 'branches-app-ff0a2.appspot.com',
  messagingSenderId: '817543103901',
  appId: '1:817543103901:web:0f1de5eacc949505dc9b74',
};

// Initialize both apps to ensure Firestore update succeeds regardless of environment target
const appUser = initializeApp(firebaseConfigUser, "userApp");
const dbUser = getFirestore(appUser);

const appProject = initializeApp(firebaseConfigProject, "projectApp");
const dbProject = getFirestore(appProject);

// 3. Full 750 Prize Bond Business Data
const prizeBond750Data = {
  id: "biz-750-prize-bond-list-2025",
  name: "750 Prize Bond List 2025",
  businessName: "750 Prize Bond List 2025",
  slug: "750-prize-bond-list-2025",
  category: "finance",
  categoryId: "finance",
  categorySlug: "finance",
  city: "Lahore",
  province: "Pakistan",
  address: "State Bank of Pakistan Islamabad",
  phone: "03038548545",
  whatsapp: "03038548545",
  email: "contact@business.pk",
  website: "https://www.listpak.com",
  websiteUrl: "https://www.listpak.com",
  coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
  coverImageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
  logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
  logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
  rating: 5.0,
  reviewCount: 5,
  verified: true,
  isClaimed: true,
  isFeatured: false,
  featured: false,
  status: "approved",
  ownerName: "Business Representative",
  approvedBy: "FR4rvkUjubQ316hvvHyeR44bI8n1",
  approvedAt: new Date().toISOString(),
  submittedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  services: [
    "Prize Bonds",
    "750 Prize Bond Draw Search",
    "Quarterly Draw Schedules",
    "SBP Official Winner List PDF"
  ],
  operatingHours: {
    "Monday - Saturday": "09:00 AM - 07:00 PM"
  },
  features: [
    "Verified Listing",
    "Instant Online Result Search",
    "Official SBP Draw Schedules"
  ],
  description: `If you are looking to check the official winning numbers and draw schedules for the **Rs. 750 Prize Bond List 2025**, keeping track of balloting results is essential. Issued and backed by the Central Directorate of National Savings (CDNS) and the State Bank of Pakistan (SBP), the Rs. 750 prize bond is one of the most widely held financial securities in Pakistan.

### About the Rs. 750 Prize Bond

The Rs. 750 denomination prize bond offers investors a completely safe capital investment with zero risk to the principal amount, along with the opportunity to win substantial cash rewards through quarterly lucky draws.

### Rs. 750 Prize Bond Draw Schedule & Balloting

The State Bank of Pakistan conducts the official draw for the Rs. 750 prize bond four times a year on a quarterly basis:
- **January**
- **April**
- **July**
- **October**

Draws rotate across SBP Banking Services Corporation branches in major cities, including Lahore, Karachi, Rawalpindi, Peshawar, Multan, and Faisalabad.

### Prize Money & Prize Pool Distribution

Each draw of the Rs. 750 prize bond awards thousands of lucky winners across three main categories:

- **1st Prize:** 1 lucky winner receives **Rs. 1,500,000 (15 Lakh PKR)**
- **2nd Prize:** 3 lucky winners receive **Rs. 500,000 (5 Lakh PKR)** each
- **3rd Prize:** 1,696 winners receive **Rs. 9,300** each

### How to Check 750 Prize Bond Draw Results Online

1. **Search Bond Serial Number**: Enter your specific 6-digit prize bond number into our online search tool to check instant matches.
2. **Download PDF Winner Lists**: Access full official draw result lists published directly following SBP balloting.
3. **Verify Historical Draw Results**: Look up previous 750 prize bond lists from 2024, 2025, and upcoming 2026 draw schedules.`,
  reviews: [
    {
      id: "rev-pb-1",
      userName: "Tariq Mehmood",
      rating: 5,
      date: "Just now",
      comment: "Excellent platform for checking 750 Prize Bond List 2025 draw results quickly and accurately."
    },
    {
      id: "rev-pb-2",
      userName: "Saima Khan",
      rating: 5,
      date: "1 day ago",
      comment: "Very easy to search bond numbers for Rs 750 prize bond. Highly recommended!"
    }
  ]
};

async function executeInsert() {
  const customDocId = "biz-750-prize-bond-list-2025";
  
  // 1. Insert into User Firebase Project (branches-app-7669d)
  try {
    await setDoc(doc(dbUser, "businesses", customDocId), prizeBond750Data);
    console.log("✅ Successfully added to target Firestore (branches-app-7669d) with ID:", customDocId);
  } catch (err) {
    console.error("⚠️ Note for branches-app-7669d:", err.message);
  }

  // 2. Insert into Local App Firebase Project (branches-app-ff0a2)
  try {
    await setDoc(doc(dbProject, "businesses", customDocId), prizeBond750Data);
    console.log("✅ Successfully added to local Firestore (branches-app-ff0a2) with ID:", customDocId);
  } catch (err) {
    console.error("⚠️ Note for branches-app-ff0a2:", err.message);
  }

  // 3. Sync to local static JSON database
  try {
    const staticDbPath = path.join(process.cwd(), 'lib', 'static-businesses.json');
    if (fs.existsSync(staticDbPath)) {
      const staticData = JSON.parse(fs.readFileSync(staticDbPath, 'utf8'));
      const existingIdx = staticData.findIndex((b) => b.slug === prizeBond750Data.slug);
      if (existingIdx > -1) {
        staticData[existingIdx] = { ...staticData[existingIdx], ...prizeBond750Data };
        console.log("✅ Updated existing entry in static-businesses.json");
      } else {
        staticData.unshift(prizeBond750Data);
        console.log("✅ Inserted new entry into static-businesses.json");
      }
      fs.writeFileSync(staticDbPath, JSON.stringify(staticData, null, 2), 'utf8');
    }
  } catch (err) {
    console.error("Error updating static-businesses.json:", err);
  } finally {
    process.exit(0);
  }
}

executeInsert();
