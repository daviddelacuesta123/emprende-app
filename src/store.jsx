import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { STEPS } from './data'
import { supabase } from './supabase'

// Debe coincidir con el límite de private.contar_pregunta() en la base de datos.
export const AI_FREE_LIMIT = 10
export const aiLeft = (ai) => Math.max(0, AI_FREE_LIMIT - ai.used)

const monthKey = () => new Date().toISOString().slice(0, 7)
const TEXT_DELAY = 700

const DEFAULT_COSTS = {
  precio: ['Materiales', 'Empaque', 'Envío'],
  presupuesto: ['Equipos y herramientas', 'Materia prima inicial', 'Trámites y registros', 'Publicidad de lanzamiento'],
}

const defaultRows = (plantilla) => DEFAULT_COSTS[plantilla].map((label, i) => ({ id: `d${i}`, label, value: '' }))

const toRows = (rows, plantilla) => {
  const mine = rows.filter((r) => r.plantilla === plantilla)
  if (!mine.length) return defaultRows(plantilla)
  return mine.map((r) => ({ id: r.id, label: r.concepto, value: r.valor == null ? '' : String(r.valor) }))
}

const toMessage = (m) => ({ role: m.rol, text: m.texto, ...(m.accion ? { action: m.accion } : {}) })

async function loadState(userId) {
  const results = await Promise.all([
    supabase.from('perfiles').select('*').eq('id', userId).maybeSingle(),
    supabase.from('actividades_completadas').select('actividad_id, completada_en'),
    supabase.from('costos').select('id, plantilla, concepto, valor, orden').order('orden'),
    supabase.from('plan_negocio').select('bloque, contenido'),
    supabase.from('mensajes_chat').select('rol, texto, accion').order('id'),
    supabase.from('uso_asistente').select('preguntas').eq('mes', monthKey()).maybeSingle(),
  ])
  const failed = results.find((r) => r.error)
  if (failed) throw failed.error
  const [perfil, actividades, costos, plan, chat, uso] = results.map((r) => r.data)
  if (!perfil) throw new Error('No se encontró el perfil del usuario.')

  return {
    name: perfil.nombre,
    business: perfil.emprendimiento,
    tier: perfil.plan,
    stage: perfil.etapa,
    onboarded: perfil.onboarded,
    done: Object.fromEntries(actividades.map((a) => [a.actividad_id, true])),
    doneAt: Object.fromEntries(actividades.map((a) => [a.actividad_id, a.completada_en])),
    calc: { costs: toRows(costos, 'precio'), margin: perfil.margen_ganancia },
    budget: toRows(costos, 'presupuesto'),
    plan: Object.fromEntries(plan.map((b) => [b.bloque, b.contenido])),
    chat: chat.map(toMessage),
    ai: { month: monthKey(), used: uso?.preguntas ?? 0 },
  }
}

// Guarda en Supabase solo lo que cambió entre `prev` y `next`.
function createSync(userId, { onError, onLimit }) {
  const queues = {}
  const timers = {}

  // Las escrituras de una misma clave van en orden, una después de otra.
  const enqueue = (key, task) => {
    queues[key] = (queues[key] ?? Promise.resolve()).then(async () => {
      try {
        const { error } = await task()
        if (error) throw error
      } catch (error) {
        if (String(error?.message).includes('limite_preguntas')) onLimit()
        else onError(error)
      }
    })
  }

  const pending = {}

  const later = (key, task) => {
    clearTimeout(timers[key])
    pending[key] = task
    timers[key] = setTimeout(() => {
      delete pending[key]
      enqueue(key, task)
    }, TEXT_DELAY)
  }

  // Envía ya lo que estaba esperando, por ejemplo si se cierra o se oculta la pestaña.
  const flush = () => {
    for (const key of Object.keys(pending)) {
      clearTimeout(timers[key])
      enqueue(key, pending[key])
      delete pending[key]
    }
  }

  const saveCosts = (plantilla, rows) => () =>
    supabase.rpc('guardar_costos', {
      p_plantilla: plantilla,
      p_filas: rows.map((r) => ({
        concepto: r.label ?? '',
        valor: r.value === '' || r.value == null ? null : Number(r.value),
      })),
    })

  const sync = (prev, next) => {
    const perfil = {}
    if (next.name !== prev.name) perfil.nombre = next.name
    if (next.business !== prev.business) perfil.emprendimiento = next.business
    if (next.stage !== prev.stage) perfil.etapa = next.stage
    if (next.onboarded !== prev.onboarded) perfil.onboarded = next.onboarded
    if (next.calc.margin !== prev.calc.margin) perfil.margen_ganancia = next.calc.margin
    if (Object.keys(perfil).length) enqueue('perfil', () => supabase.from('perfiles').update(perfil).eq('id', userId))

    if (next.done !== prev.done) {
      const added = Object.keys(next.done).filter((id) => next.done[id] && !prev.done[id])
      const removed = Object.keys(prev.done).filter((id) => prev.done[id] && !next.done[id])
      if (added.length)
        enqueue('done', () =>
          supabase
            .from('actividades_completadas')
            .upsert(added.map((actividad_id) => ({ user_id: userId, actividad_id })), {
              onConflict: 'user_id,actividad_id',
              ignoreDuplicates: true,
            }),
        )
      if (removed.length)
        enqueue('done', () => supabase.from('actividades_completadas').delete().in('actividad_id', removed))
    }

    if (next.calc.costs !== prev.calc.costs) later('costos:precio', saveCosts('precio', next.calc.costs))
    if (next.budget !== prev.budget) later('costos:presupuesto', saveCosts('presupuesto', next.budget))

    if (next.plan !== prev.plan) {
      for (const bloque of Object.keys(next.plan)) {
        if (next.plan[bloque] === prev.plan[bloque]) continue
        const contenido = next.plan[bloque]
        later(`plan:${bloque}`, () =>
          supabase.from('plan_negocio').upsert({ user_id: userId, bloque, contenido }, { onConflict: 'user_id,bloque' }),
        )
      }
    }

    if (next.chat !== prev.chat) {
      if (next.chat.length === 0 && prev.chat.length > 0) {
        enqueue('chat', () => supabase.from('mensajes_chat').delete().eq('user_id', userId))
      } else if (next.chat.length > prev.chat.length) {
        const nuevos = next.chat.slice(prev.chat.length)
        enqueue('chat', () =>
          supabase.from('mensajes_chat').insert(
            nuevos.map((m) => ({ user_id: userId, rol: m.role, texto: m.text, accion: m.action ?? null })),
          ),
        )
      }
    }
  }

  return { sync, flush }
}

