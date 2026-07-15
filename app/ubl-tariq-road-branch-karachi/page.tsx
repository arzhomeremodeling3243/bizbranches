import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Tariq Road Branch Karachi - Phone & PECHS Address"
  const description = "Get verified details for UBL Tariq Road Branch in PECHS, Karachi. Find branch location address at block 2, contact phone number, and helpline."
  const url = "https://www.pakbizbranhces.online/ubl-tariq-road-branch-karachi/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl tariq road branch karachi",
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
  return <CatchAllPageClient slug="ubl-tariq-road-branch-karachi" />
}
