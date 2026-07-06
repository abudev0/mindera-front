import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import path from 'node:path'

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

const dataDir = path.join(process.cwd(), 'data')
const dataFile = path.join(dataDir, 'registrations.json')

async function ensureDataFile() {
  await mkdir(dataDir, { recursive: true })

  try {
    await readFile(dataFile, 'utf8')
  } catch {
    await writeFile(dataFile, '[]', 'utf8')
  }
}

export async function getRegistrations(): Promise<Registration[]> {
  await ensureDataFile()
  const raw = await readFile(dataFile, 'utf8')
  const registrations = (JSON.parse(raw) as Registration[]).map((registration) => ({
    ...registration,
    email: registration.email ?? '',
    activationStatus: registration.activationStatus ?? 'pending',
    activationToken: registration.activationToken ?? crypto.randomUUID(),
    passwordHash: registration.passwordHash ?? '',
    authProvider: registration.authProvider ?? 'email',
    googleId: registration.googleId ?? '',
    sessionToken: registration.sessionToken ?? '',
    activatedAt: registration.activatedAt ?? null,
  }))

  return registrations.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export async function createRegistration(input: RegistrationInput): Promise<Registration> {
  const now = new Date().toISOString()
  const registrations = await getRegistrations()
  const email = input.email.trim().toLowerCase()
  const existingRegistration = registrations.find((registration) => registration.email === email)

  if (existingRegistration) {
    return existingRegistration
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

  registrations.unshift(registration)
  await writeFile(dataFile, JSON.stringify(registrations, null, 2), 'utf8')

  return registration
}

export async function setRegistrationPassword(
  token: string,
  password: string,
): Promise<Registration | null> {
  const registrations = await getRegistrations()
  const index = registrations.findIndex((registration) => registration.activationToken === token)

  if (index === -1) {
    return null
  }

  const now = new Date().toISOString()
  registrations[index] = {
    ...registrations[index],
    activationStatus: 'active',
    passwordHash: hashPassword(password),
    sessionToken: crypto.randomUUID(),
    activatedAt: registrations[index].activatedAt ?? now,
    updatedAt: now,
  }

  await writeFile(dataFile, JSON.stringify(registrations, null, 2), 'utf8')

  return registrations[index]
}

export async function findRegistrationByActivationToken(token: string): Promise<Registration | null> {
  const registrations = await getRegistrations()
  return registrations.find((registration) => registration.activationToken === token) ?? null
}

export async function loginWithPassword(email: string, password: string): Promise<Registration | null> {
  const registrations = await getRegistrations()
  const index = registrations.findIndex((registration) => registration.email === email.trim().toLowerCase())

  if (index === -1) {
    return null
  }

  const registration = registrations[index]

  if (
    registration.activationStatus !== 'active' ||
    !registration.passwordHash ||
    !verifyPassword(password, registration.passwordHash)
  ) {
    return null
  }

  registrations[index] = {
    ...registration,
    sessionToken: crypto.randomUUID(),
    updatedAt: new Date().toISOString(),
  }

  await writeFile(dataFile, JSON.stringify(registrations, null, 2), 'utf8')

  return registrations[index]
}

export async function getRegistrationBySession(sessionToken: string): Promise<Registration | null> {
  if (!sessionToken) {
    return null
  }

  const registrations = await getRegistrations()
  return registrations.find((registration) => registration.sessionToken === sessionToken) ?? null
}

export async function upsertGoogleRegistration(input: {
  email: string
  name: string
  googleId: string
}): Promise<Registration> {
  const now = new Date().toISOString()
  const registrations = await getRegistrations()
  const email = input.email.trim().toLowerCase()
  const index = registrations.findIndex((registration) => registration.email === email)

  if (index !== -1) {
    registrations[index] = {
      ...registrations[index],
      name: registrations[index].name || input.name,
      email,
      authProvider: 'google',
      googleId: input.googleId,
      activationStatus: 'active',
      activatedAt: registrations[index].activatedAt ?? now,
      sessionToken: crypto.randomUUID(),
      updatedAt: now,
    }

    await writeFile(dataFile, JSON.stringify(registrations, null, 2), 'utf8')

    return registrations[index]
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

  registrations.unshift(registration)
  await writeFile(dataFile, JSON.stringify(registrations, null, 2), 'utf8')

  return registration
}

export async function updateRegistrationStatus(
  id: string,
  status: RegistrationStatus,
): Promise<Registration | null> {
  const registrations = await getRegistrations()
  const index = registrations.findIndex((registration) => registration.id === id)

  if (index === -1) {
    return null
  }

  registrations[index] = {
    ...registrations[index],
    status,
    updatedAt: new Date().toISOString(),
  }

  await writeFile(dataFile, JSON.stringify(registrations, null, 2), 'utf8')

  return registrations[index]
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
