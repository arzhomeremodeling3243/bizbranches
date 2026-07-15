import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Model Town Branch Lahore - Bank Square Address PK"
  const description = "Get verified details for UBL Model Town branch in Lahore, Pakistan. Find branch address at Circular Road, phone contact number, and helpline."
  const url = "https://www.pakbizbranhces.online/ubl-model-town-branch-lahore/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl model town branch lahore",
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
  return <CatchAllPageClient slug="ubl-model-town-branch-lahore" />
}
