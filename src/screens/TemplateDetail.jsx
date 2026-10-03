import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { Check, Copy, Download, Lock, Plus, Sparkles, X } from 'lucide-react'
import { INTERVIEW_QUESTIONS, PLAN_BLOCKS, TEMPLATES } from '../data'
import { cop, useStore } from '../store'
import { BackHeader, BottomBar, Button, Card, Screen } from '../ui'

const toNum = (v) => Number(String(v).replace(/\D/g, '')) || 0
const sum = (items) => items.reduce((a, i) => a + toNum(i.value), 0)

export default function TemplateDetail() {
  const { id } = useParams()
  const t = TEMPLATES.find((x) => x.id === id)
  if (!t || t.pro) return <Navigate to={t ? '/planes' : '/plantillas'} replace />
  const Body = { plan: BusinessPlan, precio: PriceCalculator, presupuesto: Budget, guion: Interview }[id]
  return (
    <Screen bottom="cta" className="gap-4">
      <BackHeader to="/plantillas" label="Plantillas" right={<SavedBadge />} />
      <Body title={t.title} />
    </Screen>
  )
}

function SavedBadge() {
  return (
    <span className="flex items-center gap-1">
      <Check size={14} /> Guardado
    </span>
  )
}

function Title({ title, sub }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="text-2xl leading-tight font-bold">{title}</h1>
      <p className="text-[15px] text-mut">{sub}</p>
    </div>
  )
}

function CostList({ heading, items, onChange }) {
  const set = (id, patch) => onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)))
  const add = () => onChange([...items, { id: Date.now(), label: '', value: '' }])
  const remove = (id) => onChange(items.filter((i) => i.id !== id))
  return (
    <Card className="divide-y divide-line">
      <p className="px-3.5 pt-3.5 pb-1.5 text-[11px] font-semibold tracking-wide text-mut">{heading}</p>
      {items.map((i) => (
        <div key={i.id} className="flex items-center gap-2 px-3.5 py-2.5">
          <input
            value={i.label}
            onChange={(e) => set(i.id, { label: e.target.value })}
            placeholder="Concepto"
            className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-sub"
          />
          <span className="flex items-center rounded-lg bg-soft px-2.5 py-1.5">
            <span className="text-[15px] text-mut">$</span>
            <input
              inputMode="numeric"
              value={i.value === '' ? '' : toNum(i.value).toLocaleString('es-CO')}
              onChange={(e) => set(i.id, { value: e.target.value.replace(/\D/g, '') })}
              placeholder="0"
              className="w-20 bg-transparent text-right text-[15px] font-medium outline-none placeholder:text-sub"
            />
          </span>
          <button onClick={() => remove(i.id)} aria-label="Eliminar" className="p-1 text-sub">
            <X size={16} />
          </button>
        </div>
      ))}
      <button onClick={add} className="flex w-full items-center gap-1.5 px-3.5 py-3 text-sm font-medium text-mut">
        <Plus size={16} /> Agregar costo
      </button>
    </Card>
  )
}

