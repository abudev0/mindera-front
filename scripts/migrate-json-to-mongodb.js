const dbName = process.env.MONGODB_DB_NAME || 'mindera'
const targetDb = db.getSiblingDB(dbName)
const fs = require('fs')

function readJson(path) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'))
  } catch (error) {
    print(`Skipping ${path}: ${error.message}`)
    return []
  }
}

function normalizeItems(items) {
  return Array.isArray(items) ? items.filter((item) => item && typeof item === 'object' && item.id) : []
}

function upsertById(collectionName, items) {
  const collection = targetDb.getCollection(collectionName)
  const documents = normalizeItems(items).map(({ _id, ...item }) => item)

  collection.createIndex({ id: 1 }, { unique: true })

  if (documents.length === 0) {
    print(`${collectionName}: no documents to migrate`)
    return
  }

  const result = collection.bulkWrite(
    documents.map((item) => ({
      updateOne: {
        filter: { id: item.id },
        update: { $set: item },
        upsert: true,
      },
    })),
  )

  print(
    `${collectionName}: matched=${result.matchedCount}, upserted=${result.upsertedCount}, modified=${result.modifiedCount}`,
  )
}

upsertById('courses', readJson('data/courses.json'))
upsertById('registrations', readJson('data/registrations.json'))
upsertById('transactions', readJson('data/transactions.json'))

targetDb.registrations.createIndex({ email: 1 }, { unique: true })
targetDb.registrations.createIndex({ activationToken: 1 })
targetDb.registrations.createIndex({ sessionToken: 1 })
targetDb.transactions.createIndex({ userId: 1 })
targetDb.transactions.createIndex({ userEmail: 1 })
targetDb.transactions.createIndex({ status: 1 })

print(`Migration complete: ${dbName}`)
