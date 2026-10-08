import { useEffect, useId, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { GOOGLE_ENABLED, useAuth } from '../auth'
import { APP_NAME, Button, Logo, Screen } from '../ui'
import { LEGAL_VERSION } from './Legal'
import { STAGE_KEY } from './Onboarding'

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

// La etiqueta solo envuelve el título del campo: el error o la pista se leen como descripción, no como parte del nombre.
export function Field({ Icon, label, hint, error, right, ...rest }) {
  const id = useId()
  const note = error || hint
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-mut">
        {label}
      </label>
      <span
        className={`flex items-center gap-2.5 rounded-[10px] border bg-white px-3.5 transition focus-within:border-pri ${error ? 'border-red-600' : 'border-line'}`}
      >
        <Icon size={18} strokeWidth={1.8} className="shrink-0 text-sub" />
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={note ? `${id}-nota` : undefined}
          className="w-full min-w-0 bg-transparent py-3 text-[15px] outline-none placeholder:text-sub"
          {...rest}
        />
        {right}
      </span>
      {note && (
        <span id={`${id}-nota`} className={`text-[12px] ${error ? 'font-medium text-red-700' : 'text-mut'}`}>
          {note}
        </span>
      )}
    </div>
  )
}

export function PasswordToggle({ shown, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={shown ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      className="-mr-1 shrink-0 rounded-md p-1 text-mut transition-colors hover:text-ink"
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

function LegalLinks() {
  const cls = 'font-semibold text-ink underline underline-offset-2'
  return (
    <>
      <Link to="/terminos" target="_blank" className={cls}>
        Términos y condiciones
      </Link>{' '}
      y la{' '}
      <Link to="/privacidad" target="_blank" className={cls}>
        Política de tratamiento de datos
      </Link>
    </>
  )
}

export default function Auth() {
  const { session, hasAccounts, register, login, loginWithGoogle, recover } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { mode: requested, stage: pickedStage, from, recoverPushed } = location.state ?? {}
  // El modo vive en el historial: "Recuperar" agrega una entrada, así el botón Atrás vuelve al formulario.
  const mode = requested ?? (hasAccounts ? 'login' : 'register')
  const [form, setForm] = useState({ email: '', password: '', accepted: false })
  const [tried, setTried] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  // main.jsx trae aquí los enlaces de correo vencidos o ya usados.
  const [notice, setNotice] = useState(() =>
    new URLSearchParams(location.search).get('enlace') === 'vencido'
      ? 'Ese enlace ya venció o ya se usó. Si aún no confirmaste tu correo, regístrate otra vez con el mismo correo y te enviaremos uno nuevo.'
      : '',
  )
  const [busy, setBusy] = useState(false)
  const formRef = useRef(null)

  // Tras un envío con errores, el foco va al primer campo inválido para que el lector de pantalla lea su aviso.
  useEffect(() => {
    if (attempt) formRef.current?.querySelector('[aria-invalid="true"]')?.focus()
  }, [attempt])

  // Al cambiar de modo (también con Atrás) los avisos del formulario anterior se limpian.
  useEffect(() => {
    setTried(false)
    setError('')
  }, [location.key])

  // La etapa elegida en la portada espera en esta pestaña hasta la bienvenida.
  useEffect(() => {
    if (!pickedStage) return
    try {
      sessionStorage.setItem(STAGE_KEY, pickedStage)
    } catch {}
  }, [pickedStage])

  // Tras entrar, vuelve a la página que se pidió sin sesión (solo rutas internas).
  if (session) return <Navigate to={typeof from === 'string' && /^\/(?!\/)/.test(from) ? from : '/'} replace />

  const isReg = mode === 'register'
  const isRecover = mode === 'recover'
  const copy = COPY[mode]
  const emailOk = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:".]{2,}$/.test(form.email.trim())
  const errors = {
    email: !emailOk && 'Escribe un correo válido, como tu@correo.com.',
    password: !isRecover && (isReg ? form.password.trim().length < MIN_PASSWORD && `Usa al menos ${MIN_PASSWORD} caracteres, sin contar espacios.` : !form.password && 'Escribe tu contraseña.'),
    accepted: isReg && !form.accepted && 'Marca la casilla para continuar.',
  }
  const valid = !Object.values(errors).some(Boolean)
  // Los avisos de cada campo aparecen solo después de intentar enviar.
  const show = (key) => (tried ? errors[key] || null : null)

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setError('')
    // El aviso nombra el correo escrito: si cambia, ya no aplica.
    if (key === 'email') setNotice('')
  }

  const goMode = (m) =>
    navigate(location.pathname + location.search, {
      state: { ...location.state, mode: m, recoverPushed: m === 'recover' },
      replace: m !== 'recover',
    })

  const switchTo = (m) => {
    goMode(m)
    setNotice('')
  }

  // Si "Recuperar" se abrió desde este formulario, volver es retroceder en el historial.
  const leaveRecover = () => (recoverPushed ? navigate(-1) : switchTo('login'))

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
    if (busy) return
    if (!valid) {
      setTried(true)
      setAttempt((n) => n + 1)
      return
    }
    run(async () => {
      if (isRecover) {
        await recover(form.email)
        setNotice(
          `Si hay una cuenta con ${form.email.trim()}, te llegará un enlace para crear una contraseña nueva. Revisa también la carpeta de spam.`,
        )
        return
      }
      const result = await (isReg ? register({ ...form, legalVersion: LEGAL_VERSION }) : login(form))
      if (result?.needsConfirmation) {
        goMode('login')
        setNotice(`Te enviamos un correo a ${form.email.trim()}. Ábrelo para confirmar tu cuenta y luego inicia sesión.`)
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
        <button type="button" onClick={leaveRecover} className="-mt-3 flex items-center gap-1.5 self-start text-[14px] font-semibold text-pri underline-offset-2 hover:underline">
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
              className={`rounded-[9px] py-2.5 text-[14px] font-semibold transition ${mode === id ? 'bg-white text-ink shadow-sm' : 'text-ink/70 hover:bg-white/50 hover:text-ink'}`}
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
          <p className="-mt-1 text-center text-[12px] text-mut">
            Al continuar con Google confirmas que tienes 18 años o más y aceptas los <LegalLinks />.
          </p>
          <div className="flex items-center gap-3 text-[13px] text-mut">
            <span className="h-px flex-1 bg-line" />o con tu correo<span className="h-px flex-1 bg-line" />
          </div>
        </div>
      )}

      <form ref={formRef} onSubmit={submit} noValidate className="flex flex-1 flex-col gap-4">
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
          error={show('email')}
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
            error={show('password')}
            right={<PasswordToggle shown={showPass} onToggle={() => setShowPass((v) => !v)} />}
          />
        )}
        {isReg && (
          <div className="flex flex-col gap-1.5">
            <label className="flex items-start gap-3 text-[13px] leading-snug text-mut">
              <input
                type="checkbox"
                checked={form.accepted}
                onChange={(e) => setForm((f) => ({ ...f, accepted: e.target.checked }))}
                aria-invalid={show('accepted') ? true : undefined}
                aria-describedby={show('accepted') ? 'acepto-error' : undefined}
                className="mt-0.5 size-[18px] shrink-0 accent-pri"
              />
              <span>
                Tengo 18 años o más y acepto los <LegalLinks />, incluida la transferencia de mis datos a proveedores fuera de Colombia.
              </span>
            </label>
            {show('accepted') && (
              <span id="acepto-error" className="pl-[30px] text-[12px] font-medium text-red-700">
                {show('accepted')}
              </span>
            )}
          </div>
        )}
        {mode === 'login' && (
          <button type="button" onClick={() => switchTo('recover')} className="-mt-2 self-end text-[13px] font-semibold text-pri underline-offset-2 hover:underline">
            ¿Olvidaste tu contraseña?
          </button>
        )}

        {error && <Message kind="error">{error}</Message>}
        {notice && !error && <Message>{notice}</Message>}

        <div className="mt-auto flex flex-col gap-3 pt-4">
          <Button type="submit" disabled={busy}>
            {copy.cta} <ArrowRight size={18} />
          </Button>
          {isReg && <p className="-mt-1 text-center text-[13px] text-mut">Gratis. Sin tarjeta.</p>}
          {!isRecover && (
            <p className="text-center text-[13px] text-mut">
              {copy.switchText}{' '}
              <button type="button" onClick={() => switchTo(isReg ? 'login' : 'register')} className="font-semibold text-pri underline-offset-2 hover:underline">
                {copy.switchCta}
              </button>
            </p>
          )}
        </div>
      </form>
    </Screen>
  )
}
