import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "Arbisoft Islamabad Office - Contact Phone & Address PK"
  const description = "Get verified details for Arbisoft in Islamabad, Pakistan. Find office address, contact phone number, email and timing info. Access local company "
  const url = "https://www.pakbizbranhces.online/arbisoft-in-islamabad/"
  
  return {
    title,
    description,
    keywords: [
      "Arbisoft Islamabad",
      "Arbisoft Islamabad office",
      "Arbisoft Pakistan",
      "software company Islamabad",
      "IT services Islamabad"
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
  return <CatchAllPageClient slug="arbisoft-in-islamabad" />
}
