import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "Multani Hand Embroidery - Kamalia Office Details...."
  const description = "Get verified details for Multani Hand Embroidery in Kamalia, Pakistan. Find phone number, office address, and WhatsApp contact."
  const url = "https://www.pakbizbranhces.online/multani-hand-embroidery-kamalia/"
  
  return {
    title,
    description,
    keywords: [
      "Multani Hand Embroidery",
      "Multani Hand Embroidery Kamalia",
      "software company Kamalia",
      "verified business Kamalia"
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
  return <CatchAllPageClient slug="multani-hand-embroidery-kamalia" />
}
