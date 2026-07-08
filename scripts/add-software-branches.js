const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const jsonPath = path.join(rootDir, 'lib', 'static-businesses.json');

// Read existing static database
const staticData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Software company branch data
const softwareBranches = [
  // 1. Systems Limited
  {
    id: "static-systemslimited-lahore",
    businessName: "Systems Limited",
    slug: "systemslimited-in-lahore",
    city: "Lahore",
    category: "technology",
    categoryId: "technology",
    categorySlug: "technology",
    description: "Systems Limited Lahore is the head office of Pakistan's leading global technology services provider, delivering custom software, ERP, cloud consulting, and digital transformation.",
    phone: "(042) 111-797-836",
    logoUrl: "/software-logos/SystemsLogo.svg",
    status: "approved",
    isFeatured: true,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.9,
    reviewCount: 24,
    websiteUrl: "https://www.systemsltd.com",
    facebookPage: "https://www.facebook.com/systemsltd",
    address: "E-1, Sehjpal Near DHA Phase-VIII (Ex-Air Avenue), Lahore Cantt",
    whatsapp: "(042) 111-797-836",
    email: "info@systemsltd.com",
    youtubeChannel: "",
    subCategory: "Software House"
  },
  {
    id: "static-systemslimited-karachi",
    businessName: "Systems Limited",
    slug: "systemslimited-in-karachi",
    city: "Karachi",
    category: "technology",
    categoryId: "technology",
    categorySlug: "technology",
    description: "Systems Limited Karachi branch offers cutting-edge software engineering, BPO, data analytics, and digital solutions for local and international markets.",
    phone: "(021) 364-900-26",
    logoUrl: "/software-logos/SystemsLogo.svg",
    status: "approved",
    isFeatured: true,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.8,
    reviewCount: 18,
    websiteUrl: "https://www.systemsltd.com",
    facebookPage: "https://www.facebook.com/systemsltd",
    address: "9 B, Sumya Building, Mohammad Ali Society (M.A.C.H.S.)",
    whatsapp: "(021) 364-900-26",
    email: "info@systemsltd.com",
    youtubeChannel: "",
    subCategory: "Software House"
  },
  {
    id: "static-systemslimited-islamabad",
    businessName: "Systems Limited",
    slug: "systemslimited-in-islamabad",
    city: "Islamabad",
    category: "technology",
    categoryId: "technology",
    categorySlug: "technology",
    description: "Systems Limited Islamabad branch provides professional IT consulting, custom software development, and enterprise applications for government and private sectors.",
    phone: "(051) 111-797-836",
    logoUrl: "/software-logos/SystemsLogo.svg",
    status: "approved",
    isFeatured: true,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.8,
    reviewCount: 15,
    websiteUrl: "https://www.systemsltd.com",
    facebookPage: "https://www.facebook.com/systemsltd",
    address: "Plot No. 21, 1st Floor Fazeelat Arcade, Sector G-11 Markaz",
    whatsapp: "(051) 111-797-836",
    email: "info@systemsltd.com",
    youtubeChannel: "",
    subCategory: "Software House"
  },
  {
    id: "static-systemslimited-faisalabad",
    businessName: "Systems Limited",
    slug: "systemslimited-in-faisalabad",
    city: "Faisalabad",
    category: "technology",
    categoryId: "technology",
    categorySlug: "technology",
    description: "Systems Limited Faisalabad branch delivers custom software, web design, mobile app engineering, and localized IT support for growing businesses.",
    phone: "(042) 111-797-836",
    logoUrl: "/software-logos/SystemsLogo.svg",
    status: "approved",
    isFeatured: true,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.7,
    reviewCount: 8,
    websiteUrl: "https://www.systemsltd.com",
    facebookPage: "https://www.facebook.com/systemsltd",
    address: "1st floor Main East Canal Road, Ali Fatima, Science College",
    whatsapp: "(042) 111-797-836",
    email: "info@systemsltd.com",
    youtubeChannel: "",
    subCategory: "Software House"
  },
  {
    id: "static-systemslimited-multan",
    businessName: "Systems Limited",
    slug: "systemslimited-in-multan",
    city: "Multan",
    category: "technology",
    categoryId: "technology",
    categorySlug: "technology",
    description: "Systems Limited Multan branch provides verified software development, IT solutions, and digital strategy support for enterprises in South Punjab.",
    phone: "(042) 111-797-836",
    logoUrl: "/software-logos/SystemsLogo.svg",
    status: "approved",
    isFeatured: true,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.7,
    reviewCount: 6,
    websiteUrl: "https://www.systemsltd.com",
    facebookPage: "https://www.facebook.com/systemsltd",
    address: "Plot No. 842/23 near Northern Bypass Chowk, Bosan Road",
    whatsapp: "(042) 111-797-836",
    email: "info@systemsltd.com",
    youtubeChannel: "",
    subCategory: "Software House"
  },

  // 2. NETSOL Technologies
  {
    id: "static-netsol-lahore",
    businessName: "NETSOL Technologies",
    slug: "netsol-in-lahore",
    city: "Lahore",
    category: "technology",
    categoryId: "technology",
    categorySlug: "technology",
    description: "NETSOL Technologies Lahore head office is a premier IT provider specializing in leasing and finance software (NFS Ascent), custom enterprise systems, and asset finance solutions.",
    phone: "(042) 111-448-800",
    logoUrl: "/software-logos/netsol-logo.svg",
    status: "approved",
    isFeatured: true,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.9,
    reviewCount: 30,
    websiteUrl: "https://www.netsolpk.com",
    facebookPage: "https://www.facebook.com/NetsolTechnologies",
    address: "NETSOL Avenue, Main Ghazi Road Interchange, Lahore Cantt",
    whatsapp: "(042) 111-448-800",
    email: "info@netsolpk.com",
    youtubeChannel: "",
    subCategory: "Software House"
  },
  {
    id: "static-netsol-karachi",
    businessName: "NETSOL Technologies",
    slug: "netsol-in-karachi",
    city: "Karachi",
    category: "technology",
    categoryId: "technology",
    categorySlug: "technology",
    description: "NETSOL Technologies Karachi branch delivers world-class finance software, enterprise assets management, and digital automation platforms for corporations.",
    phone: "(021) 111-638-765",
    logoUrl: "/software-logos/netsol-logo.svg",
    status: "approved",
    isFeatured: true,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.8,
    reviewCount: 14,
    websiteUrl: "https://www.netsolpk.com",
    facebookPage: "https://www.facebook.com/NetsolTechnologies",
    address: "NETSOL Avenue, V388+95F, Block 6 PECHS, Karachi",
    whatsapp: "(021) 111-638-765",
    email: "info@netsolpk.com",
    youtubeChannel: "",
    subCategory: "Software House"
  },
  {
    id: "static-netsol-islamabad",
    businessName: "NETSOL Technologies",
    slug: "netsol-in-islamabad",
    city: "Islamabad",
    category: "technology",
    categoryId: "technology",
    categorySlug: "technology",
    description: "NETSOL Technologies Islamabad desk coordinates corporate sales, government contracts, and enterprise relations directly via the Lahore corporate exchange.",
    phone: "(042) 111-448-800",
    logoUrl: "/software-logos/netsol-logo.svg",
    status: "approved",
    isFeatured: true,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.7,
    reviewCount: 7,
    websiteUrl: "https://www.netsolpk.com",
    facebookPage: "https://www.facebook.com/NetsolTechnologies",
    address: "Handled directly via Lahore Ring Road Corporate Exchange",
    whatsapp: "(042) 111-448-800",
    email: "info@netsolpk.com",
    youtubeChannel: "",
    subCategory: "Software House"
  },

  // 3. 10Pearls
  {
    id: "static-10pearls-karachi",
    businessName: "10Pearls",
    slug: "10pearls-in-karachi",
    city: "Karachi",
    category: "technology",
    categoryId: "technology",
    categorySlug: "technology",
    description: "10Pearls Karachi head office designs and develops mobile apps, web applications, cloud solutions, and cybersecurity services with agile global teams.",
    phone: "+92 21 34328447",
    logoUrl: "/software-logos/10Pearls-Logo.svg",
    status: "approved",
    isFeatured: true,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.9,
    reviewCount: 22,
    websiteUrl: "https://10pearls.com",
    facebookPage: "https://www.facebook.com/10pearls",
    address: "3rd Floor (NASTP), Main Shahra-e-Faisal, Karachi",
    whatsapp: "+92 21 34328447",
    email: "info@10pearls.com",
    youtubeChannel: "",
    subCategory: "Software House"
  },
  {
    id: "static-10pearls-lahore",
    businessName: "10Pearls",
    slug: "10pearls-in-lahore",
    city: "Lahore",
    category: "technology",
    categoryId: "technology",
    categorySlug: "technology",
    description: "10Pearls Lahore branch specializes in AI-powered development, product prototyping, digital strategy, and high-performance software engineering teams.",
    phone: "+92 21 34328447",
    logoUrl: "/software-logos/10Pearls-Logo.svg",
    status: "approved",
    isFeatured: true,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.8,
    reviewCount: 11,
    websiteUrl: "https://10pearls.com",
    facebookPage: "https://www.facebook.com/10pearls",
    address: "32 Block C/1, Ghalib Road, Gulberg-III, Lahore",
    whatsapp: "+92 21 34328447",
    email: "info@10pearls.com",
    youtubeChannel: "",
    subCategory: "Software House"
  },
  {
    id: "static-10pearls-islamabad",
    businessName: "10Pearls",
    slug: "10pearls-in-islamabad",
    city: "Islamabad",
    category: "technology",
    categoryId: "technology",
    categorySlug: "technology",
    description: "10Pearls Islamabad branch provides digital innovation, custom software engineering, cloud solutions, and advanced research and development projects.",
    phone: "+92 51 8749814",
    logoUrl: "/software-logos/10Pearls-Logo.svg",
    status: "approved",
    isFeatured: true,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.8,
    reviewCount: 13,
    websiteUrl: "https://10pearls.com",
    facebookPage: "https://www.facebook.com/10pearls",
    address: "4th Floor, One Expressway, Gulberg Greens, Islamabad",
    whatsapp: "+92 51 8749814",
    email: "info@10pearls.com",
    youtubeChannel: "",
    subCategory: "Software House"
  },

  // 4. Arbisoft
  {
    id: "static-arbisoft-lahore",
    businessName: "Arbisoft",
    slug: "arbisoft-in-lahore",
    city: "Lahore",
    category: "technology",
    categoryId: "technology",
    categorySlug: "technology",
    description: "Arbisoft Lahore head office is an industry-leading software builder partnering with global companies to engineer custom web apps, mobile solutions, and enterprise integrations.",
    phone: "(042) 37498533",
    logoUrl: "/software-logos/arbisoft.svg",
    status: "approved",
    isFeatured: true,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.9,
    reviewCount: 26,
    websiteUrl: "https://arbisoft.com",
    facebookPage: "https://www.facebook.com/arbisoft",
    address: "25 Canal Rd, Westwood Colony, Lahore",
    whatsapp: "(042) 37498533",
    email: "contact@arbisoft.com",
    youtubeChannel: "",
    subCategory: "Software House"
  },
  {
    id: "static-arbisoft-karachi",
    businessName: "Arbisoft",
    slug: "arbisoft-in-karachi",
    city: "Karachi",
    category: "technology",
    categoryId: "technology",
    categorySlug: "technology",
    description: "Arbisoft Karachi branch specializes in agile software development, customized corporate portals, mobile engineering, and enterprise consulting services.",
    phone: "(042) 37498533",
    logoUrl: "/software-logos/arbisoft.svg",
    status: "approved",
    isFeatured: true,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.8,
    reviewCount: 9,
    websiteUrl: "https://arbisoft.com",
    facebookPage: "https://www.facebook.com/arbisoft",
    address: "13th Floor Dilkusha Forum, Main Tariq Road (Near Dolmen Mall), Karachi",
    whatsapp: "(042) 37498533",
    email: "contact@arbisoft.com",
    youtubeChannel: "",
    subCategory: "Software House"
  },
  {
    id: "static-arbisoft-islamabad",
    businessName: "Arbisoft",
    slug: "arbisoft-in-islamabad",
    city: "Islamabad",
    category: "technology",
    categoryId: "technology",
    categorySlug: "technology",
    description: "Arbisoft Islamabad branch offers enterprise web development, API integrations, digital consulting, and dedicated engineering resource teams.",
    phone: "(042) 37498533",
    logoUrl: "/software-logos/arbisoft.svg",
    status: "approved",
    isFeatured: true,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.8,
    reviewCount: 12,
    websiteUrl: "https://arbisoft.com",
    facebookPage: "https://www.facebook.com/arbisoft",
    address: "Chambers Fazl-ul-Haq Road, Blue Area, Islamabad",
    whatsapp: "(042) 37498533",
    email: "contact@arbisoft.com",
    youtubeChannel: "",
    subCategory: "Software House"
  },

  // 5. Contour Software
  {
    id: "static-contour-karachi",
    businessName: "Contour Software",
    slug: "contour-software-in-karachi",
    city: "Karachi",
    category: "technology",
    categoryId: "technology",
    categorySlug: "technology",
    description: "Contour Software Karachi head office is an elite division of Constellation Software Inc., offering software development, support, QA, and maintenance for global enterprise systems.",
    phone: "+92 21 34306280",
    logoUrl: "/software-logos/Contour-Software.svg",
    status: "approved",
    isFeatured: true,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.9,
    reviewCount: 20,
    websiteUrl: "https://contour-software.com",
    facebookPage: "https://www.facebook.com/ContourSoftware",
    address: "Prestige Trade Centre, 4th floor, SNCC, 1/1–A, Block 3, K.C.H.S, Main Shaheed-e-Millat Road, Karachi",
    whatsapp: "+92 21 34306280",
    email: "info@contour-software.com",
    youtubeChannel: "",
    subCategory: "Software House"
  },
  {
    id: "static-contour-lahore",
    businessName: "Contour Software",
    slug: "contour-software-in-lahore",
    city: "Lahore",
    category: "technology",
    categoryId: "technology",
    categorySlug: "technology",
    description: "Contour Software Lahore branch provides global software product support, customized engineering, quality assurance audits, and professional IT services.",
    phone: "+92 42 35788961",
    logoUrl: "/software-logos/Contour-Software.svg",
    status: "approved",
    isFeatured: true,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.8,
    reviewCount: 15,
    websiteUrl: "https://contour-software.com",
    facebookPage: "https://www.facebook.com/ContourSoftware",
    address: "Askari Corporate Towers, 12th Floor, 75-76 Block D1, Main Boulevard Gulberg–III, Lahore",
    whatsapp: "+92 42 35788961",
    email: "info@contour-software.com",
    youtubeChannel: "",
    subCategory: "Software House"
  },
  {
    id: "static-contour-islamabad",
    businessName: "Contour Software",
    slug: "contour-software-in-islamabad",
    city: "Islamabad",
    category: "technology",
    categoryId: "technology",
    categorySlug: "technology",
    description: "Contour Software Islamabad branch serves as a hub for software development, quality engineering, customer support, and IT support services for international markets.",
    phone: "+92 51 8460005",
    logoUrl: "/software-logos/Contour-Software.svg",
    status: "approved",
    isFeatured: true,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.8,
    reviewCount: 11,
    websiteUrl: "https://contour-software.com",
    facebookPage: "https://www.facebook.com/ContourSoftware",
    address: "TF Complex, 5th Floor, 7 Mauve Area, G-9/4, Islamabad",
    whatsapp: "+92 51 8460005",
    email: "info@contour-software.com",
    youtubeChannel: "",
    subCategory: "Software House"
  }
];

