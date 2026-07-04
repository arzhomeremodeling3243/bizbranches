import { Metadata } from 'next'
import { CATEGORIES, CITIES } from '@/lib/data'
import { getCategoryKeywordCluster, getCityKeywordCluster } from '@/lib/organic-keywords'
import { findStaticBusinessBySlug } from '@/lib/static-db'
import CatchAllPageClient from './catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

const BASE_URL = 'https://www.pakbizbranhces.online'

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
    let title = `${cityName} Business Directory: Find Local Contacts & Services`
    if (title.length > 60) {
      title = `${cityName} Business Directory: Find Local Contacts`
    }
    if (title.length < 50) {
      title = `${cityName} Business Directory: Verified Company Contact Details`
    }
    if (title.length > 60) {
      title = title.substring(0, 60)
    }

    let description = `Find verified local businesses, phone numbers, and addresses in ${cityName}, Pakistan. Access contact details and map locations free on PakBizBranches.`
    if (description.length < 120) {
      description = `Find verified local businesses, phone numbers, and addresses in ${cityName}, Pakistan. Access contact details and map locations free.`
    }
    if (description.length > 156) {
      description = description.substring(0, 153) + '...'
    }

    const url = `${BASE_URL}/${slug}/`
    const keywordCluster = getCityKeywordCluster(cityName)

    return {
      title,
      description,
      keywords: [`${cityName} businesses`, `${cityName} companies`, `${cityName} yellow pages`, ...keywordCluster],
      robots: { index: true, follow: true },
      alternates: { canonical: url },
      openGraph: { title, description, url, siteName: 'PakBizBranches', locale: 'en_PK', type: 'website' },
    }
  }

  // 2. Category View Meta
  const category = findCategoryBySlug(slug)
  if (category) {
    let title = `${category.name} in Pakistan: Find Verified Contact Details`
    if (title.length > 60) {
      title = `${category.name} in Pakistan: Verified Contacts`
    }
    if (title.length < 50) {
      title = `Best ${category.name} in Pakistan: Find Verified Contacts`
    }
    if (title.length > 60) {
      title = title.substring(0, 60)
    }

    let description = `Browse verified ${category.name.toLowerCase()} listings and local services in Pakistan. Find contact phone numbers, WhatsApp links, and physical addresses free.`
    if (description.length < 120) {
      description = `Browse verified ${category.name.toLowerCase()} listings and local services across Pakistan. Find contact phone numbers and physical addresses.`
    }
    if (description.length > 156) {
      description = description.substring(0, 152) + '...'
    }
    const url = `${BASE_URL}/${slug}/`
    const keywordCluster = getCategoryKeywordCluster(slug)

    return {
      title,
      description,
      keywords: [`${category.name} in Pakistan`, `best ${category.name.toLowerCase()} Pakistan`, ...keywordCluster],
      robots: { index: true, follow: true },
      alternates: { canonical: url },
      openGraph: { title, description, url, siteName: 'PakBizBranches', locale: 'en_PK', type: 'website' },
    }
  }

  // 3. Business Detail View Meta (Static or Dynamic)
  let businessName = ''
  let businessCity = 'Pakistan'
  let businessCategory = 'Business'
  let businessPhone = 'Contact'
  let businessDescription = 'Verified local business listing on PakBizBranches.'

  const staticBiz = findStaticBusinessBySlug(slug)
  if (staticBiz) {
    businessName = staticBiz.businessName
    businessCity = staticBiz.city
    businessCategory = staticBiz.category
    businessPhone = staticBiz.phone
    businessDescription = staticBiz.description || `Verified ${staticBiz.category} company in ${staticBiz.city}, Pakistan.`
  } else {
    // Dynamic fallback: extract details purely from the slug string for zero-execution compilation
    businessName = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const bizCategoryObj = CATEGORIES.find(c => c.id === businessCategory)
  const categoryName = bizCategoryObj?.name ?? businessCategory

  // Dynamically build a title strictly between 52 and 58 characters for SEO
  const baseTitle = `${businessName} - ${businessCity}`
  const suffixes = [
    ' | Phone & Address',
    ' | Contact Details',
    ' | Phone Number',
    ' | Info'
  ]
  let title = baseTitle
  for (const suffix of suffixes) {
    const candidate = baseTitle + suffix
    if (candidate.length >= 52 && candidate.length <= 58) {
      title = candidate
      break
    }
  }
  if (title.length > 58) {
    title = title.substring(0, 55) + '...'
  }
  if (title.length < 52) {
    const padding = ' | Verified Details'
    const candidate = title + padding
    if (candidate.length <= 58) {
      title = candidate
    } else {
      title = (title + padding).substring(0, 57)
    }
  }
  if (title.length > 58) {
    title = title.substring(0, 58)
  }

  // Dynamically build a description strictly between 125 and 145 characters for SEO
  const baseDesc = `Verified details for ${businessName} in ${businessCity}, Pakistan. Find phone number ${businessPhone}, location address`
  const descSuffixes = [
    ', operating hours, and customer reviews on PakBizBranches.',
    ', and contact information on PakBizBranches directory.',
    ', and timing details on PakBizBranches.',
    ' and official contact details.',
    ' and contact details.',
    '.'
  ]
  let description = baseDesc
  for (const suffix of descSuffixes) {
    const candidate = baseDesc + suffix
    if (candidate.length >= 125 && candidate.length <= 145) {
      description = candidate
      break
    }
  }
  if (description.length > 145) {
    description = description.substring(0, 142) + '...'
  }
  if (description.length < 125) {
    const padding = ' Discover verified listings, ratings, reviews, and maps for local Pakistani businesses.'
    const candidate = description + padding
    if (candidate.length >= 125 && candidate.length <= 145) {
      description = candidate
    } else {
      description = (description + padding).substring(0, 142) + '...'
    }
  }
  if (description.length > 145) {
    description = description.substring(0, 145)
  }
  if (description.length < 125) {
    description = description.padEnd(125, '.')
  }

  const url = `${BASE_URL}/${slug}/`

  return {
    title,
    description,
    keywords: [
      businessName,
      `${businessName} ${businessCity}`,
      `${businessCategory} in ${businessCity}`,
      `${businessCity} business directory`
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

export default async function CatchAllPage(props: { params: Promise<{ city: string }> }) {
  const params = await props.params
  const slug = params.city
  return <CatchAllPageClient slug={slug} />
}
