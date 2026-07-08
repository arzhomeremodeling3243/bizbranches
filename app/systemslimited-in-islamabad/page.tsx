import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "Systems Limited Islamabad Branch - Phone, Address & Info"
  const description = "Get verified details for Systems Limited in Islamabad, Pakistan. Find office address, contact phone number, email and timing info."
  const url = "https://www.pakbizbranhces.online/systemslimited-in-islamabad/"
  
  return {
    title,
    description,
    keywords: [
      "Systems Limited Islamabad",
      "Systems Limited Islamabad office",
      "Systems Limited Pakistan",
      "software company Islamabad",
      "IT services Islamabad"
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
  return <CatchAllPageClient slug="systemslimited-in-islamabad" />
}
