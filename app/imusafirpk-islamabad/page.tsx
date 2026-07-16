import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "iMusafir.pk - Islamabad Office Details.............."
  const description = "Get verified details for iMusafir.pk in Islamabad, Pakistan. Find phone number, office address, and WhatsApp contact. Access local branch coordin"
  const url = "https://www.pakbizbranhces.online/imusafirpk-islamabad/"
  
  return {
    title,
    description,
    keywords: [
      "iMusafir.pk",
      "iMusafir.pk Islamabad",
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
  return <CatchAllPageClient slug="imusafirpk-islamabad" />
}
