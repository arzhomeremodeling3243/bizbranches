import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL DHA Phase 1 Branch Rawalpindi - Verified Address PK"
  const description = "Get verified details for UBL DHA Phase 1 branch in Rawalpindi, Pakistan. Find branch address at Sector F DHA, contact phone, and helpline info."
  const url = "https://www.pakbizbranhces.online/ubl-dha-phase-1-branch-rawalpindi/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl dha phase 1 branch rawalpindi",
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
  return <CatchAllPageClient slug="ubl-dha-phase-1-branch-rawalpindi" />
}
