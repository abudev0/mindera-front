import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://mindera.uz/',
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://mindera.uz/oferta',
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: 'https://mindera.uz/maxfiylik',
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]
}
