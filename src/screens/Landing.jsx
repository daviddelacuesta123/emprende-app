import { useEffect, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router'
import { ArrowRight, BookOpen, Check, PenLine, Plus, Sparkles } from 'lucide-react'
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

const REASSURANCE = 'Gratis para empezar. Sin tarjeta.'

const btn = 'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-[10px] px-5 py-3 text-[15px] font-semibold transition active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pri'

function CtaRegister({ children = 'Crear mi cuenta gratis', light = false, className = '' }) {
  const tone = light
    ? 'bg-white text-pri hover:bg-soft'
    : 'bg-pri text-white hover:-translate-y-px hover:shadow-[0_10px_24px_-10px_rgb(15_23_42/0.55)] motion-reduce:hover:translate-y-0'
  return (
    <Link to="/acceso" state={{ mode: 'register' }} className={`${btn} ${tone} ${className}`}>
      {children}
    </Link>
  )
}

function RouteDemo() {
  const [ref, inView] = useInView(0.35)
  const last = START + STEPS.length * STEP_DELAY
  // La ruta se llena cuando la tarjeta entra en pantalla (en celular queda debajo del borde).
  const play = inView ? '' : '[animation-play-state:paused]'
  return (
    <div
      ref={ref}
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
          className={`absolute top-4 bottom-4 left-[15px] w-0.5 origin-top animate-grow-y bg-pri motion-reduce:animate-none ${play}`}
          style={{ animationDelay: `${START}s`, animationDuration: `${STEPS.length * STEP_DELAY}s` }}
        />
        {STEPS.map((s, i) => (
          <li key={s.id} className="relative flex items-center gap-3.5">
            <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-soft text-[13px] font-semibold text-mut">
              {i + 1}
              <span
                aria-hidden="true"
                className={`absolute inset-0 flex animate-pop-in items-center justify-center rounded-full bg-pri text-white motion-reduce:animate-none ${play}`}
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
          aria-hidden="true"
          className={`relative ml-[46px] animate-pop-in self-start rounded-full bg-pri px-3.5 py-1.5 text-[13px] font-semibold text-white motion-reduce:animate-none ${play}`}
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

// Sigue si el elemento está en pantalla, cada vez que entra o sale.
function useVisible(initial) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(initial)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, visible]
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

// Las muestras son ilustraciones: el lector de pantalla oye `summary` en lugar de la animación.
function Preview({ children, innerRef, summary, className = '' }) {
  return (
    <div ref={innerRef}>
      <p className="sr-only">{summary}</p>
      <div aria-hidden="true" className={`rounded-2xl border border-line bg-white p-5 ${className}`}>
        {children}
      </div>
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
    <Preview innerRef={ref} summary="Ejemplo: las actividades del paso 1, con las dos primeras marcadas como hechas.">
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
    <Preview
      innerRef={ref}
      className="min-h-[214px]"
      summary="Ejemplo: le preguntas al asistente cómo sacar el RUT y te responde que es gratis, se hace en línea en dian.gov.co y solo necesitas tu cédula y un correo."
    >
      <div className="flex flex-col gap-3">
        {phase >= 1 && (
          <p className="max-w-[80%] animate-rise self-end rounded-2xl rounded-br-md bg-soft px-3.5 py-2.5 text-[14px] font-medium motion-reduce:animate-none">
            ¿Cómo saco el RUT?
          </p>
        )}
        {phase === 2 && (
          <span className="flex animate-rise gap-1 self-start rounded-2xl rounded-bl-md border border-line px-3.5 py-3.5 motion-reduce:animate-none">
            {[0, 150, 300].map((d) => (
              <span
                key={d}
                className="size-1.5 animate-bounce rounded-full bg-sub motion-reduce:animate-none"
                style={{ animationDelay: `${d}ms` }}
              />
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
  ['Margen sobre el precio', '40 %'],
]

function CalculatorPreview() {
  const [ref, inView] = useInView()
  const rows = useSteps(inView, COSTS.length, 280)
  const price = useCountUp(rows >= COSTS.length, 20000)
  return (
    <Preview
      innerRef={ref}
      summary="Ejemplo: con $ 12.000 de costos y un margen del 40 % sobre el precio, la calculadora sugiere vender a $ 20.000."
    >
      <p className="mb-3 font-display text-base font-semibold">Calculadora de precio</p>
      {COSTS.map(([k, v], i) => (
        <div key={k} className="flex justify-between border-t border-line py-2 text-[14px]">
          <span className="text-mut">{k}</span>
          <span className={`font-medium transition-opacity duration-300 ${i < rows ? 'opacity-100' : 'opacity-0'}`}>{v}</span>
        </div>
      ))}
      <div className="mt-2 flex items-baseline justify-between rounded-xl bg-soft px-4 py-3">
        <span className="text-[13px] font-medium">Precio sugerido</span>
        <span className="font-display text-2xl font-extrabold tabular-nums">$ {price.toLocaleString('es-CO')}</span>
      </div>
    </Preview>
  )
}

function SurveyBars() {
  const [ref, inView] = useInView(0.5)
  return (
    <div className="flex flex-col gap-6">
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
      <p className="text-[13px] text-mut">Lo que pidieron 40 jóvenes en una encuesta de septiembre y octubre de 2026.</p>
    </div>
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

// Las mismas etapas que se eligen en la bienvenida después de registrarse.
const STAGES = [
  ['Todavía no empiezo', 0],
  ['Ya tengo una idea', 1],
  ['Ya vendo algo', 2],
]

function StagePicker() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-8 md:pb-28">
      <Reveal className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-[26px] leading-[1.1] font-extrabold tracking-[-0.02em] sm:text-[30px]">¿En qué punto estás hoy?</h2>
          <p className="max-w-[36rem] text-[16px] leading-relaxed text-mut">
            Al crear tu cuenta eliges tu etapa y la ruta arranca donde te corresponde.
          </p>
        </div>
        <ul className="grid divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white md:grid-cols-3 md:divide-x md:divide-y-0">
          {STAGES.map(([label, step]) => (
            <li key={label}>
              <Link
                to="/acceso"
                state={{ mode: 'register' }}
                className="group flex h-full items-center justify-between gap-4 px-5 py-5 transition-colors hover:bg-soft focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pri sm:px-6"
              >
                <span className="flex flex-col gap-1">
                  <span className="text-[16px] font-semibold">{label}</span>
                  <span className="text-[14px] text-mut">
                    Empiezas en el paso {step + 1}: {STEPS[step].title.toLowerCase()}
                  </span>
                </span>
                <ArrowRight
                  size={18}
                  aria-hidden="true"
                  className="shrink-0 text-mut transition-transform group-hover:translate-x-0.5 group-hover:text-ink motion-reduce:transition-none"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}

const FAQ = [
  [
    '¿Es gratis de verdad?',
    'Sí. El plan Gratis incluye la ruta completa de 6 pasos, 10 preguntas al asistente al mes y las plantillas básicas. No te pedimos tarjeta para crear la cuenta.',
  ],
  [
    '¿Qué pasa cuando me registro?',
    'Creas tu cuenta con nombre, correo y contraseña. Luego eliges en qué punto estás: si todavía no empiezas, arrancas en el paso 1; si ya tienes una idea, en el paso 2; y si ya vendes, en el paso 3. Desde ahí ves qué hacer cada día.',
  ],
  ['¿Quién está detrás de EmprendiApp?', '[FALTA: quién hace EmprendiApp, en una o dos frases]'],
  [
    '¿Qué hacen con mis datos?',
    'Tu cuenta y tu avance se guardan en la nube para que entres desde cualquier dispositivo. Solo tú puedes ver tu información, y puedes eliminar tu cuenta y todos tus datos desde la pantalla Cuenta cuando quieras.',
  ],
  [
    '¿El asistente reemplaza a un contador o a un abogado?',
    'No. Te ayuda a entender trámites, precios y siguientes pasos, y te lleva a la parte de la ruta o a la plantilla que necesitas. Para decisiones legales o tributarias de tu caso, consulta a un profesional.',
  ],
]

function Faq() {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-20 sm:px-8 md:grid-cols-[1fr_1.6fr] md:gap-16 md:py-24">
      <Reveal>
        <h2 className="font-display text-[30px] leading-[1.1] font-extrabold tracking-[-0.02em] sm:text-[36px]">Preguntas frecuentes</h2>
      </Reveal>
      <Reveal delay={100}>
        <div className="border-b border-line">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group border-t border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[16px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pri [&::-webkit-details-marker]:hidden">
                {q}
                <Plus
                  size={18}
                  aria-hidden="true"
                  className="shrink-0 text-mut transition-transform group-open:rotate-45 motion-reduce:transition-none"
                />
              </summary>
              <p className="max-w-[40rem] pb-5 text-[15px] leading-relaxed text-mut">{a}</p>
            </details>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

// Barra fija en celular: aparece cuando el botón principal ya salió de pantalla y se oculta en el cierre.
function StickyCta({ show }) {
  return (
    <div
      inert={!show}
      className={`fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white/95 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 ease-out motion-reduce:transition-none md:hidden ${show ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <CtaRegister className="w-full" />
    </div>
  )
}

export default function Landing() {
  const { session } = useAuth()
  const [heroCtaRef, heroCtaVisible] = useVisible(true)
  const [closingRef, closingVisible] = useVisible(false)
  if (session) return <Navigate to="/" replace />

  return (
    <div className="min-h-dvh bg-bg text-ink">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-8 sm:py-5">
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5">
          <Logo size={32} />
          <span className="font-display text-base font-extrabold tracking-tight max-[369px]:sr-only sm:text-lg">{APP_NAME}</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/acceso"
            state={{ mode: 'login' }}
            className="rounded-[10px] px-2.5 py-2.5 text-[14px] font-semibold whitespace-nowrap text-mut hover:text-ink sm:px-3"
          >
            <span className="sm:hidden">Entrar</span>
            <span className="hidden sm:inline">Iniciar sesión</span>
          </Link>
          <CtaRegister className="px-3.5 py-2.5 text-[14px] sm:px-4">Crear cuenta</CtaRegister>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-8 pb-20 sm:px-8 md:grid-cols-[1.1fr_1fr] md:gap-16 md:pt-16 md:pb-28">
          <div className="flex flex-col gap-6">
            <h1 className="animate-rise font-display text-[44px] leading-[0.98] font-extrabold tracking-[-0.03em] text-balance text-pri motion-reduce:animate-none sm:text-[60px] lg:text-[68px]">
              Cada día sabrás qué hacer para que tu negocio avance.
            </h1>
            <p
              className="max-w-[34rem] animate-rise text-[17px] leading-relaxed text-mut motion-reduce:animate-none sm:text-lg"
              style={{ animationDelay: '0.12s' }}
            >
              Una ruta de 6 pasos, un asistente y plantillas para validar tu idea, ponerle precio, hacer los trámites y conseguir clientes en Colombia. Empiezas en el paso que te corresponde, tengas solo una idea o ya estés vendiendo.
            </p>
            <div
              ref={heroCtaRef}
              className="flex animate-rise flex-col gap-3 motion-reduce:animate-none sm:flex-row sm:items-center sm:gap-5"
              style={{ animationDelay: '0.24s' }}
            >
              <CtaRegister className="px-6 py-3.5 text-base" />
              <span className="text-[14px] text-mut">{REASSURANCE}</span>
            </div>
          </div>
          <RouteDemo />
        </section>

        <StagePicker />

        <section className="border-y border-line bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-8 md:grid-cols-2 md:gap-16 md:py-24">
            <Reveal className="flex flex-col gap-4">
              <h2 className="font-display text-[34px] leading-[1.05] font-extrabold tracking-[-0.02em] sm:text-[44px]">“No sé por dónde empezar.”</h2>
              <p className="max-w-[30rem] text-[17px] leading-relaxed text-mut">
                Es lo que más se repite entre quienes quieren emprender y no han empezado. Por eso la ruta te dice qué hacer cada día, y validas tu idea con clientes antes de gastar dinero.
              </p>
              <p className="max-w-[30rem] text-[17px] leading-relaxed">
                <strong className="font-semibold">El 80 % de los jóvenes que respondieron</strong> dijo que usaría una app así.
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

        <section className="border-y border-line bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-20 sm:px-8 md:py-24">
            <Reveal>
              <h2 className="font-display text-[30px] leading-[1.1] font-extrabold tracking-[-0.02em] sm:text-[36px]">Empieza gratis, mejora cuando lo necesites</h2>
            </Reveal>
            <div className="grid gap-4 md:grid-cols-2">
              <Reveal delay={100} className="flex flex-col gap-4 rounded-2xl border border-line p-6">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-bold">Gratis</h3>
                  <span className="font-display text-3xl font-extrabold">$0</span>
                </div>
                <ul className="flex flex-col gap-2.5 text-[15px]">
                  {['La ruta completa de 6 pasos', '10 preguntas al asistente al mes', 'Plantillas básicas'].map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <Check size={18} className="shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:gap-4">
                  <CtaRegister>Empezar gratis</CtaRegister>
                  <span className="text-[13px] text-mut">Sin tarjeta.</span>
                </div>
              </Reveal>
              <Reveal delay={250} className="flex flex-col gap-4 rounded-2xl bg-pri p-6 text-white">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg font-bold">Pro</h3>
                    <span className="rounded-full bg-white/12 px-2.5 py-0.5 text-[12px] font-semibold text-acc">Próximamente</span>
                  </div>
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
                <p className="mt-auto pt-2 text-[13px] text-sub">El pago todavía no está disponible. Por ahora todas las cuentas empiezan en Gratis.</p>
              </Reveal>
            </div>
          </div>
        </section>

        <Faq />

        <section ref={closingRef} className="bg-pri text-white">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:px-8 md:flex-row md:items-center md:justify-between md:py-24">
            <Reveal>
              <h2 className="max-w-[36rem] font-display text-[34px] leading-[1.05] font-extrabold tracking-[-0.02em] sm:text-[44px]">
                Tu primer paso toma 15 minutos.
              </h2>
            </Reveal>
            <Reveal delay={150} className="flex flex-col gap-2.5">
              <CtaRegister light className="px-6 py-3.5 text-base" />
              <span className="text-[14px] text-sub">{REASSURANCE}</span>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-col gap-2 px-4 pt-8 pb-28 text-[13px] text-mut sm:flex-row sm:justify-between sm:px-8 md:pb-8">
        <span>© 2026 {APP_NAME} · Hecho para emprendedores en Colombia</span>
        <span>[FALTA: enlaces a Privacidad y Contacto]</span>
      </footer>

      <StickyCta show={!heroCtaVisible && !closingVisible} />
    </div>
  )
}
