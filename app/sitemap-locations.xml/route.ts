import { NextResponse } from 'next/server'
import { getQualifiedCityCategories, SEO_CONFIG } from '@/lib/seo-config'

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
  const locations = getQualifiedCityCategories()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${locations.map(loc => `  <url>
    <loc>${escapeXml(`${BASE_URL}/${loc.citySlug}/${loc.categoryId}/`)}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${loc.count >= 5 ? '0.80' : '0.70'}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400',
    },
  })
}
