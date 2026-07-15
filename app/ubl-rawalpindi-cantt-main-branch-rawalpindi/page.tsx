import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Rawalpindi Cantt Main Branch Regional Hub - Info"
  const description = "Get verified details for UBL Rawalpindi Cantt branch (Regional Hub) in Rawalpindi, Pakistan. Find Saddar address, phone, and helpline."
  const url = "https://www.pakbizbranhces.online/ubl-rawalpindi-cantt-main-branch-rawalpindi/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl rawalpindi cantt main branch rawalpindi",
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
  return <CatchAllPageClient slug="ubl-rawalpindi-cantt-main-branch-rawalpindi" />
}
