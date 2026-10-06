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
  [/same_password|should be different/i, 'La contraseña nueva debe ser distinta a la anterior.'],
  [/not authorized/i, 'Por ahora no podemos enviar correos a esa dirección. Intenta más tarde.'],
  [/provider is not enabled|unsupported provider/i, 'El acceso con Google todavía no está disponible.'],
  [/fetch|network/i, 'No hay conexión. Revisa tu internet e intenta de nuevo.'],
]

export const GOOGLE_ENABLED = import.meta.env.VITE_AUTH_GOOGLE === 'true'

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

  // `legalVersion` queda guardada con la cuenta como prueba de la autorización (Ley 1581).
  const register = useCallback(async ({ name = '', email, password, legalVersion }) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { name: name.trim(), acepto_terminos: legalVersion, acepto_terminos_en: new Date().toISOString() } },
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

  const loginWithGoogle = useCallback(async () => {
    remember()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) throw new Error(friendly(error))
  }, [])

  // Supabase responde igual exista o no la cuenta, para no revelar qué correos están registrados.
  const recover = useCallback(async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/nueva-contrasena`,
    })
    if (error) throw new Error(friendly(error))
  }, [])

  const updatePassword = useCallback(async (password) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw new Error(friendly(error))
  }, [])

  const deleteAccount = useCallback(async () => {
    const { error } = await supabase.rpc('eliminar_mi_cuenta')
    if (error) throw new Error('No pudimos eliminar tu cuenta. Intenta de nuevo.')
    await supabase.auth.signOut({ scope: 'local' })
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
    loginWithGoogle,
    recover,
    updatePassword,
    deleteAccount,
    logout,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
