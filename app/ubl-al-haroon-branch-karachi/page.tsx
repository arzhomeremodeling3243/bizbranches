import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Al-Haroon Branch Karachi - Phone & Saddar Address"
  const description = "Get verified details for UBL Al-Haroon Branch in Saddar, Karachi. Find branch address at Ground Floor, Al-Haroon, and phone contact details."
  const url = "https://www.pakbizbranhces.online/ubl-al-haroon-branch-karachi/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl al haroon branch karachi",
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
  return <CatchAllPageClient slug="ubl-al-haroon-branch-karachi" />
}
