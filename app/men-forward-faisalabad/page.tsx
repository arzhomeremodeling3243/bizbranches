import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "Men Forward - Faisalabad Office Details............."
  const description = "Get verified details for Men Forward in Faisalabad, Pakistan. Find phone number, office address, and WhatsApp contact. Access local branch coordi"
  const url = "https://www.pakbizbranhces.online/men-forward-faisalabad/"
  
  return {
    title,
    description,
    keywords: [
      "Men Forward",
      "Men Forward Faisalabad",
      "software company Faisalabad",
      "verified business Faisalabad"
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
  return <CatchAllPageClient slug="men-forward-faisalabad" />
}
