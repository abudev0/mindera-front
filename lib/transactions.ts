import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

export type TransactionStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export type Transaction = {
  id: string
  userId: string
  userName: string
  userEmail: string
  courseId: string
  courseTitle: string
  amount: number
  status: TransactionStatus
  paidAt: string
  createdAt: string
}

const dataDir = path.join(process.cwd(), 'data')
const dataFile = path.join(dataDir, 'transactions.json')

async function ensureDataFile() {
  await mkdir(dataDir, { recursive: true })

  try {
    await readFile(dataFile, 'utf8')
  } catch {
    await writeFile(dataFile, '[]', 'utf8')
  }
}

export async function getTransactions(): Promise<Transaction[]> {
  await ensureDataFile()
  const raw = await readFile(dataFile, 'utf8')

  return (JSON.parse(raw) as Transaction[])
    .map((transaction) => ({
      id: transaction.id,
      userId: transaction.userId ?? '',
      userName: transaction.userName ?? '',
      userEmail: transaction.userEmail ?? '',
      courseId: transaction.courseId ?? '',
      courseTitle: transaction.courseTitle ?? '',
      amount: Number(transaction.amount) || 0,
      status: transaction.status ?? 'pending',
      paidAt: transaction.paidAt ?? '',
      createdAt: transaction.createdAt ?? '',
    }))
    .sort((a, b) => new Date(b.createdAt || b.paidAt).getTime() - new Date(a.createdAt || a.paidAt).getTime())
}
