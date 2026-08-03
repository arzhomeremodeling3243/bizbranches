import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import './globals.css'
import AntiCopyWrapper from '@/components/anti-copy-wrapper'
import FloatingWhatsAppButton from '@/components/floating-whatsapp-button'
import ChatWidgetLoader from '@/components/chat-widget-loader'
import { NativeAdLoader } from '@/components/ads/ads-loader'
import BottomNav from '@/components/bottom-nav'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function loadMonetag() {
                  var schedule = window.requestIdleCallback || function(cb) { setTimeout(cb, 1000); };
                  schedule(function() {
                    var s = document.createElement('script');
                    s.dataset.zone = '11265640';
                    s.src = 'https://nap5k.com/tag.min.js';
                    s.async = true;
                    var target = [document.documentElement, document.body].filter(Boolean).pop();
                    if (target) target.appendChild(s);
                  });
                }
                if (document.readyState === 'complete') {
                  setTimeout(loadMonetag, 8000);
                } else {
                  window.addEventListener('load', function() { setTimeout(loadMonetag, 8000); }, { once: true });
                }
              })();
            `
          }}
        />

        <meta name="google-site-verification" content="D2TTC8ZWjbjA3wgOFcyrfBnFkjC3TAiCG7E6wDxDGK4" />
        <meta name="ahrefs-site-verification" content="22e1275092fa85b1" />
        <link rel="alternate" hrefLang="en-PK" href="https://www.pakbizbranhces.online/" />
        <link rel="alternate" hrefLang="x-default" href="https://www.pakbizbranhces.online/" />

        {/* Preconnect to Firebase (Firestore data) and Google APIs */}
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://wa.me" />

        {/* Google Analytics — loaded after page is interactive to avoid TBT */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-H1R80X5ZVE', { send_page_view: true });
              // Defer GA script load until after LCP
              (function() {
                function loadGA() {
                  var s = document.createElement('script');
                  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-H1R80X5ZVE';
                  s.async = true;
                  document.head.appendChild(s);
                }
                if (document.readyState === 'complete') {
                  setTimeout(loadGA, 3000);
                } else {
                  window.addEventListener('load', function() { setTimeout(loadGA, 3000); }, { once: true });
                }
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
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
