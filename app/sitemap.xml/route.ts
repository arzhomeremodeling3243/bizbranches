import { NextResponse } from 'next/server'
import { SEO_CONFIG } from '@/lib/seo-config'

export const revalidate = 86400 // 24 hours cache

const BASE_URL = SEO_CONFIG.BASE_URL

export async function GET() {
  const lastmod = new Date().toISOString().split('T')[0]

  const sitemaps = [
    `${BASE_URL}/sitemap-pages.xml`,
    `${BASE_URL}/sitemap-categories.xml`,
    `${BASE_URL}/sitemap-cities.xml`,
    `${BASE_URL}/sitemap-locations.xml`,
    `${BASE_URL}/sitemap-businesses.xml`,
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(loc => `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400',
    },
  })
}
