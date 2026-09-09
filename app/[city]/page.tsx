import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CATEGORIES, CITIES } from '@/lib/data'
import { getCategoryKeywordCluster, getCityKeywordCluster } from '@/lib/organic-keywords'
import { findStaticBusinessBySlug, getStaticCity, getStaticCategory, getStaticSimilar, getStaticNearby, getStaticBranches, STATIC_BUSINESSES } from '@/lib/static-db'
import { fetchBusinessBySlug } from '@/lib/firebase-server'
import { isCityIndexable, isBusinessIndexable, getBusinessCountForCity, getQualifiedCities, SEO_CONFIG } from '@/lib/seo-config'
import CatchAllPageClient from './catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'
export const dynamicParams = true

export async function generateStaticParams() {
  // Pre-render cities that meet indexation inventory threshold
  const cityParams = getQualifiedCities().map(c => ({
    city: c.slug
  }))

  // Pre-render all 12 major categories
  const categoryParams = CATEGORIES.map(c => ({
    city: c.id
  }))

  // Pre-render genuine static businesses
  const businessParams = STATIC_BUSINESSES
    .filter(b => isBusinessIndexable(b.slug, b.phone))
    .map(b => ({
      city: b.slug
    }))

  return [...cityParams, ...categoryParams, ...businessParams]
}

const BASE_URL = SEO_CONFIG.BASE_URL

function findCityBySlug(slug: string): string | null {
  const normalized = slug.replace(/-/g, ' ').toLowerCase()
  return CITIES.find(c => c.toLowerCase() === normalized) ?? null
}

function findCategoryBySlug(slug: string) {
  return CATEGORIES.find(c => c.id === slug) ?? null
}

