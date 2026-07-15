import { Metadata } from 'next'
import CatchAllPageClient from '@/app/[city]/catch-all-page-client'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const title = "UBL PWD Colony Branch Islamabad - Code 0749 Details PK"
  const description = "Get verified details for UBL PWD Colony branch (Branch Code 0749) in Islamabad, Pakistan. Find branch address, contact phone, and helpline."
  const url = "https://www.pakbizbranhces.online/ubl-pwd-colony-branch-islamabad/"
  
  return {
    title,
    description,
    keywords: [
      "United Bank Limited ubl pwd colony branch islamabad",
      "UBL Islamabad branch",
      "UBL helpline Islamabad",
      "United Bank Limited Islamabad",
      "UBL contact number Islamabad",
      "UBL branch code 0749",
      "UBL 0749"
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
  return <CatchAllPageClient slug="ubl-pwd-colony-branch-islamabad" />
}
