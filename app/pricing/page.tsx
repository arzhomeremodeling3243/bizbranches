import { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import Link from 'next/link'
import { Check, Landmark, Smartphone, HelpCircle, Building2 } from 'lucide-react'
import { BannerAdLoader, NativeAdLoader } from '@/components/ads/ads-loader'

export const metadata: Metadata = {
  title: 'Pricing Plans - PakBizBranches Local Directory',
  description: 'Choose the right setup & indexing plan for your business listing. Select from Standard, Express, or our popular SEO Authority plan.',
  keywords: 'pricing plans, directory placement, Google indexing, business directory setup, SEO authority plan, cheap business promotion Pakistan',
  alternates: {
    canonical: 'https://www.pakbizbranhces.online/pricing/',
  },
}

const plans = [
  {
    name: 'Standard Setup',
    price: '10',
    description: 'Perfect for small business owners seeking basic local presence.',
    features: [
      'Business page created within 24 hours',
      'Standard directory listing placement',
      'Live Google index request submission',
      'Basic listing details (Phone, Address, Map)',
      'Direct WhatsApp chat contact link'
    ],
    popular: false,
    color: 'bg-slate-50 border-slate-200 text-slate-900',
    buttonColor: 'bg-slate-800 hover:bg-slate-900 text-white'
  },
  {
    name: 'Express Setup',
    price: '20',
    description: 'Designed for fast onboarding and immediate lead generation.',
    features: [
      'Business page created within 3 hours',
      'Featured placement on directory homepage',
      'Guaranteed Google search index request',
      'Priority manual verification check',
      'Dedicated WhatsApp customer support'
    ],
    popular: false,
    color: 'bg-white border-slate-200 text-slate-900',
    buttonColor: 'bg-blue-600 hover:bg-blue-700 text-white'
  },
  {
    name: 'SEO Authority Plan',
    price: '50',
    description: 'Our most comprehensive plan for high search ranking dominance.',
    features: [
      '3000+ words unique SEO content created for your page',
      'Standard custom meta title & meta description set',
      '5+ high-quality backlinks built for your listing page',
      'Guaranteed Google indexing within 48 hours',
      'Lifetime premium priority support',
      'Full digital presence fields (Social links, website, email)'
    ],
    popular: true,
    color: 'bg-gradient-to-br from-amber-50 to-orange-50 border-orange-300 shadow-md ring-2 ring-orange-400',
    buttonColor: 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white'
  }
]

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#f8fafc] min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 -mb-6">
          <BannerAdLoader variant="inline" />
        </div>

        {/* Hero */}
        <section className="py-20 text-center" aria-labelledby="pricing-heading">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="px-3 py-1 text-[11px] font-bold tracking-wider text-blue-600 bg-blue-100 rounded-full uppercase">Simple & Fair Pricing</span>
            <h1 id="pricing-heading" className="text-4xl md:text-5xl font-black text-[#0f2b3d] mt-3 leading-tight">
              Flexible Setup & Indexing Plans
            </h1>
            <p className="mt-4 text-gray-600 text-lg leading-relaxed">
              Start promoting your business locally in Pakistan. Choose a setup plan that fits your growth targets. No monthly subscriptions, just a tiny one-time setup fee.
            </p>
          </div>
        </section>

        {/* Pricing Cards Grid */}
        <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan) => (
              <div 
                key={plan.name} 
                className={`relative flex flex-col rounded-3xl p-8 border-2 transition-all hover:scale-[1.02] ${plan.color}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-md">
                    Popular & Famous
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-xl font-extrabold text-slate-800">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mt-2 min-h-8">{plan.description}</p>
                  <div className="mt-4 flex items-baseline text-slate-900">
                    <span className="text-lg font-bold">₨</span>
                    <span className="text-5xl font-black tracking-tight">{plan.price}</span>
                    <span className="text-slate-500 text-sm ml-1">/ one-time setup</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <span className="text-slate-600 text-sm leading-tight font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/add-business/"
                  className={`w-full py-4 rounded-2xl font-bold text-center block transition-all shadow-sm ${plan.buttonColor}`}
                >
                  Get Started Now
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Ad slot between pricing and payment verification */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NativeAdLoader />
        </div>

        {/* Payment Account Details Section */}
        <section className="bg-white border-t border-b border-slate-200/60 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-[#0f2b3d] text-center mb-4">Payment Verification Guide</h2>
            <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto text-sm sm:text-base">
              Send the matching setup fee using Easypaisa, JazzCash, or Mashreq Bank to the verified accounts below. After sending, submit your transaction screenshot on the checkout page to initiate setup.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Easypaisa */}
              <div className="bg-emerald-50/40 border border-emerald-100 rounded-3xl p-6 flex flex-col gap-4 text-left">
                <div className="flex justify-between items-center border-b border-emerald-100/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-6 h-6 text-emerald-600" />
                    <span className="font-extrabold text-emerald-800 text-base">Easypaisa</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wider">
                    Instant
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Account Number</span>
                    <span className="font-mono font-bold text-slate-800">03402885226</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Account Owner</span>
                    <span className="font-bold text-slate-800">Muhammad Habib Ullah</span>
                  </div>
                </div>
              </div>

              {/* JazzCash */}
              <div className="bg-red-50/40 border border-red-100 rounded-3xl p-6 flex flex-col gap-4 text-left">
                <div className="flex justify-between items-center border-b border-red-100/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-6 h-6 text-red-600" />
                    <span className="font-extrabold text-red-800 text-base">JazzCash</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] bg-red-100 text-red-800 font-bold uppercase tracking-wider">
                    Instant
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Account Number</span>
                    <span className="font-mono font-bold text-slate-800">03019316123</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Account Owner</span>
                    <span className="font-bold text-slate-800">Muhammad Imran</span>
                  </div>
                </div>
              </div>

              {/* Mashreq Bank */}
              <div className="bg-orange-50/40 border border-orange-100 rounded-3xl p-6 flex flex-col gap-4 text-left">
                <div className="flex justify-between items-center border-b border-orange-100/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-orange-600" />
                    <span className="font-extrabold text-orange-800 text-base">Mashreq Bank</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] bg-orange-100 text-orange-800 font-bold uppercase tracking-wider">
                    Instant
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Account Number</span>
                    <span className="font-mono font-bold text-slate-800">089200179683</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Account Owner</span>
                    <span className="font-bold text-slate-800">Muhammad Imran</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing FAQs Section */}
        <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-[#0f2b3d] text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm text-left">
              <h4 className="font-extrabold text-slate-800 mb-2 flex items-center gap-2 text-base">
                <HelpCircle className="w-5 h-5 text-blue-500 shrink-0" />
                Is this a recurring fee?
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed pl-7">
                No, this is a one-time setup charge. Your business listing is free to edit, remains live indefinitely, and has no recurring monthly or annual costs.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm text-left">
              <h4 className="font-extrabold text-slate-800 mb-2 flex items-center gap-2 text-base">
                <HelpCircle className="w-5 h-5 text-blue-500 shrink-0" />
                What is the SEO Authority Plan?
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed pl-7">
                The SEO Authority Plan is our premium offering. Simply submit your basic details and we will write a high-converting, professional description of over 3000 words for your page. We also configure customized meta title/description tags and generate 5+ backlinks to help your page rank higher on Google search results immediately.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm text-left">
              <h4 className="font-extrabold text-slate-800 mb-2 flex items-center gap-2 text-base">
                <HelpCircle className="w-5 h-5 text-blue-500 shrink-0" />
                How does the guaranteed indexing work?
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed pl-7">
                We submit your canonical page URL directly to search engines through real-time API integrations like IndexNow. Under the SEO Authority Plan, we guarantee your page will be crawled and indexed by Google within 48 hours.
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <BannerAdLoader variant="inline" />
        </div>
      </main>
      <Footer />
    </>
  )
}
