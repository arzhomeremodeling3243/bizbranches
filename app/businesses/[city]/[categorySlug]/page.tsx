import { Metadata } from 'next'
import { CITIES, CATEGORIES } from '@/lib/data'
import { getCategoryKeywordCluster, getCityKeywordCluster } from '@/lib/organic-keywords'
import CityCategoryListClient from './city-category-list-client'
import React from 'react'

export const dynamic = 'force-static'

const BASE_URL = 'https://www.pakbizbranhces.online'

function findCityBySlug(slug: string): string | null {
  const normalized = slug.replace(/-/g, ' ').toLowerCase()
  return CITIES.find(c => c.toLowerCase() === normalized) ?? null
}

export async function generateMetadata(props: { params: Promise<{ city: string; categorySlug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const cityName = findCityBySlug(params.city)
  const category = CATEGORIES.find(c => c.id === params.categorySlug)
  if (!cityName || !category) return { title: 'Not Found: PakBizBranches' }

  let title = `Best ${category.name} in ${cityName} 2026: Phone and Contact Details`
  if (title.length > 60) {
    title = `Best ${category.name} in ${cityName} 2026: Verified Contact`
  }
  if (title.length > 60) {
    title = `Top ${category.name} in ${cityName}: Phone Numbers`
  }
  if (title.length < 50) {
    title = `Find Best ${category.name} in ${cityName} 2026: Contact Details`
  }
  if (title.length > 60) {
    title = title.substring(0, 60)
  }

  let description = `Find the best ${category.name.toLowerCase()} in ${cityName} with direct phone numbers, WhatsApp contacts, local addresses, and verified listings. Updated 2026.`
  if (description.length > 155) {
    description = description.substring(0, 152) + '...'
  } else if (description.length < 140) {
    description = `Find the best ${category.name.toLowerCase()} in ${cityName} with direct phone numbers, WhatsApp contacts, local addresses, and verified listings free.`
    if (description.length > 155) {
      description = description.substring(0, 152) + '...'
    }
  }

  const url = `${BASE_URL}/locations/${params.city}/${params.categorySlug}/`
  const keywordCluster = [
    ...getCategoryKeywordCluster(params.categorySlug),
    ...getCityKeywordCluster(cityName),
  ]

  return {
    title,
    description,
    keywords: [
      `${category.name} ${cityName}`,
      `best ${category.name.toLowerCase()} in ${cityName}`,
      `${cityName} ${category.name.toLowerCase()} businesses`,
      ...keywordCluster.slice(0, 8),
    ],
    robots: {
      index: true, // index static listing shell by default
      follow: true,
    },
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'PakBizBranches',
      locale: 'en_PK',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function CityCategoryPage(props: { params: Promise<{ city: string; categorySlug: string }> }) {
  const params = await props.params;
  return <CityCategoryListClient citySlug={params.city} categorySlug={params.categorySlug} />
}
