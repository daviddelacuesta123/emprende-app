import { createContext, useCallback, useContext, useState } from 'react'
import { LEGACY_KEY, storeKey } from './store'

// Cuentas solo en este dispositivo: no hay backend todavía.
const USERS = 'emprende:users'
const SESSION = 'emprende:session'

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const write = (key, value) => {
  try {
    if (value == null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export const normalizeEmail = (email) => email.trim().toLowerCase()

async function hash(email, password) {
  const text = `${email}:${password}`
  // crypto.subtle solo existe en contextos seguros (https o localhost).
  if (globalThis.crypto?.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
  }
  let h = 5381
  for (const c of text) h = Math.imul(h, 33) ^ c.charCodeAt(0)
  return `djb2:${(h >>> 0).toString(16)}`
}

function seedUserData(email, name, isFirstUser) {
  if (read(storeKey(email), null)) return
  const legacy = isFirstUser ? read(LEGACY_KEY, null) : null
  write(storeKey(email), legacy ? { ...legacy, name: legacy.name || name } : { name })
  if (legacy) write(LEGACY_KEY, null)
}

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => read(USERS, {}))
  const [session, setSession] = useState(() => {
    const s = read(SESSION, null)
    return s && read(USERS, {})[s] ? s : null
  })

  const start = (email) => {
    write(SESSION, email)
    setSession(email)
  }

  const register = useCallback(async ({ name, email, password }) => {
    const id = normalizeEmail(email)
    const all = read(USERS, {})
    if (all[id]) throw new Error('Ya existe una cuenta con este correo. Inicia sesión.')
    const next = { ...all, [id]: { name: name.trim(), hash: await hash(id, password), createdAt: Date.now() } }
    write(USERS, next)
    setUsers(next)
    seedUserData(id, name.trim(), Object.keys(all).length === 0)
    start(id)
  }, [])

  const login = useCallback(async ({ email, password }) => {
    const id = normalizeEmail(email)
    const user = read(USERS, {})[id]
    if (!user || user.hash !== (await hash(id, password))) throw new Error('Correo o contraseña incorrectos.')
    start(id)
  }, [])

  const logout = useCallback(() => {
    write(SESSION, null)
    setSession(null)
  }, [])

  const value = {
    session,
    user: session ? users[session] : null,
    hasAccounts: Object.keys(users).length > 0,
    register,
    login,
    logout,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
