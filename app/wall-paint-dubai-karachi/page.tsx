import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "Wall Paint Dubai - Karachi Office Details..........."
  const description = "Get verified details for Wall Paint Dubai in Karachi, Pakistan. Find phone number, office address, and WhatsApp contact. Access local branch coor"
  const url = "https://www.pakbizbranhces.online/wall-paint-dubai-karachi/"
  
  return {
    title,
    description,
    keywords: [
      "Wall Paint Dubai",
      "Wall Paint Dubai Karachi",
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
  return <CatchAllPageClient slug="wall-paint-dubai-karachi" />
}
