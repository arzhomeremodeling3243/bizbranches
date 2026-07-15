import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Allama Iqbal Town Branch Lahore - Phone & Address"
  const description = "Get verified details for UBL Allama Iqbal Town branch in Lahore, Pakistan. Find branch address at Noor-ul-Amin Road, contact phone, and ATM."
  const url = "https://www.pakbizbranhces.online/ubl-allama-iqbal-town-branch-lahore/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl allama iqbal town branch lahore",
      "UBL Lahore branch",
      "UBL helpline Lahore",
      "United Bank Limited Lahore",
      "UBL contact number Lahore"
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
  return <CatchAllPageClient slug="ubl-allama-iqbal-town-branch-lahore" />
}
