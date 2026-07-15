import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL Diplomatic Enclave Branch Islamabad - Code 0010 Info"
  const description = "Get verified details for UBL Diplomatic Enclave branch (Branch Code 0010) in Islamabad, Pakistan. Find branch address, phone, and helpline."
  const url = "https://www.pakbizbranhces.online/ubl-diplomatic-enclave-branch-islamabad/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl diplomatic enclave branch islamabad",
      "UBL Islamabad branch",
      "UBL helpline Islamabad",
      "United Bank Limited Islamabad",
      "UBL contact number Islamabad",
      "UBL branch code 0010",
      "UBL 0010"
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
  return <CatchAllPageClient slug="ubl-diplomatic-enclave-branch-islamabad" />
}
