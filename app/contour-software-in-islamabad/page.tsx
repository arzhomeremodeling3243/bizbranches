import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "Contour Software Islamabad Branch - Verified Details"
  const description = "Get verified details for Contour Software in Islamabad, Pakistan. Find office address, contact phone number, email and timing info."
  const url = "https://www.pakbizbranhces.online/contour-software-in-islamabad/"
  
  return {
    title,
    description,
    keywords: [
      "Contour Software Islamabad",
      "Contour Software Islamabad office",
      "Contour Software Pakistan",
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
  return <CatchAllPageClient slug="contour-software-in-islamabad" />
}
