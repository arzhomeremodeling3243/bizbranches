import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CITIES, CATEGORIES } from '@/lib/data'
import CityCategoryClient from './city-category-client'
import { getStaticCityCategory } from '@/lib/static-db'
import { isCityCategoryIndexable, getBusinessCountForCityCategory, getQualifiedCityCategories, SEO_CONFIG } from '@/lib/seo-config'
import React from 'react'

export const dynamic = 'force-static'
export const dynamicParams = true

export async function generateStaticParams() {
  // Pre-render only city+category combinations that have sufficient genuine business inventory
  return getQualifiedCityCategories().map(item => ({
    city: item.citySlug,
    category: item.categoryId,
  }))
}

const BASE_URL = SEO_CONFIG.BASE_URL

function findCityBySlug(slug: string): string | null {
  const normalized = slug.replace(/-/g, ' ').toLowerCase()
  return CITIES.find(c => c.toLowerCase() === normalized) ?? null
}

function findCategoryBySlug(slug: string) {
  return CATEGORIES.find(c => c.id === slug) ?? null
}

export async function generateMetadata(props: { params: Promise<{ city: string; category: string }> }): Promise<Metadata> {
  const params = await props.params
  const cityName = findCityBySlug(params.city)
  const category = findCategoryBySlug(params.category)
  
  if (!cityName || !category) {
    return {
      title: 'Location or Category Not Found - PakBizBranches',
      robots: { index: false, follow: false },
    }
  }

  const isIndexable = isCityCategoryIndexable(cityName, category.id)
  const count = getBusinessCountForCityCategory(cityName, category.id)

  let title = `${category.name} in ${cityName} – Local ${category.name} Directory`
  if (title.length > 60) {
    title = `${category.name} in ${cityName} – Local Directory`
  }
  if (title.length > 60) {
    title = `${category.name} in ${cityName} Directory`
  }

  let description = `Find verified ${category.name.toLowerCase()} businesses in ${cityName}, Pakistan. Compare direct phone numbers, WhatsApp links, and physical addresses free on PakBizBranches.`
  if (description.length > 155) {
    description = description.substring(0, 152) + '...'
  }

  const url = `${BASE_URL}/${params.city}/${params.category}/`

  return {
    title,
    description,
    keywords: [
      `${category.name} in ${cityName}`,
      `best ${category.name.toLowerCase()} ${cityName}`,
      `${cityName} ${category.name.toLowerCase()} directory`,
      `${category.name.toLowerCase()} contact numbers ${cityName}`,
      `${cityName} businesses`,
    ],
    alternates: { canonical: url },
    robots: {
      index: isIndexable,
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
  const params = await props.params
  const cityName = findCityBySlug(params.city)
  const category = findCategoryBySlug(params.category)

  if (!cityName || !category) {
    notFound()
  }

  const staticList = getStaticCityCategory(cityName, category.id)

  return (
    <CityCategoryClient
      citySlug={params.city}
      categorySlug={params.category}
      initialBusinessesList={staticList as any[]}
    />
  )
}
