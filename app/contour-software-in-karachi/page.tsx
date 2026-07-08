import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "Contour Software Karachi Branch - Phone, Address & Info"
  const description = "Get verified details for Contour Software in Karachi, Pakistan. Find office address, contact phone number, email and timing info."
  const url = "https://www.pakbizbranhces.online/contour-software-in-karachi/"
  
  return {
    title,
    description,
    keywords: [
      "Contour Software Karachi",
      "Contour Software Karachi office",
      "Contour Software Pakistan",
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
  return <CatchAllPageClient slug="contour-software-in-karachi" />
}
