import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import './globals.css'

const siteUrl = 'https://mindera.uz'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Mindera — 3 oyda ingliz tilida gapirishni o‘rganing',
    template: '%s | Mindera',
  },
  description:
    'Mindera onlayn ingliz tili kursi: 3 oyda speaking ko‘nikmasini rivojlantiring. IELTS 7.5–9 darajadagi ustozlar bilan jonli darslar va natija kafolati.',
  applicationName: 'Mindera',
  authors: [{ name: 'MINDERA MChJ', url: siteUrl }],
  creator: 'MINDERA MChJ',
  publisher: 'MINDERA MChJ',
  keywords: [
    'Mindera',
    'Mindera uz',
    'ingliz tili kurslari',
    'onlayn ingliz tili kursi',
    'ingliz tilida gapirish',
    'speaking kursi',
    'IELTS ustozlari',
  ],
  alternates: {
    canonical: '/',
    languages: {
      'uz-UZ': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'uz_UZ',
    url: siteUrl,
    siteName: 'Mindera',
    title: 'Mindera — 3 oyda ingliz tilida gapirishni o‘rganing',
    description:
      'IELTS 7.5–9 darajadagi ustozlar bilan jonli onlayn darslar va speaking metodikasi.',
    images: [
      {
        url: '/logo.png',
        width: 203,
        height: 143,
        alt: 'Mindera ingliz tili kurslari',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mindera — onlayn ingliz tili kursi',
    description: '3 oyda ingliz tilida gapirishni o‘rganing.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: [{ url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' }],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.webmanifest',
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uz">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
