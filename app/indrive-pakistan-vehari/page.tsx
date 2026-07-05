import { Metadata } from 'next'
import IndriveCityPage from '@/components/IndriveCityPage'
import React from 'react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const city = "Vehari"
  const base = `Indrive ${city} Pakistan: Affordable `
  let title = ''
  if (base.length + 8 >= 52 && base.length + 8 <= 58) title = base + "Services"
  else if (base.length + 5 >= 52 && base.length + 5 <= 58) title = base + "Rides"
  else if (base.length + 9 >= 52 && base.length + 9 <= 58) title = base + "Transport"
  else {
    title = `Indrive ${city}: Book Safe Rides`
    while (title.length < 52) title += " Now"
    if (title.length > 58) title = title.substring(0, 58).trim()
    if (title.length < 52) {
      title = `Indrive ${city} PK: Affordable Rides & Cabs`
      if (title.length > 58) title = title.substring(0, 58).trim()
    }
    if(title.length < 52) {
      title = `Indrive ${city} Pakistan: Best Ride Service`
    }
    if (title.length < 52) title = title.padEnd(52, '!')
    if (title.length > 58) title = title.substring(0, 58)
  }

  let description = `Discover Indrive in ${city}, Pakistan. Negotiate fares, book safe rides, and access affordable courier services. Join the community today and save!`
  if (description.length > 145) description = description.substring(0, 142) + '...'
  while (description.length < 125) {
      description += ' Book your ride now.'
  }
  if (description.length > 145) description = description.substring(0, 145)

  return {
    title,
    description,
    keywords: [`Indrive ${city}`, `ride-hailing ${city}`, `cheap taxi ${city}`, `Indrive Pakistan`, `${city} transport`, `courier ${city}`],
    alternates: {
      canonical: `https://www.pakbizbranhces.online/indrive-pakistan-vehari`,
    },
  }
}

export default function Page() {
  return <IndriveCityPage city="Vehari" />
}
