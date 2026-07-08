import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "Arbisoft Karachi Office - Contact Phone & Address PK"
  const description = "Get verified details for Arbisoft in Karachi, Pakistan. Find office address, contact phone number, email and timing info. Access local company co"
  const url = "https://www.pakbizbranhces.online/arbisoft-in-karachi/"
  
  return {
    title,
    description,
    keywords: [
      "Arbisoft Karachi",
      "Arbisoft Karachi office",
      "Arbisoft Pakistan",
      "software company Karachi",
      "IT services Karachi"
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
  return <CatchAllPageClient slug="arbisoft-in-karachi" />
}
