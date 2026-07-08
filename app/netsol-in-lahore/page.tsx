import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "NETSOL Technologies Lahore Branch - Verified Details"
  const description = "Get verified details for NETSOL Technologies in Lahore, Pakistan. Find office address, contact phone number, email and timing info."
  const url = "https://www.pakbizbranhces.online/netsol-in-lahore/"
  
  return {
    title,
    description,
    keywords: [
      "NETSOL Technologies Lahore",
      "NETSOL Technologies Lahore office",
      "NETSOL Technologies Pakistan",
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
  return <CatchAllPageClient slug="netsol-in-lahore" />
}
