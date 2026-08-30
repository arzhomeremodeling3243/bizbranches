import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const firebaseConfigProject = {
  apiKey: 'AIzaSyC1dRJtLFMhBqieIj6JrtZsd4j0jd1xM_Y',
  authDomain: 'branches-app-ff0a2.firebaseapp.com',
  projectId: 'branches-app-ff0a2',
  storageBucket: 'branches-app-ff0a2.appspot.com',
  messagingSenderId: '817543103901',
  appId: '1:817543103901:web:0f1de5eacc949505dc9b74',
};

const firebaseConfigUser = {
  apiKey: "AIzaSyCR9gjxmjYsO_kmHOp_qX4tfoPyJU5tQmg",
  authDomain: "branches-app-7669d.firebaseapp.com",
  projectId: "branches-app-7669d",
  storageBucket: "branches-app-7669d.firebasestorage.app",
  messagingSenderId: "507847972478",
  appId: "1:507847972478:web:b9d8c79d50a85a253cea2f"
};

const appProject = initializeApp(firebaseConfigProject, "projectApp");
const dbProject = getFirestore(appProject);

const appUser = initializeApp(firebaseConfigUser, "userApp");
const dbUser = getFirestore(appUser);

const shadabData = {
  id: "biz-shadab-group-sargodha",
  businessName: "Shadab Group Real Estate & Builders",
  name: "Shadab Group Real Estate & Builders",
  slug: "shadab-group-real-estate-builders-sargodha",
  city: "Sargodha",
  category: "real-estate",
  categoryId: "real-estate",
  categorySlug: "real-estate",
  subCategory: "",
  phone: "+92 305 7860084",
  whatsapp: "+92 305 7860084",
  email: "shadabgrouprealestate@gmail.com",
  address: "Shop #10–11, Shadab Real Estate, Opposite Community Office, Gulberg City, Sargodha, Pakistan",
  websiteUrl: "",
  website: "",
  facebookPage: "",
  instagramProfile: "",
  tiktokProfile: "",
  youtubeChannel: "",
  googleBusiness: "",
  googleBusinessUrl: "",
  logoUrl: "",
  metaTitle: "Shadab Group Real Estate & Builders Sargodha | Real Estate",
  metaDescription: "Shadab Group Real Estate & Builders in Sargodha offers real estate consultancy, construction, commercial construction and property investment consultancy.",
  shortIntro: "Shadab Group Real Estate & Builders is a real estate and construction company serving customers in Sargodha, Pakistan. Established in 1990, the company provides real estate advisory and consultancy, construction services, commercial construction, and property investment consultancy.",
  description: "Shadab Group Real Estate & Builders is a real estate and construction company serving customers in Sargodha, Pakistan. Established in 1990, the company provides real estate advisory and consultancy, construction services, commercial construction, and property investment consultancy.",
  aboutHeading: "About Shadab Group Real Estate & Builders",
  aboutText: "Established in 1990, Shadab Group Real Estate & Builders provides real estate and construction services in Sargodha, Pakistan. The company offers real estate advisory and consultancy, construction services, commercial construction, and property investment consultancy.\n\nShadab Group assists clients with real estate decisions and property investment requirements, providing consultation based on their individual needs. Its construction services cover general construction requirements, including home renovation and other construction projects.\n\nThe company also provides commercial construction services for businesses and commercial property requirements. With real estate and construction services available through one company, Shadab Group aims to provide customers with an all-in-one solution for property consultation, investment guidance, and construction requirements.\n\nShadab Group Real Estate & Builders is located in Gulberg City, Sargodha, and serves customers looking for professional real estate and construction assistance in the Sargodha area.",
  services: [
    {
      title: "Real Estate Advisory & Consultancy",
      desc: "Professional real estate advisory and consultancy for customers looking for guidance with property-related decisions, buying opportunities, and real estate requirements in Sargodha."
    },
    {
      title: "Construction Services",
      desc: "Construction services for residential and general construction requirements, including home renovation, general construction, and related building projects."
    },
    {
      title: "Commercial Construction",
      desc: "Construction services for commercial properties and business-related building requirements in Sargodha."
    },
    {
      title: "Property Investment Consultancy",
      desc: "Real estate investment consultancy to help clients evaluate property investment opportunities and make informed investment decisions."
    },
    {
      title: "All-in-One Real Estate & Construction Solutions",
      desc: "Shadab Group combines real estate consultancy, property investment guidance, residential construction, home renovation, and commercial construction services in one place."
    }
  ],
  businessHours: [
    {
      days: "Monday – Sunday",
      hours: "10:00 AM – 09:00 PM"
    }
  ],
  operatingHours: {
    "Monday - Sunday": "10:00 AM - 09:00 PM"
  },
  openingHoursSpecification: [
    "Mo-Su 10:00-21:00"
  ],
  faqs: [
    {
      question: "Where is Shadab Group Real Estate & Builders located?",
      answer: "Shadab Group Real Estate & Builders is located at Shop #10–11, Shadab Real Estate, opposite Community Office, Gulberg City, Sargodha, Pakistan."
    },
    {
      question: "What services does Shadab Group Real Estate & Builders provide?",
      answer: "Shadab Group provides real estate advisory and consultancy, construction services, commercial construction, and property investment consultancy."
    },
    {
      question: "Does Shadab Group provide construction services in Sargodha?",
      answer: "Yes. Shadab Group provides construction services in Sargodha, including home renovation, general construction, and commercial construction services."
    },
    {
      question: "Does Shadab Group provide property investment consultancy?",
      answer: "Yes. The company provides property investment consultancy for customers seeking guidance regarding real estate investment opportunities."
    },
    {
      question: "What are the business hours of Shadab Group?",
      answer: "Shadab Group Real Estate & Builders is open Monday through Sunday (7 days a week, no off day) from 10:00 AM to 9:00 PM."
    },
    {
      question: "How can I contact Shadab Group Real Estate & Builders?",
      answer: "You can contact Shadab Group at +92 305 7860084 by phone or WhatsApp, or contact the business by email at shadabgrouprealestate@gmail.com."
    }
  ],
  status: "approved",
  isFeatured: false,
  featured: false,
  verified: true,
  createdAt: "2026-08-30T10:00:00.000Z",
  updatedAt: new Date().toISOString()
};

