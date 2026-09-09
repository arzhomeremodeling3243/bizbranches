'use client'

import React, { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, Phone, Mail, MapPin, MessageCircle, Building2,
  Globe, Facebook, Youtube, Instagram, ExternalLink, ChevronRight, ArrowRight, Loader2, Share2, Check,
  Search, ShieldCheck, Sparkles, Navigation, Layers, Clock, X, AlertCircle
} from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import CountdownLoader from '@/components/ui/countdown-loader'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import { CATEGORIES, CITIES } from '@/lib/data'
import { LIVE_STATUSES, getPossibleCategoryValues } from '@/lib/category-mappings'
import { generateCategoryContent, generateCityContent, CITY_INFO } from '@/lib/seo-content'
import { BannerAdLoader, NativeAdLoader } from '@/components/ads/ads-loader'
import { getBusinessLogoUrl } from '@/lib/utils'

const BASE_URL = 'https://www.pakbizbranhces.online'

function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  )
}

interface ServiceItem {
  title: string
  desc: string
}

interface BusinessFAQ {
  question: string
  answer: string
}

interface BusinessHourItem {
  days: string
  hours: string
}

interface Business {
  id: string
  businessName: string
  contactPerson?: string
  email?: string
  phone: string
  whatsapp?: string
  city: string
  address: string
  category: string
  subCategory?: string
  description: string
  shortIntro?: string
  aboutHeading?: string
  aboutText?: string
  services?: ServiceItem[]
  faqs?: BusinessFAQ[]
  businessHours?: BusinessHourItem[]
  openingHoursSpecification?: string[]
  metaTitle?: string
  metaDescription?: string
  logoUrl?: string
  websiteUrl?: string
  website?: string
  facebookPage?: string
  facebook?: string
  instagramProfile?: string
  instagram?: string
  tiktokProfile?: string
  tiktok?: string
  youtubeChannel?: string
  youtube?: string
  googleBusiness?: string
  googleBusinessUrl?: string
  createdAt: any
  status: string
  slug: string
  rating?: number
  reviewCount?: number
}

function findCityBySlug(slug: string): string | null {
  const normalized = slug.replace(/-/g, ' ').toLowerCase()
  return CITIES.find(c => c.toLowerCase() === normalized) ?? null
}

function findCategoryBySlug(slug: string) {
  return CATEGORIES.find(c => c.id === slug) ?? null
}

function normalizeCitySlug(city: string): string {
  return city.toLowerCase().trim().replace(/\s+/g, '-')
}

