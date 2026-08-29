'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, Phone, Mail, MapPin, MessageCircle, Building2,
  Globe, Facebook, Youtube, Instagram, ExternalLink, ChevronRight, ArrowRight, Loader2, Share2, Check
} from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import CountdownLoader from '@/components/ui/countdown-loader'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import { CATEGORIES, CITIES } from '@/lib/data'
import { LIVE_STATUSES, getPossibleCategoryValues } from '@/lib/category-mappings'
import { generateCategoryContent, generateCityContent, CITY_INFO } from '@/lib/seo-content'
import { getCategoryKeywordCluster, getCityKeywordCluster } from '@/lib/organic-keywords'
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

interface ServiceItem {
  title: string
  desc: string
}

function findCityBySlug(slug: string): string | null {
  const normalized = slug.replace(/-/g, ' ').toLowerCase()
  return CITIES.find(c => c.toLowerCase() === normalized) ?? null
}

function findCategoryBySlug(slug: string) {
  return CATEGORIES.find(c => c.id === slug) ?? null
}

function getServicesByCategory(category: string, businessName: string): ServiceItem[] {
  const defaultServices: ServiceItem[] = [
    { title: 'Custom Business Solutions', desc: `Tailored options designed to meet the unique needs of ${businessName} clients.` },
    { title: 'Client Consulting & Support', desc: 'Direct, responsive communication channels for immediate assistance.' },
    { title: 'Standardized Quality Auditing', desc: 'A strict commitment to performance, reliability, and service excellence.' },
    { title: 'Local Service Delivery', desc: 'Efficient service execution aligned with international best practices.' }
  ]

  const serviceMap: Record<string, ServiceItem[]> = {
    'restaurants': [
      { title: 'Fine Dining & Culinary Experience', desc: 'Enjoy custom food menus, authentic international and local cuisines, and refined group dining options.' },
      { title: 'Takeaway & Express Home Delivery', desc: 'Hygienic and fast packaging with reliable home delivery services to preserve freshness and taste.' },
      { title: 'Private Events & Professional Catering', desc: 'Full-service catering and hosting for corporate gatherings, birthday parties, and custom celebrations.' },
      { title: 'Strict Food Hygiene & Quality Standards', desc: 'Strict adherence to health regulations using only fresh, premium, and hand-selected ingredients.' }
    ],
    'real-estate': [
      { title: 'Residential Property Sales & Leasing', desc: 'Browse verified listings for luxury houses, modern apartments, villas, and secure residential plots.' },
      { title: 'Commercial Real Estate Advisory', desc: 'Find premium office spaces, retail showrooms, warehouses, and get expert investment guidance.' },
      { title: 'Comprehensive Property Management', desc: 'Rent collection, property maintenance, tenant verification, and standardized portfolio management.' },
      { title: 'Valuation & Legal Documentation Assistance', desc: 'Accurate real estate market valuation combined with seamless, secure legal ownership transfers.' }
    ],
    'technology': [
      { title: 'Custom Software & Web App Development', desc: 'Bespoke corporate websites, web portals, cloud application designs, and custom API integrations.' },
      { title: 'IT Infrastructure Setup & Network Solutions', desc: 'Secure network planning, server maintenance, active firewall setup, and 24/7 technical support.' },
      { title: 'Mobile App Engineering (iOS & Android)', desc: 'User-friendly native and cross-platform mobile apps featuring intuitive user interfaces.' },
      { title: 'Cyber Security & Digital Transformation', desc: 'Advanced cloud migration services, system automation, and strict vulnerability audits.' }
    ],
    'healthcare': [
      { title: 'General Medicine & Diagnostic Consultation', desc: 'Professional outpatient care, specialized clinical checkups, and comprehensive laboratory referrals.' },
      { title: 'Specialized Treatments & Chronic Care', desc: 'Expert medical interventions for specialized disorders and personalized treatment plans.' },
      { title: 'Emergency Care & Round-the-Clock Support', desc: 'Immediate medical attention, active nursing care, and trusted emergency service coordination.' },
      { title: 'Preventive Health Screenings & Wellness', desc: 'Regular preventive health checkups, cardiovascular screenings, and professional lifestyle counseling.' }
    ],
    'education': [
      { title: 'Standard Academic Curriculum Tutoring', desc: 'Structured learning programs for school, college, and university students across major disciplines.' },
      { title: 'Professional Skill-Based Certifications', desc: 'Industry-standard training in software coding, language fluency, and corporate management.' },
      { title: 'Career Guidance & Academic Counseling', desc: 'One-on-one sessions for local and international university admissions and career pathway planning.' },
      { title: 'Interactive Workshops & Live Seminars', desc: 'Practical, hands-on learning sessions led by domain experts to foster real-world understanding.' }
    ],
    'retail': [
      { title: 'Premium Product Inventory Selection', desc: 'Wide range of high-quality products from top local and international brands under one roof.' },
      { title: 'Customer-Centric Shopping Experience', desc: 'Dedicated instore support, easy exchanges, product demonstrations, and customer loyalty rewards.' },
      { title: 'Wholesale & B2B Bulk Commercial Supply', desc: 'Cost-effective bulk purchasing options with special commercial discounts for corporate buyers.' },
      { title: 'Genuine Brand & Warranty Assurance', desc: 'Rest assured with 100% original merchandise backed by official manufacturer warranties.' }
    ],
    'construction': [
      { title: 'Architectural Design & Modern Blueprints', desc: 'Vibrant 3D interior/exterior concepts and comprehensive structural blueprints.' },
      { title: 'General Contracting & Civil Engineering', desc: 'High-quality gray structure construction, foundation works, and commercial high-rise building.' },
      { title: 'Premium Interior Design & Finishes', desc: 'Elegant false ceiling work, premium wood paneling, tile installation, and customized modular kitchens.' },
      { title: 'High-Grade Materials Procurement', desc: 'Sourcing certified grade-60 steel, premium cement brands, and durable electrical/plumbing fittings.' }
    ],
    'automotive': [
      { title: 'Periodic Maintenance & Dynamic Oil Change', desc: 'Engine tuning, comprehensive fluid top-ups, filter replacements, and standard computer diagnostics.' },
      { title: 'Mechanical, Suspension & Electrical Repairs', desc: 'Advanced suspension overhaul, transmission diagnostics, brake servicing, and electrical wiring fixes.' },
      { title: 'Certified OEM Spare Parts Replacement', desc: 'Guaranteed genuine manufacturer spare parts ensuring maximum vehicle longevity and safety.' },
      { title: 'Premium Detailing & Interior Deep Cleaning', desc: 'Multi-stage paint correction, ceramic coatings, steam car washing, and leather conditioning.' }
    ],
    'finance': [
      { title: 'Commercial Business Account Services', desc: 'Structured corporate bank accounts, payment processing setups, and business credit solutions.' },
      { title: 'Financial Planning & Wealth Management', desc: 'Personalized investment portfolios, savings schemes, and long-term asset diversification advice.' },
      { title: 'Corporate Loan & Credit Facility Auditing', desc: 'Streamlined loan applications for home financing, commercial expansion, and auto leasing.' },
      { title: 'Secure Digital Payment Gateways', desc: 'Integration of highly secure web-based payment networks and encrypted mobile transfers.' }
    ],
    'travel': [
      { title: 'Worldwide Air Ticketing & Seat Booking', desc: 'Affordable domestic and international flight options across leading global airlines.' },
      { title: 'Custom Holiday Packages & Hotel Stays', desc: 'Tailor-made itineraries, verified premium hotel bookings, and safe local sightseeing guides.' },
      { title: 'Visa Documentation & Passport Assistance', desc: 'Professional review of travel documents, application support, and travel insurance policy procurement.' },
      { title: 'Executive B2B Travel Management', desc: 'Corporate travel booking coordination, airport lounge access, and premium car rental services.' }
    ],
    'beauty': [
      { title: 'High-End Hair Styling, Cuts & Coloring', desc: 'Trendy haircuts, scalp treatments, protein therapies, and professional coloring services.' },
      { title: 'Bridal & Party Makeover Artistry', desc: 'Flawless makeup packages for weddings and special occasions using high-end cosmetic brands.' },
      { title: 'Skin Care, HydraFacials & Organic Therapy', desc: 'Deep skin cleansing, organic facials, anti-acne treatments, and skin rejuvenation programs.' },
      { title: 'Relaxing Spa Massages & Body Treatment', desc: 'Aromatherapy, therapeutic body scrubs, and deep tissue stress-relief massage therapies.' }
    ],
    'logistics': [
      { title: 'Nationwide Cargo & Courier Logistics', desc: 'Secure parcel delivery, heavy freight shipping, and real-time package tracking facilities.' },
      { title: 'Safe Warehousing & Commercial Storage', desc: 'Secure, clean, and spacious inventory storage options with active barcode cataloging.' },
      { title: 'Supply Chain & Merchant Distribution', desc: 'Fleet management, merchant distribution routes, and end-to-end commercial supply logistics.' },
      { title: 'Heavy Vehicle Fleet & Container Shipping', desc: 'Specialized shipping services for heavy machinery, bulk materials, and cargo container transport.' }
    ]
  }

  return serviceMap[category] ?? defaultServices
}

