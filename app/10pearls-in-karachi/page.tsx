import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "10Pearls Karachi Office - Contact Phone & Address PK"
  const description = "Get verified details for 10Pearls in Karachi, Pakistan. Find office address, contact phone number, email and timing info. Access local company co"
  const url = "https://www.pakbizbranhces.online/10pearls-in-karachi/"
  
  return {
    title,
    description,
    keywords: [
      "10Pearls Karachi",
      "10Pearls Karachi office",
      "10Pearls Pakistan",
      "software company Karachi",
      "IT services Karachi"
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
  return <CatchAllPageClient slug="10pearls-in-karachi" />
}
