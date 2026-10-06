import { Link } from 'react-router'
import { ArrowRight, Check } from 'lucide-react'
import { STEPS } from '../data'
import { currentStepIndex, stepProgress, useStore } from '../store'
import { Screen } from '../ui'

export default function RouteList() {
  const { state } = useStore()
  const ci = currentStepIndex(state.done)

  return (
    <Screen>
      <div className="flex flex-col gap-1">
        <h1 className="text-[26px] font-bold">Tu ruta</h1>
        <p className="text-[15px] text-mut">6 pasos para pasar de la idea a tus primeros clientes. A tu ritmo, 15 minutos al día.</p>
      </div>
      <div className="flex flex-col gap-2.5">
        {STEPS.map((s, i) => {
          const p = stepProgress(s, state.done)
          const now = i === ci
          return (
            <Link
              key={s.id}
              to={`/ruta/${s.id}`}
              className={`flex items-center gap-3.5 rounded-xl bg-white px-4 py-3.5 transition active:scale-[0.99] ${now ? 'border-2 border-pri hover:shadow-[0_10px_24px_-14px_rgb(15_23_42/0.35)]' : 'border border-line hover:border-sub'}`}
            >
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[15px] ${
                  p.complete ? 'bg-pri text-white' : now ? 'bg-acc font-bold' : 'bg-soft font-semibold text-mut'
                }`}
              >
                {p.complete ? <Check size={18} strokeWidth={2.2} /> : i + 1}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className={`text-base font-semibold ${!p.complete && !now ? 'text-ink/80' : ''}`}>{s.title}</span>
                <span className="text-[13px] text-mut">
                  {now ? `En curso · ${p.n} de ${p.total} actividades` : s.short}
                </span>
              </span>
              {now && <ArrowRight size={20} strokeWidth={1.8} />}
            </Link>
          )
        })}
      </div>
    </Screen>
  )
}
