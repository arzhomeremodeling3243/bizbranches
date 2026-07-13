import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { BannerAdLoader, NativeAdLoader } from '@/components/ads/ads-loader'
import { Phone, MapPin, MessageCircle, ChevronRight } from 'lucide-react'
import { IndriveBoilerplateContent } from '@/lib/indrive-template'

function getIndrivePhoneNumber(city: string): string {
  const norm = city.toLowerCase().trim();
  switch (norm) {
    case 'multan':
      return '03207863233';
    case 'lahore':
      return '03024208549';
    case 'islamabad':
    case 'isalmabad':
      return '03302111193';
    case 'bahawalpur':
    case 'bahalwpur':
      return '03131013254';
    case 'faisalabad':
      return '0309-7602647';
    case 'gujrat':
      return '0313 2726210';
    case 'gujranwala':
    case 'gujrawanala':
      return '0309 5154411';
    case 'hyderabad':
      return '03175573185';
    case 'gwadar':
    case 'gawadar':
      return '03331635488';
    case 'karachi':
      return '0337 8031348';
    case 'vehari':
      return '0330-2111193';
    default:
      return '0330-2111193';
  }
}

export default function IndriveCityPage({ city }: { city: string }) {
  const phone = getIndrivePhoneNumber(city);
  const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}`;

  return (
    <>
      <Navbar />
      
      <main className="bg-[#f8fafc] min-h-screen">
        {/* Banner Ad top */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 -mb-4">
          <BannerAdLoader variant="inline" />
        </div>

        {/* Header Breadcrumb & Title Section */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-[#60a5fa] transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/logistics/" className="hover:text-[#60a5fa] transition-colors">Logistics</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-800 font-medium truncate">InDrive {city}</span>
            </nav>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="shrink-0">
                <div className="w-32 h-32 rounded-2xl bg-white flex items-center justify-center border border-gray-200 shadow-sm p-3">
                  <Image 
                    src="/indrive-logo.png" 
                    alt={`InDrive ${city} Logo`} 
                    width={120} 
                    height={120} 
                    className="w-auto h-16 object-contain" 
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl md:text-4xl font-bold text-[#0f2b3d] mb-2">InDrive {city}</h1>
                <div className="flex flex-wrap items-center gap-3 text-gray-500 mb-6">
                  <Link href="/logistics/" className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-[#60a5fa] rounded-full text-sm font-medium hover:bg-blue-100 transition-colors">
                    Logistics
                  </Link>
                  <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                    <MapPin className="w-3.5 h-3.5 text-gray-500" />
                    {city}
                  </span>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  Official inDrive {city} office, contact details, driver registration guides, and passenger helpline.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href={`tel:${phone.replace(/[^0-9]/g, '')}`} className="inline-flex items-center gap-2 px-6 py-3 bg-[#0f2b3d] text-white rounded-xl font-semibold hover:bg-[#1a3f57] transition-colors shadow-sm cursor-pointer">
                    <Phone className="w-4 h-4" /> Call Now
                  </a>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-sm cursor-pointer">
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2-Column Content Grid */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column - Main Details */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* About Card (Boilerplate Template) */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 prose prose-blue max-w-none">
                  <h2 className="text-2xl font-bold text-[#0f2b3d] mb-6">About InDrive {city}</h2>
                  <IndriveBoilerplateContent city={city} />
                </div>

                {/* Native Ad Loader */}
                <div className="py-2">
                  <NativeAdLoader />
                </div>

                {/* FAQ Card */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
                  <h2 className="text-2xl font-bold text-[#0f2b3d]">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-1.5">Where is inDrive {city} office located?</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        The official inDrive service operates across {city}, Pakistan. You can access driver registration, verify documents, and view map directions for helpline setups in the business directory details.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-1.5">What is the contact phone number for inDrive {city}?</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        You can contact support or local coordination for inDrive {city} at <a href={`tel:${phone.replace(/[^0-9]/g, '')}`} className="text-blue-600 hover:underline">{phone}</a>.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-1.5">How to register as an inDrive driver in {city}?</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Download the app, switch to "Driver Mode", select "Online Registration", and upload your CNIC, Driving License, and vehicle documents.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Other Cities Links */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-[#0f2b3d] mb-6">InDrive Services in Other Cities</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 text-sm">
                    {[
                      'karachi', 'lahore', 'islamabad', 'rawalpindi', 'faisalabad', 'multan', 'peshawar', 'quetta',
                      'gujranwala', 'sialkot', 'hyderabad', 'bahawalpur', 'sargodha', 'sukkur', 'gujrat', 'gwadar',
                      'vehari', 'abbottabad', 'mardan', 'khanewal', 'larkana', 'kasur', 'sheikhupura', 'okara',
                      'murree', 'mianwali', 'jhelum', 'sahiwal', 'jhang', 'rahim-yar-khan'
                    ].filter(c => c !== city.toLowerCase()).map(c => (
                      <a
                        key={c}
                        href={`/indrive-pakistan-${c}/`}
                        className="text-blue-600 hover:underline capitalize"
                      >
                        Indrive {c.replace(/-/g, ' ')}
                      </a>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                
                {/* Location Map Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-[#0f2b3d] mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#60a5fa]" /> Location
                  </h3>
                  <div className="rounded-xl overflow-hidden mb-4 border border-gray-100">
                    <iframe 
                      src={`https://maps.google.com/maps?q=inDrive+${city},+Pakistan&t=&z=12&ie=UTF8&iwloc=&output=embed`} 
                      width="100%" 
                      height="200" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      title={`Map Location of inDrive ${city}`} 
                    />
                  </div>
                  <p className="text-sm text-gray-600">{city}, Pakistan</p>
                </div>

                {/* Business Hours Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-[#0f2b3d] mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 text-[#60a5fa] flex items-center justify-center">🕒</span> Business Hours
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between border-b border-gray-50 pb-1">
                      <span>Monday – Friday:</span>
                      <span className="font-medium text-gray-900">09:00 AM – 06:00 PM</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-1">
                      <span>Saturday:</span>
                      <span className="font-medium text-gray-900">09:00 AM – 02:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday:</span>
                      <span className="font-semibold text-red-600">Closed</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 italic">* Timing may vary. Please call to confirm.</p>
                  </div>
                </div>

                {/* Claim Listing Card */}
                <div className="bg-[#0f2b3d] rounded-2xl p-6 text-white">
                  <h3 className="font-bold mb-2">Claim this listing?</h3>
                  <p className="text-sm text-white/70 mb-4">Is this your business? Contact us to verify and enhance your listing.</p>
                  <Link href="/contact" className="block text-center py-2.5 bg-[#60a5fa] text-white rounded-xl text-sm font-bold hover:bg-blue-400 transition-colors">
                    Contact Support
                  </Link>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* Banner Ad bottom */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <BannerAdLoader variant="inline" />
        </div>
      </main>

      <Footer />
    </>
  )
}