export async function generateMetadata(props: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const params = await props.params
  const slug = params.city

  // 1. City View Meta
  const cityName = findCityBySlug(slug)
  if (cityName) {
    const isIndexable = isCityIndexable(cityName)

    let title = `${cityName} Business Directory – Local Businesses & Companies`
    if (title.length > 60) {
      title = `${cityName} Business Directory – Local Companies`
    }
    if (title.length > 60) {
      title = `${cityName} Business Directory`
    }

    let description = `Find verified local businesses, phone numbers, WhatsApp contacts, and physical addresses in ${cityName}, Pakistan. Browse top companies on PakBizBranches.`
    if (description.length > 156) {
      description = description.substring(0, 153) + '...'
    }

    const url = `${BASE_URL}/${slug}/`
    const keywordCluster = getCityKeywordCluster(cityName)

    return {
      title,
      description,
      keywords: [`${cityName} businesses`, `${cityName} companies`, `${cityName} yellow pages`, ...keywordCluster],
      robots: {
        index: isIndexable,
        follow: true,
      },
      alternates: { canonical: url },
      openGraph: { title, description, url, siteName: 'PakBizBranches', locale: 'en_PK', type: 'website' },
      twitter: { card: 'summary_large_image', title, description },
    }
  }

  // 2. Category View Meta
  const category = findCategoryBySlug(slug)
  if (category) {
    let title = `${category.name} in Pakistan – Local Business Directory`
    if (category.name === 'Restaurants') {
      title = `Restaurants in Pakistan – Local Restaurant Directory`
    }
    if (title.length > 60) {
      title = `${category.name} in Pakistan – Business Directory`
    }
    if (title.length > 60) {
      title = `${category.name} in Pakistan Directory`
    }

    let description = `Browse verified ${category.name.toLowerCase()} companies and local branches across Pakistan. Find direct phone numbers, WhatsApp links, and physical addresses free.`
    if (description.length > 156) {
      description = description.substring(0, 152) + '...'
    }
    const url = `${BASE_URL}/${slug}/`
    const keywordCluster = getCategoryKeywordCluster(slug)

    return {
      title,
      description,
      keywords: [`${category.name} in Pakistan`, `${category.name.toLowerCase()} directory Pakistan`, ...keywordCluster],
      robots: { index: true, follow: true },
      alternates: { canonical: url },
      openGraph: { title, description, url, siteName: 'PakBizBranches', locale: 'en_PK', type: 'website' },
      twitter: { card: 'summary_large_image', title, description },
    }
  }

  // 3. Business Detail View Meta
  let biz = findStaticBusinessBySlug(slug) as any
  if (!biz) {
    biz = await fetchBusinessBySlug(slug)
  }

  // If slug matches nothing in static DB or Firestore -> emit 404 metadata
  if (!biz) {
    return {
      title: 'Page Not Found - PakBizBranches',
      robots: { index: false, follow: false },
    }
  }

  const businessName = biz.businessName
  const businessCity = biz.city
  const businessCategory = biz.category
  const businessPhone = biz.phone || ''
  const isIndexable = isBusinessIndexable(slug, businessPhone)

  const bizCategoryObj = CATEGORIES.find(c => c.id === businessCategory)
  const categoryName = bizCategoryObj?.name ?? businessCategory

  let title = biz.metaTitle || ''
  if (!title) {
    title = `${businessName} – ${categoryName} in ${businessCity} | PakBizBranches`
    if (title.length > 60) {
      title = `${businessName} – ${categoryName} in ${businessCity}`
    }
    if (title.length > 60) {
      title = `${businessName} – ${businessCity} | PakBizBranches`
    }
    if (title.length > 60) {
      title = `${businessName} – ${businessCity}`
    }
    if (title.length > 60) {
      title = businessName.substring(0, 57) + '...'
    }
  }

  let description = biz.metaDescription || ''
  if (!description) {
    description = `Verified details for ${businessName} in ${businessCity}, Pakistan. Find phone number ${businessPhone}, address, and direct WhatsApp contact on PakBizBranches.`
    if (description.length > 155) {
      description = description.substring(0, 152) + '...'
    }
  }

  const url = `${BASE_URL}/${slug}/`

  return {
    title,
    description,
    keywords: [
      businessName,
      `${businessName} ${businessCity}`,
      `${categoryName} in ${businessCity}`,
      `${businessCity} business directory`
    ],
    robots: {
      index: isIndexable,
      follow: true,
    },
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

export default async function CatchAllPage(props: { params: Promise<{ city: string }> }) {
  const params = await props.params
  const slug = params.city

  // 1. City Route
  const cityName = findCityBySlug(slug)
  if (cityName) {
    const staticCityList = getStaticCity(cityName) as any[]
    return (
      <CatchAllPageClient
        slug={slug}
        initialViewType="city"
        initialCityName={cityName}
        initialBusinessesList={staticCityList}
      />
    )
  }

  // 2. Category Route
  const category = findCategoryBySlug(slug)
  if (category) {
    const staticCategoryList = getStaticCategory(category.id) as any[]
    return (
      <CatchAllPageClient
        slug={slug}
        initialViewType="category"
        initialCategory={category}
        initialBusinessesList={staticCategoryList}
      />
    )
  }

  // 3. Business Detail Route
  let foundBiz: any = null
  const staticBiz = findStaticBusinessBySlug(slug)
  if (staticBiz) {
    foundBiz = {
      id: staticBiz.id,
      businessName: staticBiz.businessName,
      slug: staticBiz.slug,
      city: staticBiz.city,
      category: staticBiz.category,
      categoryId: staticBiz.categoryId || staticBiz.category,
      description: staticBiz.description,
      shortIntro: staticBiz.shortIntro,
      aboutHeading: staticBiz.aboutHeading,
      aboutText: staticBiz.aboutText,
      services: staticBiz.services,
      faqs: staticBiz.faqs,
      businessHours: staticBiz.businessHours,
      openingHoursSpecification: staticBiz.openingHoursSpecification,
      metaTitle: staticBiz.metaTitle,
      metaDescription: staticBiz.metaDescription,
      phone: staticBiz.phone,
      logoUrl: staticBiz.logoUrl,
      status: staticBiz.status,
      isFeatured: staticBiz.isFeatured || staticBiz.featured,
      createdAt: staticBiz.createdAt,
      rating: staticBiz.rating,
      reviewCount: staticBiz.reviewCount,
      websiteUrl: staticBiz.websiteUrl,
      facebookPage: staticBiz.facebookPage,
      instagramProfile: staticBiz.instagramProfile || (staticBiz as any).instagram || '',
      tiktokProfile: staticBiz.tiktokProfile || (staticBiz as any).tiktok || '',
      googleBusiness: staticBiz.googleBusiness || '',
      address: staticBiz.address,
      whatsapp: staticBiz.whatsapp,
      email: staticBiz.email,
      youtubeChannel: staticBiz.youtubeChannel,
      subCategory: staticBiz.subCategory
    }
  } else {
    // Check Firestore
    foundBiz = await fetchBusinessBySlug(slug)
  }

  // If slug is NOT a city, NOT a category, and NOT a registered business -> Emit genuine HTTP 404!
  if (!foundBiz) {
    notFound()
  }

  const staticSimilar = getStaticSimilar(foundBiz.city, foundBiz.category, slug) as any[]
  const staticNearby = getStaticNearby(foundBiz.city, slug, 4) as any[]
  const staticBranches = getStaticBranches(foundBiz.businessName, slug) as any[]

  return (
    <CatchAllPageClient
      slug={slug}
      initialViewType="business"
      initialBusiness={foundBiz}
      initialSimilarBusinesses={staticSimilar.slice(0, 4)}
      initialNearbyBusinesses={staticNearby}
      initialBranches={staticBranches}
    />
  )
}
