import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !key) {
  throw new Error('Faltan VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY. Copia .env.example a .env (ver README).')
}

// index.html lee esta misma clave para decidir si muestra la pantalla de carga.
export const AUTH_STORAGE_KEY = 'emprende:auth'

export const supabase = createClient(url, key, {
  auth: { storageKey: AUTH_STORAGE_KEY },
  // keepalive deja terminar los guardados que se envían justo al cerrar la pestaña.
  global: { fetch: (input, init) => fetch(input, { ...init, keepalive: true }) },
})
