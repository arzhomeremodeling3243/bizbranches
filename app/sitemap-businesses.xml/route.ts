import { NextResponse } from 'next/server'
import { fetchAllBusinessesForSitemap } from '@/lib/firebase-server'
import { HIGH_PRIORITY_SLUGS } from '@/lib/static-db'
import { isBusinessIndexable, SEO_CONFIG } from '@/lib/seo-config'

const BASE_URL = SEO_CONFIG.BASE_URL

export const revalidate = 86400

function escapeXml(unsafe: string): string {
  if (!unsafe) return ''
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function getAbsoluteImageUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  const cleanUrl = url.startsWith('/') ? url : `/${url}`
  return `${BASE_URL}${cleanUrl}`
}

export async function GET() {
  const lastmod = new Date().toISOString().split('T')[0]
  const allBusinesses = await fetchAllBusinessesForSitemap()

  // Filter out non-business informational pages and entries marked noindex
  const validBusinesses = allBusinesses.filter(biz => isBusinessIndexable(biz.slug))

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${validBusinesses.map(biz => {
  const isHighPriority = HIGH_PRIORITY_SLUGS.has(biz.slug)
  const imageXml = biz.logoUrl ? `\n    <image:image>
      <image:loc>${escapeXml(getAbsoluteImageUrl(biz.logoUrl))}</image:loc>
      <image:title>${escapeXml(biz.slug.replace(/-/g, ' '))}</image:title>
    </image:image>` : ''
  return `  <url>
    <loc>${escapeXml(`${BASE_URL}/${biz.slug}/`)}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${escapeXml(isHighPriority ? '0.90' : '0.75')}</priority>${imageXml}
  </url>`
}).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400',
    },
  })
}
