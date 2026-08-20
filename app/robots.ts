import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/auth/',
          '/user/',
          '/add-bussiness',   // typo redirect — keep blocked
          '/search?',         // prevent crawling search result URLs with query params
          '/*?cat=*',         // block query parameter URL variations
          '/*?city=*',        // block query parameter URL variations
          '/*?sort=',         // block crawling sort parameter variations
          '/*?filter=',       // block crawling filter parameter variations
          '/*?page=*',        // block crawling duplicate paginated pages with params
        ],
      },
      // Block AI scraping, training bots, and aggressive SEO crawlers from consuming compute
      {
        userAgent: [
          'GPTBot',
          'Bytespider',
          'ClaudeBot',
          'CCBot',
          'anthropic-ai',
          'Amazonbot',
          'Applebot-Extended',
          'SemrushBot',
          'AhrefsBot',
          'DotBot',
          'MJ12bot',
          'DataForSeoBot',
          'meta-externalagent',
          'FacebookBot',
        ],
        disallow: '/',
      },
      // Explicitly allow AI search/answer citation crawlers
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/auth/',
          '/user/',
          '/add-bussiness',
          '/search?',
          '/*?cat=*',
          '/*?city=*',
          '/*?sort=',
          '/*?filter=',
          '/*?page=*',
        ],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/auth/',
          '/user/',
          '/add-bussiness',
          '/search?',
          '/*?cat=*',
          '/*?city=*',
          '/*?sort=',
          '/*?filter=',
          '/*?page=*',
        ],
      },
    ],
    sitemap: [
      'https://www.pakbizbranhces.online/sitemap.xml',
      'https://www.pakbizbranhces.online/sitemap-businesses.xml'
    ],
    host: 'https://www.pakbizbranhces.online',
  }
}

