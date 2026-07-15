import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "Australian Concept infertility Medical Center - Lahore Off"
  const description = "Get verified details for Australian Concept infertility Medical Center in Lahore, Pakistan. Find phone number, office address, and WhatsApp co..."
  const url = "https://www.pakbizbranhces.online/australian-concept-infertility-medical-center-lahore/"
  
  return {
    title,
    description,
    keywords: [
      "Australian Concept infertility Medical Center",
      "Australian Concept infertility Medical Center Lahore",
      "software company Lahore",
      "verified business Lahore"
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
  return <CatchAllPageClient slug="australian-concept-infertility-medical-center-lahore" />
}
