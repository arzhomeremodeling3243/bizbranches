import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Commercial Market Branch Rawalpindi - Code 0251 Info"
  const description = "Get verified details for UBL Commercial Market branch (Branch Code 0251) in Rawalpindi, Pakistan. Find address, contact phone, and helpline."
  const url = "https://www.pakbizbranhces.online/ubl-commercial-market-branch-rawalpindi/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl commercial market branch rawalpindi",
      "UBL Rawalpindi branch",
      "UBL helpline Rawalpindi",
      "United Bank Limited Rawalpindi",
      "UBL contact number Rawalpindi",
      "UBL branch code 0251",
      "UBL 0251"
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
  return <CatchAllPageClient slug="ubl-commercial-market-branch-rawalpindi" />
}
