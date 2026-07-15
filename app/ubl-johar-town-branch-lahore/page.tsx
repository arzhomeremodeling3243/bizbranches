import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Johar Town Branch Lahore - Code 1937 Phone & Info"
  const description = "Get verified details for UBL Johar Town branch (Branch Code 1937) in Lahore, Pakistan. Find branch address at block L, phone contact, and ATM."
  const url = "https://www.pakbizbranhces.online/ubl-johar-town-branch-lahore/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl johar town branch lahore",
      "UBL Lahore branch",
      "UBL helpline Lahore",
      "United Bank Limited Lahore",
      "UBL contact number Lahore",
      "UBL branch code 1937",
      "UBL 1937"
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
  return <CatchAllPageClient slug="ubl-johar-town-branch-lahore" />
}
