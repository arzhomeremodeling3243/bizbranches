import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "Arbisoft Lahore Office - Contact Phone & Address PK Now"
  const description = "Get verified details for Arbisoft in Lahore, Pakistan. Find office address, contact phone number, email and timing info. Access local company coo"
  const url = "https://www.pakbizbranhces.online/arbisoft-in-lahore/"
  
  return {
    title,
    description,
    keywords: [
      "Arbisoft Lahore",
      "Arbisoft Lahore office",
      "Arbisoft Pakistan",
      "software company Lahore",
      "IT services Lahore"
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
  return <CatchAllPageClient slug="arbisoft-in-lahore" />
}
