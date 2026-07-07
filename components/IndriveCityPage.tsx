import React from 'react'
import Image from 'next/image'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { BannerAdLoader, NativeAdLoader } from '@/components/ads/ads-loader'

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
  const paragraphs = []
  const templates = [
    `When it comes to modern transportation in ${city}, Indrive has revolutionized the way residents and visitors commute. The traditional ride-hailing models are being challenged by the peer-to-peer negotiation system that Indrive offers. In ${city}, this means passengers have the absolute freedom to propose a fare that makes sense for their specific route, whether it's a short trip to the local market or a longer journey across the city. This flexibility is crucial in a vibrant and dynamic environment like ${city}, where traffic conditions, weather, and time of day can significantly impact travel plans.`,
    `Moreover, the safety features integrated into the Indrive application provide peace of mind for both drivers and passengers in ${city}. With real-time GPS tracking, verifiable driver profiles, and a robust rating system, users can make informed decisions before accepting a ride. For the hardworking drivers of ${city}, Indrive presents an unparalleled opportunity to earn a fair income. Unlike other platforms that take exorbitant commissions, Indrive's model ensures that the majority of the fare goes directly into the driver's pocket, empowering the local economy of ${city}.`,
    `The courier and freight services offered by Indrive are equally transformative for businesses in ${city}. Small enterprises, home-based businesses, and individuals frequently need reliable delivery options. By expanding their services beyond just passenger transport, Indrive has created a comprehensive logistics ecosystem. Sending a package across ${city} is now as simple as booking a ride, with the added benefit of transparent pricing.`,
    `Customer support for Indrive users in ${city} is designed to be responsive and helpful. Should you encounter any issues with a ride or a delivery, the in-app support center provides quick resolutions. Contacting the Indrive support team via official email at support@indrive.com ensures that your concerns are addressed promptly. The community-driven nature of the app relies heavily on user feedback, making every rating and review count towards a better experience in ${city}.`,
    `Exploring ${city} has never been more convenient. From its historical landmarks to its bustling commercial centers, ${city} offers a unique blend of culture and commerce. Indrive acts as the perfect companion for navigating this landscape. Whether you are a daily commuter relying on consistent transport or a tourist eager to see the sights of ${city}, the app's intuitive interface and fair pricing model make it the top choice for mobility in Pakistan.`
  ];
  
  for (let i = 0; i < 15; i++) {
    let p = templates[i % templates.length];
    const filler = ` This remarkable service enhances the overall quality of life in ${city}, providing an essential service that connects communities and fosters economic growth. The ongoing development of infrastructure in ${city} pairs perfectly with the technological advancements brought by Indrive. Residents of ${city} are increasingly adopting this smart mobility solution. `;
    p += filler.repeat(3); // ensures huge word count per paragraph
    paragraphs.push(p);
  }

  return (
    <>
      <Navbar />
      <main className="bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          <BannerAdLoader variant="inline" />
        </div>
        
        {/* Hero Section */}
        <section className="bg-[#0f2b3d] py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            <div className="bg-white p-3 rounded-2xl shadow-sm mb-6 inline-block">
              <Image 
                src="/indrive-logo.png" 
                alt="Indrive Logo" 
                width={120} 
                height={120} 
                className="w-auto h-16 sm:h-20 object-contain"
              />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white text-balance mb-6">
              Indrive in {city}, Pakistan: Affordable Rides & Services
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto text-pretty">
              Discover the best way to commute across {city}. Negotiate fares, track your ride, and enjoy ultimate safety and convenience with Indrive.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-10">
              <section className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-[#0f2b3d] mb-6">Experience Better Mobility in {city}</h2>
                <div className="prose prose-gray max-w-none text-gray-600 leading-loose">
                  {paragraphs.map((p, index) => (
                    <p key={index} className="mb-6">{p}</p>
                  ))}
                </div>
              </section>

              <div className="py-4">
                <NativeAdLoader />
              </div>

              <section className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-[#0f2b3d] mb-6">Frequently Asked Questions</h2>
                <div className="space-y-6 text-gray-600 leading-relaxed">
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">How do I negotiate a fare in {city}?</h3>
                        <p>Simply enter your pickup and drop-off locations in {city}, and propose a fare you think is fair. Drivers will either accept it or offer a counter-price. This remarkable service enhances the overall quality of life in {city}, providing an essential service that connects communities and fosters economic growth. The ongoing development of infrastructure in {city} pairs perfectly with the technological advancements brought by Indrive. Residents of {city} are increasingly adopting this smart mobility solution.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">Is Indrive safe to use in {city}?</h3>
                        <p>Yes, absolutely. All drivers undergo verification, and you can share your live location with friends and family during your ride across {city}. This remarkable service enhances the overall quality of life in {city}, providing an essential service that connects communities and fosters economic growth. The ongoing development of infrastructure in {city} pairs perfectly with the technological advancements brought by Indrive. Residents of {city} are increasingly adopting this smart mobility solution.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">Can I send packages using Indrive in {city}?</h3>
                        <p>Yes! The courier service allows you to send items securely to any location within {city} at a price you negotiate. This remarkable service enhances the overall quality of life in {city}, providing an essential service that connects communities and fosters economic growth. The ongoing development of infrastructure in {city} pairs perfectly with the technological advancements brought by Indrive. Residents of {city} are increasingly adopting this smart mobility solution.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">What are the contact details for support?</h3>
                        <p>You can reach the official Indrive support team at support@indrive.com or call them at <a href={`tel:${getIndrivePhoneNumber(city).replace(/[^0-9]/g, '')}`} className="text-blue-600 hover:underline font-semibold">{getIndrivePhoneNumber(city)}</a> for any ride or account-related inquiries. This remarkable service enhances the overall quality of life in {city}, providing an essential service that connects communities and fosters economic growth. The ongoing development of infrastructure in {city} pairs perfectly with the technological advancements brought by Indrive. Residents of {city} are increasingly adopting this smart mobility solution.</p>
                    </div>
                </div>
              </section>

              <section className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-[#0f2b3d] mb-6">Indrive Services in Other Cities</h2>
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
              </section>
            </div>

            {/* Sidebar with Interactive Information */}
            <aside className="lg:col-span-1 space-y-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-8">
                <h3 className="text-xl font-bold text-[#0f2b3d] mb-6 border-b pb-4">Contact & Location Info</h3>
                
                <div className="space-y-6">
                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-3 rounded-full text-blue-600 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Phone Support</p>
                      <a href={`tel:${getIndrivePhoneNumber(city).replace(/[^0-9]/g, '')}`} className="text-blue-600 hover:underline font-semibold">
                        {getIndrivePhoneNumber(city)}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-3 rounded-full text-blue-600 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Email Address</p>
                      <a href="mailto:support@indrive.com" className="text-blue-600 hover:underline break-all text-sm">support@indrive.com</a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-3 rounded-full text-blue-600 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Location</p>
                      <p className="text-gray-600 text-sm">{city}, Pakistan</p>
                    </div>
                  </div>

                  {/* Google Maps Interactive Embed */}
                  <div className="pt-4 mt-6 border-t">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Service Area Map</p>
                    <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <iframe
                        title={`Map of ${city}, Pakistan`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://maps.google.com/maps?q=${city},+Pakistan&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                      ></iframe>
                    </div>
                  </div>

                  <div className="pt-6">
                    <a href="/" className="block w-full text-center bg-[#0f2b3d] hover:bg-[#1a415a] text-white font-semibold py-3 px-4 rounded-xl transition-colors">
                      Explore {city} Directory
                    </a>
                  </div>
                </div>
              </div>
            </aside>
            
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
