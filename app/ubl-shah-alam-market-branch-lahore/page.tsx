import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Shah Alam Market Branch Lahore - Code 0007 Details"
  const description = "Get verified details for UBL Shah Alam Market branch (Branch Code 0007) in Lahore, Pakistan. Find office address, contact phone, and helpline."
  const url = "https://www.pakbizbranhces.online/ubl-shah-alam-market-branch-lahore/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl shah alam market branch lahore",
      "UBL Lahore branch",
      "UBL helpline Lahore",
      "United Bank Limited Lahore",
      "UBL contact number Lahore",
      "UBL branch code 0007",
      "UBL 0007"
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
  return <CatchAllPageClient slug="ubl-shah-alam-market-branch-lahore" />
}
