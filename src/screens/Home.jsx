import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowRight, Check, Flame, Sparkles } from 'lucide-react'
import { STEPS } from '../data'
import { currentStepIndex, hasStarted, nextActivities, streak, useStore } from '../store'
import { Button, Card, ProgressBar, Screen } from '../ui'

const QUICK = ['¿Cómo saco el RUT?', '¿Cuánto cobrar?']

const streakText = ({ days, today }) => {
  const dias = days === 1 ? '1 día' : `${days} días seguidos`
  if (!today) return `Llevas ${dias}. Completa una actividad hoy para no perder tu racha.`
  if (days === 1) return 'Avanzaste hoy. Vuelve mañana para empezar tu racha.'
  return `Llevas ${dias} avanzando.`
}

export default function Home() {
  const { state, update } = useStore()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const ci = currentStepIndex(state.done)
  const step = STEPS[ci]
  const tasks = nextActivities(state.done, 3)
  const started = hasStarted(state.doneAt)
  // Mientras no haya completado nada, la tarjeta principal lleva directo a su primera actividad.
  const first = !started && step ? step.activities.find((a) => !state.done[a.id]) : null
  const racha = streak(state.doneAt)

  const ask = (text) => text.trim() && nav('/asistente', { state: { q: text.trim() } })
  const toggle = (id) => update((s) => ({ done: { ...s.done, [id]: !s.done[id] } }))

  return (
    <Screen>
      <div className="flex flex-col gap-1">
        <h1 className="text-[26px] font-bold">Hola, {state.name}</h1>
        <p className="text-[15px] text-mut">
          {step
            ? started
              ? `Vas muy bien. Hoy toca: ${step.title.toLowerCase()}.`
              : `Empecemos: tu ruta arranca en el paso ${ci + 1}.`
            : 'Completaste toda la ruta.'}
        </p>
        {racha.days > 0 && (
          <p
            className={`mt-2 flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-[13px] font-medium ${racha.today ? 'bg-pri text-white' : 'border border-line bg-white text-ink'}`}
          >
            <Flame size={16} strokeWidth={2} className={racha.today ? 'text-acc' : 'text-pri'} />
            {streakText(racha)}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-xl bg-pri p-4 text-white">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-sub">Tu ruta para emprender</span>
          <span className="font-semibold">{step ? `Paso ${ci + 1} de ${STEPS.length}` : 'Completada'}</span>
        </div>
        <ProgressBar value={ci / STEPS.length} track="bg-white/15" bar="bg-acc" className="h-2" />
        {first ? (
          <>
            <div className="flex flex-col gap-1">
              <p className="text-lg leading-snug font-semibold">{first.title}</p>
              <p className="text-[13px] text-sub">
                Tu primera actividad · {first.meta}
              </p>
            </div>
            <Button
              variant="light"
              className="self-start px-4 py-3"
              onClick={() => nav(`/ruta/${step.id}`, { state: { open: first.id } })}
            >
              Empezar <ArrowRight size={18} />
            </Button>
          </>
        ) : (
          <p className="text-lg leading-snug font-semibold">
            {step ? `Siguiente: ${step.title}` : 'Ya tienes las bases. Sigue usando el asistente y las plantillas.'}
          </p>
        )}
        {step && !first && (
          <Button variant="light" className="self-start px-4 py-3" onClick={() => nav(`/ruta/${step.id}`)}>
            Continuar <ArrowRight size={18} />
          </Button>
        )}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-[17px] font-semibold">¿Tienes una duda?</h2>
        <Card className="flex flex-col gap-3 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              ask(q)
            }}
            className="flex items-center gap-2.5 rounded-[10px] bg-soft px-3.5 py-3"
          >
            <Sparkles size={20} strokeWidth={1.8} className="shrink-0 text-pri" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Pregúntale al asistente de IA…"
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-mut"
            />
          </form>
          <div className="flex flex-wrap gap-2">
            {QUICK.map((t) => (
              <button key={t} onClick={() => ask(t)} className="rounded-full bg-soft px-3 py-1.5 text-[13px] font-medium transition hover:bg-acc active:scale-[0.97]">
                {t}
              </button>
            ))}
          </div>
        </Card>
      </section>

      {tasks.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[17px] font-semibold">Tareas de esta semana</h2>
            <Link to="/ruta" className="text-[13px] font-medium text-mut">
              Ver ruta
            </Link>
          </div>
          <Card className="flex flex-col gap-3 p-4">
            {tasks.map((t) => (
              <label key={t.id} className="group -mx-2 flex cursor-pointer items-center gap-3 rounded-[10px] px-2 py-1 transition-colors hover:bg-soft">
                <input type="checkbox" className="peer sr-only" checked={!!state.done[t.id]} onChange={() => toggle(t.id)} />
                <span className="flex size-[22px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] border-sub/70 peer-checked:border-pri peer-checked:bg-pri">
                  {state.done[t.id] && <Check size={14} className="text-white" strokeWidth={2.5} />}
                </span>
                <span className="text-[15px]">{t.title}</span>
              </label>
            ))}
          </Card>
        </section>
      )}
    </Screen>
  )
}
