import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "WPX SEO Digital - Multan Office Details............."
  const description = "Get verified details for WPX SEO Digital in Multan, Pakistan. Find phone number, office address, and WhatsApp contact. Access local branch coordi"
  const url = "https://www.pakbizbranhces.online/wpx-seo-digital-multan/"
  
  return {
    title,
    description,
    keywords: [
      "WPX SEO Digital",
      "WPX SEO Digital Multan",
      "software company Multan",
      "verified business Multan"
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

export default function Page() {
  return <CatchAllPageClient slug="wpx-seo-digital-multan" />
}
