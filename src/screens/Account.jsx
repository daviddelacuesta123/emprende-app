import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ChevronRight, Crown, LogOut, Sparkles, Store } from 'lucide-react'
import { useAuth } from '../auth'
import { STEPS } from '../data'
import { AI_FREE_LIMIT, aiLeft, currentStepIndex, useStore } from '../store'
import { Avatar, Button, Card, ProgressBar, Screen, Sheet } from '../ui'
import { STAGES } from './Onboarding'

const DELETE_WORD = 'ELIMINAR'

const FIELDS = {
  name: { label: 'Tu nombre', placeholder: 'Tu nombre', required: true },
  business: { label: 'Nombre de tu emprendimiento', placeholder: 'Ej: Dulces de la Abuela', required: false },
}

const memberSince = (ts) =>
  ts ? new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' }).format(new Date(ts)) : null

function Row({ label, value, placeholder, onClick, last }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left ${onClick ? 'transition-colors hover:bg-soft' : ''} ${last ? '' : 'border-b border-line'}`}
    >
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[13px] text-mut">{label}</span>
        <span className={`truncate text-[15px] font-medium ${value ? '' : 'text-sub'}`}>{value || placeholder}</span>
      </span>
      {onClick && <ChevronRight size={18} strokeWidth={1.8} className="shrink-0 text-sub" />}
    </Tag>
  )
}

export default function Account() {
  const { state, update } = useStore()
  const { user, logout, deleteAccount } = useAuth()
  const [deleting, setDeleting] = useState(false)
  const [deleteText, setDeleteText] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleteBusy, setDeleteBusy] = useState(false)

  const closeDelete = () => {
    setDeleting(false)
    setDeleteText('')
    setDeleteError('')
  }

  const confirmDelete = async (e) => {
    e.preventDefault()
    if (deleteText.trim().toUpperCase() !== DELETE_WORD || deleteBusy) return
    setDeleteBusy(true)
    try {
      await deleteAccount()
    } catch (err) {
      setDeleteError(err.message)
      setDeleteBusy(false)
    }
  }
  const nav = useNavigate()
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState('')
  const [confirmLogout, setConfirmLogout] = useState(false)

  const isPro = state.tier === 'pro'
  const ci = currentStepIndex(state.done)
  const stage = STAGES.find((s) => s.id === state.stage)
  const since = memberSince(user?.createdAt)
  const field = editing && FIELDS[editing]

  const openEdit = (key) => {
    setDraft(state[key] ?? '')
    setEditing(key)
  }

  const save = (e) => {
    e.preventDefault()
    if (field.required && !draft.trim()) return
    update({ [editing]: draft.trim() })
    setEditing(null)
  }

  return (
    <Screen className="gap-6">
      <div className="flex items-center gap-4 pt-1">
        <Avatar name={state.name} size="size-16 text-[22px]" />
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="truncate text-[22px] font-bold">{state.name}</h1>
          <span className="truncate text-[14px] text-mut">{user?.email}</span>
          {since && <span className="text-[12px] text-sub">Miembro desde {since}</span>}
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-[17px] font-semibold">Tu emprendimiento</h2>
        <Card className="flex flex-col gap-3.5 p-4">
          <button onClick={() => openEdit('business')} className="-m-1.5 flex items-center gap-3 rounded-xl p-1.5 text-left transition-colors hover:bg-soft">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-soft text-pri">
              <Store size={22} strokeWidth={1.8} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className={`truncate text-base font-semibold ${state.business ? '' : 'text-mut'}`}>
                {state.business || 'Ponle nombre a tu emprendimiento'}
              </span>
              <span className="text-[13px] text-mut">{stage ? stage.title : 'Etapa sin definir'}</span>
            </span>
            <ChevronRight size={18} strokeWidth={1.8} className="shrink-0 text-sub" />
          </button>
          <div className="flex flex-col gap-2 border-t border-line pt-3.5">
            <div className="flex justify-between text-[13px]">
              <span className="text-mut">Progreso de tu ruta</span>
              <span className="font-semibold">{ci < STEPS.length ? `Paso ${ci + 1} de ${STEPS.length}` : 'Completada'}</span>
            </div>
            <ProgressBar value={ci / STEPS.length} />
          </div>
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[17px] font-semibold">Tu plan</h2>
        {isPro ? (
          <div className="flex flex-col gap-2 rounded-xl bg-pri p-4 text-white">
            <span className="flex items-center gap-2 text-lg font-bold">
              <Crown size={20} strokeWidth={1.8} className="text-acc" /> Plan Pro
            </span>
            <span className="text-sm text-sub">Asistente IA ilimitado y todas las plantillas.</span>
          </div>
        ) : (
          <Card className="flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">Plan Gratis</span>
              <span className="rounded-full bg-soft px-2.5 py-1 text-xs font-semibold text-mut">Actual</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-[13px] text-mut">
                <Sparkles size={16} strokeWidth={1.8} className="text-pri" />
                Te quedan {aiLeft(state.ai)} de {AI_FREE_LIMIT} preguntas al asistente este mes
              </span>
              <ProgressBar value={aiLeft(state.ai) / AI_FREE_LIMIT} />
            </div>
            <Button onClick={() => nav('/planes')} className="mt-1">
              <Crown size={18} strokeWidth={1.8} /> Mejorar a Pro
            </Button>
          </Card>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[17px] font-semibold">Datos personales</h2>
        <Card className="overflow-hidden">
          <Row label="Nombre" value={state.name} onClick={() => openEdit('name')} />
          <Row label="Correo electrónico" value={user?.email} last />
        </Card>
      </section>

      <div className="mt-auto flex flex-col gap-2 pt-2">
        <Button variant="danger-outline" onClick={() => setConfirmLogout(true)}>
          <LogOut size={18} strokeWidth={1.8} /> Cerrar sesión
        </Button>
        <p className="text-center text-[12px] text-sub">Tu progreso queda guardado en tu cuenta.</p>
        <button
          type="button"
          onClick={() => setDeleting(true)}
          className="mt-3 self-center text-[13px] font-medium text-mut underline underline-offset-2 hover:text-red-600"
        >
          Eliminar mi cuenta
        </button>
        <p className="mt-2 flex justify-center gap-4 text-[12px] text-mut">
          <Link to="/privacidad" className="hover:text-ink">Política de datos</Link>
          <Link to="/terminos" className="hover:text-ink">Términos y condiciones</Link>
        </p>
      </div>

      <Sheet open={!!editing} onClose={() => setEditing(null)}>
        {field && (
          <form onSubmit={save} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[17px] font-semibold">{field.label}</span>
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={field.placeholder}
                className="rounded-[10px] border border-line bg-white px-4 py-3 text-[15px] outline-none placeholder:text-sub focus:border-pri"
              />
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={field.required && !draft.trim()}>
                Guardar
              </Button>
            </div>
          </form>
        )}
      </Sheet>

      <Sheet open={confirmLogout} onClose={() => setConfirmLogout(false)}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[17px] font-semibold">¿Cerrar sesión?</span>
            <span className="text-[14px] text-mut">Tu progreso queda guardado. Puedes volver a ingresar con tu correo y contraseña.</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <Button variant="secondary" onClick={() => setConfirmLogout(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={logout}>
              Cerrar sesión
            </Button>
          </div>
        </div>
      </Sheet>

      <Sheet open={deleting} onClose={closeDelete}>
        <form onSubmit={confirmDelete} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[17px] font-semibold">¿Eliminar tu cuenta?</span>
            <span className="text-[14px] text-mut">
              Se borran para siempre tu cuenta, tu progreso en la ruta, tus plantillas y tus conversaciones con el asistente. No
              se puede deshacer.
            </span>
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-mut">
              Para confirmar, escribe <strong className="text-ink">{DELETE_WORD}</strong>
            </span>
            <input
              value={deleteText}
              onChange={(e) => {
                setDeleteText(e.target.value)
                setDeleteError('')
              }}
              autoCapitalize="characters"
              autoComplete="off"
              className="rounded-[10px] border border-line bg-white px-4 py-3 text-[15px] outline-none focus:border-red-600"
            />
          </label>
          {deleteError && (
            <p role="alert" className="rounded-[10px] bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-700">
              {deleteError}
            </p>
          )}
          <div className="grid grid-cols-2 gap-2.5">
            <Button type="button" variant="secondary" onClick={closeDelete}>
              Cancelar
            </Button>
            <Button type="submit" variant="danger" disabled={deleteText.trim().toUpperCase() !== DELETE_WORD || deleteBusy}>
              Eliminar cuenta
            </Button>
          </div>
        </form>
      </Sheet>
    </Screen>
  )
}
