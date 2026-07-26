import { Metadata } from 'next'
import { CITIES } from '@/lib/data'
import { getCityKeywordCluster } from '@/lib/organic-keywords'
import CityClient from './city-client'
import React from 'react'

const BASE_URL = 'https://www.pakbizbranhces.online'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return CITIES.map((c) => ({
    city: c.toLowerCase().replace(/\s+/g, '-'),
  }))
}

export const dynamicParams = true

function findCityBySlug(slug: string): string | null {
  const normalized = slug.replace(/-/g, ' ').toLowerCase()
  return CITIES.find(c => c.toLowerCase() === normalized) ?? null
}

export async function generateMetadata(props: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const params = await props.params;
  const cityName = findCityBySlug(params.city)
  if (!cityName) return { title: 'City Not Found: PakBizBranches Directory' }

  // Title: 50-60 chars, no pipes or dashes
  let title = `${cityName} Business Directory: Find Local Companies`
  if (title.length < 50) {
    title = `${cityName} Business Directory: Find Verified Local Companies`
  }
  if (title.length > 60) {
    title = title.substring(0, 60)
  }

  // Description: 140-155 chars
  let description = `Search verified local businesses in ${cityName}. Find phone numbers, WhatsApp contacts, and physical addresses on the PakBizBranches directory free.`
  if (description.length < 140) {
    description = `Search verified local businesses in ${cityName}. Find direct phone numbers, WhatsApp contacts, and physical addresses on the PakBizBranches directory free.`
  }
  if (description.length > 155) {
    description = description.substring(0, 152) + '...'
  }

  const url = `${BASE_URL}/${params.city}/`
  const keywordCluster = getCityKeywordCluster(cityName)

  return {
    title,
    description,
    keywords: [
      `${cityName} business directory`,
      `businesses in ${cityName}`,
      `${cityName} local businesses`,
      `restaurants in ${cityName}`,
      `clinics in ${cityName}`,
      `real estate ${cityName}`,
      ...keywordCluster,
    ],
    robots: {
      index: true, // index static city landing shell by default
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

export default async function CityPage(props: { params: Promise<{ city: string }> }) {
  const params = await props.params;
  return <CityClient citySlug={params.city} />
}
