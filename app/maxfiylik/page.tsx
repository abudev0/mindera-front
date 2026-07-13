import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/footer'
import LegalDocumentContent, { parseLegalMarkdown } from '@/components/legal-document-content'
import PrintButton from '../oferta/print-button'

export const metadata: Metadata = {
  title: 'Maxfiylik siyosati | Mindera',
  description: 'MINDERA MChJning shaxsga doir ma’lumotlarni qayta ishlash va himoya qilish siyosati.',
}

export const dynamic = 'force-static'

export default function PrivacyPage() {
  const markdownPath = path.join(process.cwd(), 'docs', 'mindera-maxfiylik-siyosati.md')
  const blocks = parseLegalMarkdown(fs.readFileSync(markdownPath, 'utf8'))

  return (
    <>
      <main className="min-h-screen bg-[#f2efe8] px-4 py-5 text-black md:px-8 md:py-10 print:bg-white print:p-0">
        <div className="mx-auto mb-5 flex max-w-[920px] items-center justify-between gap-4 print:hidden">
          <Link href="/" className="text-[18px] font-extrabold transition-opacity hover:opacity-60">
            ← Bosh sahifa
          </Link>
          <PrintButton />
        </div>

        <article className="oferta-document mx-auto max-w-[920px] rounded-[12px] bg-white px-6 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] md:px-14 md:py-14 print:max-w-none print:rounded-none print:p-0 print:shadow-none">
          <LegalDocumentContent blocks={blocks} />
        </article>
      </main>
      <Footer />
    </>
  )
}
