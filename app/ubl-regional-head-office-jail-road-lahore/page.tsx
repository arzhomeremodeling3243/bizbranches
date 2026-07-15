import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Regional Head Office Jail Road Lahore - Phone Info"
  const description = "Get verified details for UBL Regional Head Office on Jail Road in Lahore, Pakistan. Find central corporate address, contact phone, and helpline."
  const url = "https://www.pakbizbranhces.online/ubl-regional-head-office-jail-road-lahore/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl regional head office jail road lahore",
      "UBL Lahore branch",
      "UBL helpline Lahore",
      "United Bank Limited Lahore",
      "UBL contact number Lahore"
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
  return <CatchAllPageClient slug="ubl-regional-head-office-jail-road-lahore" />
}