function generateDynamicAboutSection(business: Business, categoryName: string): string {
  const parts = [
    `Welcome to the professional profile of ${business.businessName}, a highly regarded and verified ${categoryName} company operating in ${business.city}, Pakistan.`,
    `As an established leader within the local ${categoryName.toLowerCase()} sector, ${business.businessName} has built a solid reputation for delivering exceptional service quality, reliability, and professional solutions to clients across the region.`,
    `Conveniently located at their physical address: ${business.address}, ${business.city}, they serve as a vital hub for local patrons looking for expert ${categoryName.toLowerCase()} assistance.`,
    `Whether you are seeking customized options, expert consultation, or everyday support, their team is dedicated to meeting your precise business and personal requirements with professionalism.`
  ]

  if (business.whatsapp || business.email || business.websiteUrl) {
    parts.push(
      `To ensure seamless accessibility and customer convenience, ${business.businessName} offers multiple communication channels. You can easily reach their official representatives by calling their primary phone number at ${business.phone}${business.whatsapp ? ` or messaging them on WhatsApp` : ''}${business.email ? ` or via email at ${business.email}` : ''}.`
    )
  } else {
    parts.push(
      `To ensure seamless accessibility and customer convenience, ${business.businessName} maintains active communication lines. You can easily reach their official representatives by calling their primary phone number at ${business.phone} for immediate assistance, booking inquiries, or service consultations.`
    )
  }

  parts.push(
    `By choosing a verified listing like ${business.businessName} on the PakBizBranches business directory, you are guaranteed authentic contact details, correct address mapping, and direct connection pathways to premium services in ${business.city}.`
  )

  return parts.join(' ')
}

