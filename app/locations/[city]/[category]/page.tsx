import CityCategoryPage, { generateMetadata as baseGenerateMetadata } from '@/app/businesses/[city]/[categorySlug]/page'
import { Metadata } from 'next'
import { CITIES, CATEGORIES, TOP_CITIES } from '@/lib/data'
import React from 'react'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const params: { city: string; category: string }[] = []

  TOP_CITIES.forEach(city => {
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

export const dynamicParams = false

export async function generateMetadata(props: { params: Promise<{ city: string; category: string }> }): Promise<Metadata> {
  const params = await props.params
  return baseGenerateMetadata({ params: Promise.resolve({ city: params.city, categorySlug: params.category }) })
}

export default async function LocationsCategoryPage(props: { params: Promise<{ city: string; category: string }> }) {
  const params = await props.params
  return CityCategoryPage({ params: Promise.resolve({ city: params.city, categorySlug: params.category }) })
}
