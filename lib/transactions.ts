import { getCollection } from '@/lib/mongodb'

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

export async function getTransactions(): Promise<Transaction[]> {
  const collection = await getTransactionsCollection()
  const transactions = await collection
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1, paidAt: -1 })
    .toArray()

  return transactions.map(normalizeTransaction)
}

async function getTransactionsCollection() {
  const collection = await getCollection<Transaction>('transactions')
  await Promise.all([
    collection.createIndex({ id: 1 }, { unique: true }),
    collection.createIndex({ userId: 1 }),
    collection.createIndex({ userEmail: 1 }),
    collection.createIndex({ status: 1 }),
  ])

  return collection
}

function normalizeTransaction(transaction: Transaction): Transaction {
  return {
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
  }
}
