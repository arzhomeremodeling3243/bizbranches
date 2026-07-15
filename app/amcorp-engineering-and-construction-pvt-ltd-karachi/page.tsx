import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "AMCORP Engineering and Construction (Pvt) Ltd - Karachi Of"
  const description = "Get verified details for AMCORP Engineering and Construction (Pvt) Ltd in Karachi, Pakistan. Find phone number, office address, and WhatsApp c..."
  const url = "https://www.pakbizbranhces.online/amcorp-engineering-and-construction-pvt-ltd-karachi/"
  
  return {
    title,
    description,
    keywords: [
      "AMCORP Engineering and Construction (Pvt) Ltd",
      "AMCORP Engineering and Construction (Pvt) Ltd Karachi",
      "software company Karachi",
      "verified business Karachi"
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
  return <CatchAllPageClient slug="amcorp-engineering-and-construction-pvt-ltd-karachi" />
}
