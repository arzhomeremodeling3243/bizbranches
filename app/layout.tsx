import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import AntiCopyWrapper from '@/components/anti-copy-wrapper'
import FloatingWhatsAppButton from '@/components/floating-whatsapp-button'
import ChatWidgetLoader from '@/components/chat-widget-loader'
import { NativeAdLoader } from '@/components/ads/ads-loader'
import BottomNav from '@/components/bottom-nav'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  preload: true,
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Pakistan Free Business Directory: Find Local Businesses',
  description:
    'Search or list your business on the premier Pakistan free business directory. Find verified local businesses, phone numbers, and addresses by city and category. 15,000 plus listings across 150 plus cities on PakBizBranches.',
  keywords:
    'pakistan free business directory, Pakistan business directory, free business listing Pakistan, Karachi business listings, Lahore business directory, Islamabad business listings, local services Pakistan, business phone numbers Pakistan, companies in Pakistan by city, verified business contacts Pakistan, WhatsApp business directory Pakistan',
  authors: [{ name: 'PakBizBranches', url: 'https://www.pakbizbranhces.online/' }],
  metadataBase: new URL('https://www.pakbizbranhces.online/'),
  icons: {
    icon: [
      { url: '/favicon.png', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Pakistan Free Business Directory: Find Local Businesses',
    description:
      'Search or list your business on the premier Pakistan free business directory. Find verified local businesses, phone numbers, and addresses by city and category.',
    url: 'https://www.pakbizbranhces.online/',
    siteName: 'PakBizBranches',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pakistan Free Business Directory: Find Local Businesses',
    description:
      'Search or list your business on the premier Pakistan free business directory. Find verified local businesses, phone numbers, and addresses by city and category.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={outfit.variable}>
      <head>
        {/* Third-party monetization & analytics deferred strictly to first user interaction to maximize Speed Index and FCP */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var loaded = false;
                function loadDeferredScripts() {
                  if (loaded) return;
                  loaded = true;
                  ['scroll', 'pointerdown', 'touchstart', 'keydown'].forEach(function(e) {
                    window.removeEventListener(e, loadDeferredScripts);
                  });

                  // Load Monetag Ads
                  try {
                    var s1 = document.createElement('script');
                    s1.dataset.zone = '11265640';
                    s1.src = 'https://nap5k.com/tag.min.js';
                    s1.async = true;
                    document.body.appendChild(s1);
                  } catch(e) {}

                  // Load Google Analytics
                  try {
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-H1R80X5ZVE', { send_page_view: true });
                    var s2 = document.createElement('script');
                    s2.src = 'https://www.googletagmanager.com/gtag/js?id=G-H1R80X5ZVE';
                    s2.async = true;
                    document.head.appendChild(s2);
                  } catch(e) {}
                }

                ['scroll', 'pointerdown', 'touchstart', 'keydown'].forEach(function(e) {
                  window.addEventListener(e, loadDeferredScripts, { once: true, passive: true });
                });
              })();
            `,
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              '@id': 'https://www.pakbizbranhces.online/#organization',
              name: 'PakBizBranches',
              url: 'https://www.pakbizbranhces.online/',
              logo: 'https://www.pakbizbranhces.online/logo-img.png',
              description: 'Pakistan\'s trusted free business directory with 15,000+ verified listings. No registration required. Helps users find local businesses by city and category and allows business owners to add their local citations for free.',
              sameAs: [
                'https://facebook.com/pakbizbranches',
                'https://twitter.com/pakbizbranches',
                'https://instagram.com/pakbizbranches',
                'https://linkedin.com/company/pakbizbranches'
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                email: 'admin@pakbizbranhces.online',
                areaServed: {
                  '@type': 'Country',
                  name: 'Pakistan'
                }
              },
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Gulghast Colony, Urdu Bazar',
                addressLocality: 'Multan',
                addressRegion: 'Punjab',
                addressCountry: 'PK'
              },
              areaServed: {
                '@type': 'Country',
                name: 'Pakistan'
              }
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              '@id': 'https://www.pakbizbranhces.online/#website',
              name: 'PakBizBranches',
              url: 'https://www.pakbizbranhces.online/',
              description: 'Pakistan\'s trusted free business directory with 15,000+ verified listings. No registration required. Find local businesses by city and category with WhatsApp details. Add your business free.',
              publisher: {
                '@id': 'https://www.pakbizbranhces.online/#organization'
              },
              inLanguage: 'en-PK',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://www.pakbizbranhces.online/categories/?q={search_term_string}'
                },
                'query-input': 'required name=search_term_string'
              }
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased pb-16 md:pb-0">
        <AntiCopyWrapper />
        <FloatingWhatsAppButton />
        <ChatWidgetLoader />

        {children}

        <BottomNav />
      </body>
    </html>
  )
}
