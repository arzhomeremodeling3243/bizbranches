import { Suspense } from 'react'
import { Metadata } from 'next'
import RealEstateClient from './real-estate-client'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Real Estate Pakistan: Property and Housing Directory',
  description: 'Find top real estate agents and builders in Pakistan. Access verified contacts, office addresses, and listings. Contact property experts today.',
  keywords: 'Pakistan real estate, property directory Pakistan, real estate agents Pakistan, housing Pakistan, property dealers Pakistan, commercial property Pakistan, residential property Pakistan',
  alternates: {
    canonical: 'https://www.pakbizbranhces.online/real-estate/',
  },
}

export default function RealEstatePage() {
  return (
    <Suspense fallback={null}>
      <RealEstateClient />
    </Suspense>
  )
}
