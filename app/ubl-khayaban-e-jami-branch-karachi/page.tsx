import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Khayaban-e-Jami Branch Karachi - Phone & Address"
  const description = "Get verified details for UBL Khayaban-e-Jami Branch in DHA, Karachi. Find branch location address, contact phone number, and helpline info."
  const url = "https://www.pakbizbranhces.online/ubl-khayaban-e-jami-branch-karachi/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl khayaban e jami branch karachi",
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
  return <CatchAllPageClient slug="ubl-khayaban-e-jami-branch-karachi" />
}
