import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "Gulf Podcast Studios - Lahore Office Details........"
  const description = "Get verified details for Gulf Podcast Studios in Lahore, Pakistan. Find phone number, office address, and WhatsApp contact. Access local branch c"
  const url = "https://www.pakbizbranhces.online/gulf-podcast-studios-lahore/"
  
  return {
    title,
    description,
    keywords: [
      "Gulf Podcast Studios",
      "Gulf Podcast Studios Lahore",
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
  return <CatchAllPageClient slug="gulf-podcast-studios-lahore" />
}
