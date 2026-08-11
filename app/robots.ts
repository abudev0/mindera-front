import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/activate/', '/checkout/', '/courses', '/dashboard/'],
    },
    sitemap: 'https://mindera.uz/sitemap.xml',
    host: 'https://mindera.uz',
  }
}
