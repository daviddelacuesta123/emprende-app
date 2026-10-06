import { useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router'
import { ArrowRight, BookOpen, Check, FileText, Lightbulb, PenLine, Sparkles, Users } from 'lucide-react'
import { STEPS, TEMPLATES } from '../data'
import { hasStarted, stepProgress, useStore } from '../store'
import { BackHeader, BottomBar, Button, Card, ProgressBar, Screen, Sheet } from '../ui'

const TYPE_ICON = { read: BookOpen, exercise: PenLine, template: Users, ai: Sparkles }

export default function StepDetail() {
  const { id } = useParams()
  const { state, update } = useStore()
  const nav = useNavigate()
  // El Inicio puede pedir que se abra una actividad directamente.
  const [openId, setOpenId] = useState(useLocation().state?.open ?? null)
  // Actividad recién completada cuando es la primera de la persona: muestra el aviso en lugar de cerrar.
  const [firstWin, setFirstWin] = useState(null)

  const idx = STEPS.findIndex((s) => s.id === id)
  if (idx === -1) return <Navigate to="/ruta" replace />
  const step = STEPS[idx]
  const p = stepProgress(step, state.done)
  const nextAct = step.activities.find((a) => !state.done[a.id])
  const nextIdx = step.activities.indexOf(nextAct)
  const open = step.activities.find((a) => a.id === openId)
  const template = TEMPLATES.find((t) => t.id === step.template)
  const nextStep = STEPS[idx + 1]

  const setDone = (actId, value) => update((s) => ({ done: { ...s.done, [actId]: value } }))
  const closeSheet = () => {
    setOpenId(null)
    setFirstWin(null)
  }
  const afterWin = firstWin && step.activities.find((a) => !state.done[a.id] && a.id !== firstWin)

  return (
    <Screen bottom="cta" className="gap-[18px]">
      <BackHeader to="/ruta" label="Ruta" right={`Paso ${idx + 1} de ${STEPS.length}`} />

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl leading-tight font-bold">{step.title}</h1>
        <p className="text-[15px] text-mut">{step.intro}</p>
        <div className="flex items-center gap-2.5 pt-1">
          <ProgressBar value={p.n / p.total} className="flex-1" />
          <span className="text-[13px] font-medium text-mut">
            {p.n} de {p.total} · {step.time}
          </span>
        </div>
      </div>

      <Card className="divide-y divide-line">
        {step.activities.map((a) => {
          const done = !!state.done[a.id]
          const now = a === nextAct
          const Icon = TYPE_ICON[a.type]
          return (
            <button key={a.id} onClick={() => setOpenId(a.id)} className="flex w-full items-center gap-3 p-3.5 text-left">
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full ${done ? 'bg-pri text-white' : now ? 'bg-acc' : 'bg-soft text-mut'}`}
              >
                {done ? <Check size={16} strokeWidth={2.2} /> : <Icon size={16} strokeWidth={1.8} />}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className={`text-[15px] ${now ? 'font-semibold' : 'font-medium'} ${done ? 'text-mut' : ''}`}>{a.title}</span>
                <span className="text-[13px] text-mut">{now ? `Siguiente · ${a.meta}` : a.meta}</span>
              </span>
              {now && <ArrowRight size={18} strokeWidth={1.8} />}
            </button>
          )
        })}
      </Card>

      {template && (
        <section className="flex flex-col gap-2.5">
          <h2 className="text-[15px] font-semibold">Plantilla para este paso</h2>
          <Card as="button" onClick={() => nav(`/plantillas/${template.id}`)} className="flex items-center gap-3 p-3.5 text-left">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-soft">
              <FileText size={18} strokeWidth={1.8} />
            </span>
            <span className="flex-1 text-[15px] font-medium">{template.title}</span>
            <span className="text-sm font-semibold">Abrir</span>
          </Card>
        </section>
      )}

      <div className="flex gap-3 rounded-xl bg-soft p-3.5">
        <Lightbulb size={20} strokeWidth={1.8} className="shrink-0" />
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-semibold">Consejo</span>
          <span className="text-[13px] text-mut">{step.tip}</span>
        </div>
      </div>

      <BottomBar>
        {nextAct ? (
          <Button className="flex-1" onClick={() => setOpenId(nextAct.id)}>
            {p.n === 0 ? 'Empezar' : 'Seguir con'} actividad {nextIdx + 1} <ArrowRight size={18} />
          </Button>
        ) : nextStep ? (
          <Button className="flex-1" onClick={() => nav(`/ruta/${nextStep.id}`)}>
            Ir al paso {idx + 2} <ArrowRight size={18} />
          </Button>
        ) : (
          <Button className="flex-1" onClick={() => nav('/')}>
            Volver al inicio
          </Button>
        )}
      </BottomBar>

      <Sheet open={!!open || !!firstWin} onClose={closeSheet}>
        {firstWin ? (
          <div className="flex flex-col gap-4">
            <span className="flex size-11 items-center justify-center rounded-full bg-pri text-white">
              <Check size={22} strokeWidth={2.4} />
            </span>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-xl leading-snug font-bold">Hiciste tu primera actividad</h3>
              <p className="text-[15px] leading-relaxed text-mut">Vuelve mañana para empezar tu racha. Cada actividad completada suma a tu avance.</p>
            </div>
            <div className="flex flex-col gap-2.5 pt-1">
              {afterWin && (
                <Button
                  onClick={() => {
                    setFirstWin(null)
                    setOpenId(afterWin.id)
                  }}
                >
                  Seguir con la siguiente <ArrowRight size={18} />
                </Button>
              )}
              <Button variant={afterWin ? 'secondary' : 'primary'} onClick={() => nav('/')}>
                Volver al inicio
              </Button>
            </div>
          </div>
        ) : open && (
          <div className="flex flex-col gap-4">
            <span className="text-[13px] font-medium text-mut">{open.meta}</span>
            <h3 className="-mt-2 text-xl leading-snug font-bold">{open.title}</h3>
            <p className="text-[15px] leading-relaxed text-ink/80">{open.body}</p>
            <div className="flex flex-col gap-2.5 pt-1">
              {open.type === 'template' && (
                <Button variant="secondary" onClick={() => nav(`/plantillas/${open.template}`)}>
                  <FileText size={18} /> Abrir plantilla
                </Button>
              )}
              {open.type === 'ai' && (
                <Button variant="secondary" onClick={() => nav('/asistente', { state: { draft: open.ask } })}>
                  <Sparkles size={18} /> Ir al asistente
                </Button>
              )}
              {state.done[open.id] ? (
                <Button variant="light" onClick={() => setDone(open.id, false)}>
                  Marcar como pendiente
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    const isFirst = !hasStarted(state.doneAt)
                    setDone(open.id, true)
                    setOpenId(null)
                    if (isFirst) setFirstWin(open.id)
                  }}
                >
                  <Check size={18} /> Marcar como hecha
                </Button>
              )}
            </div>
          </div>
        )}
      </Sheet>
    </Screen>
  )
}
