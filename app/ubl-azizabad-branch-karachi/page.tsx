import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Azizabad Branch Karachi - Phone & FB Area Address"
  const description = "Get verified details for UBL Azizabad Branch in Federal B Area, Karachi. Find branch address, contact phone number, and helpline info."
  const url = "https://www.pakbizbranhces.online/ubl-azizabad-branch-karachi/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl azizabad branch karachi",
      "UBL Karachi branch",
      "UBL helpline Karachi",
      "United Bank Limited Karachi",
      "UBL contact number Karachi"
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
  return <CatchAllPageClient slug="ubl-azizabad-branch-karachi" />
}
