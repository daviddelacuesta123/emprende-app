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
    <div className="rounded-2xl border border-line bg-white p-5 shadow-[0_24px_48px_-24px_rgb(15_23_42/0.25)] sm:p-6">
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

function Preview({ children }) {
  return <div className="rounded-2xl border border-line bg-white p-5">{children}</div>
}

const TOOLS = [
  {
    title: 'Sabes qué hacer cada día',
    body: 'Cada paso se divide en actividades cortas: lecturas de 4 minutos, ejercicios prácticos y preguntas para el asistente. Marcas lo que terminas y en Inicio siempre ves tus tareas de la semana.',
    preview: (
      <Preview>
        <p className="mb-3 font-display text-base font-semibold">Encuentra y define tu idea</p>
        {[
          [BookOpen, 'De dónde salen las buenas ideas', 'Lectura · 4 min', true],
          [PenLine, 'Haz una lista de 10 problemas que ves a tu alrededor', 'Ejercicio · 15 min', true],
          [PenLine, 'Elige uno y escribe tu idea en una frase', 'Ejercicio · 10 min', false],
          [Sparkles, 'Pídele a la IA que critique tu idea', 'Asistente · 5 min', false],
        ].map(([Icon, t, meta, done]) => (
          <div key={t} className="flex items-center gap-3 border-t border-line py-2.5">
            <span className={`flex size-7 shrink-0 items-center justify-center rounded-full ${done ? 'bg-pri text-white' : 'bg-soft text-mut'}`}>
              {done ? <Check size={14} strokeWidth={2.4} /> : <Icon size={14} strokeWidth={1.8} />}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className={`text-[14px] font-medium ${done ? 'text-mut line-through decoration-sub' : ''}`}>{t}</span>
              <span className="text-[12px] text-mut">{meta}</span>
            </span>
          </div>
        ))}
      </Preview>
    ),
  },
  {
    title: 'Resuelves tus dudas sin buscar en mil sitios',
    body: 'Pregunta por el RUT, la Cámara de Comercio, cuánto cobrar o cómo conseguir clientes. Cada respuesta te lleva a la parte de la ruta o a la plantilla que necesitas.',
    preview: (
      <Preview>
        <div className="flex flex-col gap-3">
          <p className="max-w-[80%] self-end rounded-2xl rounded-br-md bg-pri px-3.5 py-2.5 text-[14px] text-white">¿Cómo saco el RUT?</p>
          <div className="flex max-w-[90%] flex-col gap-2 self-start rounded-2xl rounded-bl-md border border-line px-3.5 py-3">
            <p className="text-[14px] leading-relaxed">
              Sacar el RUT es gratis y se hace en línea en dian.gov.co. Solo necesitas tu cédula y un correo electrónico.
            </p>
            <span className="self-start rounded-full bg-soft px-3 py-1 text-[12px] font-medium">Ver paso de trámites</span>
          </div>
        </div>
      </Preview>
    ),
  },
  {
    title: 'Haces las cuentas sin saber de finanzas',
    body: 'Plan de negocio en una página, calculadora de precio, presupuesto inicial y guion para entrevistar clientes. Las llenas en la app y se guardan solas.',
    preview: (
      <Preview>
        <p className="mb-3 font-display text-base font-semibold">Calculadora de precio</p>
        {[
          ['Materiales', '$ 8.000'],
          ['Empaque', '$ 1.500'],
          ['Envío', '$ 2.500'],
          ['Margen de ganancia', '40 %'],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between border-t border-line py-2 text-[14px]">
            <span className="text-mut">{k}</span>
            <span className="font-medium">{v}</span>
          </div>
        ))}
        <div className="mt-2 flex items-baseline justify-between rounded-xl bg-pri px-4 py-3 text-white">
          <span className="text-[13px] text-sub">Precio sugerido</span>
          <span className="font-display text-2xl font-extrabold">$ 20.000</span>
        </div>
      </Preview>
    ),
  },
]

export default function Landing() {
  const { session } = useAuth()
  if (session) return <Navigate to="/" replace />

  return (
    <div className="min-h-dvh bg-bg text-ink">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-8 sm:py-5">
        <Link to="/conoce" className="flex items-center gap-2.5">
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
            <h1 className="font-display text-[44px] leading-[0.98] font-extrabold tracking-[-0.03em] text-pri sm:text-[60px] lg:text-[72px]">
              De la idea a tu primera venta, paso a paso.
            </h1>
            <p className="max-w-[34rem] text-[17px] leading-relaxed text-mut sm:text-lg">
              {APP_NAME} te dice qué hacer cada día para arrancar tu emprendimiento en Colombia: validar tu idea, ponerle precio, hacer los trámites y conseguir tus primeros clientes.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <CtaRegister className="px-6 py-3.5 text-base" />
              <span className="text-[14px] text-mut">Gratis para empezar. Sin tarjeta.</span>
            </div>
          </div>
          <RouteDemo />
        </section>

        <section className="border-y border-line bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-8 md:grid-cols-2 md:gap-16 md:py-24">
            <div className="flex flex-col gap-4">
              <p className="font-display text-[34px] leading-[1.05] font-extrabold tracking-[-0.02em] sm:text-[44px]">“No sé por dónde empezar.”</p>
              <p className="max-w-[30rem] text-[17px] leading-relaxed text-mut">
                Es la razón que más se repite entre quienes quieren emprender y no han empezado, según una encuesta que hicimos a 40 jóvenes. Por eso la app se construyó alrededor de lo que más pidieron:
              </p>
            </div>
            <ul className="flex flex-col justify-center gap-6">
              {SURVEY.map(([label, pct]) => (
                <li key={label} className="flex flex-col gap-2">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[16px] font-semibold">{label}</span>
                    <span className="text-[15px] text-mut tabular-nums">{pct} %</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-soft">
                    <div className="h-full rounded-full bg-pri" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-20 sm:px-8 md:gap-24 md:py-28">
          {TOOLS.map((t, i) => (
            <div key={t.title} className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
              <div className={`flex flex-col gap-3 ${i % 2 ? 'md:order-2' : ''}`}>
                <h2 className="font-display text-[30px] leading-[1.1] font-extrabold tracking-[-0.02em] sm:text-[36px]">{t.title}</h2>
                <p className="max-w-[30rem] text-[17px] leading-relaxed text-mut">{t.body}</p>
              </div>
              {t.preview}
            </div>
          ))}
        </section>

        <section className="border-t border-line bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-20 sm:px-8 md:py-24">
            <h2 className="font-display text-[30px] leading-[1.1] font-extrabold tracking-[-0.02em] sm:text-[36px]">Empieza gratis, mejora cuando lo necesites</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-4 rounded-2xl border border-line p-6">
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
              </div>
              <div className="flex flex-col gap-4 rounded-2xl bg-pri p-6 text-white">
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
              </div>
            </div>
          </div>
        </section>

        <section className="bg-pri text-white">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:px-8 md:flex-row md:items-center md:justify-between md:py-24">
            <h2 className="max-w-[36rem] font-display text-[34px] leading-[1.05] font-extrabold tracking-[-0.02em] sm:text-[44px]">
              Tu primer paso toma 15 minutos.
            </h2>
            <CtaRegister light className="px-6 py-3.5 text-base">
              Empezar mi ruta
            </CtaRegister>
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
