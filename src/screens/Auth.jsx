import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router'
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { GOOGLE_ENABLED, useAuth } from '../auth'
import { APP_NAME, Button, Logo, Screen } from '../ui'

const MIN_PASSWORD = 6

const COPY = {
  register: {
    title: 'Crea tu cuenta',
    sub: 'Guarda tu avance y retoma tu ruta cuando quieras.',
    cta: 'Crear cuenta',
    switchText: '¿Ya tienes cuenta?',
    switchCta: 'Inicia sesión',
  },
  login: {
    title: 'Hola de nuevo',
    sub: 'Ingresa para continuar con tu ruta.',
    cta: 'Ingresar',
    switchText: '¿Aún no tienes cuenta?',
    switchCta: 'Regístrate gratis',
  },
  recover: {
    title: 'Recupera tu contraseña',
    sub: 'Escribe el correo de tu cuenta y te enviaremos un enlace para crear una contraseña nueva.',
    cta: 'Enviarme el enlace',
  },
}

export function Field({ Icon, label, hint, right, ...rest }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-mut">{label}</span>
      <span className="flex items-center gap-2.5 rounded-[10px] border border-line bg-white px-3.5 transition focus-within:border-pri">
        <Icon size={18} strokeWidth={1.8} className="shrink-0 text-sub" />
        <input className="w-full min-w-0 bg-transparent py-3 text-[15px] outline-none placeholder:text-sub" {...rest} />
        {right}
      </span>
      {hint && <span className="text-[12px] text-mut">{hint}</span>}
    </label>
  )
}

export function PasswordToggle({ shown, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={shown ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      className="-mr-1 shrink-0 p-1 text-mut"
    >
      {shown ? <EyeOff size={18} strokeWidth={1.8} /> : <Eye size={18} strokeWidth={1.8} />}
    </button>
  )
}

export function Message({ kind, children }) {
  const styles = kind === 'error' ? 'bg-red-50 text-red-700' : 'bg-soft text-ink'
  return (
    <p role={kind === 'error' ? 'alert' : 'status'} className={`rounded-[10px] px-3.5 py-2.5 text-[13px] font-medium ${styles}`}>
      {children}
    </p>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  )
}

export default function Auth() {
  const { session, hasAccounts, register, login, loginWithGoogle, recover } = useAuth()
  const requested = useLocation().state?.mode
  const [mode, setMode] = useState(requested ?? (hasAccounts ? 'login' : 'register'))
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  if (session) return <Navigate to="/" replace />

  const isReg = mode === 'register'
  const isRecover = mode === 'recover'
  const copy = COPY[mode]
  const emailOk = /^\S+@\S+\.\S+$/.test(form.email.trim())
  const valid = isRecover
    ? emailOk
    : emailOk && (isReg ? form.name.trim() && form.password.length >= MIN_PASSWORD : form.password)

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setError('')
  }

  const switchTo = (m) => {
    setMode(m)
    setError('')
    setNotice('')
  }

  const run = async (task) => {
    setBusy(true)
    setError('')
    try {
      await task()
    } catch (err) {
      setError(err.message)
    }
    setBusy(false)
  }

  const submit = (e) => {
    e.preventDefault()
    if (!valid || busy) return
    run(async () => {
      if (isRecover) {
        await recover(form.email)
        setNotice(
          `Si hay una cuenta con ${form.email.trim()}, te llegará un enlace para crear una contraseña nueva. Revisa también la carpeta de spam.`,
        )
        return
      }
      const result = await (isReg ? register(form) : login(form))
      if (result?.needsConfirmation) {
        setNotice(`Te enviamos un correo a ${form.email.trim()}. Ábrelo para confirmar tu cuenta y luego inicia sesión.`)
        setMode('login')
      }
    })
  }

  return (
    <Screen bottom="none" className="gap-7">
      <Link to="/" className="flex items-center gap-2.5 self-start pt-3">
        <Logo size={34} />
        <span className="text-[17px] font-bold tracking-tight">{APP_NAME}</span>
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] leading-tight font-bold">{copy.title}</h1>
        <p className="text-base text-mut">{copy.sub}</p>
      </div>

      {isRecover ? (
        <button type="button" onClick={() => switchTo('login')} className="-mt-3 flex items-center gap-1.5 self-start text-[14px] font-semibold text-pri">
          <ArrowLeft size={16} /> Volver a iniciar sesión
        </button>
      ) : (
        <div role="tablist" className="grid grid-cols-2 rounded-xl bg-acc/70 p-1">
          {[
            ['register', 'Registro'],
            ['login', 'Iniciar sesión'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={mode === id}
              onClick={() => switchTo(id)}
              className={`rounded-[9px] py-2.5 text-[14px] font-semibold transition ${mode === id ? 'bg-white text-ink shadow-sm' : 'text-mut'}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {GOOGLE_ENABLED && !isRecover && (
        <div className="flex flex-col gap-4">
          <Button type="button" variant="secondary" disabled={busy} onClick={() => run(loginWithGoogle)}>
            <GoogleIcon /> Continuar con Google
          </Button>
          <div className="flex items-center gap-3 text-[13px] text-mut">
            <span className="h-px flex-1 bg-line" />o con tu correo<span className="h-px flex-1 bg-line" />
          </div>
        </div>
      )}

      <form onSubmit={submit} noValidate className="flex flex-1 flex-col gap-4">
        {isReg && (
          <Field Icon={User} label="Nombre" value={form.name} onChange={set('name')} placeholder="Tu nombre" autoComplete="given-name" />
        )}
        <Field
          Icon={Mail}
          label="Correo electrónico"
          type="email"
          inputMode="email"
          value={form.email}
          onChange={set('email')}
          placeholder="tu@correo.com"
          autoComplete="email"
          autoCapitalize="none"
        />
        {!isRecover && (
          <Field
            Icon={Lock}
            label="Contraseña"
            type={showPass ? 'text' : 'password'}
            value={form.password}
            onChange={set('password')}
            placeholder={isReg ? 'Crea una contraseña' : 'Tu contraseña'}
            autoComplete={isReg ? 'new-password' : 'current-password'}
            hint={isReg ? `Mínimo ${MIN_PASSWORD} caracteres` : null}
            right={<PasswordToggle shown={showPass} onToggle={() => setShowPass((v) => !v)} />}
          />
        )}
        {mode === 'login' && (
          <button type="button" onClick={() => switchTo('recover')} className="-mt-2 self-end text-[13px] font-semibold text-pri">
            ¿Olvidaste tu contraseña?
          </button>
        )}

        {error && <Message kind="error">{error}</Message>}
        {notice && !error && <Message>{notice}</Message>}

        <div className="mt-auto flex flex-col gap-3 pt-4">
          <Button type="submit" disabled={!valid || busy}>
            {copy.cta} <ArrowRight size={18} />
          </Button>
          {!isRecover && (
            <p className="text-center text-[13px] text-mut">
              {copy.switchText}{' '}
              <button type="button" onClick={() => switchTo(isReg ? 'login' : 'register')} className="font-semibold text-pri">
                {copy.switchCta}
              </button>
            </p>
          )}
        </div>
      </form>
    </Screen>
  )
}
