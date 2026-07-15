import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Samanabad Branch Lahore - Poonch Road Address PK"
  const description = "Get verified details for UBL Samanabad branch in Lahore, Pakistan. Find branch address at Poonch Road, contact phone number, and helpline info."
  const url = "https://www.pakbizbranhces.online/ubl-samanabad-branch-lahore/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl samanabad branch lahore",
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
  return <CatchAllPageClient slug="ubl-samanabad-branch-lahore" />
}
