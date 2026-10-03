import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { BackHeader, Button, Screen } from '../ui'

const FREE = [
  ['Ruta completa paso a paso', true],
  ['10 preguntas al asistente IA al mes', true],
  ['Plantillas básicas', true],
  ['Plantillas Pro y exportar a PDF/Excel', false],
]
const PRO = ['Todo lo del plan Gratis', 'Asistente IA ilimitado', 'Todas las plantillas + exportar', 'Recordatorios y tareas semanales']

export default function Plans() {
  const [notice, setNotice] = useState(false)
  return (
    <Screen bottom="none" className="gap-[18px]">
      <BackHeader to="/" label="Inicio" />
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[26px] font-bold">Elige tu plan</h1>
        <p className="text-[15px] text-mut">Empieza gratis. Pásate a Pro cuando tu negocio lo necesite.</p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-line bg-white p-[18px]">
        <span className="text-lg font-bold">Gratis</span>
        <span className="text-[30px] font-bold">$0</span>
        {FREE.map(([f, ok]) => (
          <span key={f} className={`flex items-center gap-2.5 text-sm ${ok ? '' : 'text-mut'}`}>
            {ok ? <Check size={18} /> : <X size={18} className="text-sub" />} {f}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-xl bg-pri p-[18px] text-white">
        <span className="flex items-center justify-between">
          <span className="text-lg font-bold">Pro</span>
          <span className="rounded-full bg-acc px-2.5 py-1 text-xs font-semibold text-ink">Recomendado</span>
        </span>
        <span className="flex items-baseline gap-1.5">
          <span className="text-[30px] font-bold">$19.900</span>
          <span className="text-sm text-sub">COP / mes</span>
        </span>
        {PRO.map((f) => (
          <span key={f} className="flex items-center gap-2.5 text-sm">
            <Check size={18} className="text-acc" /> {f}
          </span>
        ))}
        <Button variant="light" onClick={() => setNotice(true)}>
          Probar 7 días gratis
        </Button>
        {notice && <p className="text-center text-[13px] text-sub">Los pagos se activan en la próxima versión. ¡Gracias por tu interés!</p>}
      </div>
    </Screen>
  )
}
