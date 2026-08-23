import { Suspense } from 'react'
import { Metadata } from 'next'
import CitiesClient from './cities-client'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Pakistani Cities Business Directory: Browse by City & Region',
  description:
    'Browse verified local businesses across 150+ cities in Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Peshawar, and Multan on PakBizBranches.',
  keywords: [
    'Pakistan cities business directory',
    'find businesses by city Pakistan',
    'Karachi local businesses',
    'Lahore business directory',
    'Islamabad verified companies',
    'Rawalpindi services directory',
    'Faisalabad industrial businesses',
    'Multan local shops',
    'Peshawar company listings',
    'Quetta business directory',
    'Gwadar commercial companies',
  ],
  alternates: {
    canonical: 'https://www.pakbizbranhces.online/cities/',
  },
  openGraph: {
    title: 'Pakistani Cities Business Directory: Browse by City & Region',
    description:
      'Browse verified local businesses across 150+ cities in Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Peshawar, and Multan.',
    url: 'https://www.pakbizbranhces.online/cities/',
    type: 'website',
  },
}

export default function CitiesPage() {
  return (
    <Suspense fallback={null}>
      <CitiesClient />
    </Suspense>
  )
}
