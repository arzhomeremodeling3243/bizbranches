import { NextResponse } from 'next/server'
import { BLOG_POSTS } from '@/lib/blog-data'
import { SEO_CONFIG } from '@/lib/seo-config'

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

  interface SitemapItem {
    loc: string
    lastmod: string
    changefreq: string
    priority: string
    image?: { loc: string; title: string }
  }

  const items: SitemapItem[] = [
    { loc: `${BASE_URL}/`, lastmod, changefreq: 'daily', priority: '1.0' },
    { loc: `${BASE_URL}/categories/`, lastmod, changefreq: 'weekly', priority: '0.9' },
    { loc: `${BASE_URL}/cities/`, lastmod, changefreq: 'weekly', priority: '0.9' },
    { loc: `${BASE_URL}/add-business/`, lastmod, changefreq: 'monthly', priority: '0.8' },
    { loc: `${BASE_URL}/blog/`, lastmod, changefreq: 'weekly', priority: '0.8' },
    { loc: `${BASE_URL}/about/`, lastmod, changefreq: 'monthly', priority: '0.7' },
    { loc: `${BASE_URL}/contact/`, lastmod, changefreq: 'monthly', priority: '0.7' },
    { loc: `${BASE_URL}/featured-businesses/`, lastmod, changefreq: 'daily', priority: '0.8' },
    { loc: `${BASE_URL}/html-sitemap/`, lastmod, changefreq: 'monthly', priority: '0.5' },
    { loc: `${BASE_URL}/pricing/`, lastmod, changefreq: 'monthly', priority: '0.7' },
    { loc: `${BASE_URL}/terms/`, lastmod, changefreq: 'yearly', priority: '0.4' },
    { loc: `${BASE_URL}/privacy/`, lastmod, changefreq: 'yearly', priority: '0.4' },
    { loc: `${BASE_URL}/why-list-your-business/`, lastmod, changefreq: 'monthly', priority: '0.7' },
  ]

  // Add active blog posts
  const activePosts = BLOG_POSTS.filter(p => !p.hidden)
  activePosts.forEach(post => {
    const item: SitemapItem = {
      loc: `${BASE_URL}/blog/${post.slug}/`,
      lastmod,
      changefreq: 'monthly',
      priority: '0.7',
    }
    if ((post as any).image) {
      item.image = {
        loc: getAbsoluteImageUrl((post as any).image),
        title: post.title,
      }
    }
    items.push(item)
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${items.map(u => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${escapeXml(u.lastmod)}</lastmod>
    <changefreq>${escapeXml(u.changefreq)}</changefreq>
    <priority>${escapeXml(u.priority)}</priority>${u.image ? `
    <image:image>
      <image:loc>${escapeXml(u.image.loc)}</image:loc>
      <image:title>${escapeXml(u.image.title)}</image:title>
    </image:image>` : ''}
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400',
    },
  })
}
