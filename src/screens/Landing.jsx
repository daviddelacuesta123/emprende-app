import { useEffect, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router'
import { BookOpen, Check, PenLine, Sparkles } from 'lucide-react'
import { STEPS } from '../data'
import { useAuth } from '../auth'
import { APP_NAME, Logo } from '../ui'

const STEP_DELAY = 0.38
const START = 0.5

const SURVEY = [
  ['Guías paso a paso', 78],
  ['Un asistente para resolver dudas', 60],
  ['Plantillas listas para usar', 58],
]

const btn = 'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-[10px] px-5 py-3 text-[15px] font-semibold transition active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pri'

function CtaRegister({ children = 'Crear mi cuenta gratis', light = false, className = '' }) {
  return (
    <Link to="/acceso" state={{ mode: 'register' }} className={`${btn} ${light ? 'bg-white text-pri' : 'bg-pri text-white'} ${className}`}>
      {children}
    </Link>
  )
}

function RouteDemo() {
  const last = START + STEPS.length * STEP_DELAY
  return (
    <div
      className="animate-rise rounded-2xl border border-line bg-white p-5 shadow-[0_24px_48px_-24px_rgb(15_23_42/0.25)] motion-reduce:animate-none sm:p-6"
      style={{ animationDelay: '0.1s' }}
    >
      <div className="mb-5 flex items-baseline justify-between">
        <span className="font-display text-lg font-semibold">Tu ruta</span>
        <span className="text-[13px] text-mut">15 minutos al día</span>
      </div>
      <ol className="relative flex flex-col gap-4">
        <span aria-hidden="true" className="absolute top-4 bottom-4 left-[15px] w-0.5 bg-line" />
        <span
          aria-hidden="true"
          className="absolute top-4 bottom-4 left-[15px] w-0.5 origin-top animate-grow-y bg-pri motion-reduce:animate-none"
          style={{ animationDelay: `${START}s`, animationDuration: `${STEPS.length * STEP_DELAY}s` }}
        />
        {STEPS.map((s, i) => (
          <li key={s.id} className="relative flex items-center gap-3.5">
            <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-soft text-[13px] font-semibold text-mut">
              {i + 1}
              <span
                className="absolute inset-0 flex animate-pop-in items-center justify-center rounded-full bg-pri text-white motion-reduce:animate-none"
                style={{ animationDelay: `${START + i * STEP_DELAY}s` }}
              >
                <Check size={16} strokeWidth={2.4} />
              </span>
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-[15px] font-semibold">{s.title}</span>
              <span className="text-[13px] text-mut">{s.short}</span>
            </span>
          </li>
        ))}
        <li
          className="relative ml-[46px] animate-pop-in self-start rounded-full bg-pri px-3.5 py-1.5 text-[13px] font-semibold text-white motion-reduce:animate-none"
          style={{ animationDelay: `${last}s` }}
        >
          Tu primera venta
        </li>
      </ol>
    </div>
  )
}

const reducedMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

// Se activa una sola vez, cuando el elemento entra en pantalla.
function useInView(threshold = 0.45) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reducedMotion() || !('IntersectionObserver' in window)) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, inView]
}

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView(0.15)
  return (
    <div
      ref={ref}
      className={`transition duration-700 ease-out motion-reduce:transition-none ${inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// Avanza de 0 a `total`, un paso cada `ms`, cuando `active` se vuelve verdadero.
function useSteps(active, total, ms) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!active) return
    if (reducedMotion()) {
      setN(total)
      return
    }
    let i = 0
    const id = setInterval(() => {
      i += 1
      setN(i)
      if (i >= total) clearInterval(id)
    }, ms)
    return () => clearInterval(id)
  }, [active, total, ms])
  return n
}

function useCountUp(active, target, ms = 1100) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    if (reducedMotion()) {
      setValue(target)
      return
    }
    let frame
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / ms, 1)
      setValue(Math.round((target * (1 - (1 - t) ** 3)) / 100) * 100)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, target, ms])
  return value
}

function Preview({ children, innerRef, className = '' }) {
  return (
    <div ref={innerRef} className={`rounded-2xl border border-line bg-white p-5 ${className}`}>
      {children}
    </div>
  )
}

const ACTIVITIES = [
  [BookOpen, 'De dónde salen las buenas ideas', 'Lectura · 4 min'],
  [PenLine, 'Haz una lista de 10 problemas que ves a tu alrededor', 'Ejercicio · 15 min'],
  [PenLine, 'Elige uno y escribe tu idea en una frase', 'Ejercicio · 10 min'],
  [Sparkles, 'Pídele a la IA que critique tu idea', 'Asistente · 5 min'],
]

function ActivitiesPreview() {
  const [ref, inView] = useInView()
  const done = useSteps(inView, 2, 650)
  return (
    <Preview innerRef={ref}>
      <p className="mb-3 font-display text-base font-semibold">Encuentra y define tu idea</p>
      {ACTIVITIES.map(([Icon, t, meta], i) => {
        const isDone = i < done
        return (
          <div key={t} className="flex items-center gap-3 border-t border-line py-2.5">
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${isDone ? 'bg-pri text-white' : 'bg-soft text-mut'}`}
            >
              {isDone ? (
                <Check size={14} strokeWidth={2.4} className="animate-pop-in motion-reduce:animate-none" />
              ) : (
                <Icon size={14} strokeWidth={1.8} />
              )}
            </span>
            <span className="flex min-w-0 flex-col">
              <span
                className={`text-[14px] font-medium transition-colors duration-300 ${isDone ? 'text-mut line-through decoration-sub' : ''}`}
              >
                {t}
              </span>
              <span className="text-[12px] text-mut">{meta}</span>
            </span>
          </div>
        )
      })}
    </Preview>
  )
}

