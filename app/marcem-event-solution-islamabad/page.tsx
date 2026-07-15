import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "Marcem Event Solution - Islamabad Office Details...."
  const description = "Get verified details for Marcem Event Solution in Islamabad, Pakistan. Find phone number, office address, and WhatsApp contact."
  const url = "https://www.pakbizbranhces.online/marcem-event-solution-islamabad/"
  
  return {
    title,
    description,
    keywords: [
      "Marcem Event Solution",
      "Marcem Event Solution Islamabad",
      "software company Islamabad",
      "verified business Islamabad"
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
  return <CatchAllPageClient slug="marcem-event-solution-islamabad" />
}
