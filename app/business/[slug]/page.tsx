import { Metadata } from 'next'
import { CATEGORIES } from '@/lib/data'
import { findStaticBusinessBySlug, STATIC_BUSINESSES } from '@/lib/static-db'
import BusinessDetailClient from './business-detail-client'
import React from 'react'

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  return STATIC_BUSINESSES.map((b) => ({
    slug: b.slug,
  }))
}

const BASE_URL = 'https://www.pakbizbranhces.online'

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug

  let businessName = ''
  let businessCity = 'Pakistan'
  let businessCategory = 'Business'
  let businessPhone = 'Contact'
  let businessDescription = 'Verified business listing on PakBizBranches.'

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

  const category = CATEGORIES.find(c => c.id === businessCategory)
  const categoryName = category?.name ?? businessCategory

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

  // Dynamically build a description strictly between 120 and 145 characters for SEO
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

  const url = `${BASE_URL}/business/${slug}/`

  return {
    title,
    description,
    keywords: [
      businessName,
      `${businessName} ${businessCity}`,
      `${businessName} contact`,
      `${businessName} address`,
      `${businessName} details`,
      categoryName,
      `${categoryName} in ${businessCity}`,
      `${businessCity} business directory`,
      'Pakistan business directory',
    ].join(', '),
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'PakBizBranches',
      locale: 'en_PK',
      type: 'website',
      images: [{ url: 'https://www.pakbizbranhces.online/logo-img.png', alt: 'PakBizBranches' }],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function BusinessPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  return <BusinessDetailClient slug={params.slug} />
}
