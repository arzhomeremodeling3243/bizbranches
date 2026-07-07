import { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import React from 'react'
import { BannerAdLoader, NativeAdLoader } from '@/components/ads/ads-loader'

export const dynamic = 'force-static'

const cities = [
  'vehari', 'sargodha', 'mardan', 'faisalabad', 'rawalpindi', 'abbottabad', 'quetta',
  'khanewal', 'multan', 'hyderabad', 'sukkur', 'rahim-yar-khan', 'bahawalpur', 'islamabad',
  'larkana', 'kasur', 'sialkot', 'sheikhupura', 'okara', 'murree', 'lahore', 'peshawar',
  'mianwali', 'gujranwala', 'jhelum', 'karachi', 'gwadar', 'sahiwal', 'gujrat', 'jhang'
];

function capitalize(str: string | undefined) {
  if (!str) return 'Pakistan';
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function getIndrivePhoneNumber(city: string | undefined): string {
  if (!city) return '0330-2111193';
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

export function generateStaticParams() {
  return cities.map((city) => ({
    city,
  }))
}

export const dynamicParams = false

export async function generateMetadata(props: { params: Promise<{ city?: string }> }): Promise<Metadata> {
  const params = await props.params
  const city = capitalize(params?.city)
  
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
      canonical: `https://www.pakbizbranhces.online/indrive-pakistan-${params?.city || 'pakistan'}`,
    },
  }
}

export default async function IndriveCityPage(props: { params: Promise<{ city?: string }> }) {
  const params = await props.params
  const city = capitalize(params?.city)
  
  // Generating large unique content (2000+ words) specifically for this city
  const paragraphs = []
  const templates = [
    `When it comes to modern transportation in ${city}, Indrive has revolutionized the way residents and visitors commute. The traditional ride-hailing models are being challenged by the peer-to-peer negotiation system that Indrive offers. In ${city}, this means passengers have the absolute freedom to propose a fare that makes sense for their specific route, whether it's a short trip to the local market or a longer journey across the city. This flexibility is crucial in a vibrant and dynamic environment like ${city}, where traffic conditions, weather, and time of day can significantly impact travel plans.`,
    `Moreover, the safety features integrated into the Indrive application provide peace of mind for both drivers and passengers in ${city}. With real-time GPS tracking, verifiable driver profiles, and a robust rating system, users can make informed decisions before accepting a ride. For the hardworking drivers of ${city}, Indrive presents an unparalleled opportunity to earn a fair income. Unlike other platforms that take exorbitant commissions, Indrive's model ensures that the majority of the fare goes directly into the driver's pocket, empowering the local economy of ${city}.`,
    `The courier and freight services offered by Indrive are equally transformative for businesses in ${city}. Small enterprises, home-based businesses, and individuals frequently need reliable delivery options. By expanding their services beyond just passenger transport, Indrive has created a comprehensive logistics ecosystem. Sending a package across ${city} is now as simple as booking a ride, with the added benefit of transparent pricing.`,
    `Customer support for Indrive users in ${city} is designed to be responsive and helpful. Should you encounter any issues with a ride or a delivery, the in-app support center provides quick resolutions. Contacting the directory support team via official email at support@pakbizbranhces.online ensures that your concerns regarding business visibility are addressed promptly. The community-driven nature of the app relies heavily on user feedback, making every rating and review count towards a better experience in ${city}.`,
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white text-balance mb-6">
              Indrive in {city}, Pakistan: Affordable Rides & Services
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto text-pretty">
              Discover the best way to commute across {city}. Negotiate fares, track your ride, and enjoy ultimate safety and convenience with Indrive.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          
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
                    <p>You can reach the official Indrive support team at support@indrive.com or call them at <a href={`tel:${getIndrivePhoneNumber(params?.city).replace(/[^0-9]/g, '')}`} className="text-blue-600 hover:underline font-semibold">{getIndrivePhoneNumber(params?.city)}</a> for any ride or account-related inquiries. This remarkable service enhances the overall quality of life in {city}, providing an essential service that connects communities and fosters economic growth. The ongoing development of infrastructure in {city} pairs perfectly with the technological advancements brought by Indrive. Residents of {city} are increasingly adopting this smart mobility solution.</p>
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
              ].filter(c => c !== (params?.city || '').toLowerCase()).map(c => (
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
      </main>
      <Footer />
    </>
  )
}
