import { createClient } from '@supabase/supabase-js'
import express from 'express'
import { chat } from './llm/index.js'
import { SYSTEM_PROMPT } from './prompt.js'

try {
  process.loadEnvFile()
} catch {
  // Sin archivo .env: se usan las variables del sistema.
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Faltan VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY. Copia .env.example a .env.')
  process.exit(1)
}
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } })

const MAX_MESSAGES = 12
const MAX_CHARS = 4000
const RATE_LIMIT = 30
const RATE_WINDOW_MS = 60 * 60 * 1000

// Solo responde a usuarios con sesión válida en Supabase.
async function requireUser(req, res, next) {
  const token = req.get('authorization')?.match(/^Bearer (.+)$/)?.[1]
  if (!token) return res.status(401).json({ error: 'Inicia sesión para usar el asistente.' })
  const { data, error } = await supabase.auth.getClaims(token)
  if (error || !data?.claims?.sub) return res.status(401).json({ error: 'Tu sesión venció. Vuelve a iniciar sesión.' })
  req.userId = data.claims.sub
  next()
}

// Límite contra abuso por usuario. El límite de preguntas del plan gratis lo aplica Supabase al guardar el mensaje.
const recent = new Map()
function rateLimit(req, res, next) {
  const now = Date.now()
  const hits = (recent.get(req.userId) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  if (hits.length >= RATE_LIMIT) return res.status(429).json({ error: 'Hiciste muchas preguntas seguidas. Espera un rato.' })
  hits.push(now)
  recent.set(req.userId, hits)
  next()
}

// Solo acepta mensajes del usuario y del asistente: las instrucciones del sistema las pone el servidor.
const cleanMessages = (messages) =>
  messages
    .filter((m) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))

const app = express()
app.use(express.json({ limit: '100kb' }))

app.post('/api/chat', requireUser, rateLimit, async (req, res) => {
  const messages = Array.isArray(req.body?.messages) ? cleanMessages(req.body.messages) : []
  if (messages.length === 0 || messages.at(-1).role !== 'user') {
    return res.status(400).json({ error: 'messages requerido' })
  }

  try {
    const content = await chat([{ role: 'system', content: SYSTEM_PROMPT }, ...messages])
    res.json({ content })
  } catch (err) {
    console.error('[chat]', err.message)
    res.status(503).json({ error: 'El asistente no está disponible ahora. Intenta más tarde.' })
  }
})

const PORT = process.env.PORT ?? 3001
app.listen(PORT, () => console.log(`Server listo en http://localhost:${PORT}`))
