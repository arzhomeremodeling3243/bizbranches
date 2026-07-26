import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "Dermaluxe Clinic by Dr Rabia Ishfaq - Lahore Office Detail"
  const description = "Get verified details for Dermaluxe Clinic by Dr Rabia Ishfaq in Lahore, Pakistan. Find phone number, office address, and WhatsApp contact."
  const url = "https://www.pakbizbranhces.online/dermaluxe-clinic-by-dr-rabia-ishfaq-lahore/"
  
  return {
    title,
    description,
    keywords: [
      "Dermaluxe Clinic by Dr Rabia Ishfaq",
      "Dermaluxe Clinic by Dr Rabia Ishfaq Lahore",
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
  return <CatchAllPageClient slug="dermaluxe-clinic-by-dr-rabia-ishfaq-lahore" />
}
