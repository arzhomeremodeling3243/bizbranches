import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "NF Consultants Worldwide Education (Private) Limited - Raw"
  const description = "Get verified details for NF Consultants Worldwide Education (Private) Limited in Rawalpindi, Pakistan. Find phone number, office address, and ..."
  const url = "https://www.pakbizbranhces.online/nf-consultants-worldwide-education-private-limited-rawalpindi/"
  
  return {
    title,
    description,
    keywords: [
      "NF Consultants Worldwide Education (Private) Limited",
      "NF Consultants Worldwide Education (Private) Limited Rawalpindi",
      "software company Rawalpindi",
      "verified business Rawalpindi"
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
  return <CatchAllPageClient slug="nf-consultants-worldwide-education-private-limited-rawalpindi" />
}
