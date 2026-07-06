import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mindera - Learn English in 3 Months',
  description: 'Master English with IELTS preparation courses. 100% success guarantee with certified teachers.',
  icons: {
    icon: [
      {
        url: '/logo.png',
        // media: '(prefers-color-scheme: light)',
      }
    ]
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