interface CatchAllPageClientProps {
  slug: string
  initialViewType?: 'city' | 'category' | 'business'
  initialCityName?: string | null
  initialCategory?: any
  initialBusiness?: Business | null
  initialBusinessesList?: Business[]
  initialSimilarBusinesses?: Business[]
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
  const [branches, setBranches] = useState<Business[]>(initialBranches)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    async function loadData() {
      // If initialViewType is already set, we paint instantly without showing a skeleton!
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
          const q = query(collection(db, 'businesses'), where('city', '==', city), limit(40))
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
          }).slice(0, 40)
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

      // 3. Fallback: Business View (Try dynamic Firestore if initialBusiness was not provided)
      let foundBiz: Business | null = initialBusiness
      if (!foundBiz) {
        try {
          const q = query(
            collection(db, 'businesses'),
            where('slug', '==', slug),
            limit(1)
          )
          const querySnapshot = await getDocs(q)
          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0]
            foundBiz = { id: doc.id, ...doc.data() } as Business
          }
        } catch (err) {
          console.error('Error fetching dynamic business details:', err)
        }
      }

      if (foundBiz) {
        setBusiness(foundBiz)
        setViewType('business')
        setLoading(false)
        setCountdownDone(true)

        // Defer Firestore dynamic background enrichment without blocking initial paint
        const targetBiz = foundBiz
        setTimeout(async () => {
          try {
            const qSimilar = query(
              collection(db, 'businesses'),
              where('city', '==', targetBiz.city),
              where('category', '==', targetBiz.category),
              limit(5)
            )
            const qBranches = query(
              collection(db, 'businesses'),
              where('businessName', '==', targetBiz.businessName),
              limit(10)
            )
            const [simSnap, brSnap] = await Promise.all([getDocs(qSimilar), getDocs(qBranches)])
            
            const dynSimilar = simSnap.docs
              .map(doc => ({ id: doc.id, ...doc.data() } as Business))
              .filter(b => b.slug !== slug && (!b.status || LIVE_STATUSES.has(b.status.toLowerCase())))
            const mergedSim = new Map<string, Business>()
            initialSimilarBusinesses.forEach(b => mergedSim.set(b.slug, b))
            dynSimilar.forEach(b => mergedSim.set(b.slug, b))
            if (mergedSim.size > 0) {
              setSimilarBusinesses(Array.from(mergedSim.values()).slice(0, 4))
            }

            const dynBranches = brSnap.docs
              .map(doc => ({ id: doc.id, ...doc.data() } as Business))
              .filter(b => b.slug !== slug && (!b.status || LIVE_STATUSES.has(b.status.toLowerCase())))
            const mergedBr = new Map<string, Business>()
            initialBranches.forEach(b => mergedBr.set(b.slug, b))
            dynBranches.forEach(b => mergedBr.set(b.slug, b))
            if (mergedBr.size > 0) {
              setBranches(Array.from(mergedBr.values()))
            }
          } catch (err) {
            console.error('Error loading dynamic related businesses:', err)
          }
        }, 100)
        
        return
      }

      // If nothing matches in static DB or Firebase, show 404
      setViewType('404')
      setLoading(false)
      setCountdownDone(true)
    }

    loadData()
  }, [slug])

  // Loading skeleton state (only show skeleton if we have no pre-rendered data)
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

  // 1. City View
  if (viewType === 'city' && cityName) {
    const content = generateCityContent(cityName)
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: cityName, item: `${BASE_URL}/${slug}/` },
      ],
    }

    return (
      <>
        <Navbar />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <main className="bg-[#f8fafc] min-h-screen">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 -mb-4">
            <BannerAdLoader variant="inline" />
          </div>
          <section className="bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/60 mb-6">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-white font-medium">{cityName}</span>
              </nav>
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-8 h-8 text-[#60a5fa]" />
                <h1 className="text-4xl md:text-5xl font-bold text-white">Business Directory {cityName} – Find Local Companies & Services</h1>
              </div>
              <p className="text-xl text-white/80 max-w-2xl">Discover top-rated local businesses in {cityName}.</p>
            </div>
          </section>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {businessesList.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium text-sm">No listings found in {cityName} yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {businessesList.map(biz => (
                  <Link key={biz.id} href={`/${biz.slug}/`} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group flex flex-col justify-between">
                     <div className="min-w-0">
                       <h3 className="font-bold text-gray-900 group-hover:text-[#60a5fa] truncate mb-2">{biz.businessName}</h3>
                     </div>
                     <div className="flex items-center justify-between border-t border-gray-50 pt-2 mt-2">
                       <span className="text-sm text-gray-500">{biz.phone}</span>
                       <button
                         onClick={(e) => {
                           e.preventDefault()
                           e.stopPropagation()
                           window.location.href = `tel:${biz.phone.replace(/[^0-9+]/g, '')}`
                         }}
                         className="flex items-center justify-center p-1.5 bg-[#60a5fa]/10 hover:bg-[#60a5fa]/20 text-[#60a5fa] rounded-full transition-colors cursor-pointer"
                         title={`Call ${biz.businessName}`}
                       >
                         <Phone className="w-3.5 h-3.5 fill-current" />
                       </button>
                     </div>
                  </Link>
                ))}
              </div>
            )}
            <div className="mt-8">
              <NativeAdLoader />
            </div>
            <div className="mt-12 prose prose-blue max-w-none bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
               {content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <BannerAdLoader variant="inline" />
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // 2. Category View
  if (viewType === 'category' && category) {
    const content = generateCategoryContent(slug)
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: category.name, item: `${BASE_URL}/${slug}/` },
      ],
    }

    return (
      <>
        <Navbar />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <main className="bg-[#f8fafc] min-h-screen">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 -mb-4">
            <BannerAdLoader variant="inline" />
          </div>
          <section className="bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/60 mb-6">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-white font-medium">{category.name}</span>
              </nav>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{category.name} in Pakistan</h1>
              <p className="text-xl text-white/80">Browse verified {category.name.toLowerCase()} businesses across Pakistan.</p>
            </div>
          </section>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {businessesList.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium text-sm">No listings found for {category.name} yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {businessesList.map(biz => (
                  <Link key={biz.id} href={`/${biz.slug}/`} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group flex flex-col justify-between">
                     <div className="min-w-0">
                       <h3 className="font-bold text-gray-900 group-hover:text-[#60a5fa] truncate mb-2">{biz.businessName}</h3>
                     </div>
                     <div className="flex items-center justify-between border-t border-gray-50 pt-2 mt-2">
                       <span className="text-sm text-gray-500">{biz.city}</span>
                       {biz.phone && (
                         <button
                           onClick={(e) => {
                             e.preventDefault()
                             e.stopPropagation()
                             window.location.href = `tel:${biz.phone.replace(/[^0-9+]/g, '')}`
                           }}
                           className="flex items-center justify-center p-1.5 bg-[#60a5fa]/10 hover:bg-[#60a5fa]/20 text-[#60a5fa] rounded-full transition-colors cursor-pointer"
                           title={`Call ${biz.businessName}`}
                         >
                           <Phone className="w-3.5 h-3.5 fill-current" />
                         </button>
                       )}
                     </div>
                  </Link>
                ))}
              </div>
            )}
            <div className="mt-8">
              <NativeAdLoader />
            </div>
            <div className="mt-12 prose prose-blue max-w-none bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
               {content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <BannerAdLoader variant="inline" />
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // 3. Business Detail View
  if (viewType === 'business' && business) {
    const businessCategory = CATEGORIES.find(c => c.id === business.category)
    const categoryName = businessCategory?.name ?? business.category
    const primaryWhatsapp = business.whatsapp ? business.whatsapp.split(/[,/]/)[0].replace(/[^0-9]/g, '') : null
    const whatsappUrl = primaryWhatsapp ? `https://wa.me/${primaryWhatsapp}` : null
    const mapQuery = encodeURIComponent(`${business.address}, ${business.city}, Pakistan`)
    const mapSrc = `https://maps.google.com/maps?q=${mapQuery}&output=embed`
    const pageUrl = `${BASE_URL}/${slug}/`
    const categoryUrl = `/${business.category}/`
    const cityUrl = `/${encodeURIComponent(business.city.toLowerCase().replace(/ /g, '-'))}/`

    // Extract & normalize all online & social links
    const rawWeb = business.websiteUrl || (business as any).website || ''
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
    const province = cityDetails?.province ?? 'Punjab'

    const finalLogoUrl = getBusinessLogoUrl(business.logoUrl, business.businessName, business.slug)

    const localBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': pageUrl,
      name: business.businessName,
      description: business.description || `Verified ${categoryName} company in ${business.city}, Pakistan.`,
      url: pageUrl,
      telephone: business.phone,
      priceRange: '$$',
      ...(business.email && { email: business.email }),
      address: {
        '@type': 'PostalAddress',
        streetAddress: business.address,
        addressLocality: business.city,
        addressRegion: province,
        addressCountry: 'PK',
      },
      areaServed: { '@type': 'City', name: business.city },
      ...(businessCategory && { knowsAbout: businessCategory.name }),
      ...(finalLogoUrl && { image: finalLogoUrl, logo: finalLogoUrl }),
      ...(sameAs.length > 0 && { sameAs }),
      ...(business.rating && business.reviewCount && business.reviewCount > 0 ? {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: String(business.rating),
          reviewCount: String(business.reviewCount),
          bestRating: '5',
          worstRating: '1'
        }
      } : {})
    }

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: categoryName, item: `${BASE_URL}${categoryUrl}` },
        { '@type': 'ListItem', position: 3, name: business.businessName, item: pageUrl },
      ],
    }

    const services = getServicesByCategory(business.category, business.businessName)
    const serviceListText = services.map(s => s.title).join(', ')
    const dynamicAbout = generateDynamicAboutSection(business, categoryName)

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `Where is ${business.businessName} located?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${business.businessName} is located at ${business.address}, ${business.city}, Pakistan.`,
          },
        },
        {
          '@type': 'Question',
          name: `What is the contact number for ${business.businessName}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `You can contact ${business.businessName} at ${business.phone}.`,
          },
        },
        {
          '@type': 'Question',
          name: `What services does ${business.businessName} offer?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${business.businessName} specializes in ${categoryName} solutions. Key services include: ${serviceListText}.`,
          },
        },
      ],
    }

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
          <section className="bg-white border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link href="/" className="hover:text-[#60a5fa] transition-colors">Home</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href={categoryUrl} className="hover:text-[#60a5fa] transition-colors">{categoryName}</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-800 font-medium truncate">{business.businessName}</span>
              </nav>

              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="shrink-0">
                  {finalLogoUrl ? (
                    <img src={finalLogoUrl} alt={business.businessName} className="w-32 h-32 rounded-2xl object-cover border border-gray-200 shadow-sm" loading="lazy" />
                  ) : (
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] flex items-center justify-center border border-gray-200">
                      <Building2 className="w-16 h-16 text-white/60" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl md:text-4xl font-bold text-[#0f2b3d] mb-2">
                    {business.businessName} {business.city}
                    {slug.toLowerCase().startsWith('ubl-') && (
                      ` - ${slug
                        .toLowerCase()
                        .replace(/^ubl-/, 'ubl bank limited-')
                        .replace(/-branch-/g, '-')
                        .replace(/-branch$/g, '')
                        .replace(/-/g, ' ')}`
                    )}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-gray-500 mb-6">
                    <Link href={categoryUrl} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-[#60a5fa] rounded-full text-sm font-medium hover:bg-blue-100 transition-colors">
                      {categoryName}
                    </Link>
                    <Link href={cityUrl} className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors">
                      <MapPin className="w-3.5 h-3.5" />
                      {business.city}
                    </Link>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">{business.description}</p>
                  <div className="flex flex-wrap gap-3">
                    <a 
                      href={`tel:${business.phone}`} 
                      aria-label={`Call ${business.businessName} at ${business.phone}`}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-[#0f2b3d] text-white rounded-xl font-semibold hover:bg-[#1a3f57] transition-all shadow-sm active:scale-98"
                    >
                      <Phone className="w-4 h-4" /> Call Now
                    </a>
                    {whatsappUrl && (
                      <a 
                        href={whatsappUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label={`Send WhatsApp message to ${business.businessName}`}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-sm active:scale-98"
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
                        className="inline-flex items-center gap-2 px-5 py-3 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl font-semibold transition-all shadow-sm active:scale-98"
                      >
                        <Globe className="w-4 h-4" /> Visit Website
                        <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                      </a>
                    )}
                    {business.email && (
                      <a 
                        href={`mailto:${business.email}`} 
                        aria-label={`Email ${business.businessName}`}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 rounded-xl font-semibold transition-all shadow-sm active:scale-98"
                      >
                        <Mail className="w-4 h-4" /> Email
                      </a>
                    )}
                  </div>
                  <div className="mt-8 border-t border-gray-100 pt-6">
                    <BannerAdLoader variant="inline" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Official Online Profiles & Social Media Card */}
                  {hasSocials && (
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                      <h2 className="text-xl sm:text-2xl font-bold text-[#0f2b3d] mb-1.5 flex items-center gap-2.5">
                        <Globe className="w-5 sm:w-6 h-5 sm:h-6 text-[#60a5fa]" /> Official Profiles & Social Media
                      </h2>
                      <p className="text-slate-500 text-xs sm:text-sm mb-6">
                        Verified online handles and direct communication channels for {business.businessName}.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 not-prose">
                        {websiteUrl && (
                          <a
                            href={websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3.5 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300 transition-all group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                              <Globe className="w-5 h-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider group-hover:text-blue-600 transition-colors">Official Website</span>
                              <span className="block text-xs text-slate-500 truncate">{websiteUrl.replace(/^https?:\/\//i, '').replace(/\/$/, '')}</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                          </a>
                        )}

                        {facebookUrl && (
                          <a
                            href={facebookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3.5 rounded-xl border border-blue-100 bg-[#1877F2]/5 hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30 transition-all group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-xs">
                              <Facebook className="w-5 h-5 fill-current" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider group-hover:text-[#1877F2] transition-colors">Facebook Page</span>
                              <span className="block text-xs text-slate-500 truncate">{rawFb.replace(/^https?:\/\/(www\.)?facebook\.com\/?/i, '') || 'View Facebook'}</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#1877F2] shrink-0" />
                          </a>
                        )}

                        {instagramUrl && (
                          <a
                            href={instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3.5 rounded-xl border border-pink-100 bg-gradient-to-br from-pink-50/50 via-purple-50/30 to-amber-50/30 hover:border-pink-300 transition-all group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shrink-0 shadow-xs">
                              <Instagram className="w-5 h-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider group-hover:text-pink-600 transition-colors">Instagram Profile</span>
                              <span className="block text-xs text-slate-500 truncate">{rawIg.replace(/^https?:\/\/(www\.)?instagram\.com\/?/i, '') || '@Instagram'}</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-pink-600 shrink-0" />
                          </a>
                        )}

                        {tiktokUrl && (
                          <a
                            href={tiktokUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-950 text-white hover:bg-black transition-all group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 text-cyan-400 flex items-center justify-center shrink-0 shadow-xs">
                              <TikTokIcon className="w-5 h-5 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="block text-xs font-bold text-white uppercase tracking-wider">TikTok Account</span>
                              <span className="block text-xs text-slate-300 truncate">{rawTt.replace(/^https?:\/\/(www\.)?tiktok\.com\/?@?/i, '@') || '@TikTok'}</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white shrink-0" />
                          </a>
                        )}

                        {youtubeUrl && (
                          <a
                            href={youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3.5 rounded-xl border border-red-100 bg-red-50/50 hover:bg-red-50 hover:border-red-300 transition-all group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-[#FF0000] text-white flex items-center justify-center shrink-0 shadow-xs">
                              <Youtube className="w-5 h-5 fill-current" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider group-hover:text-red-600 transition-colors">YouTube Channel</span>
                              <span className="block text-xs text-slate-500 truncate">{rawYt.replace(/^https?:\/\/(www\.)?youtube\.com\/?(@|channel\/)?/i, '') || 'YouTube Channel'}</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-red-600 shrink-0" />
                          </a>
                        )}

                        {whatsappUrl && (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-300 transition-all group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                              <MessageCircle className="w-5 h-5 fill-current" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">WhatsApp Business</span>
                              <span className="block text-xs text-slate-500 truncate">{primaryWhatsapp || 'Chat on WhatsApp'}</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                          </a>
                        )}

                        {googleBusinessUrl && (
                          <a
                            href={googleBusinessUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                              <MapPin className="w-5 h-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider group-hover:text-blue-600 transition-colors">Google Business</span>
                              <span className="block text-xs text-slate-500 truncate">View on Google Maps</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 prose prose-blue max-w-none">
                    <h2 className="text-2xl font-bold text-[#0f2b3d] mb-6">About {business.businessName}</h2>
                    {business.description && (
                      <p className="text-gray-600 leading-relaxed text-lg mb-6">{business.description}</p>
                    )}
                    <p className="text-gray-600 leading-relaxed text-lg">{dynamicAbout}</p>
                    
                    <h3 className="text-xl font-bold text-[#0f2b3d] mt-8 mb-4">Professional Overview</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {business.businessName} is a verified <strong>{categoryName}</strong> business serving the <strong>{business.city}</strong> area. 
                      Located at {business.address}, they are committed to providing quality services to their customers.
                    </p>

                    <h3 className="text-xl font-bold text-[#0f2b3d] mt-8 mb-4">Services Offered</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 not-prose">
                      {services.map((service, index) => (
                        <div key={index} className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] mt-2 shrink-0" />
                          <div>
                            <strong className="block text-gray-900 text-sm font-semibold">{service.title}</strong>
                            <span className="block text-gray-500 text-xs mt-0.5">{service.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-xl font-bold text-[#0f2b3d] mt-8 mb-4">Contact Information</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                      <li><strong>Address:</strong> {business.address}, {business.city}, Pakistan</li>
                      {business.phone && (
                        <li>
                          <strong>Phone:</strong>{' '}
                          {business.phone.split(/[,/]/).map((num, idx, arr) => {
                            const trimmed = num.trim()
                            const cleanDigits = trimmed.replace(/[^0-9+]/g, '')
                            return (
                              <React.Fragment key={idx}>
                                <a href={`tel:${cleanDigits}`} className="text-blue-600 hover:underline">
                                  {trimmed}
                                </a>
                                {idx < arr.length - 1 ? ', ' : ''}
                              </React.Fragment>
                            )
                          })}
                        </li>
                      )}
                      {business.whatsapp && (
                        <li>
                          <strong>WhatsApp:</strong>{' '}
                          {business.whatsapp.split(/[,/]/).map((num, idx, arr) => {
                            const trimmed = num.trim()
                            const cleanDigits = trimmed.replace(/[^0-9]/g, '')
                            return (
                              <React.Fragment key={idx}>
                                <a
                                  href={`https://wa.me/${cleanDigits}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {trimmed}
                                </a>
                                {idx < arr.length - 1 ? ', ' : ''}
                              </React.Fragment>
                            )
                          })}
                        </li>
                      )}
                      {business.email && <li><strong>Email:</strong> <a href={`mailto:${business.email}`} className="text-blue-600 hover:underline">{business.email}</a></li>}
                      {websiteUrl && <li><strong>Website:</strong> <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{websiteUrl}</a></li>}
                      {facebookUrl && <li><strong>Facebook:</strong> <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{rawFb}</a></li>}
                      {instagramUrl && <li><strong>Instagram:</strong> <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{rawIg}</a></li>}
                      {tiktokUrl && <li><strong>TikTok:</strong> <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{rawTt}</a></li>}
                      {youtubeUrl && <li><strong>YouTube:</strong> <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{rawYt}</a></li>}
                    </ul>
                  </div>

                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-2xl font-bold text-[#0f2b3d]">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-1.5">Where is {business.businessName} located?</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {business.businessName} is situated at {business.address}, {business.city}, Pakistan.
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-1.5">What is the contact phone number for {business.businessName}?</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          You can contact {business.businessName} by calling their primary phone number at <a href={`tel:${business.phone}`} className="text-blue-600 hover:underline">{business.phone}</a>.
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-1.5">What services does {business.businessName} provide?</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          As a verified {categoryName} business, they specialize in professional {categoryName.toLowerCase()} solutions. Key services include: {serviceListText}.
                        </p>
                      </div>
                    </div>
                  </div>

                  {similarBusinesses.length > 0 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-[#0f2b3d]">Similar Businesses in {business.city}</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {similarBusinesses.map(biz => (
                          <Link key={biz.id} href={`/${biz.slug}/`} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-[#60a5fa]/30 transition-all flex items-center justify-between gap-4 group">
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50">
                                <Building2 className="w-6 h-6 text-gray-400 group-hover:text-[#60a5fa]" />
                              </div>
                              <div className="min-w-0">
                                <span className="block font-bold text-gray-900 group-hover:text-[#60a5fa] truncate">{biz.businessName}</span>
                                <span className="block text-sm text-gray-500">{biz.phone}</span>
                              </div>
                            </div>
                            {biz.phone && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  window.location.href = `tel:${biz.phone.replace(/[^0-9+]/g, '')}`
                                }}
                                className="flex items-center justify-center p-2 bg-[#60a5fa]/10 hover:bg-[#60a5fa]/20 text-[#60a5fa] rounded-full transition-colors cursor-pointer shrink-0"
                                title={`Call ${biz.businessName}`}
                              >
                                <Phone className="w-4 h-4 fill-current" />
                              </button>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {branches.length > 0 && (
                    <div className="space-y-6 mt-8">
                      <h2 className="text-2xl font-bold text-[#0f2b3d]">{business.businessName} Locations in Other Cities</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {branches.map(br => (
                          <Link key={br.id} href={`/${br.slug}/`} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-[#60a5fa]/30 transition-all flex items-center justify-between gap-4 group">
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50">
                                <MapPin className="w-6 h-6 text-[#60a5fa]" />
                              </div>
                              <div className="min-w-0">
                                <span className="block font-bold text-gray-900 group-hover:text-[#60a5fa] truncate">{business.businessName} – {br.city}</span>
                                <span className="block text-sm text-gray-500">{br.phone}</span>
                              </div>
                            </div>
                            {br.phone && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  window.location.href = `tel:${br.phone.replace(/[^0-9+]/g, '')}`
                                }}
                                className="flex items-center justify-center p-2 bg-[#60a5fa]/10 hover:bg-[#60a5fa]/20 text-[#60a5fa] rounded-full transition-colors cursor-pointer shrink-0"
                                title={`Call ${business.businessName}`}
                              >
                                <Phone className="w-4 h-4 fill-current" />
                              </button>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-[#0f2b3d] mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#60a5fa]" /> Location
                    </h3>
                    <div className="rounded-xl overflow-hidden mb-4 border border-gray-100 min-h-[200px] bg-slate-50 relative flex items-center justify-center">
                      {mapLoaded ? (
                        <iframe src={mapSrc} width="100%" height="200" style={{ border: 0 }} allowFullScreen loading="lazy" title="Map Location" />
                      ) : (
                        <button
                          onClick={() => setMapLoaded(true)}
                          className="w-full h-[200px] flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50/50 hover:bg-blue-50 transition-colors group cursor-pointer"
                        >
                          <MapPin className="w-8 h-8 text-[#60a5fa] group-hover:scale-110 transition-transform mb-2" />
                          <span className="text-sm font-semibold text-gray-800">Load Interactive Google Map</span>
                          <span className="text-xs text-gray-500 mt-1">Click to view location map</span>
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{business.address}, {business.city}, Pakistan</p>
                  </div>

                  <NativeAdLoader />

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-[#0f2b3d] mb-4 flex items-center gap-2">
                      <span className="w-5 h-5 text-[#60a5fa] flex items-center justify-center">🕒</span> Business Hours
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between border-b border-gray-50 pb-1">
                        <span>Monday – Friday:</span>
                        <span className="font-medium text-gray-900">09:00 AM – 06:00 PM</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-50 pb-1">
                        <span>Saturday:</span>
                        <span className="font-medium text-gray-900">09:00 AM – 02:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday:</span>
                        <span className="font-semibold text-red-600">Closed</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2 italic">* Timing may vary. Please call to confirm.</p>
                    </div>
                  </div>

                  <div className="bg-[#0f2b3d] rounded-2xl p-6 text-white">
                    <h3 className="font-bold mb-2">Claim this listing?</h3>
                    <p className="text-sm text-white/70 mb-4">Is this your business? Contact us to verify and enhance your listing.</p>
                    <Link href="/contact/" className="block text-center py-2.5 bg-[#60a5fa] text-white rounded-xl text-sm font-bold hover:bg-blue-400 transition-colors">
                      Contact Support
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
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
