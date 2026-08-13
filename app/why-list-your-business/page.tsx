import { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { 
  Search, 
  PhoneCall, 
  MessageCircle, 
  Globe, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { BannerAdLoader } from '@/components/ads/ads-loader'

export const metadata: Metadata = {
  title: 'Why List Your Business on PakBizBranches? Free Listing Benefits',
  description: 'Discover why Pakistani business owners list on PakBizBranches. Get discovered in your city, get direct phone calls & WhatsApp inquiries, and build local SEO for free.',
  keywords: 'why list business Pakistan, business directory benefits Pakistan, free business marketing Pakistan, local SEO Pakistan',
  alternates: {
    canonical: 'https://www.pakbizbranhces.online/why-list-your-business/',
  },
}

const benefits = [
  {
    icon: Search,
    title: '1. Get Discovered Locally',
    description: 'Appear at the top when customers in your city search for your exact category — from restaurants and clinics to real estate and software houses.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: PhoneCall,
    title: '2. Get Direct Phone Calls',
    description: 'Customers don\'t have to fill out annoying forms. They click one button to call your business phone directly.',
    color: 'bg-[#0f2b3d] text-white',
  },
  {
    icon: MessageCircle,
    title: '3. Get Instant WhatsApp Inquiries',
    description: 'Connect directly with Pakistani buyers on WhatsApp. One click starts a direct chat on your phone.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Globe,
    title: '4. Professional Online Presence',
    description: 'No website? No problem. Get a Google-friendly, professional web page displaying your address, services, photos, and operating hours.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: ShieldCheck,
    title: '5. 100% Free Forever',
    description: 'No hidden monthly fees, no trial periods, and no credit card required. Free listing for every legitimate Pakistani business.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: TrendingUp,
    title: '6. Boost Local Citation & SEO',
    description: 'A structured local citation on PakBizBranches strengthens your business credibility and improves your visibility across local online searches.',
    color: 'bg-emerald-50 text-emerald-600',
  },
]

export default function WhyListYourBusinessPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#f8fafc] min-h-screen">
        {/* Hero Section */}
        <section className="bg-[#0f2b3d] text-white py-20 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-[#60a5fa] text-xs font-semibold uppercase tracking-wider mb-6 border border-blue-400/30">
              <Sparkles className="w-4 h-4" /> Built for Pakistani Business Owners
            </span>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-balance leading-tight mb-6">
              Why Should You List Your Business on PakBizBranches?
            </h1>
            
            <p className="text-base sm:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-8 text-pretty">
              Stop losing local customers to competitors. Get your business found on Google and local searches across 150+ Pakistani cities in under 60 seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/add-business/"
                className="w-full sm:w-auto px-8 py-4 bg-[#60a5fa] hover:bg-blue-500 text-white font-bold rounded-xl text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Create Your Free Business Profile
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0f2b3d] mb-4">
              Everything Your Business Needs To Grow Online
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base">
              PakBizBranches gives you a complete digital storefront without spending thousands of rupees on custom web design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((item, index) => {
              const Icon = item.icon
              return (
                <div 
                  key={index}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-6`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0f2b3d] mb-3">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* What Your Profile Includes */}
        <section className="py-16 bg-white border-y border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-[#0f2b3d] mb-8">
              Your Free Profile Includes All These Features
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {[
                'Google-Friendly Structured Business Page',
                'Direct One-Click WhatsApp Chat Button',
                'Direct Click-to-Call Phone Button',
                'Business Location & Address Display',
                'Logo & Photos Upload Space',
                'Detailed List of Services Provided',
                'Opening Hours & Working Days',
                'Website & Social Media Page Links',
                'No Expiry — Profile Stays Live Forever',
                'Zero Monthly Fees or Hidden Charges',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 bg-[#f8fafc] p-4 rounded-xl border border-gray-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-sm font-semibold text-gray-800">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <Link
                href="/add-business/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#60a5fa] hover:bg-blue-500 text-white font-bold rounded-xl text-base transition-colors shadow-md"
              >
                Add Your Business Now (Takes under 60s)
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Banner Ad */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          <BannerAdLoader variant="inline" />
        </div>
      </main>
      <Footer />
    </>
  )
}
