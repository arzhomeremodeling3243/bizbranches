import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Bunder Road Branch Karachi - Phone & M.A. Jinnah"
  const description = "Get verified details for UBL Bunder Road Branch in Karachi. Find branch address on M.A. Jinnah Road, contact phone number, and helpline."
  const url = "https://www.pakbizbranhces.online/ubl-bunder-road-branch-karachi/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl bunder road branch karachi",
      "UBL Karachi branch",
      "UBL helpline Karachi",
      "United Bank Limited Karachi",
      "UBL contact number Karachi"
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
  return <CatchAllPageClient slug="ubl-bunder-road-branch-karachi" />
}
