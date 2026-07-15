import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Ghauri Town Phase 4 Branch Islamabad - Details PK"
  const description = "Get verified details for UBL Ghauri Town Phase 4 branch in Islamabad, Pakistan. Find branch address, contact phone number, and helpline info."
  const url = "https://www.pakbizbranhces.online/ubl-ghauri-town-phase-4-branch-islamabad/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl ghauri town phase 4 branch islamabad",
      "UBL Islamabad branch",
      "UBL helpline Islamabad",
      "United Bank Limited Islamabad",
      "UBL contact number Islamabad"
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
  return <CatchAllPageClient slug="ubl-ghauri-town-phase-4-branch-islamabad" />
}
