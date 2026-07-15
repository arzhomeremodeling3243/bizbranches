import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Bahria Town Phase 4 Branch Rawalpindi - Code 1646"
  const description = "Get verified details for UBL Bahria Town Phase 4 branch (Branch Code 1646) in Rawalpindi, Pakistan. Find address, contact phone, and ATM."
  const url = "https://www.pakbizbranhces.online/ubl-bahria-town-phase-4-branch-rawalpindi/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl bahria town phase 4 branch rawalpindi",
      "UBL Rawalpindi branch",
      "UBL helpline Rawalpindi",
      "United Bank Limited Rawalpindi",
      "UBL contact number Rawalpindi",
      "UBL branch code 1646",
      "UBL 1646"
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
  return <CatchAllPageClient slug="ubl-bahria-town-phase-4-branch-rawalpindi" />
}
