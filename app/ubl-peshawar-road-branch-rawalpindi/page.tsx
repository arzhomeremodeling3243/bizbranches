import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Peshawar Road Branch Rawalpindi - Code 0543 Details"
  const description = "Get verified details for UBL Peshawar Road branch (Branch Code 0543) in Rawalpindi, Pakistan. Find branch address, contact phone, and helpline."
  const url = "https://www.pakbizbranhces.online/ubl-peshawar-road-branch-rawalpindi/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl peshawar road branch rawalpindi",
      "UBL Rawalpindi branch",
      "UBL helpline Rawalpindi",
      "United Bank Limited Rawalpindi",
      "UBL contact number Rawalpindi",
      "UBL branch code 0543",
      "UBL 0543"
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
  return <CatchAllPageClient slug="ubl-peshawar-road-branch-rawalpindi" />
}
