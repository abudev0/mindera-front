import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { getCollection } from '@/lib/mongodb'

export type RegistrationStatus = 'new' | 'contacted' | 'enrolled' | 'rejected'
export type ActivationStatus = 'pending' | 'active'
export type AuthProvider = 'email' | 'google'

export type Registration = {
  id: string
  name: string
  phone: string
  email: string
  telegram: string
  courseGoal: string
  comment: string
  status: RegistrationStatus
  activationStatus: ActivationStatus
  activationToken: string
  passwordHash: string
  authProvider: AuthProvider
  googleId: string
  sessionToken: string
  activatedAt: string | null
  createdAt: string
  updatedAt: string
}

export type RegistrationInput = {
  name: string
  phone: string
  email: string
  telegram?: string
  courseGoal?: string
  comment?: string
}

export async function getRegistrations(): Promise<Registration[]> {
  const collection = await getRegistrationsCollection()
  const registrations = await collection
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray()

  return registrations.map(normalizeRegistration)
}

export async function createRegistration(input: RegistrationInput): Promise<Registration> {
  const now = new Date().toISOString()
  const collection = await getRegistrationsCollection()
  const email = input.email.trim().toLowerCase()
  const existingRegistration = await collection.findOne({ email }, { projection: { _id: 0 } })

  if (existingRegistration) {
    return normalizeRegistration(existingRegistration)
  }

  const registration: Registration = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    phone: input.phone.trim(),
    email,
    telegram: input.telegram?.trim() ?? '',
    courseGoal: input.courseGoal?.trim() ?? '',
    comment: input.comment?.trim() ?? '',
    status: 'new',
    activationStatus: 'pending',
    activationToken: crypto.randomUUID(),
    passwordHash: '',
    authProvider: 'email',
    googleId: '',
    sessionToken: '',
    activatedAt: null,
    createdAt: now,
    updatedAt: now,
  }

  await collection.insertOne(registration)

  return registration
}

export async function setRegistrationPassword(
  token: string,
  password: string,
): Promise<Registration | null> {
  const collection = await getRegistrationsCollection()
  const registration = await collection.findOne({ activationToken: token }, { projection: { _id: 0 } })

  if (!registration) {
    return null
  }

  const now = new Date().toISOString()
  const result = await collection.findOneAndUpdate(
    { activationToken: token },
    {
      $set: {
        activationStatus: 'active',
        passwordHash: hashPassword(password),
        sessionToken: crypto.randomUUID(),
        activatedAt: registration.activatedAt ?? now,
        updatedAt: now,
      },
    },
    { projection: { _id: 0 }, returnDocument: 'after' },
  )

  return result ? normalizeRegistration(result) : null
}

export async function findRegistrationByActivationToken(token: string): Promise<Registration | null> {
  const collection = await getRegistrationsCollection()
  const registration = await collection.findOne({ activationToken: token }, { projection: { _id: 0 } })

  return registration ? normalizeRegistration(registration) : null
}

export async function loginWithPassword(email: string, password: string): Promise<Registration | null> {
  const collection = await getRegistrationsCollection()
  const registration = await collection.findOne(
    { email: email.trim().toLowerCase() },
    { projection: { _id: 0 } },
  )

  if (
    !registration ||
    registration.activationStatus !== 'active' ||
    !registration.passwordHash ||
    !verifyPassword(password, registration.passwordHash)
  ) {
    return null
  }

  const result = await collection.findOneAndUpdate(
    { id: registration.id },
    {
      $set: {
        sessionToken: crypto.randomUUID(),
        updatedAt: new Date().toISOString(),
      },
    },
    { projection: { _id: 0 }, returnDocument: 'after' },
  )

  return result ? normalizeRegistration(result) : null
}

export async function getRegistrationBySession(sessionToken: string): Promise<Registration | null> {
  if (!sessionToken) {
    return null
  }

  const collection = await getRegistrationsCollection()
  const registration = await collection.findOne({ sessionToken }, { projection: { _id: 0 } })

  return registration ? normalizeRegistration(registration) : null
}

