import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "Trustmed Labs - Lahore Office Details..............."
  const description = "Get verified details for Trustmed Labs in Lahore, Pakistan. Find phone number, office address, and WhatsApp contact. Access local branch coordina"
  const url = "https://www.pakbizbranhces.online/trustmed-labs-lahore-1/"
  
  return {
    title,
    description,
    keywords: [
      "Trustmed Labs",
      "Trustmed Labs Lahore",
      "software company Lahore",
      "verified business Lahore"
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
  return <CatchAllPageClient slug="trustmed-labs-lahore-1" />
}
