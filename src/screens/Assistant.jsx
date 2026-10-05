import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { ArrowUp, Sparkles } from 'lucide-react'
import { reply } from '../assistant'
import { AI_FREE_LIMIT, aiLeft, useStore } from '../store'
import { Screen } from '../ui'

const SUGGESTIONS = ['¿Por dónde empiezo?', '¿Cómo saco el RUT?', '¿Cuánto debo cobrar?', '¿Cómo consigo mis primeros clientes?']

export default function Assistant() {
  const { state, update } = useStore()
  const nav = useNavigate()
  const loc = useLocation()
  const [text, setText] = useState(loc.state?.draft ?? '')
  const [typing, setTyping] = useState(false)
  const handled = useRef(false)
  const endRef = useRef(null)
  const left = aiLeft(state.ai)

  const send = async (raw) => {
    const q = raw.trim()
    if (!q || left === 0 || typing) return
    setText('')
    const nextChat = [...state.chat, { role: 'user', text: q }]
    update((s) => ({ chat: nextChat, ai: { ...s.ai, used: s.ai.used + 1 } }))
    setTyping(true)
    const r = await reply(nextChat)
    update((s) => ({ chat: [...s.chat, { role: 'assistant', ...r }] }))
    setTyping(false)
  }

  useEffect(() => {
    if (loc.state?.q && !handled.current) {
      handled.current = true
      send(loc.state.q)
      nav(loc.pathname, { replace: true })
    }
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [state.chat.length, typing])

  return (
    <Screen className="gap-4">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-pri text-white">
          <Sparkles size={20} strokeWidth={1.8} />
        </span>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold">Asistente</h1>
          <span className="text-[13px] text-mut">Resuelve tus dudas sobre tu negocio</span>
        </div>
      </div>

      {state.chat.length === 0 && (
        <div className="flex flex-col gap-3 pt-2">
          <p className="text-[15px] text-mut">Pregúntame lo que quieras sobre emprender. Por ejemplo:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} className="rounded-full border border-line bg-white px-3.5 py-2 text-[13px] font-medium">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3">
        {state.chat.map((m, i) =>
          m.role === 'user' ? (
            <div key={i} className="max-w-[80%] self-end rounded-2xl rounded-br-md bg-pri px-3.5 py-3 text-[15px] text-white">
              {m.text}
            </div>
          ) : (
            <div key={i} className="flex max-w-[88%] flex-col gap-2.5 self-start rounded-2xl rounded-bl-md border border-line bg-white px-3.5 py-3">
              <p className="text-[15px] leading-relaxed">{m.text}</p>
              {m.action && (
                <Link to={m.action.to} className="self-start rounded-full bg-soft px-3 py-1.5 text-[13px] font-medium">
                  {m.action.label}
                </Link>
              )}
            </div>
          ),
        )}
        {typing && (
          <div className="self-start rounded-2xl rounded-bl-md border border-line bg-white px-4 py-3 text-[15px] text-mut">Escribiendo…</div>
        )}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-[calc(106px_+_max(0px,_env(safe-area-inset-bottom)_-_24px))] flex flex-col gap-2 bg-bg pt-2 md:bottom-4">
        {left === 0 ? (
          <Link to="/planes" className="rounded-xl bg-pri px-4 py-3.5 text-center text-[15px] font-semibold text-white">
            Usaste tus {AI_FREE_LIMIT} preguntas gratis de este mes · Ver Pro
          </Link>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(text)
            }}
            className="flex items-center gap-2.5 rounded-full border border-line bg-white py-2 pr-2 pl-4"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe tu pregunta…"
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-mut"
            />
            <button disabled={!text.trim() || typing} className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-pri text-white disabled:opacity-40">
              <ArrowUp size={18} />
            </button>
          </form>
        )}
        <p className="text-center text-xs text-mut">
          Te quedan {left} de {AI_FREE_LIMIT} preguntas gratis este mes · Pro: ilimitadas
        </p>
      </div>
    </Screen>
  )
}
