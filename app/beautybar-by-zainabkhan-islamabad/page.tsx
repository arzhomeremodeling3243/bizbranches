import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "BeautyBar by Zainabkhan - Islamabad | Phone & Address"
  const description = "Get verified details for BeautyBar by Zainabkhan in Islamabad, Pakistan. Find phone number, office address, and WhatsApp contact."
  const url = "https://www.pakbizbranhces.online/beautybar-by-zainabkhan-islamabad/"
  
  return {
    title,
    description,
    keywords: [
      "BeautyBar by Zainabkhan",
      "BeautyBar by Zainabkhan Islamabad",
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
  return <CatchAllPageClient slug="beautybar-by-zainabkhan-islamabad" />
}
