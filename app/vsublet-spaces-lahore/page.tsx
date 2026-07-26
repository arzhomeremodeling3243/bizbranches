import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "VSublet Spaces - Lahore Office Details.............."
  const description = "Get verified details for VSublet Spaces in Lahore, Pakistan. Find phone number, office address, and WhatsApp contact. Access local branch coordin"
  const url = "https://www.pakbizbranhces.online/vsublet-spaces-lahore/"
  
  return {
    title,
    description,
    keywords: [
      "VSublet Spaces",
      "VSublet Spaces Lahore",
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
  return <CatchAllPageClient slug="vsublet-spaces-lahore" />
}
