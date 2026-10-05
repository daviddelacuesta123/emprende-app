import { useState } from 'react'
import { useNavigate } from 'react-router'
import { FileText, Lock, Search } from 'lucide-react'
import { TEMPLATES } from '../data'
import { Screen } from '../ui'

const CATS = ['Todas', 'Plan', 'Finanzas', 'Marketing']

export default function Templates() {
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('Todas')
  const norm = (s) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
  const list = TEMPLATES.filter((t) => (cat === 'Todas' || t.cat === cat) && norm(t.title).includes(norm(q)))

  return (
    <Screen className="gap-[18px]">
      <h1 className="text-[26px] font-bold">Plantillas</h1>
      <label className="flex items-center gap-2.5 rounded-[10px] bg-white px-3.5 py-3">
        <Search size={20} strokeWidth={1.8} className="text-mut" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar plantilla…"
          className="w-full bg-transparent text-[15px] outline-none placeholder:text-mut"
        />
      </label>
      <div className="flex gap-2">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-3.5 py-2 text-[13px] font-medium ${cat === c ? 'bg-ink text-white' : 'bg-white'}`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {list.map((t) => (
          <button
            key={t.id}
            onClick={() => nav(t.pro ? '/planes' : `/plantillas/${t.id}`)}
            className="flex flex-col gap-2.5 rounded-xl bg-white p-3.5 text-left"
          >
            <span className="flex items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-lg bg-soft">
                <FileText size={20} strokeWidth={1.8} />
              </span>
              {t.pro && (
                <span className="flex items-center gap-1 rounded-full bg-ink px-2 py-1 text-[11px] font-semibold text-white">
                  <Lock size={12} /> Pro
                </span>
              )}
            </span>
            <span className="text-[15px] leading-snug font-semibold">{t.title}</span>
            <span className="text-xs font-medium text-mut">{t.cat}</span>
          </button>
        ))}
        {list.length === 0 && <p className="col-span-2 py-8 text-center text-[15px] text-mut">No encontramos plantillas con ese nombre.</p>}
      </div>
    </Screen>
  )
}