async function run() {
  const filePath = path.join(__dirname, '../lib/static-businesses.json');
  let businesses = [];
  try {
    businesses = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.error('Error reading static-businesses.json:', err);
  }

  const idx = businesses.findIndex(b => b.slug === shadabData.slug);
  if (idx >= 0) {
    businesses[idx] = { ...businesses[idx], ...shadabData };
    console.log(`Updated existing entry in static-businesses.json at index ${idx}`);
  } else {
    businesses.unshift(shadabData);
    console.log('Inserted new entry in static-businesses.json at position 0');
  }

  fs.writeFileSync(filePath, JSON.stringify(businesses, null, 2), 'utf-8');
  console.log('Saved static-businesses.json successfully.');

  // Save to Firestore dbProject
  try {
    const docRef = doc(dbProject, 'businesses', shadabData.id);
    await setDoc(docRef, shadabData, { merge: true });
    console.log(`Saved Shadab Group to dbProject Firestore (doc: ${shadabData.id})`);
  } catch (err) {
    console.error('Error writing to dbProject Firestore:', err);
  }

  // Save to Firestore dbUser
  try {
    const docRefUser = doc(dbUser, 'businesses', shadabData.id);
    await setDoc(docRefUser, shadabData, { merge: true });
    console.log(`Saved Shadab Group to dbUser Firestore (doc: ${shadabData.id})`);
  } catch (err) {
    console.error('Error writing to dbUser Firestore:', err);
  }
}

run().then(() => {
  console.log('All updates completed successfully.');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