const COMMON_LOCALITIES = [
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

function getLocalityFromAddress(address: string): string | null {
  if (!address) return null
  const addr = address.toLowerCase()
  for (const loc of COMMON_LOCALITIES) {
    if (addr.includes(loc.toLowerCase())) {
      return loc
    }
  }
  return null
}

function FormattedDescription({ text }: { text: string }) {
  if (!text) return null
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const paragraphs = text.split(/\n\n+/)

  return (
    <div className="space-y-3 text-gray-700 leading-relaxed text-base">
      {paragraphs.map((p, pIdx) => {
        const parts: React.ReactNode[] = []
        let lastIndex = 0
        let match: RegExpExecArray | null
        const regex = new RegExp(linkRegex)

        while ((match = regex.exec(p)) !== null) {
          if (match.index > lastIndex) {
            parts.push(p.substring(lastIndex, match.index))
          }
          const linkText = match[1]
          const linkUrl = match[2]
          if (linkUrl.startsWith('/')) {
            parts.push(
              <Link key={match.index} href={linkUrl} className="text-blue-600 font-semibold hover:underline">
                {linkText}
              </Link>
            )
          } else {
            parts.push(
              <a key={match.index} href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">
                {linkText}
              </a>
            )
          }
          lastIndex = match.index + match[0].length
        }

        if (lastIndex < p.length) {
          parts.push(p.substring(lastIndex))
        }

        return <p key={pIdx}>{parts.length > 0 ? parts : p}</p>
      })}
    </div>
  )
}

function getBusinessHours(business: Business): { days: string; hours: string }[] | null {
  if (business.businessHours && business.businessHours.length > 0) {
    return business.businessHours
  }
  const desc = business.description || ''
  const match = desc.match(/(?:timings?|hours?):\s*([^.\n]+)/i)
  if (match) {
    const raw = match[1].trim()
    if (raw.includes('|')) {
      return raw.split('|').map(segment => {
        const parts = segment.split(':')
        if (parts.length >= 2) {
          return { days: parts[0].trim(), hours: parts.slice(1).join(':').trim() }
        }
        return { days: 'Operating Timings', hours: segment.trim() }
      })
    }
    return [{ days: 'Operating Timings', hours: raw }]
  }
  return null
}

interface CatchAllPageClientProps {
  slug: string
  initialViewType?: 'city' | 'category' | 'business'
  initialCityName?: string | null
  initialCategory?: any
  initialBusiness?: Business | null
  initialBusinessesList?: Business[]
  initialSimilarBusinesses?: Business[]
  initialNearbyBusinesses?: Business[]
  initialBranches?: Business[]
}

export default function CatchAllPageClient({
  slug,
  initialViewType,
  initialCityName = null,
  initialCategory = null,
  initialBusiness = null,
  initialBusinessesList = [],
  initialSimilarBusinesses = [],
  initialNearbyBusinesses = [],
  initialBranches = []
}: CatchAllPageClientProps) {
  const [viewType, setViewType] = useState<'city' | 'category' | 'business' | 'loading' | '404'>(
    initialViewType || 'loading'
  )
  const [loading, setLoading] = useState(!initialViewType)
  const [countdownDone, setCountdownDone] = useState(!!initialViewType)
  
  // Data States
  const [cityName, setCityName] = useState<string | null>(initialCityName)
  const [category, setCategory] = useState<any>(initialCategory)
  const [business, setBusiness] = useState<Business | null>(initialBusiness)
  const [businessesList, setBusinessesList] = useState<Business[]>(initialBusinessesList)
  const [similarBusinesses, setSimilarBusinesses] = useState<Business[]>(initialSimilarBusinesses)
  const [nearbyBusinesses, setNearbyBusinesses] = useState<Business[]>(initialNearbyBusinesses)
  const [branches, setBranches] = useState<Business[]>(initialBranches)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [searchFilter, setSearchFilter] = useState('')
  const [claimModalOpen, setClaimModalOpen] = useState(false)

  useEffect(() => {
    async function loadData() {
      if (!initialViewType) {
        setLoading(true)
      }
      
      // 1. Check if City View
      const city = initialCityName || findCityBySlug(slug)
      if (city) {
        if (!cityName) setCityName(city)
        if (viewType !== 'city') setViewType('city')
        if (initialBusinessesList && initialBusinessesList.length > 0) {
          setLoading(false)
          setCountdownDone(true)
          return
        }
        try {
          const q = query(collection(db, 'businesses'), where('city', '==', city), limit(60))
          const snap = await getDocs(q)
          const fetched = snap.docs
            .map(d => ({ id: d.id, ...d.data() } as Business))
            .filter(b => {
              const status = String((b as any).status ?? '').toLowerCase()
              return !status || LIVE_STATUSES.has(status)
            })
          if (fetched.length > 0) {
            setBusinessesList(fetched)
          }
        } catch (err) {
          console.error('Error fetching city businesses:', err)
        }
        setLoading(false)
        setCountdownDone(true)
        return
      }

      // 2. Check if Category View
      const cat = initialCategory || findCategoryBySlug(slug)
      if (cat) {
        if (!category) setCategory(cat)
        if (viewType !== 'category') setViewType('category')
        if (initialBusinessesList && initialBusinessesList.length > 0) {
          setLoading(false)
          setCountdownDone(true)
          return
        }
        try {
          const categoryValues = getPossibleCategoryValues(slug).slice(0, 5)
          const primaryQuery = query(collection(db, 'businesses'), where('categoryId', '==', slug), limit(60))
          const fallbackQuery = query(collection(db, 'businesses'), where('category', 'in', categoryValues), limit(60))
          const [pSnap, fSnap] = await Promise.all([getDocs(primaryQuery), getDocs(fallbackQuery)])
          const merged = new Map<string, Business>()
          pSnap.docs.forEach(doc => merged.set(doc.id, { id: doc.id, ...doc.data() } as Business))
          fSnap.docs.forEach(doc => { if (!merged.has(doc.id)) merged.set(doc.id, { id: doc.id, ...doc.data() } as Business) })
          const list = Array.from(merged.values()).filter(b => {
            const status = String((b as any).status ?? '').toLowerCase()
            return !status || LIVE_STATUSES.has(status)
          }).slice(0, 60)
          if (list.length > 0) {
            setBusinessesList(list)
          }
        } catch (err) {
          console.error('Error fetching category businesses:', err)
        }
        setLoading(false)
        setCountdownDone(true)
        return
      }

      // 3. Check if Business View
      if (initialBusiness) {
        if (viewType !== 'business') setViewType('business')
        setLoading(false)
        setCountdownDone(true)
        return
      }

      // If nothing matches, trigger 404
      setViewType('404')
      setLoading(false)
      setCountdownDone(true)
    }

    loadData()
  }, [slug])

  // Filter businesses by search input
  const filteredList = useMemo(() => {
    if (!searchFilter.trim()) return businessesList
    const q = searchFilter.toLowerCase().trim()
    return businessesList.filter(b => 
      b.businessName.toLowerCase().includes(q) ||
      (b.address && b.address.toLowerCase().includes(q)) ||
      (b.category && b.category.toLowerCase().includes(q))
    )
  }, [businessesList, searchFilter])

  // Loading skeleton state
  if ((loading || viewType === 'loading' || !countdownDone) && !business && !cityName && !category && businessesList.length === 0) {
    return (
      <>
        <Navbar />
        <CountdownLoader 
          isDataLoading={loading || viewType === 'loading'} 
          onComplete={() => setCountdownDone(true)} 
        />
        <Footer />
      </>
    )
  }

  if (viewType === '404') {
    notFound()
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 1. CITY VIEW
  // ══════════════════════════════════════════════════════════════════════════
  if (viewType === 'city' && cityName) {
    const citySlug = normalizeCitySlug(cityName)
    const content = generateCityContent(cityName)
    const cityInfo = CITY_INFO[cityName]
    const province = cityInfo?.province ?? 'Pakistan'

    // Categories available in this city
    const activeCategoriesInCity = CATEGORIES.map(cat => {
      const count = businessesList.filter(b => 
        ((b as any).categoryId?.toLowerCase() === cat.id || b.category?.toLowerCase() === cat.id)
      ).length
      return { ...cat, count }
    }).filter(c => c.count > 0)

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Cities', item: `${BASE_URL}/cities/` },
        { '@type': 'ListItem', position: 3, name: cityName, item: `${BASE_URL}/${citySlug}/` },
      ],
    }

    const cityFaqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `How many verified businesses are listed in ${cityName}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `PakBizBranches currently lists ${businessesList.length} verified companies, shops, and professional service providers in ${cityName}, ${province}.`
          }
        },
        {
          '@type': 'Question',
          name: `How can I contact local companies in ${cityName}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Every listing on PakBizBranches includes direct contact phone numbers, instant WhatsApp chat links, and verified office addresses without any sign-up wall.`
          }
        },
        {
          '@type': 'Question',
          name: `Is listing a local business in ${cityName} free?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Yes! Business owners in ${cityName} can submit their listing for free on PakBizBranches to gain local visibility across Google and directory searches.`
          }
        }
      ]
    }

    const localitiesInCity = Array.from(new Set(
      businessesList.map(b => getLocalityFromAddress(b.address)).filter(Boolean) as string[]
    )).slice(0, 10)

    const featuredInCity = businessesList.filter(b => b.phone && b.address).slice(0, 3)

    return (
      <>
        <Navbar />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cityFaqSchema) }} />
        
        <main className="bg-[#f8fafc] min-h-screen">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 -mb-4">
            <BannerAdLoader variant="inline" />
          </div>

          {/* City Hero */}
          <section className="bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] py-14 text-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/60 mb-6 flex-wrap">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                <Link href="/cities/" className="hover:text-white transition-colors">Cities</Link>
                <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                <span className="text-white font-medium">{cityName}</span>
              </nav>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-semibold text-blue-200 mb-3 border border-white/20">
                    <MapPin className="w-3.5 h-3.5 text-[#60a5fa]" />
                    {province} • Verified City Directory
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                    {cityName} Business Directory
                  </h1>
                  <p className="text-lg text-white/80 mt-3 max-w-2xl leading-relaxed">
                    Browse {businessesList.length} verified companies, emergency contacts, and professional services across {cityName}.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shrink-0 text-center min-w-[180px]">
                  <span className="block text-3xl font-extrabold text-[#60a5fa]">{businessesList.length}</span>
                  <span className="block text-xs font-medium text-white/80 uppercase tracking-wider mt-1">Verified Listings</span>
                  <Link href="/add-business/" className="inline-block mt-3 px-4 py-2 bg-[#60a5fa] hover:bg-blue-400 text-white rounded-lg text-xs font-bold transition-colors">
                    + Add Business
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Sector / Category Hub in City */}
            {activeCategoriesInCity.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-2xl font-bold text-[#0f2b3d]">Browse by Industry in {cityName}</h2>
                    <p className="text-sm text-slate-500">Explore business sectors with active listings in {cityName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                  {activeCategoriesInCity.map(cat => (
                    <Link
                      key={cat.id}
                      href={`/${citySlug}/${cat.id}/`}
                      className="group bg-white p-4 rounded-xl border border-gray-100 shadow-xs hover:border-[#60a5fa] hover:shadow-md transition-all flex items-center justify-between"
                    >
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                          {cat.name}
                        </h3>
                        <span className="text-xs text-slate-400">{cat.count} listings</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#60a5fa] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Popular Localities in City */}
            {localitiesInCity.length > 0 && (
              <section className="mb-12 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                <h3 className="text-base font-bold text-[#0f2b3d] mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#60a5fa]" /> Commercial Areas & Localities in {cityName}
                </h3>
                <p className="text-xs text-slate-500 mb-3.5">Filter verified listings by specific area or business hub:</p>
                <div className="flex flex-wrap gap-2">
                  {localitiesInCity.map(loc => (
                    <button
                      key={loc}
                      onClick={() => setSearchFilter(loc)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        searchFilter.toLowerCase() === loc.toLowerCase()
                          ? 'bg-[#0f2b3d] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      📍 {loc}
                    </button>
                  ))}
                  {searchFilter && (
                    <button
                      onClick={() => setSearchFilter('')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                    >
                      ✕ Clear Filter
                    </button>
                  )}
                </div>
              </section>
            )}

            {/* Featured Businesses in City */}
            {featuredInCity.length > 0 && !searchFilter && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-2xl font-bold text-[#0f2b3d]">Featured Businesses in {cityName}</h2>
                    <p className="text-sm text-slate-500">Established service providers with verified direct contacts</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {featuredInCity.map(biz => {
                    const loc = getLocalityFromAddress(biz.address)
                    return (
                      <Link
                        key={biz.id}
                        href={`/${biz.slug}/`}
                        className="bg-white rounded-2xl p-5 shadow-xs border border-blue-100 hover:shadow-lg hover:border-blue-300 transition-all group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-md text-xs font-bold uppercase tracking-wider truncate">
                              {biz.category}
                            </span>
                            {loc && (
                              <span className="text-xs text-slate-500 truncate">
                                📍 {loc}
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                            {biz.businessName}
                          </h3>
                          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-4">
                            {biz.description || `Verified ${biz.category} business serving customers in ${biz.city}.`}
                          </p>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-2">
                          <span className="text-xs font-bold text-emerald-700">{biz.phone}</span>
                          <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                            Profile →
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Business Listings Search & List */}
            <section className="mb-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#0f2b3d]">All Verified Listings in {cityName}</h2>
                  <p className="text-sm text-slate-500">Showing {filteredList.length} of {businessesList.length} verified businesses</p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search by name, area, service..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#60a5fa]"
                  />
                </div>
              </div>

              {filteredList.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-xs">
                  <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-700">No matching businesses found</h3>
                  <p className="text-slate-400 text-sm mt-1">Try another search term or clear the filter.</p>
                  {searchFilter && (
                    <button
                      onClick={() => setSearchFilter('')}
                      className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredList.map(biz => {
                    const locality = getLocalityFromAddress(biz.address)
                    return (
                      <Link
                        key={biz.id}
                        href={`/${biz.slug}/`}
                        className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 hover:shadow-lg hover:border-[#60a5fa]/30 transition-all group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="px-2.5 py-0.5 bg-blue-50 text-[#60a5fa] rounded-md text-xs font-semibold uppercase tracking-wider truncate max-w-[150px]">
                              {biz.category}
                            </span>
                            {locality && (
                              <span className="text-xs text-slate-500 truncate">
                                📍 {locality}
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-gray-900 text-base group-hover:text-[#60a5fa] transition-colors line-clamp-1 mb-1">
                            {biz.businessName}
                          </h3>
                          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-4">
                            {biz.description || `Verified ${biz.category} company located in ${biz.city}, Pakistan.`}
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-2">
                          <span className="text-xs font-semibold text-slate-700">{biz.phone}</span>
                          <span className="text-xs font-semibold text-[#60a5fa] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                            View Profile <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </section>

            <div className="my-8">
              <NativeAdLoader />
            </div>

            {/* City Overview & Guide */}
            <section className="bg-white p-8 rounded-2xl shadow-xs border border-gray-100 prose prose-blue max-w-none mb-10">
              {content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </section>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <BannerAdLoader variant="inline" />
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 2. CATEGORY VIEW
  // ══════════════════════════════════════════════════════════════════════════
  if (viewType === 'category' && category) {
    const content = generateCategoryContent(slug)

    // Top cities for this category with listings
    const topCitiesForCategory = [
      'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Multan', 'Faisalabad', 'Peshawar', 'Hyderabad', 'Gujranwala', 'Sialkot', 'Quetta'
    ].map(cName => {
      const cSlug = normalizeCitySlug(cName)
      const count = businessesList.filter(b => b.city?.toLowerCase() === cName.toLowerCase()).length
      return { name: cName, slug: cSlug, count }
    }).filter(c => c.count > 0)

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Categories', item: `${BASE_URL}/categories/` },
        { '@type': 'ListItem', position: 3, name: category.name, item: `${BASE_URL}/${slug}/` },
      ],
    }

    const categoryFaqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `How do I find top ${category.name.toLowerCase()} in Pakistan?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `PakBizBranches provides verified listings for ${category.name.toLowerCase()} across all major Pakistani cities, including Karachi, Lahore, and Islamabad.`
          }
        },
        {
          '@type': 'Question',
          name: `Can I add my ${category.name.toLowerCase()} business for free?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Yes, you can list your ${category.name.toLowerCase()} business on PakBizBranches for free without any subscription or credit card requirement.`
          }
        }
      ]
    }

    // Related categories
    const relatedCategories = CATEGORIES.filter(c => c.id !== slug).slice(0, 6)

    return (
      <>
        <Navbar />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryFaqSchema) }} />
        
        <main className="bg-[#f8fafc] min-h-screen">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 -mb-4">
            <BannerAdLoader variant="inline" />
          </div>

          {/* Category Hero */}
          <section className="bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] py-14 text-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/60 mb-6 flex-wrap">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                <Link href="/categories/" className="hover:text-white transition-colors">Categories</Link>
                <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                <span className="text-white font-medium">{category.name}</span>
              </nav>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-semibold text-blue-200 mb-3 border border-white/20">
                    <Layers className="w-3.5 h-3.5 text-[#60a5fa]" />
                    National Industry Sector
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                    {category.name} in Pakistan
                  </h1>
                  <p className="text-lg text-white/80 mt-3 max-w-2xl leading-relaxed">
                    Compare {businessesList.length} verified {category.name.toLowerCase()} businesses, direct phone numbers, and physical addresses across Pakistan.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shrink-0 text-center min-w-[180px]">
                  <span className="block text-3xl font-extrabold text-[#60a5fa]">{businessesList.length}</span>
                  <span className="block text-xs font-medium text-white/80 uppercase tracking-wider mt-1">Active Listings</span>
                  <Link href="/add-business/" className="inline-block mt-3 px-4 py-2 bg-[#60a5fa] hover:bg-blue-400 text-white rounded-lg text-xs font-bold transition-colors">
                    + List Your Service
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Browse by Top Cities for this Category */}
            {topCitiesForCategory.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-[#0f2b3d] mb-2">
                  Browse {category.name} by Top Cities
                </h2>
                <p className="text-sm text-slate-500 mb-5">
                  Select a city to explore local contact details and services
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                  {topCitiesForCategory.map(c => (
                    <Link
                      key={c.slug}
                      href={`/${c.slug}/${slug}/`}
                      className="group bg-white p-4 rounded-xl border border-gray-100 shadow-xs hover:border-[#60a5fa] hover:shadow-md transition-all flex items-center justify-between"
                    >
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                          {c.name}
                        </h3>
                        <span className="text-xs text-slate-400">{c.count} verified listings</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#60a5fa] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Business Listings Search & Grid */}
            <section className="mb-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#0f2b3d]">Verified {category.name} Listings</h2>
                  <p className="text-sm text-slate-500">Showing {filteredList.length} of {businessesList.length} listings</p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search by name, city, service..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#60a5fa]"
                  />
                </div>
              </div>

              {filteredList.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-xs">
                  <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-700">No matching businesses found</h3>
                  <p className="text-slate-400 text-sm mt-1">Try another search term or clear the filter.</p>
                  {searchFilter && (
                    <button
                      onClick={() => setSearchFilter('')}
                      className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredList.map(biz => {
                    const locality = getLocalityFromAddress(biz.address)
                    return (
                      <Link
                        key={biz.id}
                        href={`/${biz.slug}/`}
                        className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 hover:shadow-lg hover:border-[#60a5fa]/30 transition-all group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="px-2.5 py-0.5 bg-blue-50 text-[#60a5fa] rounded-md text-xs font-semibold truncate">
                              📍 {biz.city}{locality ? ` · ${locality}` : ''}
                            </span>
                            {biz.whatsapp && (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[11px] font-semibold flex items-center gap-1">
                                WhatsApp
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-gray-900 text-base group-hover:text-[#60a5fa] transition-colors line-clamp-1 mb-1">
                            {biz.businessName}
                          </h3>
                          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-4">
                            {biz.description || `Verified ${category.name} business based in ${biz.city}, Pakistan.`}
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-2">
                          <span className="text-xs font-semibold text-slate-700">{biz.phone}</span>
                          <span className="text-xs font-semibold text-[#60a5fa] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                            View Profile <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </section>

            {/* Related Categories Navigation */}
            <section className="mb-10 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
              <h3 className="text-base font-bold text-[#0f2b3d] mb-3">Explore Related Business Categories</h3>
              <div className="flex flex-wrap gap-2.5">
                {relatedCategories.map(rCat => (
                  <Link
                    key={rCat.id}
                    href={`/${rCat.id}/`}
                    className="px-3.5 py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 transition-all"
                  >
                    {rCat.name} →
                  </Link>
                ))}
              </div>
            </section>

            <div className="my-8">
              <NativeAdLoader />
            </div>

            {/* Category Overview */}
            <section className="bg-white p-8 rounded-2xl shadow-xs border border-gray-100 prose prose-blue max-w-none mb-10">
              {content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </section>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <BannerAdLoader variant="inline" />
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 3. BUSINESS DETAIL VIEW
  // ══════════════════════════════════════════════════════════════════════════
  if (viewType === 'business' && business) {
    const businessCategory = CATEGORIES.find(c => c.id === business.category)
    const categoryName = businessCategory?.name ?? business.category
    const primaryWhatsapp = business.whatsapp ? business.whatsapp.split(/[,/]/)[0].replace(/[^0-9]/g, '') : null
    const whatsappUrl = primaryWhatsapp ? `https://wa.me/${primaryWhatsapp.startsWith('92') ? primaryWhatsapp : `92${primaryWhatsapp.replace(/^0/, '')}`}` : null

    const rawWeb = business.websiteUrl || business.website || ''
    const rawFb = business.facebookPage || (business as any).facebook || ''
    const rawIg = business.instagramProfile || (business as any).instagram || ''
    const rawTt = business.tiktokProfile || (business as any).tiktok || ''
    const rawYt = business.youtubeChannel || (business as any).youtube || ''
    const rawGb = business.googleBusiness || (business as any).googleBusinessUrl || (business as any).googleMaps || ''

    const websiteUrl = rawWeb ? (rawWeb.startsWith('http') ? rawWeb : `https://${rawWeb}`) : null
    const facebookUrl = rawFb ? (rawFb.startsWith('http') ? rawFb : `https://facebook.com/${rawFb.replace(/^@/, '')}`) : null
    const instagramUrl = rawIg ? (rawIg.startsWith('http') ? rawIg : `https://instagram.com/${rawIg.replace(/^@/, '')}`) : null
    const tiktokUrl = rawTt ? (rawTt.startsWith('http') ? rawTt : `https://tiktok.com/@${rawTt.replace(/^@/, '')}`) : null
    const youtubeUrl = rawYt ? (rawYt.startsWith('http') ? rawYt : `https://youtube.com/${rawYt.startsWith('@') ? rawYt : `@${rawYt}`}`) : null
    const googleBusinessUrl = rawGb ? (rawGb.startsWith('http') ? rawGb : `https://${rawGb}`) : null

    const sameAs: string[] = []
    if (websiteUrl) sameAs.push(websiteUrl)
    if (facebookUrl) sameAs.push(facebookUrl)
    if (instagramUrl) sameAs.push(instagramUrl)
    if (tiktokUrl) sameAs.push(tiktokUrl)
    if (youtubeUrl) sameAs.push(youtubeUrl)
    if (googleBusinessUrl) sameAs.push(googleBusinessUrl)

    const hasSocials = !!(websiteUrl || facebookUrl || instagramUrl || tiktokUrl || youtubeUrl || googleBusinessUrl)

    const cityDetails = CITY_INFO[business.city]
    const province = cityDetails?.province ?? 'Pakistan'
    const locality = getLocalityFromAddress(business.address)

    const finalLogoUrl = getBusinessLogoUrl(business.logoUrl, business.businessName, business.slug)

    const services = (business.services && business.services.length > 0)
      ? business.services
      : business.subCategory
      ? [{ title: `${business.subCategory} Services`, desc: `Specialized ${business.subCategory.toLowerCase()} services provided by ${business.businessName} in ${business.city}.` }]
      : []

    const businessHours = getBusinessHours(business)
    const citySlug = normalizeCitySlug(business.city)
    const categorySlug = business.category

    const faqs = business.faqs && business.faqs.length > 0
      ? business.faqs
      : [
          {
            question: `Where is ${business.businessName} located?`,
            answer: `${business.businessName} is located at ${business.address}, ${business.city}, Pakistan.`,
          },
          {
            question: `What is the contact phone number for ${business.businessName}?`,
            answer: `You can reach ${business.businessName} by calling ${business.phone}.`,
          },
          {
            question: `How can I connect with ${business.businessName} on WhatsApp?`,
            answer: business.whatsapp 
              ? `You can message ${business.businessName} directly via WhatsApp at ${business.whatsapp}.`
              : `A direct WhatsApp line is not listed. Please contact them via phone at ${business.phone}.`,
          },
        ]

    // LocalBusiness schema WITHOUT deceptive AggregateRating or fake priceRange
    const localBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': business.category === 'real-estate' 
        ? 'RealEstateAgent' 
        : business.category === 'restaurants' 
        ? 'Restaurant' 
        : business.category === 'finance'
        ? 'FinancialService'
        : business.category === 'healthcare'
        ? 'MedicalOrganization'
        : business.category === 'automotive'
        ? 'AutomotiveBusiness'
        : business.category === 'travel'
        ? 'TravelAgency'
        : 'LocalBusiness',
      '@id': `${BASE_URL}/${business.slug}/`,
      name: business.businessName,
      description: business.description || `Verified ${categoryName} company in ${business.city}, Pakistan.`,
      url: `${BASE_URL}/${business.slug}/`,
      telephone: business.phone,
      ...(business.email && { email: business.email }),
      address: {
        '@type': 'PostalAddress',
        streetAddress: business.address,
        addressLocality: business.city,
        addressRegion: province,
        addressCountry: 'PK',
      },
      areaServed: { '@type': 'City', name: business.city },
      ...(business.openingHoursSpecification && { openingHoursSpecification: business.openingHoursSpecification }),
      ...(businessCategory && { knowsAbout: businessCategory.name }),
      ...(finalLogoUrl && { image: finalLogoUrl, logo: finalLogoUrl }),
      ...(sameAs.length > 0 && { sameAs }),
    }

    // 4-Level Strict Breadcrumb Schema: Home -> City -> Category in City -> Business
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: business.city, item: `${BASE_URL}/${citySlug}/` },
        { '@type': 'ListItem', position: 3, name: `${categoryName} in ${business.city}`, item: `${BASE_URL}/${citySlug}/${categorySlug}/` },
        { '@type': 'ListItem', position: 4, name: business.businessName, item: `${BASE_URL}/${business.slug}/` },
      ],
    }

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    }

    const mapQuery = encodeURIComponent(`${business.businessName}, ${business.address}, ${business.city}`)
    const mapSrc = `https://maps.google.com/maps?q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`

    return (
      <>
        <Navbar />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        
        <main className="bg-[#f8fafc] min-h-screen">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 -mb-4">
            <BannerAdLoader variant="inline" />
          </div>

          {/* Profile Header */}
          <section className="bg-white border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Visible Hierarchical Breadcrumbs */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
                <Link href="/" className="hover:text-[#60a5fa] transition-colors">Home</Link>
                <ChevronRight className="w-3 h-3 text-gray-400" />
                <Link href={`/${citySlug}/`} className="hover:text-[#60a5fa] transition-colors">{business.city}</Link>
                <ChevronRight className="w-3 h-3 text-gray-400" />
                <Link href={`/${citySlug}/${categorySlug}/`} className="hover:text-[#60a5fa] transition-colors">{categoryName}</Link>
                <ChevronRight className="w-3 h-3 text-gray-400" />
                <span className="text-gray-800 font-medium truncate max-w-[200px] sm:max-w-none">{business.businessName}</span>
              </nav>

              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="shrink-0">
                  {finalLogoUrl ? (
                    <img src={finalLogoUrl} alt={`${business.businessName} logo`} width={128} height={128} className="w-28 sm:w-32 h-28 sm:h-32 rounded-2xl object-cover border border-gray-200 shadow-xs" loading="lazy" />
                  ) : (
                    <div className="w-28 sm:w-32 h-28 sm:h-32 rounded-2xl bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] flex items-center justify-center border border-gray-200">
                      <Building2 className="w-14 sm:w-16 h-14 sm:h-16 text-white/60" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Profile
                    </span>
                    {locality && (
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                        📍 {locality}
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0f2b3d] tracking-tight mb-2">
                    {business.businessName}
                  </h1>

                  <div className="flex flex-wrap items-center gap-2.5 text-gray-500 mb-5">
                    <Link href={`/${citySlug}/${categorySlug}/`} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-[#60a5fa] rounded-full text-xs font-semibold hover:bg-blue-100 transition-colors">
                      {categoryName} in {business.city}
                    </Link>
                    <Link href={`/${citySlug}/`} className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {business.city}, {province}
                    </Link>
                  </div>

                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
                    {business.shortIntro || (
                      business.description 
                        ? business.description.split('.')[0] + '.'
                        : `Verified ${categoryName} company located in ${business.city}, Pakistan.`
                    )}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <a 
                      href={`tel:${business.phone.replace(/[^0-9+]/g, '')}`} 
                      aria-label={`Call ${business.businessName} at ${business.phone}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0f2b3d] hover:bg-[#1a3f57] text-white rounded-xl font-semibold text-sm transition-all shadow-xs"
                    >
                      <Phone className="w-4 h-4 text-emerald-400" /> Call {business.phone}
                    </a>

                    {whatsappUrl && (
                      <a 
                        href={whatsappUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label={`Send WhatsApp message to ${business.businessName}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-all shadow-xs"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" /> WhatsApp
                      </a>
                    )}

                    {websiteUrl && (
                      <a 
                        href={websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label={`Visit official website of ${business.businessName}`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl font-semibold text-sm transition-all shadow-xs"
                      >
                        <Globe className="w-4 h-4 text-blue-600" /> Website
                        <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                      </a>
                    )}

                    {business.email && (
                      <a 
                        href={`mailto:${business.email}`} 
                        aria-label={`Email ${business.businessName}`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 rounded-xl font-semibold text-sm transition-all shadow-xs"
                      >
                        <Mail className="w-4 h-4 text-slate-600" /> Email
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Profile Details Layout */}
          <section className="py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Social Profiles */}
                  {hasSocials && (
                    <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-gray-100">
                      <h2 className="text-lg font-bold text-[#0f2b3d] mb-1 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-[#60a5fa]" /> Verified Online Channels
                      </h2>
                      <p className="text-slate-500 text-xs mb-4">
                        Direct online channels and official profiles for {business.businessName}.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {websiteUrl && (
                          <a
                            href={websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-xl border border-blue-100 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-300 transition-all group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                              <Globe className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="block text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate">Official Website</span>
                              <span className="block text-xs text-slate-400 truncate">{websiteUrl.replace(/^https?:\/\//i, '').replace(/\/$/, '')}</span>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                          </a>
                        )}

                        {facebookUrl && (
                          <a
                            href={facebookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-xl border border-blue-100 bg-[#1877F2]/5 hover:bg-[#1877F2]/10 transition-all group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#1877F2] text-white flex items-center justify-center shrink-0">
                              <Facebook className="w-4 h-4 fill-current" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="block text-xs font-bold text-slate-800 group-hover:text-[#1877F2] truncate">Facebook Profile</span>
                              <span className="block text-xs text-slate-400 truncate">{rawFb.replace(/^https?:\/\/(www\.)?facebook\.com\/?/i, '') || 'Facebook'}</span>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1877F2] shrink-0" />
                          </a>
                        )}

                        {instagramUrl && (
                          <a
                            href={instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-xl border border-pink-100 bg-pink-50/40 hover:border-pink-300 transition-all group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shrink-0">
                              <Instagram className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="block text-xs font-bold text-slate-800 group-hover:text-pink-600 truncate">Instagram</span>
                              <span className="block text-xs text-slate-400 truncate">{rawIg.replace(/^https?:\/\/(www\.)?instagram\.com\/?/i, '') || '@Instagram'}</span>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-600 shrink-0" />
                          </a>
                        )}

                        {googleBusinessUrl && (
                          <a
                            href={googleBusinessUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="block text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate">Google Maps Listing</span>
                              <span className="block text-xs text-slate-400 truncate">Open in Google Maps</span>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* About Section */}
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-100">
                    <h2 className="text-xl font-bold text-[#0f2b3d] mb-4">
                      {business.aboutHeading || `About ${business.businessName}`}
                    </h2>

                    {business.aboutText ? (
                      <FormattedDescription text={business.aboutText} />
                    ) : (
                      <div className="space-y-3">
                        {business.description && (
                          <FormattedDescription text={business.description} />
                        )}
                        <p className="text-gray-600 text-sm">
                          {business.businessName} is a verified business citation in the <strong>{categoryName}</strong> directory, serving customers in {locality ? `${locality}, ` : ''}{business.city}, Pakistan.
                        </p>
                      </div>
                    )}

                    {/* Key Business Attributes */}
                    <div className="mt-8 border-t border-gray-100 pt-6">
                      <h3 className="text-base font-bold text-[#0f2b3d] mb-3">Key Business Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-slate-400 block mb-0.5">Primary Sector</span>
                          <span className="font-semibold text-slate-800">{categoryName}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-slate-400 block mb-0.5">Location & Area</span>
                          <span className="font-semibold text-slate-800">{locality ? `${locality}, ${business.city}` : `${business.city}, ${province}`}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-slate-400 block mb-0.5">Direct Telephone</span>
                          <span className="font-semibold text-emerald-700">{business.phone}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-slate-400 block mb-0.5">Instant WhatsApp</span>
                          <span className="font-semibold text-slate-800">{business.whatsapp ? 'Available & Verified' : 'Direct Call Only'}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-slate-400 block mb-0.5">Official Digital Channels</span>
                          <span className="font-semibold text-slate-800">{hasSocials ? 'Active Channels Listed' : 'Offline / Contact by Phone'}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-slate-400 block mb-0.5">Directory Listing Status</span>
                          <span className="font-semibold text-emerald-600">Active Free Citation</span>
                        </div>
                      </div>
                    </div>

                    {/* Services */}
                    {services.length > 0 && (
                      <div className="mt-8 border-t border-gray-100 pt-6">
                        <h3 className="text-lg font-bold text-[#0f2b3d] mb-4">Services & Offerings</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {services.map((service, index) => (
                            <div key={index} className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                              <h4 className="text-sm font-bold text-gray-900 mb-1">{service.title}</h4>
                              <p className="text-gray-600 text-xs leading-relaxed mb-0">{service.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* FAQs */}
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-100 space-y-4">
                    <h2 className="text-xl font-bold text-[#0f2b3d]">Frequently Asked Questions</h2>
                    <div className="space-y-3">
                      {faqs.map((faq, fIdx) => (
                        <div key={fIdx} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                          <h3 className="font-bold text-gray-900 mb-1 text-sm">{faq.question}</h3>
                          <p className="text-gray-600 text-xs leading-relaxed">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contextual Internal Linking Box */}
                  <div className="bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-100 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-[#0f2b3d] uppercase tracking-wider mb-2">
                      Explore Related Directories
                    </h3>
                    <p className="text-xs text-slate-600 mb-4">
                      Discover more verified business contacts in your area:
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      <Link 
                        href={`/${citySlug}/${categorySlug}/`} 
                        className="px-3.5 py-2 bg-white border border-blue-200 rounded-xl text-xs font-semibold text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-2xs"
                      >
                        Top {categoryName} in {business.city} →
                      </Link>
                      <Link 
                        href={`/${citySlug}/`} 
                        className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:border-slate-300 transition-all shadow-2xs"
                      >
                        All Businesses in {business.city} →
                      </Link>
                      <Link 
                        href={`/${categorySlug}/`} 
                        className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:border-slate-300 transition-all shadow-2xs"
                      >
                        All {categoryName} in Pakistan →
                      </Link>
                    </div>
                  </div>

                  {/* Similar Businesses */}
                  {similarBusinesses.length > 0 && (
                    <div className="space-y-4 pt-2">
                      <h2 className="text-xl font-bold text-[#0f2b3d]">Similar {categoryName} in {business.city}</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {similarBusinesses.map(biz => (
                          <Link key={biz.id} href={`/${biz.slug}/`} className="bg-white p-4 rounded-xl shadow-xs border border-gray-100 hover:border-[#60a5fa]/30 transition-all flex items-center justify-between gap-3 group">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50">
                                <Building2 className="w-5 h-5 text-gray-400 group-hover:text-[#60a5fa]" />
                              </div>
                              <div className="min-w-0">
                                <span className="block font-bold text-gray-900 group-hover:text-[#60a5fa] text-sm truncate">{biz.businessName}</span>
                                <span className="block text-xs text-gray-500 truncate">{biz.phone}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#60a5fa] shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Nearby Businesses in this City */}
                  {nearbyBusinesses.length > 0 && (
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-[#0f2b3d]">More Local Businesses in {business.city}</h2>
                        <Link href={`/${citySlug}/`} className="text-xs font-semibold text-blue-600 hover:underline">
                          View all in {business.city} →
                        </Link>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {nearbyBusinesses.map(biz => (
                          <Link key={biz.id} href={`/${biz.slug}/`} className="bg-white p-4 rounded-xl shadow-xs border border-gray-100 hover:border-[#60a5fa]/30 transition-all flex items-center justify-between gap-3 group">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50">
                                <Building2 className="w-5 h-5 text-gray-400 group-hover:text-[#60a5fa]" />
                              </div>
                              <div className="min-w-0">
                                <span className="block font-bold text-gray-900 group-hover:text-[#60a5fa] text-sm truncate">{biz.businessName}</span>
                                <span className="block text-xs text-slate-400 capitalize truncate">{biz.category} • {biz.phone}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#60a5fa] shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Multi-City Branches */}
                  {branches.length > 0 && (
                    <div className="space-y-4 pt-2">
                      <h2 className="text-xl font-bold text-[#0f2b3d]">{business.businessName} in Other Cities</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {branches.map(br => (
                          <Link key={br.id} href={`/${br.slug}/`} className="bg-white p-4 rounded-xl shadow-xs border border-gray-100 hover:border-[#60a5fa]/30 transition-all flex items-center justify-between gap-3 group">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50">
                                <MapPin className="w-5 h-5 text-[#60a5fa]" />
                              </div>
                              <div className="min-w-0">
                                <span className="block font-bold text-gray-900 group-hover:text-[#60a5fa] text-sm truncate">{business.businessName} – {br.city}</span>
                                <span className="block text-xs text-gray-500 truncate">{br.phone}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#60a5fa] shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                  {/* Location & Map Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-[#0f2b3d] text-base flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#60a5fa]" /> Physical Address
                      </h3>
                      <a 
                        href={directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline font-semibold"
                      >
                        Get Directions ↗
                      </a>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      {business.address.toLowerCase().includes(business.city.toLowerCase()) ? business.address : `${business.address}, ${business.city}, Pakistan`}
                    </p>

                    <div className="rounded-xl overflow-hidden border border-gray-100 min-h-[180px] bg-slate-50 relative flex items-center justify-center">
                      {mapLoaded ? (
                        <iframe src={mapSrc} width="100%" height="180" style={{ border: 0 }} allowFullScreen loading="lazy" title="Map Location" />
                      ) : (
                        <button
                          onClick={() => setMapLoaded(true)}
                          className="w-full h-[180px] flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50/40 hover:bg-blue-50 transition-colors group cursor-pointer"
                        >
                          <MapPin className="w-7 h-7 text-[#60a5fa] group-hover:scale-110 transition-transform mb-1.5" />
                          <span className="text-xs font-semibold text-gray-800">Show Google Map</span>
                          <span className="text-2xs text-gray-500">Click to view location map</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100">
                    <h3 className="font-bold text-[#0f2b3d] text-base mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#60a5fa]" /> Operating Hours
                    </h3>
                    {businessHours && businessHours.length > 0 ? (
                      <div className="space-y-2 text-xs text-gray-600">
                        {businessHours.map((item, hIdx) => (
                          <div key={hIdx} className="flex justify-between border-b border-gray-50 pb-1.5">
                            <span className="text-slate-500">{item.days}:</span>
                            <span className="font-semibold text-emerald-700">{item.hours}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
                        <p className="font-medium text-slate-700 mb-1">Timings Not Registered</p>
                        <p className="text-slate-500">
                          Contact {business.businessName} directly at <span className="font-semibold text-slate-700">{business.phone}</span> to confirm current opening hours before visiting.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Claim Listing Card */}
                  <div className="bg-[#0f2b3d] rounded-2xl p-6 text-white shadow-xs">
                    <h3 className="font-bold text-base mb-1.5">Are you the owner?</h3>
                    <p className="text-xs text-white/70 mb-4 leading-relaxed">
                      Update phone numbers, opening hours, WhatsApp link, address, or claim ownership of this profile.
                    </p>
                    <button
                      onClick={() => setClaimModalOpen(true)}
                      className="w-full text-center py-2.5 bg-[#60a5fa] hover:bg-blue-400 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Claim or Suggest Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Claim / Update Modal */}
          {claimModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
                <button 
                  onClick={() => setClaimModalOpen(false)}
                  className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                    🛡️
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0f2b3d]">Claim or Update Profile</h3>
                    <p className="text-xs text-slate-500">{business.businessName} • {business.city}</p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  Are you the owner or authorized representative of <strong>{business.businessName}</strong>? Send your verified details directly to our directory team to update contact numbers, operating hours, address, or website.
                </p>

                <div className="space-y-3 mb-6">
                  <a
                    href={`https://wa.me/923000000000?text=${encodeURIComponent(`Hello PakBizBranches Team, I am reaching out to claim/update the listing for ${business.businessName} in ${business.city} (Slug: ${business.slug}).\n\nUpdates requested:\n- Phone: \n- Timings: \n- Address: `)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" /> Submit via WhatsApp Support
                  </a>

                  <a
                    href={`mailto:admin@pakbizbranhces.online?subject=${encodeURIComponent(`Update Request: ${business.businessName} (${business.city})`)}&body=${encodeURIComponent(`Business Name: ${business.businessName}\nCity: ${business.city}\nListing Slug: ${business.slug}\n\nRequested Updates:\n- Phone:\n- WhatsApp:\n- Address:\n- Business Hours:\n- Official Website:\n\nContact Person:\nPhone Number:\n`)}`}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-sm font-semibold transition-colors border border-slate-200"
                  >
                    <Mail className="w-4 h-4 text-slate-600" /> Submit via Official Email
                  </a>
                </div>

                <p className="text-2xs text-slate-400 text-center">
                  Free listing management. We verify all changes within 24-48 hours.
                </p>
              </div>
            </div>
          )}

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <BannerAdLoader variant="inline" />
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return null
}
