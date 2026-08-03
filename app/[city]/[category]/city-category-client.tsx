'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, Building2, Phone, ArrowRight, ChevronRight, Loader2 } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { CITIES, CATEGORIES } from '@/lib/data'
import { generateCityCategoryContent } from '@/lib/seo-content'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import { LIVE_STATUSES } from '@/lib/category-mappings'
import { BannerAdLoader, NativeAdLoader } from '@/components/ads/ads-loader'
import CountdownLoader from '@/components/ui/countdown-loader'
import React from 'react'
import { getBusinessLogoUrl } from '@/lib/utils'
import { getStaticCityCategory } from '@/lib/static-db'

const BASE_URL = 'https://www.pakbizbranhces.online'

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
  facebookPage?: string
  googleBusiness?: string
  youtubeChannel?: string
  createdAt: any
  status: string
  slug: string
}

function findCityBySlug(slug: string): string | null {
  const normalized = slug.replace(/-/g, ' ').toLowerCase()
  return CITIES.find(c => c.toLowerCase() === normalized) ?? null
}

function findCategoryBySlug(slug: string) {
  return CATEGORIES.find(c => c.id === slug) ?? null
}

interface CityCategoryClientProps {
  citySlug: string
  categorySlug: string
  initialBusinessesList?: Business[]
}

