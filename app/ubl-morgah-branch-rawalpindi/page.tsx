import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Morgah Branch Rawalpindi - Verified Office Address"
  const description = "Get verified details for UBL Morgah branch in Rawalpindi, Pakistan. Find branch address near Attock Refinery, contact phone, and helpline info."
  const url = "https://www.pakbizbranhces.online/ubl-morgah-branch-rawalpindi/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl morgah branch rawalpindi",
      "UBL Rawalpindi branch",
      "UBL helpline Rawalpindi",
      "United Bank Limited Rawalpindi",
      "UBL contact number Rawalpindi"
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
  return <CatchAllPageClient slug="ubl-morgah-branch-rawalpindi" />
}