export async function upsertGoogleRegistration(input: {
  email: string
  name: string
  googleId: string
}): Promise<Registration> {
  const now = new Date().toISOString()
  const collection = await getRegistrationsCollection()
  const email = input.email.trim().toLowerCase()
  const existingRegistration = await collection.findOne({ email }, { projection: { _id: 0 } })

  if (existingRegistration) {
    const result = await collection.findOneAndUpdate(
      { email },
      {
        $set: {
          name: existingRegistration.name || input.name,
          email,
          authProvider: 'google',
          googleId: input.googleId,
          activationStatus: 'active',
          activatedAt: existingRegistration.activatedAt ?? now,
          sessionToken: crypto.randomUUID(),
          updatedAt: now,
        },
      },
      { projection: { _id: 0 }, returnDocument: 'after' },
    )

    return normalizeRegistration(result ?? existingRegistration)
  }

  const registration: Registration = {
    id: crypto.randomUUID(),
    name: input.name.trim() || email,
    phone: '',
    email,
    telegram: '',
    courseGoal: '',
    comment: '',
    status: 'new',
    activationStatus: 'active',
    activationToken: crypto.randomUUID(),
    passwordHash: '',
    authProvider: 'google',
    googleId: input.googleId,
    sessionToken: crypto.randomUUID(),
    activatedAt: now,
    createdAt: now,
    updatedAt: now,
  }

  await collection.insertOne(registration)

  return registration
}

export async function updateRegistrationPhone(
  id: string,
  phone: string,
): Promise<Registration | null> {
  const collection = await getRegistrationsCollection()
  const result = await collection.findOneAndUpdate(
    { id },
    {
      $set: {
        phone,
        updatedAt: new Date().toISOString(),
      },
    },
    { projection: { _id: 0 }, returnDocument: 'after' },
  )

  return result ? normalizeRegistration(result) : null
}

export async function updateRegistrationStatus(
  id: string,
  status: RegistrationStatus,
): Promise<Registration | null> {
  const collection = await getRegistrationsCollection()
  const result = await collection.findOneAndUpdate(
    { id },
    {
      $set: {
        status,
        updatedAt: new Date().toISOString(),
      },
    },
    { projection: { _id: 0 }, returnDocument: 'after' },
  )

  return result ? normalizeRegistration(result) : null
}

async function getRegistrationsCollection() {
  const collection = await getCollection<Registration>('registrations')
  await Promise.all([
    collection.createIndex({ id: 1 }, { unique: true }),
    collection.createIndex({ email: 1 }, { unique: true }),
    collection.createIndex({ activationToken: 1 }),
    collection.createIndex({ sessionToken: 1 }),
  ])

  return collection
}

function normalizeRegistration(registration: Registration): Registration {
  return {
    ...registration,
    name: registration.name ?? '',
    phone: registration.phone ?? '',
    email: registration.email ?? '',
    telegram: registration.telegram ?? '',
    courseGoal: registration.courseGoal ?? '',
    comment: registration.comment ?? '',
    status: registration.status ?? 'new',
    activationStatus: registration.activationStatus ?? 'pending',
    activationToken: registration.activationToken ?? crypto.randomUUID(),
    passwordHash: registration.passwordHash ?? '',
    authProvider: registration.authProvider ?? 'email',
    googleId: registration.googleId ?? '',
    sessionToken: registration.sessionToken ?? '',
    activatedAt: registration.activatedAt ?? null,
    createdAt: registration.createdAt ?? new Date(0).toISOString(),
    updatedAt: registration.updatedAt ?? new Date(0).toISOString(),
  }
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')

  return `${salt}:${hash}`
}

function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(':')

  if (!salt || !hash) {
    return false
  }

  const hashBuffer = Buffer.from(hash, 'hex')
  const passwordBuffer = scryptSync(password, salt, 64)

  return hashBuffer.length === passwordBuffer.length && timingSafeEqual(hashBuffer, passwordBuffer)
}
