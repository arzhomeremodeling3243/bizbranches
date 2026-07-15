import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Ravi Road Branch Lahore - Near Ravi Park Address"
  const description = "Get verified details for UBL Ravi Road branch in Lahore, Pakistan. Find branch address near Ravi Park, contact phone number, and helpline info."
  const url = "https://www.pakbizbranhces.online/ubl-ravi-road-branch-lahore/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl ravi road branch lahore",
      "UBL Lahore branch",
      "UBL helpline Lahore",
      "United Bank Limited Lahore",
      "UBL contact number Lahore"
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
  return <CatchAllPageClient slug="ubl-ravi-road-branch-lahore" />
}
