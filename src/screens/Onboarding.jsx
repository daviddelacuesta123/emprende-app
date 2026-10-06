import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowRight, Compass, Lightbulb, Rocket } from 'lucide-react'
import { skippedActivities, useStore } from '../store'
import { Button, Screen } from '../ui'

export const STAGES = [
  { id: 'start', Icon: Compass, title: 'Quiero emprender pero no sé por dónde empezar', sub: 'Te ayudamos a encontrar y definir tu idea' },
  { id: 'idea', Icon: Lightbulb, title: 'Ya tengo una idea', sub: 'La validamos y armamos tu plan' },
  { id: 'running', Icon: Rocket, title: 'Ya tengo un negocio en marcha', sub: 'Trámites, finanzas y más clientes' },
]

// Etapa elegida en la portada antes de registrarse (la guarda la pantalla de acceso).
export const STAGE_KEY = 'emprende:etapa'

const pickedStage = () => {
  try {
    const id = sessionStorage.getItem(STAGE_KEY)
    return STAGES.some((s) => s.id === id) ? id : null
  } catch {
    return null
  }
}

export default function Onboarding() {
  const { state, update } = useStore()
  const nav = useNavigate()
  const [name, setName] = useState(state.name)
  const [business, setBusiness] = useState(state.business)
  const [stage, setStage] = useState(() => state.stage ?? pickedStage() ?? 'start')

  const submit = () => {
    update((s) => ({
      onboarded: true,
      name: name.trim(),
      business: business.trim(),
      stage,
      done: { ...skippedActivities(stage), ...s.done },
    }))
    try {
      sessionStorage.removeItem(STAGE_KEY)
    } catch {}
    nav('/', { replace: true })
  }

  return (
    <Screen bottom="none" className="gap-6">
      <div className="flex flex-col gap-2 pt-3">
        <h1 className="text-[28px] leading-tight font-bold">¿En qué punto estás?</h1>
        <p className="text-base text-mut">Armamos tu ruta según tu etapa. No necesitas tener todo claro.</p>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium text-mut">¿Cómo te llamas?</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
          className="rounded-[10px] border border-line bg-white px-4 py-3 text-[15px] outline-none focus:border-pri"
        />
      </label>

      <label className="-mt-2 flex flex-col gap-1.5">
        <span className="text-[13px] font-medium text-mut">Nombre de tu emprendimiento (opcional)</span>
        <input
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          placeholder="Si aún no lo tienes, lo puedes poner después"
          className="rounded-[10px] border border-line bg-white px-4 py-3 text-[15px] outline-none placeholder:text-sub focus:border-pri"
        />
      </label>

      <div role="group" aria-label="Tu etapa" className="flex flex-col gap-3">
        {STAGES.map(({ id, Icon, title, sub }) => {
          const sel = stage === id
          return (
            <button
              key={id}
              type="button"
              aria-pressed={sel}
              onClick={() => setStage(id)}
              className={`flex items-center gap-3.5 rounded-xl border bg-white p-4 text-left transition ${sel ? 'border-2 border-pri' : 'border-line hover:border-sub'} active:scale-[0.99]`}
            >
              <span className={`flex size-11 shrink-0 items-center justify-center rounded-[10px] ${sel ? 'bg-pri text-white' : 'bg-soft text-pri'}`}>
                <Icon size={22} strokeWidth={1.8} />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-base font-semibold">{title}</span>
                <span className="text-[13px] text-mut">{sub}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <Button onClick={submit} disabled={!name.trim()}>
          Empezar mi ruta <ArrowRight size={18} />
        </Button>
        <p className="text-center text-[13px] text-mut">Gratis para empezar</p>
      </div>
    </Screen>
  )
}
