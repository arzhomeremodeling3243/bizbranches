import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Aabpara Market Branch Islamabad - Code 0259 Details"
  const description = "Get verified details for UBL Aabpara Market branch (Branch Code 0259) in Islamabad, Pakistan. Find branch address at G-6, phone, and helpline."
  const url = "https://www.pakbizbranhces.online/ubl-aabpara-market-branch-islamabad/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl aabpara market branch islamabad",
      "UBL Islamabad branch",
      "UBL helpline Islamabad",
      "United Bank Limited Islamabad",
      "UBL contact number Islamabad",
      "UBL branch code 0259",
      "UBL 0259"
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
  return <CatchAllPageClient slug="ubl-aabpara-market-branch-islamabad" />
}
