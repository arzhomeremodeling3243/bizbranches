import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Ameen Bait-Us-Salam Karachi - Phone & DHA Address"
  const description = "Get verified details for UBL Ameen Bait-Us-Salam in DHA Phase 4, Karachi. Find branch address at Sunset Commercial, and phone contact info."
  const url = "https://www.pakbizbranhces.online/ubl-ameen-bait-us-salam-karachi/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl ameen bait us salam karachi",
      "UBL Karachi branch",
      "UBL helpline Karachi",
      "United Bank Limited Karachi",
      "UBL contact number Karachi"
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
  return <CatchAllPageClient slug="ubl-ameen-bait-us-salam-karachi" />
}
