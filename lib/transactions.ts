import { getCollection } from '@/lib/mongodb'
import { callUzumBackend } from '@/lib/uzum-backend'

export type TransactionStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export type Transaction = {
  id: string
  userId: string
  userName: string
  userEmail: string
  userPhone: string
  courseId: string
  courseTitle: string
  amount: number
  status: TransactionStatus
  paidAt: string
  createdAt: string
}

type UzumOrdersResponse = {
  success: boolean
  orders: Array<{
    orderId: string
    customer: {
      id?: string
      name?: string
      phone?: string
      email?: string
    }
    items: Array<{
      sku: string
      name?: string
      months?: number
      quantity: number
      price: number
    }>
    totalPrice: number
    paymentStatus: 'pending' | 'paid' | 'cancelled' | 'refunded'
    paidAt?: string
    createdAt: string
    updatedAt: string
  }>
}

export async function getTransactions(): Promise<Transaction[]> {
  const collection = await getTransactionsCollection()
  const [legacyTransactions, uzumResponse] = await Promise.all([
    collection.find({}, { projection: { _id: 0 } }).toArray(),
    callUzumBackend<UzumOrdersResponse>('/integrations/tilda/uzum/orders?refreshPending=true'),
  ])
  const transactions = new Map(
    legacyTransactions.map((transaction) => [transaction.id, normalizeTransaction(transaction)]),
  )

  uzumResponse.orders.forEach((order) => {
    const firstItem = order.items[0]
    const courseTitle = order.items
      .map((item) => `${item.name ?? item.sku}${item.quantity > 1 ? ` × ${item.quantity}` : ''}`)
      .join(', ')

    transactions.set(order.orderId, {
      id: order.orderId,
      userId: order.customer.id ?? '',
      userName: order.customer.name ?? '',
      userEmail: order.customer.email ?? '',
      userPhone: order.customer.phone ?? '',
      courseId: firstItem?.sku ?? '',
      courseTitle,
      amount: Number(order.totalPrice) || 0,
      status: order.paymentStatus === 'cancelled' ? 'failed' : order.paymentStatus,
      paidAt: order.paymentStatus === 'paid' ? (order.paidAt ?? order.updatedAt) : '',
      createdAt: order.createdAt,
    })
  })

  return [...transactions.values()].sort((left, right) => {
    const leftDate = Date.parse(left.createdAt || left.paidAt) || 0
    const rightDate = Date.parse(right.createdAt || right.paidAt) || 0
    return rightDate - leftDate
  })
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
    userPhone: transaction.userPhone ?? '',
    courseId: transaction.courseId ?? '',
    courseTitle: transaction.courseTitle ?? '',
    amount: Number(transaction.amount) || 0,
    status: transaction.status ?? 'pending',
    paidAt: transaction.paidAt ?? '',
    createdAt: transaction.createdAt ?? '',
  }
}
