import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router'
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { useAuth } from '../auth'
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
}

function Field({ Icon, label, hint, right, ...rest }) {
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

export default function Auth() {
  const { session, hasAccounts, register, login } = useAuth()
  const requested = useLocation().state?.mode
  const [mode, setMode] = useState(requested ?? (hasAccounts ? 'login' : 'register'))
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  if (session) return <Navigate to="/" replace />

  const isReg = mode === 'register'
  const copy = COPY[mode]
  const emailOk = /^\S+@\S+\.\S+$/.test(form.email.trim())
  const valid = emailOk && (isReg ? form.name.trim() && form.password.length >= MIN_PASSWORD : form.password)

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setError('')
  }

  const switchTo = (m) => {
    setMode(m)
    setError('')
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!valid || busy) return
    setBusy(true)
    try {
      const result = await (isReg ? register(form) : login(form))
      if (result?.needsConfirmation) {
        setNotice(`Te enviamos un correo a ${form.email.trim()}. Ábrelo para confirmar tu cuenta y luego inicia sesión.`)
        setMode('login')
        setBusy(false)
      }
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
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

      <form onSubmit={submit} noValidate className="flex flex-1 flex-col gap-4">
        {isReg && (
          <Field
            Icon={User}
            label="Nombre"
            value={form.name}
            onChange={set('name')}
            placeholder="Tu nombre"
            autoComplete="given-name"
          />
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
        <Field
          Icon={Lock}
          label="Contraseña"
          type={showPass ? 'text' : 'password'}
          value={form.password}
          onChange={set('password')}
          placeholder={isReg ? 'Crea una contraseña' : 'Tu contraseña'}
          autoComplete={isReg ? 'new-password' : 'current-password'}
          hint={isReg ? `Mínimo ${MIN_PASSWORD} caracteres` : null}
          right={
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              className="-mr-1 shrink-0 p-1 text-mut"
            >
              {showPass ? <EyeOff size={18} strokeWidth={1.8} /> : <Eye size={18} strokeWidth={1.8} />}
            </button>
          }
        />

        {error && (
          <p role="alert" className="rounded-[10px] bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-700">
            {error}
          </p>
        )}
        {notice && !error && (
          <p role="status" className="rounded-[10px] bg-soft px-3.5 py-2.5 text-[13px] font-medium text-ink">
            {notice}
          </p>
        )}

        <div className="mt-auto flex flex-col gap-3 pt-4">
          <Button type="submit" disabled={!valid || busy}>
            {copy.cta} <ArrowRight size={18} />
          </Button>
          <p className="text-center text-[13px] text-mut">
            {copy.switchText}{' '}
            <button type="button" onClick={() => switchTo(isReg ? 'login' : 'register')} className="font-semibold text-pri">
              {copy.switchCta}
            </button>
          </p>
        </div>
      </form>
    </Screen>
  )
}
