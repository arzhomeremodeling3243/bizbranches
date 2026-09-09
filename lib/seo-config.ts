import { CITIES, CATEGORIES } from './data'
import { STATIC_BUSINESSES } from './static-db'

/**
 * Quality-First SEO & Indexation Configuration
 * 
 * Prevents Google from crawling or indexing thin/empty doorway pages.
 * Only cities and city+category combinations with sufficient genuine 
 * business inventory are marked indexable and submitted to sitemaps.
 */
export const SEO_CONFIG = {
  // Minimum genuine business listings required for a city page to be indexable
  MIN_BUSINESSES_FOR_CITY_INDEX: 2,

  // Minimum genuine business listings required for a city+category page to be indexable
  MIN_BUSINESSES_FOR_CITY_CATEGORY_INDEX: 2,

  // Non-business informational pages or listings with insufficient/fake data that must not be indexed as businesses
  NOINDEX_BUSINESS_SLUGS: new Set([
    '750-prize-bond-list-2025',
    'rs-25000-premium-prize-bond-draw-schedule-overview-islamabad',
    'ramzan-relief-package-eligibility-cnic-portal-services-islamabad',
    'orange-line-metro-station-timing-and-routes',
    'tools-website-multan', // Missing contact phone
  ]),

  // Base canonical website URL
  BASE_URL: 'https://www.pakbizbranhces.online',
}

/**
 * Normalizes city strings for consistent lookup
 */
export function normalizeCitySlug(city: string): string {
  return city.toLowerCase().trim().replace(/\s+/g, '-')
}

export const COMMON_LOCALITIES = [
  'DHA Phase 1', 'DHA Phase 2', 'DHA Phase 3', 'DHA Phase 4', 'DHA Phase 5', 'DHA Phase 6', 'DHA Phase 7', 'DHA Phase 8', 'DHA',
  'Clifton', 'Gulberg III', 'Gulberg II', 'Gulberg', 'Blue Area', 'Saddar', 'Bahria Town', 'Johar Town', 
  'F-7 Markaz', 'F-7', 'F-8 Markaz', 'F-8', 'F-6 Markaz', 'F-6', 'F-10 Markaz', 'F-10', 'F-11 Markaz', 'F-11', 
  'G-11 Markaz', 'G-11', 'G-10 Markaz', 'G-10', 'G-9 Markaz', 'G-9', 'G-8 Markaz', 'G-8', 'I-8 Markaz', 'I-8',
  'I-9 Industrial Area', 'I-9', 'I-10 Industrial Area', 'I-10', 'E-7', 'E-11',
  'PECHS', 'Gulshan-e-Iqbal', 'Gulshan-e-Jauhar', 'Gulshan-e-Maymar', 'Federal B Area', 'North Nazimabad', 'Nazimabad',
  'Model Town', 'Allama Iqbal Town', 'Cavalry Ground', 'Cantt', 'Chaklala Scheme III', 'Rawalpindi Cantt', 'Lahore Cantt', 
  'Korangi Industrial Area', 'Korangi', 'SITE Area', 'Shahrah-e-Faisal', 'Tariq Road', 'Urdu Bazar', 'Anarkali', 
  'Mall Road', 'Liberty Market', 'WAPDA Town', 'Faisal Town', 'Garden Town', 'Township', 'EME Society', 
  'Gulshan-e-Ravi', 'Shadman', 'Mughalpura', 'Shahdara', 'Murree Road', 'Raja Bazaar', 'Commercial Market', 
  'Satellite Town', 'Gulgasht Colony', 'Bosan Road', 'D-Ground', 'University Road', 'Hayatabad', 
  'Kashmir Road', 'G.T. Road', 'Civil Lines', 'Latifabad', 'Qasimabad', 'Auto Bhan Road', 'I.I. Chundrigar Road'
]

export function getLocalityFromAddress(address?: string): string | null {
  if (!address) return null
  const addr = address.toLowerCase()
  for (const loc of COMMON_LOCALITIES) {
    if (addr.includes(loc.toLowerCase())) {
      return loc
    }
  }
  return null
}

/**
 * Normalizes category strings for consistent lookup
 */
export function normalizeCategorySlug(category: string): string {
  return category.toLowerCase().trim()
}

/**
 * Returns the count of approved, genuine businesses in a given city
 */
export function getBusinessCountForCity(cityName: string): number {
  const norm = cityName.toLowerCase().trim()
  return STATIC_BUSINESSES.filter(b => 
    b.city.toLowerCase().trim() === norm && 
    !SEO_CONFIG.NOINDEX_BUSINESS_SLUGS.has(b.slug)
  ).length
}

/**
 * Returns the count of approved, genuine businesses for a city + category combination
 */
export function getBusinessCountForCityCategory(cityName: string, categoryId: string): number {
  const normCity = cityName.toLowerCase().trim()
  const normCat = categoryId.toLowerCase().trim()
  return STATIC_BUSINESSES.filter(b => 
    b.city.toLowerCase().trim() === normCity && 
    (b.categoryId?.toLowerCase().trim() === normCat || b.category?.toLowerCase().trim() === normCat) &&
    !SEO_CONFIG.NOINDEX_BUSINESS_SLUGS.has(b.slug)
  ).length
}

/**
 * Check if a city page qualifies for search indexing
 */
export function isCityIndexable(cityName: string): boolean {
  return getBusinessCountForCity(cityName) >= SEO_CONFIG.MIN_BUSINESSES_FOR_CITY_INDEX
}

/**
 * Check if a city + category page qualifies for search indexing
 */
export function isCityCategoryIndexable(cityName: string, categoryId: string): boolean {
  return getBusinessCountForCityCategory(cityName, categoryId) >= SEO_CONFIG.MIN_BUSINESSES_FOR_CITY_CATEGORY_INDEX
}

/**
 * Check if an individual business profile qualifies for search indexing
 */
export function isBusinessIndexable(slug: string, phone?: string): boolean {
  if (SEO_CONFIG.NOINDEX_BUSINESS_SLUGS.has(slug)) return false
  if (!phone || phone.trim().length < 6) return false
  return true
}

/**
 * Get all cities that meet the inventory threshold for indexing
 */
export function getQualifiedCities(): { name: string; slug: string; count: number }[] {
  return CITIES
    .map(name => ({
      name,
      slug: normalizeCitySlug(name),
      count: getBusinessCountForCity(name)
    }))
    .filter(c => c.count >= SEO_CONFIG.MIN_BUSINESSES_FOR_CITY_INDEX)
    .sort((a, b) => b.count - a.count)
}

/**
 * Get all city + category pairs that meet the inventory threshold for indexing
 */
export function getQualifiedCityCategories(): {
  cityName: string
  citySlug: string
  categoryName: string
  categoryId: string
  count: number
}[] {
  const results: {
    cityName: string
    citySlug: string
    categoryName: string
    categoryId: string
    count: number
  }[] = []

  CITIES.forEach(city => {
    CATEGORIES.forEach(cat => {
      const count = getBusinessCountForCityCategory(city, cat.id)
      if (count >= SEO_CONFIG.MIN_BUSINESSES_FOR_CITY_CATEGORY_INDEX) {
        results.push({
          cityName: city,
          citySlug: normalizeCitySlug(city),
          categoryName: cat.name,
          categoryId: cat.id,
          count,
        })
      }
    })
  })

  return results.sort((a, b) => b.count - a.count)
}
