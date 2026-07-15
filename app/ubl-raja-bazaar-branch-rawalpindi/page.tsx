import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Raja Bazaar Branch Rawalpindi - Code 0005 Details"
  const description = "Get verified details for UBL Raja Bazaar branch (Branch Code 0005) in Rawalpindi, Pakistan. Find branch address, contact phone, and helpline."
  const url = "https://www.pakbizbranhces.online/ubl-raja-bazaar-branch-rawalpindi/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl raja bazaar branch rawalpindi",
      "UBL Rawalpindi branch",
      "UBL helpline Rawalpindi",
      "United Bank Limited Rawalpindi",
      "UBL contact number Rawalpindi",
      "UBL branch code 0005",
      "UBL 0005"
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
  return <CatchAllPageClient slug="ubl-raja-bazaar-branch-rawalpindi" />
}
