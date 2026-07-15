import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Jinnah Ave Corporate Center Branch Islamabad - Info"
  const description = "Get verified details for UBL Jinnah Avenue branch (Corporate Hub) in Islamabad, Pakistan. Find office address, contact phone, and helpline."
  const url = "https://www.pakbizbranhces.online/ubl-jinnah-avenue-corporate-center-branch-islamabad/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl jinnah avenue corporate center branch islamabad",
      "UBL Islamabad branch",
      "UBL helpline Islamabad",
      "United Bank Limited Islamabad",
      "UBL contact number Islamabad"
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
  return <CatchAllPageClient slug="ubl-jinnah-avenue-corporate-center-branch-islamabad" />
}
