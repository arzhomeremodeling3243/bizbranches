import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "Kiddies and Toys - Lahore Office Details............"
  const description = "Get verified details for Kiddies and Toys in Lahore, Pakistan. Find phone number, office address, and WhatsApp contact. Access local branch coord"
  const url = "https://www.pakbizbranhces.online/kiddies-and-toys-lahore/"
  
  return {
    title,
    description,
    keywords: [
      "Kiddies and Toys",
      "Kiddies and Toys Lahore",
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
  return <CatchAllPageClient slug="kiddies-and-toys-lahore" />
}
