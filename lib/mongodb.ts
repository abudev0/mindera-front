import { MongoClient, type Collection, type Document } from 'mongodb'

const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017'
const dbName = process.env.MONGODB_DB_NAME ?? 'mindera'

type CachedMongo = {
  client: MongoClient | null
  promise: Promise<MongoClient> | null
}

const globalForMongo = globalThis as typeof globalThis & {
  minderaMongo?: CachedMongo
}

const cached = globalForMongo.minderaMongo ?? {
  client: null,
  promise: null,
}

if (!globalForMongo.minderaMongo) {
  globalForMongo.minderaMongo = cached
}

export async function getMongoClient() {
  if (cached.client) {
    return cached.client
  }

  cached.promise ??= new MongoClient(uri).connect()
  cached.client = await cached.promise

  return cached.client
}

export async function getMongoDb() {
  const client = await getMongoClient()

  return client.db(dbName)
}

export async function getCollection<T extends Document>(name: string): Promise<Collection<T>> {
  const db = await getMongoDb()

  return db.collection<T>(name)
}
