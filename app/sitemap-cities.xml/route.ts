import { NextResponse } from 'next/server'
import { getQualifiedCities, SEO_CONFIG } from '@/lib/seo-config'

export const revalidate = 86400

const BASE_URL = SEO_CONFIG.BASE_URL

function escapeXml(unsafe: string): string {
  if (!unsafe) return ''
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const lastmod = new Date().toISOString().split('T')[0]
  const cities = getQualifiedCities()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cities.map(c => `  <url>
    <loc>${escapeXml(`${BASE_URL}/${c.slug}/`)}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${c.count >= 10 ? '0.85' : '0.75'}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400',
    },
  })
}