function ResultCard({ label, value, rows }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-pri p-[18px] text-white">
      <span className="text-[13px] font-medium text-sub">{label}</span>
      <span className="text-[34px] leading-none font-bold">{value}</span>
      {rows && (
        <div className="flex flex-col gap-2 border-t border-white/10 pt-3">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm">
              <span className="text-sub">{k}</span>
              <span className="font-semibold">{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ProButton({ label }) {
  const nav = useNavigate()
  return (
    <Button className="flex-1 px-3" onClick={() => nav('/planes')}>
      <Lock size={16} /> {label}
    </Button>
  )
}

function PriceCalculator({ title }) {
  const { state, update } = useStore()
  const nav = useNavigate()
  const { costs, margin } = state.calc
  const total = sum(costs)
  const price = total / (1 - margin / 100)
  const setCalc = (patch) => update((s) => ({ calc: { ...s.calc, ...patch } }))

  return (
    <>
      <Title title={title} sub="Descubre cuánto cobrar por unidad sin perder dinero." />
      <CostList heading="COSTOS POR UNIDAD" items={costs} onChange={(c) => setCalc({ costs: c })} />
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between text-[15px] font-semibold">
          <span>Margen de ganancia</span>
          <span>{margin} %</span>
        </div>
        <div className="flex gap-1 rounded-[10px] bg-acc p-1">
          {[20, 30, 40, 50].map((m) => (
            <button
              key={m}
              onClick={() => setCalc({ margin: m })}
              className={`flex-1 rounded-lg py-2 text-sm ${margin === m ? 'bg-white font-semibold' : 'font-medium text-mut'}`}
            >
              {m} %
            </button>
          ))}
        </div>
      </div>
      <ResultCard
        label="Precio sugerido por unidad"
        value={cop(price)}
        rows={[
          ['Costo total', cop(total)],
          ['Ganancia por unidad', cop(price - total)],
        ]}
      />
      <BottomBar>
        <Button
          variant="secondary"
          className="flex-1 px-3"
          onClick={() => nav('/asistente', { state: { q: `Mis costos por unidad suman ${cop(total)}. ¿Cuánto debo cobrar?` } })}
        >
          <Sparkles size={16} /> Revisar con IA
        </Button>
        <ProButton label="Exportar Excel" />
      </BottomBar>
    </>
  )
}

function Budget({ title }) {
  const { state, update } = useStore()
  const total = sum(state.budget)
  return (
    <>
      <Title title={title} sub="Todo lo que necesitas pagar antes de tu primera venta." />
      <CostList heading="GASTOS PARA ARRANCAR" items={state.budget} onChange={(b) => update({ budget: b })} />
      <ResultCard label="Necesitas para arrancar" value={cop(total)} />
      <BottomBar>
        <ProButton label="Exportar Excel" />
      </BottomBar>
    </>
  )
}

function BusinessPlan({ title }) {
  const { state, update } = useStore()
  const nav = useNavigate()
  const filled = PLAN_BLOCKS.filter((b) => state.plan[b.id]?.trim()).length
  return (
    <>
      <Title title={title} sub="Responde cada bloque en pocas líneas. La IA te ayuda si te trabas." />
      <p className="-mt-1 text-[13px] font-medium text-mut">
        {filled} de {PLAN_BLOCKS.length} bloques completos
      </p>
      {PLAN_BLOCKS.map((b) => {
        const v = state.plan[b.id] ?? ''
        return (
          <Card key={b.id} className={`flex flex-col gap-1.5 p-3.5 ${v.trim() ? '' : 'border-dashed'}`}>
            <span className="flex items-center justify-between text-[11px] font-semibold tracking-wide text-mut">
              {b.label.toUpperCase()}
              {v.trim() && <Check size={14} className="text-ink" />}
            </span>
            <textarea
              rows={2}
              value={v}
              onChange={(e) => update((s) => ({ plan: { ...s.plan, [b.id]: e.target.value } }))}
              placeholder={b.hint}
              className="field-sizing-content resize-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-sub"
            />
            {!v.trim() && (
              <button
                onClick={() => nav('/asistente', { state: { draft: `Ayúdame a escribir el bloque "${b.label}" de mi plan de negocio. Mi idea es: ` } })}
                className="flex items-center gap-1.5 self-start rounded-full bg-soft px-2.5 py-1.5 text-xs font-medium"
              >
                <Sparkles size={14} /> Sugerir con IA
              </button>
            )}
          </Card>
        )
      })}
      <BottomBar>
        <Button className="flex-1" onClick={() => nav('/planes')}>
          <Download size={18} /> Descargar PDF <Lock size={14} className="opacity-70" />
        </Button>
      </BottomBar>
    </>
  )
}

function Interview({ title }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INTERVIEW_QUESTIONS.map((q, i) => `${i + 1}. ${q}`).join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }
  return (
    <>
      <Title title={title} sub="10 preguntas para entender el problema de tu cliente sin influir en sus respuestas." />
      <Card className="divide-y divide-line">
        {INTERVIEW_QUESTIONS.map((q, i) => (
          <div key={q} className="flex gap-3 p-3.5">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-soft text-xs font-semibold">{i + 1}</span>
            <span className="text-[15px]">{q}</span>
          </div>
        ))}
      </Card>
      <div className="rounded-xl bg-soft p-3.5 text-[13px] text-mut">
        <span className="font-semibold text-ink">Recuerda: </span>
        escucha más de lo que hablas y no presentes tu idea hasta el final.
      </div>
      <BottomBar>
        <Button className="flex-1" onClick={copy}>
          {copied ? <Check size={18} /> : <Copy size={18} />} {copied ? 'Copiadas' : 'Copiar preguntas'}
        </Button>
      </BottomBar>
    </>
  )
}