// Append new software branches, checking for duplicate slugs first
let addedCount = 0;
softwareBranches.forEach(branch => {
  const duplicateIdx = staticData.findIndex(item => item.slug === branch.slug);
  if (duplicateIdx > -1) {
    console.log(`Replacing existing entry for slug: ${branch.slug}`);
    staticData[duplicateIdx] = branch;
  } else {
    staticData.push(branch);
    addedCount++;
  }
});

// Write updated JSON back
fs.writeFileSync(jsonPath, JSON.stringify(staticData, null, 2), 'utf8');
console.log(`Successfully updated ${jsonPath}. Added ${addedCount} new branches.`);

// Generate folders and page.tsx files under app/
softwareBranches.forEach(branch => {
  const folderName = branch.slug;
  const folderPath = path.join(rootDir, 'app', folderName);
  
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  
  const pagePath = path.join(folderPath, 'page.tsx');
  
  // Format Title: length between 52 and 58 characters
  let title = `${branch.businessName} ${branch.city} Branch - Verified Details`;
  if (title.length > 58) {
    title = `${branch.businessName} ${branch.city} - Phone & Address`;
  }
  if (title.length < 52) {
    title = `${branch.businessName} ${branch.city} Branch - Phone, Address & Info`;
  }
  if (title.length < 52) {
    title = `${branch.businessName} ${branch.city} Office - Contact Phone & Address`;
  }
  if (title.length > 58) {
    title = title.substring(0, 58);
  }
  
  // Format Description: length between 125 and 145 characters
  let desc = `Get verified details for ${branch.businessName} in ${branch.city}, Pakistan. Find office address, contact phone number, email and timing info.`;
  if (desc.length > 145) {
    desc = desc.substring(0, 142) + '...';
  }
  while (desc.length < 125) {
    desc += ' Access local company coordinates.';
  }
  if (desc.length > 145) {
    desc = desc.substring(0, 145);
  }

  const pageContent = `import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "${title}"
  const description = "${desc}"
  const url = "https://www.pakbizbranhces.online/${branch.slug}/"
  
  return {
    title,
    description,
    keywords: [
      "${branch.businessName} ${branch.city}",
      "${branch.businessName} ${branch.city} office",
      "${branch.businessName} Pakistan",
      "software company ${branch.city}",
      "IT services ${branch.city}"
    ],
    alternates: { canonical: url },
    openGraph: { 
      title, 
      description, 
      url, 
      siteName: 'PakBizBranches', 
      locale: 'en_PK', 
      type: 'website' 
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  }
}

export default function Page() {
  return <CatchAllPageClient slug="${branch.slug}" />
}
`;

  fs.writeFileSync(pagePath, pageContent, 'utf8');
  console.log(`Generated page at: ${pagePath}`);
});

console.log('Script execution complete!');