const Ctx = createContext(null)

export function StoreProvider({ userId, children }) {
  const [state, setState] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [saveError, setSaveError] = useState(false)
  const stateRef = useRef(null)
  const syncRef = useRef(null)

  const load = useCallback(() => {
    setLoadError(null)
    loadState(userId)
      .then((s) => {
        stateRef.current = s
        setState(s)
      })
      .catch((error) => {
        console.error('[supabase] No se pudieron cargar los datos', error)
        setLoadError(error)
      })
  }, [userId])

  useEffect(() => {
    syncRef.current = createSync(userId, {
      onError: (error) => {
        console.error('[supabase] No se pudo guardar', error)
        setSaveError(true)
      },
      onLimit: () => {
        const s = { ...stateRef.current, ai: { ...stateRef.current.ai, used: AI_FREE_LIMIT } }
        stateRef.current = s
        setState(s)
      },
    })
    load()

    const flush = () => syncRef.current?.flush()
    const onVisibility = () => document.visibilityState === 'hidden' && flush()
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', flush)
    return () => {
      flush()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', flush)
    }
  }, [userId, load])

  useEffect(() => {
    if (!saveError) return
    const t = setTimeout(() => setSaveError(false), 5000)
    return () => clearTimeout(t)
  }, [saveError])

  const update = useCallback((patch) => {
    const prev = stateRef.current
    const next = { ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }
    if (next.done !== prev.done) {
      const now = new Date().toISOString()
      next.doneAt = Object.fromEntries(
        Object.keys(next.done)
          .filter((id) => next.done[id])
          .map((id) => [id, prev.doneAt[id] ?? now]),
      )
    }
    stateRef.current = next
    setState(next)
    syncRef.current.sync(prev, next)
  }, [])

  if (loadError) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-[17px] font-semibold">No pudimos cargar tus datos</p>
        <p className="max-w-sm text-[15px] text-mut">Revisa tu conexión a internet e intenta de nuevo.</p>
        <button onClick={load} className="rounded-[10px] bg-pri px-5 py-3 text-[15px] font-semibold text-white">
          Reintentar
        </button>
      </div>
    )
  }

  if (!state) return <div className="min-h-dvh" aria-busy="true" />

  return (
    <Ctx.Provider value={{ state, update }}>
      {children}
      {saveError && (
        <div
          role="alert"
          className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-pri px-4 py-2.5 text-[13px] font-medium text-white shadow-lg"
        >
          No se pudo guardar. Revisa tu conexión.
        </div>
      )}
    </Ctx.Provider>
  )
}

export const useStore = () => useContext(Ctx)

export const stepProgress = (step, done) => {
  const n = step.activities.filter((a) => done[a.id]).length
  return { n, total: step.activities.length, complete: n === step.activities.length }
}

export const currentStepIndex = (done) => {
  const i = STEPS.findIndex((s) => !stepProgress(s, done).complete)
  return i === -1 ? STEPS.length : i
}

export const nextActivities = (done, k = 3) =>
  STEPS.flatMap((s) => s.activities.map((a) => ({ ...a, step: s })))
    .filter((a) => !done[a.id])
    .slice(0, k)

const dayKey = (date) => new Date(date).toLocaleDateString('en-CA')

// Días seguidos con al menos una actividad completada, contando hasta hoy o hasta ayer.
export const streak = (doneAt) => {
  const days = new Set(Object.values(doneAt).map(dayKey))
  const day = new Date()
  const today = days.has(dayKey(day))
  if (!today) day.setDate(day.getDate() - 1)
  let n = 0
  while (days.has(dayKey(day))) {
    n += 1
    day.setDate(day.getDate() - 1)
  }
  return { days: n, today }
}

export const cop = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(
    Number.isFinite(n) ? n : 0,
  )
