import { Metadata } from 'next'
import { CITIES, CATEGORIES } from '@/lib/data'
import CityCategoryClient from './city-category-client'
import React from 'react'

export const dynamic = 'force-static'

export const dynamicParams = true

export async function generateStaticParams() {
  const params: { city: string; category: string }[] = []

  CITIES.forEach(city => {
    const citySlug = city.toLowerCase().replace(/\s+/g, '-')
    CATEGORIES.forEach(cat => {
      params.push({
        city: citySlug,
        category: cat.id
      })
    })
  })

  return params
}

const BASE_URL = 'https://www.pakbizbranhces.online'

function findCityBySlug(slug: string): string | null {
  const normalized = slug.replace(/-/g, ' ').toLowerCase()
  return CITIES.find(c => c.toLowerCase() === normalized) ?? null
}

function findCategoryBySlug(slug: string) {
  return CATEGORIES.find(c => c.id === slug) ?? null
}

export async function generateMetadata(props: { params: Promise<{ city: string; category: string }> }): Promise<Metadata> {
  const params = await props.params;
  const cityName = findCityBySlug(params.city)
  const category = findCategoryBySlug(params.category)
  
  if (!cityName || !category) return { title: 'Not Found: PakBizBranches' }

  // Build title: 50-60 chars, no pipes
  let title = `${category.name} in ${cityName}: Verified Phone Numbers`
  if (title.length > 60) title = `${category.name} in ${cityName}: Contacts`
  if (title.length > 60) title = title.substring(0, 60)
  if (title.length < 50) title = `Find ${category.name} in ${cityName}: Verified Contacts`
  if (title.length > 60) title = title.substring(0, 60)

  // Build description: 140-155 chars
  let description = `Browse verified ${category.name.toLowerCase()} businesses in ${cityName}. Get direct phone numbers, WhatsApp links, and exact addresses free on PakBizBranches.`
  if (description.length > 155) description = description.substring(0, 152) + '...'
  if (description.length < 140) {
    description = `Find the best ${category.name.toLowerCase()} in ${cityName}, Pakistan. Get verified phone numbers, WhatsApp contacts, and addresses free on PakBizBranches.`
    if (description.length > 155) description = description.substring(0, 152) + '...'
  }

  const url = `${BASE_URL}/${params.city}/${params.category}/`

  return {
    title,
    description,
    keywords: [
      `${category.name} in ${cityName}`,
      `best ${category.name} ${cityName}`,
      `${cityName} ${category.name} directory`,
      `${category.name} contact numbers ${cityName}`,
      `${cityName} businesses`,
    ],
    alternates: { canonical: url },
    robots: {
      index: true, // index static landing shell by default
      follow: true,
    },
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

export default async function CityCategoryPage(props: { params: Promise<{ city: string; category: string }> }) {
  const params = await props.params;
  return <CityCategoryClient citySlug={params.city} categorySlug={params.category} />
}
