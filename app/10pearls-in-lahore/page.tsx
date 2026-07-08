import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "10Pearls Lahore Office - Contact Phone & Address PK Now"
  const description = "Get verified details for 10Pearls in Lahore, Pakistan. Find office address, contact phone number, email and timing info. Access local company coo"
  const url = "https://www.pakbizbranhces.online/10pearls-in-lahore/"
  
  return {
    title,
    description,
    keywords: [
      "10Pearls Lahore",
      "10Pearls Lahore office",
      "10Pearls Pakistan",
      "software company Lahore",
      "IT services Lahore"
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
  return <CatchAllPageClient slug="10pearls-in-lahore" />
}
