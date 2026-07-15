import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Liberty Market Branch Lahore - Code 0962 Details PK"
  const description = "Get verified details for UBL Liberty Market branch (Branch Code 0962) in Lahore, Pakistan. Find address at Liberty Market, Gulberg, and phone."
  const url = "https://www.pakbizbranhces.online/ubl-liberty-market-branch-lahore/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl liberty market branch lahore",
      "UBL Lahore branch",
      "UBL helpline Lahore",
      "United Bank Limited Lahore",
      "UBL contact number Lahore",
      "UBL branch code 0962",
      "UBL 0962"
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
  return <CatchAllPageClient slug="ubl-liberty-market-branch-lahore" />
}
