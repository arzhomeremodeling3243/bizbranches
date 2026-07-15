import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Anarkali Bazaar Branch Lahore - Mall Road Address"
  const description = "Get verified details for UBL Anarkali Bazaar branch in Lahore, Pakistan. Find branch address at Mall Road, contact phone number, and helpline."
  const url = "https://www.pakbizbranhces.online/ubl-anarkali-bazaar-branch-lahore/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl anarkali bazaar branch lahore",
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
  return <CatchAllPageClient slug="ubl-anarkali-bazaar-branch-lahore" />
}