export default function CityCategoryClient({
  citySlug,
  categorySlug,
  initialBusinessesList = []
}: CityCategoryClientProps) {
  const [businesses, setBusinesses] = useState<Business[]>(initialBusinessesList)
  const [loading, setLoading] = useState(false)
  const [countdownDone, setCountdownDone] = useState(true)
  
  const cityName = findCityBySlug(citySlug)
  const category = findCategoryBySlug(categorySlug)

  useEffect(() => {
    async function loadBusinesses() {
      if (!cityName || !category) {
        setLoading(false)
        return
      }

      // Immediately populate with static data so page paints instantly (LCP < 1.0s)
      const staticList = initialBusinessesList.length > 0
        ? initialBusinessesList
        : (getStaticCityCategory(cityName, category.id) as any as Business[])
      setBusinesses(staticList)
      setLoading(false)

      if (staticList.length > 0) return
    }

    loadBusinesses()
  }, [cityName, category])

  if (!cityName || !category) {
    return (
      <>
        <Navbar />
        <main className="bg-[#f8fafc] min-h-screen py-16 text-center">
          <h2 className="text-2xl font-bold text-red-600">Location or Category Not Found</h2>
          <p className="text-slate-500 mt-2">The requested combination does not exist.</p>
        </main>
        <Footer />
      </>
    )
  }

  if (loading || !countdownDone) {
    return (
      <>
        <Navbar />
        <CountdownLoader 
          isDataLoading={loading} 
          onComplete={() => setCountdownDone(true)} 
        />
        <Footer />
      </>
    )
  }

  const content = generateCityCategoryContent(cityName, category.id)
  const pageUrl = `${BASE_URL}/${citySlug}/${categorySlug}/`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: cityName, item: `${BASE_URL}/${citySlug}/` },
      { '@type': 'ListItem', position: 3, name: category.name, item: pageUrl },
    ],
  }

  const itemListSchema = businesses.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.name} in ${cityName}`,
    numberOfItems: businesses.length,
    itemListElement: businesses.slice(0, 10).map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.businessName,
      url: `${BASE_URL}/${b.slug}/`,
    })),
  } : null

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What are the best ${category.name.toLowerCase()} in ${cityName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `You can find the top ${category.name.toLowerCase()} in ${cityName} on PakBizBranches. Browse verified listings with direct phone numbers, WhatsApp contacts, and addresses.`,
        },
      },
      {
        '@type': 'Question',
        name: `How do I contact ${category.name.toLowerCase()} businesses in ${cityName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Each listing on PakBizBranches includes direct phone numbers, WhatsApp contacts, and addresses for ${category.name.toLowerCase()} businesses in ${cityName}. Click any listing to view full contact details.`,
        },
      },
      {
        '@type': 'Question',
        name: `Can I add my ${category.name.toLowerCase()} business in ${cityName} for free?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes! You can list your ${category.name.toLowerCase()} business in ${cityName} for free on PakBizBranches. No registration or payment required.`,
        },
      },
    ],
  }

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {itemListSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      <main className="bg-[#f8fafc] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 -mb-4">
          <BannerAdLoader variant="inline" />
        </div>
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/60 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href={`/${citySlug}/`} className="hover:text-white transition-colors">{cityName}</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">{category.name}</span>
            </nav>
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-8 h-8 text-[#60a5fa]" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {businesses.length > 0 ? `${businesses.length}+ ` : ''}{category.name} in {cityName} – Verified Contacts & Reviews
              </h1>
            </div>
            <p className="text-xl text-white/80 max-w-2xl">
              Verified {category.name.toLowerCase()} businesses and services in {cityName}, Pakistan. Find contact details and locations instantly.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Business Listings */}
          <section className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
               <h2 className="text-2xl font-bold text-[#0f2b3d]">
                Top Rated {category.name}
                <span className="text-base font-normal text-gray-500 ml-3">({businesses.length} verified listings)</span>
              </h2>
              <Link href="/add-business" className="inline-flex items-center gap-2 text-[#60a5fa] font-semibold hover:underline">
                Add Your Business
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {businesses.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Listings Found</h3>
                <p className="text-gray-500 mb-6">Be the first to list a {category.name.toLowerCase()} business in {cityName}!</p>
                <Link href="/add-business" className="inline-flex items-center gap-2 px-6 py-3 bg-[#60a5fa] text-white rounded-xl font-semibold hover:bg-blue-400 transition-colors">
                  List Business Free
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {businesses.map(biz => (
                  <Link
                    key={biz.id}
                    href={`/${biz.slug}/`}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#60a5fa]/30 transition-all group flex gap-5"
                  >
                    {getBusinessLogoUrl(biz.logoUrl, biz.businessName, biz.slug) ? (
                      <img src={getBusinessLogoUrl(biz.logoUrl, biz.businessName, biz.slug)} alt={biz.businessName} className="w-20 h-20 rounded-xl object-cover border border-gray-100 shrink-0" loading="lazy" />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] flex items-center justify-center shrink-0">
                        <Building2 className="w-10 h-10 text-white/60" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#60a5fa] transition-colors mb-1 truncate">
                        {biz.businessName}
                      </h3>
                      <p className="text-gray-500 text-sm mb-3 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {cityName}, Pakistan
                      </p>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {biz.description}
                      </p>
                      <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-1">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-[#0f2b3d]">
                          <Phone className="w-4 h-4 text-[#60a5fa]" />
                          {biz.phone}
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              window.location.href = `tel:${biz.phone.replace(/[^0-9+]/g, '')}`
                            }}
                            className="flex items-center justify-center p-2 bg-[#60a5fa]/10 hover:bg-[#60a5fa]/20 text-[#60a5fa] rounded-full transition-colors cursor-pointer"
                            title={`Call ${biz.businessName}`}
                          >
                            <Phone className="w-4 h-4 fill-current" />
                          </button>
                          <span className="text-xs text-[#60a5fa] font-bold group-hover:translate-x-1 transition-transform">View Details →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <div className="mt-8">
              <NativeAdLoader />
            </div>
          </section>

          {/* SEO Content Block */}
          <section className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 prose prose-blue max-w-none">
             {content.split('\n').map((line, i) => {
              if (line.startsWith('## ')) return <h2 key={i} className="text-3xl font-bold text-[#0f2b3d] mt-8 mb-6">{line.replace('## ', '')}</h2>
              if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-[#0f2b3d] mt-6 mb-4">{line.replace('### ', '')}</h3>
              if (line.trim() === '') return null
              return <p key={i} className="text-gray-600 leading-relaxed text-lg mb-4">{line}</p>
            })}
            
            {/* Quick Links */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <h3 className="text-xl font-bold text-[#0f2b3d] mb-6">Other Popular Categories in {cityName}</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.filter(c => c.id !== category.id).slice(0, 8).map(cat => (
                  <Link
                    key={cat.id}
                    href={`/${citySlug}/${cat.id}/`}
                    className="px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-sm font-medium hover:bg-blue-50 hover:text-[#60a5fa] transition-colors border border-gray-100"
                  >
                    {cat.name} in {cityName}
                  </Link>
                ))}
              </div>
            </div>
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
