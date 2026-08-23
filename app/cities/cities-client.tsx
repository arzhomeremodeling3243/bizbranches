'use client'

import { useState, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { Search, MapPin, Building2, ArrowRight, Compass, ShieldCheck } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { CITIES, TOP_CITIES } from '@/lib/data'
import { CITY_INFO } from '@/lib/seo-content'
import { BannerAdLoader, NativeAdLoader } from '@/components/ads/ads-loader'

// Categorized regions for rich browsing
const PROVINCE_GROUPS = [
  {
    name: 'Top Metropolitan Hubs',
    description: 'Major economic, business, and industrial centers of Pakistan',
    cities: TOP_CITIES,
  },
  {
    name: 'Federal Capital',
    description: 'Federal capital territory and adjacent commercial sectors',
    cities: ['Islamabad'],
  },
  {
    name: 'Punjab',
    description: 'Industrial hubs, agricultural centers, and commercial districts across Punjab',
    cities: [
      'Lahore', 'Rawalpindi', 'Faisalabad', 'Multan', 'Gujranwala', 'Sialkot',
      'Sargodha', 'Bahawalpur', 'Sahiwal', 'Gujrat', 'Sheikhupura', 'Jhang',
      'Bahawalnagar', 'Sadiqabad', 'Kasur', 'Okara', 'Rahim Yar Khan', 'Mianwali',
      'Vehari', 'Khanewal', 'Mandi Bahauddin', 'Toba Tek Singh', 'Jhelum', 'Bhalwal',
      'Daska', 'Burewala', 'Hafizabad', 'Chiniot', 'Kamoke', 'Pattoki',
      'Jaranwala', 'Kamalia', 'Renala Khurd', 'Samundri', 'Wazirabad',
      'Murree', 'Mian Channu', 'Bhakkar', 'Lalamusa', 'Shakargarh', 'Layyah',
      'Dinga', 'Pakpattan', 'Arifwala', 'Baddomalhi', 'Gojra', 'Ahmedpur East',
      'Chichawatni', 'Chishtian', 'Mailsi', 'Haroonabad', 'Hasilpur', 'Bhera',
      'Chakwal', 'Attock', 'Fateh Jang', 'Pindigheb', 'Jand', 'Wah Cantonment',
      'Taxila', 'Hazro', 'Hassan Abdal', 'Sarai Alamgir', 'Dina', 'Sohawa',
      'Kallar Syedan', 'Gujar Khan', 'Kahuta',
    ],
  },
  {
    name: 'Sindh',
    description: 'Port cities, financial districts, and trade centers throughout Sindh',
    cities: [
      'Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Khairpur',
      'Mirpur Khas', 'Ghotki', 'Jacobabad', 'Shikarpur', 'Dadu', 'Moro',
      'Tando Adam', 'Tando Allahyar', 'Tando Muhammad Khan', 'Matli', 'Kotri',
      'Sehwan', 'Gambat', 'Kandhkot', 'Kashmor', 'Mehar', 'Shujabad', 'Warah',
    ],
  },
  {
    name: 'Khyber Pakhtunkhwa (KPK)',
    description: 'Commercial corridors, valley trade hubs, and business centers',
    cities: [
      'Peshawar', 'Abbottabad', 'Mardan', 'Swabi', 'Kohat', 'Lakki Marwat',
      'Bannu', 'Karak', 'Tank', 'Hangu', 'Dera Ismail Khan', 'Mansehra',
      'Haripur', 'Havelian', 'Batkhela', 'Nowshera', 'Charsadda', 'Timergara',
      'Mingora', 'Saidu Sharif', 'Kabal', 'Chitral',
    ],
  },
  {
    name: 'Balochistan',
    description: 'Deep-sea ports, border trade hubs, and provincial commercial centers',
    cities: [
      'Quetta', 'Gwadar', 'Turbat', 'Pasni', 'Ormara', 'Jiwani', 'Khuzdar',
      'Hub', 'Uthal', 'Belapat', 'Wadh', 'Nushki', 'Dalbandin', 'Taftan',
      'Ziarat', 'Sibi', 'Harnai', 'Kohlu', 'Duki', 'Barkhan', 'Loralai',
      'Mach', 'Bolan', 'Dera Bugti', 'Dera Murad Jamali', 'Sui', 'Pir Koh',
      'Usta Muhammad', 'Gandakha', 'Jhal Magsi', 'Kachhi', 'Sohbatpur',
      'Chaman', 'Zhob', 'Mastung', 'Kalat',
    ],
  },
  {
    name: 'Gilgit-Baltistan & Azad Kashmir',
    description: 'Tourism hotspots, cross-border corridors, and regional commercial markets',
    cities: [
      'Gilgit', 'Skardu', 'Hunza', 'Nagar', 'Diamer', 'Astore', 'Ghanche',
      'Kharmang', 'Shigar', 'Baltistan', 'Roundu', 'Ghizer', 'Gakuch',
      'Khaplu', 'Muzaffarabad', 'Mirpur', 'Rawalakot', 'Kotli', 'Bhimber',
      'Hattian Bala', 'Haveli', 'Bagh', 'Sudhanoti', 'Poonch', 'Neelum Valley',
      'Athmuqam', 'Jhelum Valley', 'Leepa Valley', 'Pallandri', 'Trarkhel',
      'Hajira', 'Sehnsa',
    ],
  },
]

function getCitySlug(city: string): string {
  return city.toLowerCase().replace(/\s+/g, '-')
}

function CitiesContent() {
  const [queryText, setQueryText] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All')

  const filteredCities = useMemo(() => {
    let result = CITIES
    if (queryText.trim()) {
      const q = queryText.toLowerCase()
      result = result.filter(c => c.toLowerCase().includes(q))
    }
    return result
  }, [queryText])

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.pakbizbranhces.online/' },
      { '@type': 'ListItem', position: 2, name: 'Cities', item: 'https://www.pakbizbranhces.online/cities/' },
    ],
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Pakistani Cities Business Directory',
    description: 'Directory of verified local businesses, phone numbers, addresses, and maps across 150+ cities in Pakistan.',
    url: 'https://www.pakbizbranhces.online/cities/',
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Hero Header */}
      <section className="bg-[#0f2b3d] py-14 md:py-20 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-blue-200 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white font-medium">Cities</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance">
            Find Local Businesses by City in Pakistan
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-3xl leading-relaxed">
            Explore verified local company contacts, addresses, phone numbers, and WhatsApp details across 150+ Pakistani cities. Select your city to browse top local service sectors and registered businesses.
          </p>

          {/* Search Filter Bar */}
          <div className="mt-8 max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20">
            <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 text-gray-800 shadow-sm">
              <Search className="w-5 h-5 text-gray-400 shrink-0" aria-hidden="true" />
              <input
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Search any Pakistani city (e.g., Karachi, Lahore, Gwadar)..."
                className="w-full text-sm sm:text-base outline-none bg-transparent placeholder-gray-400"
                aria-label="Search Pakistani cities"
              />
              {queryText && (
                <button
                  onClick={() => setQueryText('')}
                  className="text-xs text-gray-400 hover:text-gray-600 font-bold px-2 py-1 bg-gray-100 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Popular Cities Quick Links */}
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <span className="text-white/60 font-medium">Major Cities:</span>
            {TOP_CITIES.slice(0, 8).map(cityName => (
              <Link
                key={cityName}
                href={`/${getCitySlug(cityName)}/`}
                className="bg-white/10 hover:bg-white/25 text-white px-3 py-1 rounded-full border border-white/15 transition-colors"
              >
                {cityName}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <section className="py-12 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Quick Filter Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-[#0f2b3d]">
                {queryText ? `Search Results for "${queryText}"` : 'Browse Pakistani Cities'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Showing {filteredCities.length} {filteredCities.length === 1 ? 'city' : 'cities'} with verified business listings
              </p>
            </div>

            {!queryText && (
              <div className="flex flex-wrap gap-1.5">
                {['All', 'Punjab', 'Sindh', 'KPK', 'Balochistan', 'Federal / GB / AJK'].map(reg => (
                  <button
                    key={reg}
                    onClick={() => setSelectedRegion(reg)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                      selectedRegion === reg
                        ? 'bg-[#0f2b3d] text-white shadow-sm'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* If Search Query Active */}
          {queryText ? (
            filteredCities.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm max-w-lg mx-auto my-8">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-800">No matching city found</h3>
                <p className="text-sm text-gray-500 mt-2">
                  We currently list businesses in 150+ verified Pakistani cities. Try searching another city name or explore all regions.
                </p>
                <button
                  onClick={() => setQueryText('')}
                  className="mt-6 px-5 py-2.5 bg-[#60a5fa] hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  View All 150+ Cities
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredCities.map(cityName => {
                  const citySlug = getCitySlug(cityName)
                  const info = CITY_INFO[cityName]
                  return (
                    <Link
                      key={cityName}
                      href={`/${citySlug}/`}
                      className="group bg-white rounded-xl p-5 border border-gray-200 hover:border-[#60a5fa] hover:shadow-md transition-all duration-200 flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-[#60a5fa] transition-colors">
                          {cityName}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {info?.province || 'Pakistan'} • Local Directory
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#60a5fa] group-hover:translate-x-1 transition-all" />
                    </Link>
                  )
                })}
              </div>
            )
          ) : (
            // Grouped by Province / Region
            <div className="space-y-12">
              {PROVINCE_GROUPS.filter(g => {
                if (selectedRegion === 'All') return true
                if (selectedRegion === 'Punjab') return g.name === 'Punjab' || g.name === 'Top Metropolitan Hubs'
                if (selectedRegion === 'Sindh') return g.name === 'Sindh'
                if (selectedRegion === 'KPK') return g.name === 'Khyber Pakhtunkhwa (KPK)'
                if (selectedRegion === 'Balochistan') return g.name === 'Balochistan'
                if (selectedRegion === 'Federal / GB / AJK') return g.name === 'Federal Capital' || g.name === 'Gilgit-Baltistan & Azad Kashmir'
                return true
              }).map(group => (
                <div key={group.name} className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Compass className="w-5 h-5 text-[#60a5fa]" />
                    <h3 className="text-xl font-bold text-[#0f2b3d]">{group.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-6">{group.description}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {group.cities.map(cityName => {
                      const citySlug = getCitySlug(cityName)
                      return (
                        <Link
                          key={cityName}
                          href={`/${citySlug}/`}
                          className="group p-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all flex items-center justify-between text-sm"
                        >
                          <span className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                            {cityName}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Ad Slot */}
          <div className="my-10">
            <NativeAdLoader />
          </div>

          {/* Value Props & CTA */}
          <div className="bg-gradient-to-br from-[#0f2b3d] to-[#1e40af] rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-blue-200 mb-4 border border-white/20">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Free Local Business Registration
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-balance">
                Is Your Business Listed in Your City?
              </h2>
              <p className="mt-3 text-white/80 text-sm sm:text-base leading-relaxed">
                Connect with thousands of buyers searching for local shops, restaurants, doctors, lawyers, and services in your hometown. Listing takes under 3 minutes and is 100% free.
              </p>
            </div>
            <Link
              href="/add-business/"
              className="shrink-0 px-8 py-4 bg-[#60a5fa] hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-center"
            >
              Add Your Business Free →
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-gray-50">
        <BannerAdLoader variant="inline" />
      </div>
    </main>
  )
}

export default function CitiesClient() {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 -mb-6 bg-gray-50">
        <BannerAdLoader variant="inline" />
      </div>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading cities...</div>}>
        <CitiesContent />
      </Suspense>
      <Footer />
    </>
  )
}
