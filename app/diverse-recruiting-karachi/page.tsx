import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "Diverse Recruiting - Karachi Office Details........."
  const description = "Get verified details for Diverse Recruiting in Karachi, Pakistan. Find phone number, office address, and WhatsApp contact. Access local branch co"
  const url = "https://www.pakbizbranhces.online/diverse-recruiting-karachi/"
  
  return {
    title,
    description,
    keywords: [
      "Diverse Recruiting",
      "Diverse Recruiting Karachi",
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
  return <CatchAllPageClient slug="diverse-recruiting-karachi" />
}
