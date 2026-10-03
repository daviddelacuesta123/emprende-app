import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { STEPS } from './data'

export const LEGACY_KEY = 'emprende:v1'
export const storeKey = (email) => `${LEGACY_KEY}:${email}`
export const AI_FREE_LIMIT = 10

const monthKey = () => new Date().toISOString().slice(0, 7)

const initial = {
  onboarded: false,
  name: '',
  business: '',
  tier: 'free',
  stage: null,
  done: {},
  calc: {
    costs: [
      { id: 1, label: 'Materiales', value: '' },
      { id: 2, label: 'Empaque', value: '' },
      { id: 3, label: 'Envío', value: '' },
    ],
    margin: 40,
  },
  budget: [
    { id: 1, label: 'Equipos y herramientas', value: '' },
    { id: 2, label: 'Materia prima inicial', value: '' },
    { id: 3, label: 'Trámites y registros', value: '' },
    { id: 4, label: 'Publicidad de lanzamiento', value: '' },
  ],
  plan: {},
  interview: {},
  chat: [],
  ai: { month: monthKey(), used: 0 },
}

function load(key) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      const saved = { ...initial, ...JSON.parse(raw) }
      if (saved.ai.month !== monthKey()) saved.ai = { month: monthKey(), used: 0 }
      return saved
    }
  } catch {}
  return initial
}

const Ctx = createContext(null)

export function StoreProvider({ storageKey, children }) {
  const [state, setState] = useState(() => load(storageKey))

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch {}
  }, [state, storageKey])

  const update = useCallback(
    (patch) => setState((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) })),
    [],
  )

  return <Ctx.Provider value={{ state, update }}>{children}</Ctx.Provider>
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

export const cop = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(
    Number.isFinite(n) ? n : 0,
  )