function ChatPreview() {
  const [ref, inView] = useInView()
  const phase = useSteps(inView, 3, 750)
  return (
    <Preview innerRef={ref} className="min-h-[214px]">
      <div className="flex flex-col gap-3">
        {phase >= 1 && (
          <p className="max-w-[80%] animate-rise self-end rounded-2xl rounded-br-md bg-pri px-3.5 py-2.5 text-[14px] text-white motion-reduce:animate-none">
            ¿Cómo saco el RUT?
          </p>
        )}
        {phase === 2 && (
          <span
            aria-label="Escribiendo"
            className="flex animate-rise gap-1 self-start rounded-2xl rounded-bl-md border border-line px-3.5 py-3.5 motion-reduce:animate-none"
          >
            {[0, 150, 300].map((d) => (
              <span key={d} className="size-1.5 animate-bounce rounded-full bg-sub" style={{ animationDelay: `${d}ms` }} />
            ))}
          </span>
        )}
        {phase >= 3 && (
          <div className="flex max-w-[90%] animate-rise flex-col gap-2 self-start rounded-2xl rounded-bl-md border border-line px-3.5 py-3 motion-reduce:animate-none">
            <p className="text-[14px] leading-relaxed">
              Sacar el RUT es gratis y se hace en línea en dian.gov.co. Solo necesitas tu cédula y un correo electrónico.
            </p>
            <span className="self-start rounded-full bg-soft px-3 py-1 text-[12px] font-medium">Ver paso de trámites</span>
          </div>
        )}
      </div>
    </Preview>
  )
}

const COSTS = [
  ['Materiales', '$ 8.000'],
  ['Empaque', '$ 1.500'],
  ['Envío', '$ 2.500'],
  ['Margen de ganancia', '40 %'],
]

