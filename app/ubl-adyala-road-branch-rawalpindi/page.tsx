import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Adyala Road Branch Rawalpindi - Verified Address PK"
  const description = "Get verified details for UBL Adyala Road branch in Rawalpindi, Pakistan. Find branch address at Main Adyala Road, contact phone, and helpline."
  const url = "https://www.pakbizbranhces.online/ubl-adyala-road-branch-rawalpindi/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl adyala road branch rawalpindi",
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
  return <CatchAllPageClient slug="ubl-adyala-road-branch-rawalpindi" />
}
