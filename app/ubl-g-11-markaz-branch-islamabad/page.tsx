import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL G-11 Markaz Branch Islamabad - Code 2911 Details"
  const description = "Get verified details for UBL G-11 Markaz branch (Branch Code 2911) in Islamabad, Pakistan. Find branch address at Al-Rehman Mall, and phone."
  const url = "https://www.pakbizbranhces.online/ubl-g-11-markaz-branch-islamabad/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl g 11 markaz branch islamabad",
      "UBL Islamabad branch",
      "UBL helpline Islamabad",
      "United Bank Limited Islamabad",
      "UBL contact number Islamabad",
      "UBL branch code 2911",
      "UBL 2911"
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
  return <CatchAllPageClient slug="ubl-g-11-markaz-branch-islamabad" />
}
