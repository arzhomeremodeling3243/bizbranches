import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL I-8 Markaz Branch Islamabad - Code 1206 Details"
  const description = "Get verified details for UBL I-8 Markaz branch (Branch Code 1206) in Islamabad, Pakistan. Find branch address at Huzaifa Plaza, and phone."
  const url = "https://www.pakbizbranhces.online/ubl-i-8-markaz-branch-islamabad/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl i 8 markaz branch islamabad",
      "UBL Islamabad branch",
      "UBL helpline Islamabad",
      "United Bank Limited Islamabad",
      "UBL contact number Islamabad",
      "UBL branch code 1206",
      "UBL 1206"
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
  return <CatchAllPageClient slug="ubl-i-8-markaz-branch-islamabad" />
}