function CalculatorPreview() {
  const [ref, inView] = useInView()
  const rows = useSteps(inView, COSTS.length, 280)
  const price = useCountUp(rows >= COSTS.length, 20000)
  return (
    <Preview innerRef={ref}>
      <p className="mb-3 font-display text-base font-semibold">Calculadora de precio</p>
      {COSTS.map(([k, v], i) => (
        <div key={k} className="flex justify-between border-t border-line py-2 text-[14px]">
          <span className="text-mut">{k}</span>
          <span className={`font-medium transition-opacity duration-300 ${i < rows ? 'opacity-100' : 'opacity-0'}`}>{v}</span>
        </div>
      ))}
      <div className="mt-2 flex items-baseline justify-between rounded-xl bg-pri px-4 py-3 text-white">
        <span className="text-[13px] text-sub">Precio sugerido</span>
        <span className="font-display text-2xl font-extrabold tabular-nums">$ {price.toLocaleString('es-CO')}</span>
      </div>
    </Preview>
  )
}

function SurveyBars() {
  const [ref, inView] = useInView(0.5)
  return (
    <ul ref={ref} className="flex flex-col justify-center gap-6">
      {SURVEY.map(([label, pct], i) => (
        <li key={label} className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-[16px] font-semibold">{label}</span>
            <span className="text-[15px] text-mut tabular-nums">{pct} %</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-soft">
            <div
              className="h-full rounded-full bg-pri transition-[width] duration-1000 ease-out motion-reduce:transition-none"
              style={{ width: inView ? `${pct}%` : '0%', transitionDelay: `${i * 150}ms` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

const TOOLS = [
  {
    title: 'Sabes qué hacer cada día',
    body: 'Cada paso se divide en actividades cortas: lecturas de 4 minutos, ejercicios prácticos y preguntas para el asistente. Marcas lo que terminas y en Inicio siempre ves tus tareas de la semana.',
    Preview: ActivitiesPreview,
  },
  {
    title: 'Resuelves tus dudas sin buscar en mil sitios',
    body: 'Pregunta por el RUT, la Cámara de Comercio, cuánto cobrar o cómo conseguir clientes. Cada respuesta te lleva a la parte de la ruta o a la plantilla que necesitas.',
    Preview: ChatPreview,
  },
  {
    title: 'Haces las cuentas sin saber de finanzas',
    body: 'Plan de negocio en una página, calculadora de precio, presupuesto inicial y guion para entrevistar clientes. Las llenas en la app y se guardan solas.',
    Preview: CalculatorPreview,
  },
]


export default function Landing() {
  const { session } = useAuth()
  if (session) return <Navigate to="/" replace />

  return (
    <div className="min-h-dvh bg-bg text-ink">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-8 sm:py-5">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo size={32} />
          <span className="font-display text-lg font-extrabold tracking-tight">{APP_NAME}</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/acceso"
            state={{ mode: 'login' }}
            className="rounded-[10px] px-3 py-2.5 text-[14px] font-semibold whitespace-nowrap text-mut hover:text-ink"
          >
            Iniciar sesión
          </Link>
          <span className="hidden sm:block">
            <CtaRegister className="px-4 py-2.5 text-[14px]">Crear cuenta</CtaRegister>
          </span>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-8 pb-20 sm:px-8 md:grid-cols-[1.1fr_1fr] md:gap-16 md:pt-16 md:pb-28">
          <div className="flex flex-col gap-6">
            <h1 className="animate-rise font-display text-[44px] leading-[0.98] font-extrabold tracking-[-0.03em] text-pri motion-reduce:animate-none sm:text-[60px] lg:text-[72px]">
              De la idea a tu primera venta, paso a paso.
            </h1>
            <p
              className="max-w-[34rem] animate-rise text-[17px] leading-relaxed text-mut motion-reduce:animate-none sm:text-lg"
              style={{ animationDelay: '0.12s' }}
            >
              {APP_NAME} te dice qué hacer cada día para arrancar tu emprendimiento en Colombia: validar tu idea, ponerle precio, hacer los trámites y conseguir tus primeros clientes.
            </p>
            <div
              className="flex animate-rise flex-col gap-3 motion-reduce:animate-none sm:flex-row sm:items-center sm:gap-5"
              style={{ animationDelay: '0.24s' }}
            >
              <CtaRegister className="px-6 py-3.5 text-base" />
              <span className="text-[14px] text-mut">Gratis para empezar. Sin tarjeta.</span>
            </div>
          </div>
          <RouteDemo />
        </section>

        <section className="border-y border-line bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-8 md:grid-cols-2 md:gap-16 md:py-24">
            <Reveal className="flex flex-col gap-4">
              <p className="font-display text-[34px] leading-[1.05] font-extrabold tracking-[-0.02em] sm:text-[44px]">“No sé por dónde empezar.”</p>
              <p className="max-w-[30rem] text-[17px] leading-relaxed text-mut">
                Es la razón que más se repite entre quienes quieren emprender y no han empezado, según una encuesta que hicimos a 40 jóvenes. Por eso la app se construyó alrededor de lo que más pidieron:
              </p>
            </Reveal>
            <Reveal delay={150} className="flex flex-col justify-center">
              <SurveyBars />
            </Reveal>
          </div>
        </section>

        <section className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-20 sm:px-8 md:gap-24 md:py-28">
          {TOOLS.map((t, i) => (
            <div key={t.title} className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
              <Reveal className={`flex flex-col gap-3 ${i % 2 ? 'md:order-2' : ''}`}>
                <h2 className="font-display text-[30px] leading-[1.1] font-extrabold tracking-[-0.02em] sm:text-[36px]">{t.title}</h2>
                <p className="max-w-[30rem] text-[17px] leading-relaxed text-mut">{t.body}</p>
              </Reveal>
              <Reveal delay={150}>
                <t.Preview />
              </Reveal>
            </div>
          ))}
        </section>

        <section className="border-t border-line bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-20 sm:px-8 md:py-24">
            <Reveal>
              <h2 className="font-display text-[30px] leading-[1.1] font-extrabold tracking-[-0.02em] sm:text-[36px]">Empieza gratis, mejora cuando lo necesites</h2>
            </Reveal>
            <div className="grid gap-4 md:grid-cols-2">
              <Reveal delay={100} className="flex flex-col gap-4 rounded-2xl border border-line p-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-bold">Gratis</span>
                  <span className="font-display text-3xl font-extrabold">$0</span>
                </div>
                <ul className="flex flex-col gap-2.5 text-[15px]">
                  {['La ruta completa de 6 pasos', '10 preguntas al asistente al mes', 'Plantillas básicas'].map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <Check size={18} className="shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={250} className="flex flex-col gap-4 rounded-2xl bg-pri p-6 text-white">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-bold">Pro</span>
                  <span>
                    <span className="font-display text-3xl font-extrabold">$19.900</span>
                    <span className="text-sm text-sub"> COP al mes</span>
                  </span>
                </div>
                <ul className="flex flex-col gap-2.5 text-[15px]">
                  {['Todo lo del plan Gratis', 'Asistente ilimitado', 'Todas las plantillas y exportar a PDF y Excel', 'Recordatorios y tareas semanales'].map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <Check size={18} className="shrink-0 text-acc" /> {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="bg-pri text-white">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:px-8 md:flex-row md:items-center md:justify-between md:py-24">
            <Reveal>
              <h2 className="max-w-[36rem] font-display text-[34px] leading-[1.05] font-extrabold tracking-[-0.02em] sm:text-[44px]">
                Tu primer paso toma 15 minutos.
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <CtaRegister light className="px-6 py-3.5 text-base">
                Empezar mi ruta
              </CtaRegister>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-[13px] text-mut sm:flex-row sm:justify-between sm:px-8">
        <span>© 2026 {APP_NAME}</span>
        <span>Hecho para emprendedores en Colombia</span>
      </footer>
    </div>
  )
}
