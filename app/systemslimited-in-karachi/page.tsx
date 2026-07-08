import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "Systems Limited Karachi Branch - Phone, Address & Info"
  const description = "Get verified details for Systems Limited in Karachi, Pakistan. Find office address, contact phone number, email and timing info."
  const url = "https://www.pakbizbranhces.online/systemslimited-in-karachi/"
  
  return {
    title,
    description,
    keywords: [
      "Systems Limited Karachi",
      "Systems Limited Karachi office",
      "Systems Limited Pakistan",
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
  return <CatchAllPageClient slug="systemslimited-in-karachi" />
}
