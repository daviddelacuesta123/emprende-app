import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

// Recuerda si en este navegador ya se creó o usó una cuenta, para abrir el acceso en "Iniciar sesión".
const SEEN_KEY = 'emprende:ha-ingresado'

const remember = () => {
  try {
    localStorage.setItem(SEEN_KEY, '1')
  } catch {}
}

const seen = () => {
  try {
    return !!localStorage.getItem(SEEN_KEY)
  } catch {
    return false
  }
}

const MESSAGES = [
  [/already.*registered|user_already_exists/i, 'Ya existe una cuenta con este correo. Inicia sesión.'],
  [/invalid login credentials|invalid_credentials/i, 'Correo o contraseña incorrectos.'],
  [/email not confirmed|email_not_confirmed/i, 'Confirma tu correo antes de iniciar sesión: revisa tu bandeja de entrada.'],
  [/password should be|weak_password/i, 'La contraseña es muy débil. Usa al menos 6 caracteres.'],
  [/rate limit|too many|over_request_rate_limit|over_email_send_rate_limit/i, 'Demasiados intentos. Espera unos minutos y vuelve a intentar.'],
  [/invalid.*email|email_address_invalid/i, 'Ese correo no es válido.'],
  [/fetch|network/i, 'No hay conexión. Revisa tu internet e intenta de nuevo.'],
]

const friendly = (error) => {
  const text = `${error?.code ?? ''} ${error?.message ?? ''}`
  for (const [re, msg] of MESSAGES) if (re.test(text)) return msg
  return 'Algo salió mal. Intenta de nuevo.'
}

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [authSession, setAuthSession] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthSession(data.session)
      setReady(true)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setAuthSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  const register = useCallback(async ({ name, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { name: name.trim() } },
    })
    if (error) throw new Error(friendly(error))
    remember()
    // Si el proyecto pide confirmar el correo, Supabase no devuelve sesión hasta que se confirme.
    return { needsConfirmation: !data.session }
  }, [])

  const login = useCallback(async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) throw new Error(friendly(error))
    remember()
  }, [])

  const logout = useCallback(() => supabase.auth.signOut(), [])

  if (!ready) return null

  const u = authSession?.user
  const value = {
    session: u?.id ?? null,
    user: u ? { id: u.id, email: u.email, name: u.user_metadata?.name ?? '', createdAt: u.created_at } : null,
    hasAccounts: seen(),
    register,
    login,
    logout,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
