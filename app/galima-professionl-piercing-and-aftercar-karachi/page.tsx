import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "GALIMA PROFESSIONL PIERCING AND AFTERCAR - Karachi Office "
  const description = "Get verified details for GALIMA PROFESSIONL PIERCING AND AFTERCAR in Karachi, Pakistan. Find phone number, office address, and WhatsApp contact."
  const url = "https://www.pakbizbranhces.online/galima-professionl-piercing-and-aftercar-karachi/"
  
  return {
    title,
    description,
    keywords: [
      "GALIMA PROFESSIONL PIERCING AND AFTERCAR",
      "GALIMA PROFESSIONL PIERCING AND AFTERCAR Karachi",
      "software company Karachi",
      "verified business Karachi"
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
  return <CatchAllPageClient slug="galima-professionl-piercing-and-aftercar-karachi" />
}
