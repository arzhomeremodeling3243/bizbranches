import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "7 Elements Digital - Islamabad Office Details......."
  const description = "Get verified details for 7 Elements Digital in Islamabad, Pakistan. Find phone number, office address, and WhatsApp contact. Access local branch "
  const url = "https://www.pakbizbranhces.online/7-elements-digital-islamabad/"
  
  return {
    title,
    description,
    keywords: [
      "7 Elements Digital",
      "7 Elements Digital Islamabad",
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
  return <CatchAllPageClient slug="7-elements-digital-islamabad" />
}
