import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Badami Bagh Branch Lahore - Grain Market Address"
  const description = "Get verified details for UBL Badami Bagh branch in Lahore, Pakistan. Find branch address at Grain Market Peco Road, contact phone, and helpline."
  const url = "https://www.pakbizbranhces.online/ubl-badami-bagh-branch-lahore/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl badami bagh branch lahore",
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
  return <CatchAllPageClient slug="ubl-badami-bagh-branch-lahore" />
}
