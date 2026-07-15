import staticData from './static-businesses.json'

export interface StaticBusiness {
  id: string
  businessName: string
  slug: string
  city: string
  category: string
  categoryId: string
  categorySlug: string
  description: string
  phone: string
  logoUrl: string
  status: string
  isFeatured: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
  rating: number
  reviewCount: number
  websiteUrl: string
  facebookPage: string
  address: string
  whatsapp: string
  email: string
  youtubeChannel: string
  subCategory: string
}

export const STATIC_BUSINESSES = staticData as StaticBusiness[]

// Find static business by slug
export function findStaticBusinessBySlug(slug: string): StaticBusiness | null {
  const normalized = slug.toLowerCase().replace(/\/$/, '')
  return STATIC_BUSINESSES.find(b => b.slug.toLowerCase() === normalized) ?? null
}

// Find static businesses by city
export function getStaticCity(city: string): StaticBusiness[] {
  const normalized = city.toLowerCase().trim()
  return STATIC_BUSINESSES.filter(b => b.city.toLowerCase() === normalized)
}

// Find static businesses by category
export function getStaticCategory(categoryId: string): StaticBusiness[] {
  const normalized = categoryId.toLowerCase().trim()
  return STATIC_BUSINESSES.filter(b => 
    b.categoryId.toLowerCase() === normalized || 
    b.category.toLowerCase() === normalized
  )
}

// Find static businesses by city and category
export function getStaticCityCategory(city: string, categoryId: string): StaticBusiness[] {
  const normCity = city.toLowerCase().trim()
  const normCat = categoryId.toLowerCase().trim()
  return STATIC_BUSINESSES.filter(b => 
    b.city.toLowerCase() === normCity && 
    (b.categoryId.toLowerCase() === normCat || b.category.toLowerCase() === normCat)
  )
}

// Find static similar businesses
export function getStaticSimilar(city: string, category: string, excludeSlug: string): StaticBusiness[] {
  const normCity = city.toLowerCase().trim()
  const normCat = category.toLowerCase().trim()
  return STATIC_BUSINESSES.filter(b => 
    b.city.toLowerCase() === normCity && 
    (b.categoryId.toLowerCase() === normCat || b.category.toLowerCase() === normCat) &&
    b.slug !== excludeSlug
  )
}

// Find static branches
export function getStaticBranches(businessName: string, excludeSlug: string): StaticBusiness[] {
  const normName = businessName.toLowerCase().trim()
  return STATIC_BUSINESSES.filter(b => 
    b.businessName.toLowerCase() === normName && 
    b.slug !== excludeSlug
  )
}

export const HIGH_PRIORITY_SLUGS = new Set<string>([
  // 17 Software branches
  "systemslimited-in-lahore",
  "systemslimited-in-karachi",
  "systemslimited-in-islamabad",
  "systemslimited-in-faisalabad",
  "systemslimited-in-multan",
  "netsol-in-lahore",
  "netsol-in-karachi",
  "netsol-in-islamabad",
  "10pearls-in-karachi",
  "10pearls-in-lahore",
  "10pearls-in-islamabad",
  "arbisoft-in-lahore",
  "arbisoft-in-karachi",
  "arbisoft-in-islamabad",
  "contour-software-in-karachi",
  "contour-software-in-lahore",
  "contour-software-in-islamabad",
  // 15 migrated businesses
  "amcorp-engineering-and-construction-pvt-ltd-karachi",
  "meskay-femtee-karachi",
  "men-forward-faisalabad",
  "wpx-seo-digital-multan",
  "multani-hand-embroidery-kamalia",
  "galima-professionl-piercing-and-aftercar-karachi",
  "trustmed-labs-lahore-1",
  "alizeh-fashion-lahore",
  "home-solutions-pk-karachi",
  "trustmed-labs-lahore",
  "kiddies-and-toys-lahore",
  "marcem-event-solution-islamabad",
  "australian-concept-infertility-medical-center-lahore",
  "dusky-solutions-karachi",
  "diamasiajewels-lahore",
  // 14 UBL Karachi branches
  "ubl-head-office-karachi",
  "ubl-al-haroon-branch-karachi",
  "ubl-tariq-road-branch-karachi",
  "ubl-ameen-shahrah-e-faisal-karachi",
  "ubl-ameen-bait-us-salam-karachi",
  "ubl-khayaban-e-jami-branch-karachi",
  "ubl-bunder-road-branch-karachi",
  "ubl-north-nazimabad-branch-karachi",
  "ubl-gulshan-e-iqbal-branch-karachi",
  "ubl-azizabad-branch-karachi",
  "ubl-north-karachi-branch-karachi",
  "ubl-metroville-site-branch-karachi",
  "ubl-landhi-branch-karachi",
  "ubl-korangi-branch-karachi",
  // 15 UBL Lahore branches
  "ubl-shah-alam-market-branch-lahore",
  "ubl-liberty-market-branch-lahore",
  "ubl-johar-town-branch-lahore",
  "ubl-regional-head-office-jail-road-lahore",
  "ubl-model-town-branch-lahore",
  "ubl-allama-iqbal-town-branch-lahore",
  "ubl-dha-phase-5-branch-lahore",
  "ubl-dha-phase-6-branch-lahore",
  "ubl-bahria-town-branch-lahore",
  "ubl-badami-bagh-branch-lahore",
  "ubl-anarkali-bazaar-branch-lahore",
  "ubl-barkat-market-branch-lahore",
  "ubl-samanabad-branch-lahore",
  "ubl-circular-road-branch-lahore",
  "ubl-ravi-road-branch-lahore",
  // 15 UBL Islamabad branches
  "ubl-jinnah-avenue-corporate-center-branch-islamabad",
  "ubl-i-8-markaz-branch-islamabad",
  "ubl-f-7-markaz-branch-islamabad",
  "ubl-f-8-markaz-branch-islamabad",
  "ubl-g-8-markaz-branch-islamabad",
  "ubl-g-9-markaz-branch-islamabad",
  "ubl-blue-area-pak-pavilion-branch-islamabad",
  "ubl-diplomatic-enclave-branch-islamabad",
  "ubl-aabpara-market-branch-islamabad",
  "ubl-g-11-markaz-branch-islamabad",
  "ubl-d-12-markaz-branch-islamabad",
  "ubl-pwd-colony-branch-islamabad",
  "ubl-dha-phase-2-branch-islamabad",
  "ubl-e-11-markaz-branch-islamabad",
  "ubl-ghauri-town-phase-4-branch-islamabad",
  // 15 UBL Rawalpindi branches
  "ubl-rawalpindi-cantt-main-branch-rawalpindi",
  "ubl-commercial-market-branch-rawalpindi",
  "ubl-bahria-town-phase-4-branch-rawalpindi",
  "ubl-chandni-chowk-branch-rawalpindi",
  "ubl-raja-bazaar-branch-rawalpindi",
  "ubl-chaklala-scheme-iii-branch-rawalpindi",
  "ubl-saddar-bank-road-branch-rawalpindi",
  "ubl-adyala-road-branch-rawalpindi",
  "ubl-saidpur-road-branch-rawalpindi",
  "ubl-peshawar-road-branch-rawalpindi",
  "ubl-tench-bhatta-branch-rawalpindi",
  "ubl-dha-phase-1-branch-rawalpindi",
  "ubl-gulraiz-housing-scheme-branch-rawalpindi",
  "ubl-muslim-town-branch-rawalpindi",
  "ubl-morgah-branch-rawalpindi"
]);

