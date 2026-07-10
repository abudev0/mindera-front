import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import Footer from '@/components/footer'
import PrintButton from './print-button'

export const metadata: Metadata = {
  title: 'Ommaviy oferta | Mindera',
  description: 'MINDERA MChJ ta’lim xizmatlarini ko‘rsatish bo‘yicha ommaviy ofertasi.',
}

export const dynamic = 'force-static'

type MarkdownBlock =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'rule' }

function parseMarkdown(source: string): MarkdownBlock[] {
  const lines = source.split(/\r?\n/)
  const blocks: MarkdownBlock[] = []
  let paragraph: string[] = []
  let list: { ordered: boolean; items: string[] } | null = null

  function flushParagraph() {
    if (paragraph.length > 0) {
      blocks.push({ type: 'paragraph', text: paragraph.join(' ') })
      paragraph = []
    }
  }

  function flushList() {
    if (list) {
      blocks.push({ type: 'list', ordered: list.ordered, items: list.items })
      list = null
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (!line) {
      flushParagraph()
      flushList()
      continue
    }

    const heading = /^(#{1,6})\s+(.+)$/.exec(line)
    if (heading) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] })
      continue
    }

    if (line === '---') {
      flushParagraph()
      flushList()
      blocks.push({ type: 'rule' })
      continue
    }

    const unorderedItem = /^[-*]\s+(.+)$/.exec(line)
    const orderedItem = /^\d+\.\s+(.+)$/.exec(line)
    const item = unorderedItem ?? orderedItem
    if (item) {
      flushParagraph()
      const ordered = Boolean(orderedItem)
      if (!list || list.ordered !== ordered) {
        flushList()
        list = { ordered, items: [] }
      }
      list.items.push(item[1])
      continue
    }

    flushList()
    paragraph.push(line.replace(/\s{2}$/, ''))
  }

  flushParagraph()
  flushList()
  return blocks
}

function renderInline(text: string): ReactNode[] {
  const tokenPattern = /(\*\*[^*]+\*\*|https?:\/\/[^\s;,]+[^\s;,.)]|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/g
  const nodes: ReactNode[] = []
  let cursor = 0

  for (const match of text.matchAll(tokenPattern)) {
    const index = match.index ?? 0
    if (index > cursor) nodes.push(text.slice(cursor, index))

    const token = match[0]
    if (token.startsWith('**')) {
      nodes.push(<strong key={`${index}-${token}`}>{token.slice(2, -2)}</strong>)
    } else {
      const href = token.includes('@') && !token.startsWith('http') ? `mailto:${token}` : token
      nodes.push(
        <a
          key={`${index}-${token}`}
          href={href}
          className="font-bold underline decoration-black/30 underline-offset-2 hover:decoration-black"
        >
          {token}
        </a>,
      )
    }
    cursor = index + token.length
  }

  if (cursor < text.length) nodes.push(text.slice(cursor))
  return nodes
}

function OfertaContent({ blocks }: { blocks: MarkdownBlock[] }) {
  return blocks.map((block, index) => {
    if (block.type === 'heading') {
      if (block.level === 1) {
        return (
          <h1 key={index} className="text-[30px] font-black leading-[1.08] md:text-[44px]">
            {renderInline(block.text)}
          </h1>
        )
      }

      return (
        <h2
          key={index}
          className="mb-3 mt-9 border-t border-black/10 pt-7 text-[23px] font-black leading-tight md:text-[27px]"
        >
          {renderInline(block.text)}
        </h2>
      )
    }

    if (block.type === 'paragraph') {
      return (
        <p key={index} className="my-3 text-[16px] font-medium leading-[1.65] text-black/80 md:text-[17px]">
          {renderInline(block.text)}
        </p>
      )
    }

    if (block.type === 'list') {
      const List = block.ordered ? 'ol' : 'ul'
      return (
        <List
          key={index}
          className={`my-4 grid gap-2 pl-7 text-[16px] font-medium leading-[1.55] text-black/80 md:text-[17px] ${
            block.ordered ? 'list-decimal' : 'list-disc'
          }`}
        >
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item)}</li>
          ))}
        </List>
      )
    }

    return <hr key={index} className="my-10 border-black/20" />
  })
}

export default function OfertaPage() {
  const markdownPath = path.join(process.cwd(), 'docs', 'mindera-ommaviy-oferta.md')
  const blocks = parseMarkdown(fs.readFileSync(markdownPath, 'utf8'))

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
          <OfertaContent blocks={blocks} />
        </article>
      </main>
      <Footer />
    </>
  )
}
