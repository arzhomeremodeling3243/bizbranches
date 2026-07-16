import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "FIVI Communication Pvt Ltd - Chakwal | Phone & Address"
  const description = "Get verified details for FIVI Communication Pvt Ltd in Chakwal, Pakistan. Find phone number, office address, and WhatsApp contact."
  const url = "https://www.pakbizbranhces.online/fivi-communication-pvt-ltd-chakwal/"
  
  return {
    title,
    description,
    keywords: [
      "FIVI Communication Pvt Ltd",
      "FIVI Communication Pvt Ltd Chakwal",
      "software company Chakwal",
      "verified business Chakwal"
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
  return <CatchAllPageClient slug="fivi-communication-pvt-ltd-chakwal" />
}
