import type { ReactNode } from 'react'

type MarkdownBlock =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'rule' }

export function parseLegalMarkdown(source: string): MarkdownBlock[] {
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

function headingId(text: string) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[‘’'“”"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function LegalDocumentContent({ blocks }: { blocks: MarkdownBlock[] }) {
  return blocks.map((block, index) => {
    if (block.type === 'heading') {
      if (block.level === 1) {
        return (
          <h1
            key={index}
            id={headingId(block.text)}
            className="scroll-mt-6 text-[30px] font-black leading-[1.08] md:text-[44px]"
          >
            {renderInline(block.text)}
          </h1>
        )
      }

      return (
        <h2
          key={index}
          id={headingId(block.text)}
          className="scroll-mt-6 mb-3 mt-9 border-t border-black/10 pt-7 text-[23px] font-black leading-tight md:text-[27px]"
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
