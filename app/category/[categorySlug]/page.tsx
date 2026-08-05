import { Metadata } from 'next'
import { CATEGORIES } from '@/lib/data'
import { getCategoryKeywordCluster } from '@/lib/organic-keywords'
import CategoryClient from './category-client'
import React from 'react'

const BASE_URL = 'https://www.pakbizbranhces.online'

export const dynamic = 'force-static'
export const revalidate = 15552000 // 180 days ISR

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({
    categorySlug: c.id,
  }))
}

export const dynamicParams = true

export async function generateMetadata(props: { params: Promise<{ categorySlug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const category = CATEGORIES.find(c => c.id === params.categorySlug)
  if (!category) return { title: 'Category Not Found: PakBizBranches' }

  let title = `Best ${category.name} in Pakistan 2026: Verified Contact Details`
  if (title.length > 60) {
    title = `Best ${category.name} in Pakistan 2026: Verified Contacts`
  }
  if (title.length < 50) {
    title = `Best ${category.name} Listings in Pakistan 2026: Verified Contacts`
  }
  if (title.length > 60) {
    title = title.substring(0, 60)
  }

  let description = `Browse verified ${category.name.toLowerCase()} listings in Karachi, Lahore, Islamabad, and 150 plus cities. Find direct phone and WhatsApp numbers on PakBizBranches.`
  if (description.length > 155) {
    description = description.substring(0, 152) + '...'
  } else if (description.length < 140) {
    description = `Browse verified ${category.name.toLowerCase()} listings across Karachi, Lahore, Islamabad, and 150 plus cities in Pakistan. Find direct phone and WhatsApp numbers free.`
    if (description.length > 155) {
      description = description.substring(0, 152) + '...'
    }
  }

  const url = `${BASE_URL}/${params.categorySlug}/`
  const keywordCluster = getCategoryKeywordCluster(params.categorySlug)

  return {
    title,
    description,
    keywords: [
      `${category.name} in Pakistan`,
      `${category.name.toLowerCase()} businesses Pakistan`,
      `best ${category.name.toLowerCase()} in Pakistan`,
      `${category.name.toLowerCase()} Karachi`,
      `${category.name.toLowerCase()} Lahore`,
      `${category.name.toLowerCase()} Islamabad`,
      ...keywordCluster,
    ],
    robots: {
      index: true, // index static category landing shell by default
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

import { getStaticCategory } from '@/lib/static-db'

export default async function CategoryPage(props: { params: Promise<{ categorySlug: string }> }) {
  const params = await props.params;
  const staticList = getStaticCategory(params.categorySlug)
  return <CategoryClient categorySlug={params.categorySlug} initialBusinessesList={staticList as any[]} />
}
