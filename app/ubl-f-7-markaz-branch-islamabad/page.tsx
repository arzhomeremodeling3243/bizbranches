import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL F-7 Markaz Branch Islamabad - Verified Details PK"
  const description = "Get verified details for UBL F-7 Markaz branch in Islamabad, Pakistan. Find branch address at Block 4, contact phone number, and helpline."
  const url = "https://www.pakbizbranhces.online/ubl-f-7-markaz-branch-islamabad/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl f 7 markaz branch islamabad",
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
  return <CatchAllPageClient slug="ubl-f-7-markaz-branch-islamabad" />
}
