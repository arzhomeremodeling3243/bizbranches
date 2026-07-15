import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL DHA Phase 5 Branch Lahore - Verified CCA Address"
  const description = "Get verified details for UBL DHA Phase 5 branch in Lahore, Pakistan. Find branch address at CCA Phase 5, contact phone number, and helpline."
  const url = "https://www.pakbizbranhces.online/ubl-dha-phase-5-branch-lahore/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl dha phase 5 branch lahore",
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
  return <CatchAllPageClient slug="ubl-dha-phase-5-branch-lahore" />
}
