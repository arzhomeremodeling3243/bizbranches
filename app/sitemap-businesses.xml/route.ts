import { NextResponse } from 'next/server'
import { fetchAllBusinessesForSitemap } from '@/lib/firebase-server'
import { HIGH_PRIORITY_SLUGS } from '@/lib/static-db'

const BASE_URL = 'https://www.pakbizbranhces.online'

export const dynamic = 'force-static'
export const revalidate = 604800 // 7 days cache for business sitemap XML


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
  const businesses = await fetchAllBusinessesForSitemap()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${businesses.map(biz => {
  const isHighPriority = HIGH_PRIORITY_SLUGS.has(biz.slug)
  const imageXml = biz.logoUrl ? `\n    <image:image>
      <image:loc>${getAbsoluteImageUrl(biz.logoUrl)}</image:loc>
      <image:title>${biz.slug.replace(/-/g, ' ')}</image:title>
    </image:image>` : ''
  return `  <url>
    <loc>${BASE_URL}/${biz.slug}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${isHighPriority ? '0.90' : '0.75'}</priority>${imageXml}
  </url>`
}).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400',
    },
  })
}
