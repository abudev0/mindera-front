import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mindera — onlayn ingliz tili kurslari',
    short_name: 'Mindera',
    description: '3 oyda ingliz tilida gapirishni o‘rganing.',
    start_url: '/',
    display: 'standalone',
    background_color: '#202020',
    theme_color: '#202020',
    lang: 'uz',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
