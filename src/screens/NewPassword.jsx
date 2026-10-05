import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowRight, Check, Lock } from 'lucide-react'
import { useAuth } from '../auth'
import { APP_NAME, Button, Logo, Screen } from '../ui'
import { Field, Message, PasswordToggle } from './Auth'

const MIN_PASSWORD = 6

export default function NewPassword() {
  const { session, updatePassword } = useAuth()
  const nav = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [shown, setShown] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const mismatch = confirm.length > 0 && confirm !== password
  const valid = password.length >= MIN_PASSWORD && confirm === password

  const submit = async (e) => {
    e.preventDefault()
    if (!valid || busy) return
    setBusy(true)
    setError('')
    try {
      await updatePassword(password)
      setDone(true)
    } catch (err) {
      setError(err.message)
    }
    setBusy(false)
  }

  return (
    <Screen bottom="none" className="gap-7">
      <Link to="/" className="flex items-center gap-2.5 self-start pt-3">
        <Logo size={34} />
        <span className="text-[17px] font-bold tracking-tight">{APP_NAME}</span>
      </Link>

      {!session ? (
        <>
          <div className="flex flex-col gap-2">
            <h1 className="text-[28px] leading-tight font-bold">Este enlace ya no funciona</h1>
            <p className="text-base text-mut">
              Los enlaces para recuperar la contraseña vencen después de un tiempo y solo sirven una vez. Pide uno nuevo.
            </p>
          </div>
          <Link
            to="/acceso"
            state={{ mode: 'recover' }}
            className="flex items-center justify-center gap-2 rounded-[10px] bg-pri px-5 py-3.5 text-[15px] font-semibold text-white"
          >
            Pedir un enlace nuevo <ArrowRight size={18} />
          </Link>
        </>
      ) : done ? (
        <>
          <div className="flex flex-col gap-3">
            <span className="flex size-12 items-center justify-center rounded-full bg-pri text-white">
              <Check size={24} strokeWidth={2.4} />
            </span>
            <h1 className="text-[28px] leading-tight font-bold">Listo, cambiaste tu contraseña</h1>
            <p className="text-base text-mut">Desde ahora entra con tu contraseña nueva.</p>
          </div>
          <Button onClick={() => nav('/', { replace: true })}>
            Ir a mi ruta <ArrowRight size={18} />
          </Button>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <h1 className="text-[28px] leading-tight font-bold">Crea una contraseña nueva</h1>
            <p className="text-base text-mut">Usa al menos {MIN_PASSWORD} caracteres.</p>
          </div>
          <form onSubmit={submit} noValidate className="flex flex-1 flex-col gap-4">
            <Field
              Icon={Lock}
              label="Contraseña nueva"
              type={shown ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña nueva"
              autoComplete="new-password"
              right={<PasswordToggle shown={shown} onToggle={() => setShown((v) => !v)} />}
            />
            <Field
              Icon={Lock}
              label="Repite la contraseña"
              type={shown ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repite la contraseña"
              autoComplete="new-password"
              hint={mismatch ? 'Las contraseñas no coinciden.' : null}
            />
            {error && <Message kind="error">{error}</Message>}
            <div className="mt-auto pt-4">
              <Button type="submit" disabled={!valid || busy} className="w-full">
                Guardar contraseña <ArrowRight size={18} />
              </Button>
            </div>
          </form>
        </>
      )}
    </Screen>
  )
}
