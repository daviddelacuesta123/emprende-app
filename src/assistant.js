// Respuestas locales de respaldo cuando el backend no está disponible.
const RULES = [
  [
    /\brut\b|dian/i,
    'Sacar el RUT es gratis y se hace en línea en dian.gov.co. Solo necesitas tu cédula y un correo electrónico. Es el primer trámite que te recomiendo: con él ya puedes facturar y abrir cuentas a nombre de tu negocio.',
    { label: 'Ver paso de trámites', to: '/ruta/formalizar' },
  ],
  [
    /c[aá]mara de comercio|matr[ií]cula|formaliz|tr[aá]mite|legal/i,
    'Cuando vendes de forma habitual debes registrarte en la Cámara de Comercio de tu ciudad (matrícula mercantil) y renovarla cada año. Puedes hacerlo como persona natural o creando una SAS. Empieza por el RUT y da este paso cuando ya tengas ventas constantes.',
    { label: 'Ver paso de trámites', to: '/ruta/formalizar' },
  ],
  [
    /precio|cobrar|costo|margen|cu[aá]nto/i,
    'Para fijar tu precio suma todo lo que te cuesta producir una unidad (materiales, empaque, envío) y agrégale tu margen de ganancia. Un margen de 30 % a 50 % es común para productos pequeños. La calculadora lo hace por ti en dos minutos.',
    { label: 'Abrir calculadora', to: '/plantillas/precio' },
  ],
  [
    /financ|pr[eé]stamo|inversi|capital|fondo|plata para/i,
    'Antes de buscar financiación, intenta arrancar con poco: vende por encargo, usa lo que ya tienes y reinvierte tus primeras ganancias. Cuando tengas ventas, revisa convocatorias como el Fondo Emprender del SENA o los programas de iNNpulsa y de tu universidad.',
    { label: 'Armar presupuesto inicial', to: '/plantillas/presupuesto' },
  ],
  [
    /redes|instagram|tiktok|marketing|publicidad|contenido/i,
    'Para empezar en redes: elige una sola red (donde esté tu cliente), publica 3 veces por semana y mezcla tres tipos de contenido: tu producto, el detrás de cámaras y lo que dicen tus clientes. Los videos cortos mostrando el producto en uso son lo que más alcance tiene gratis.',
    { label: 'Ver paso de clientes', to: '/ruta/clientes' },
  ],
  [
    /cliente|vender|venta/i,
    'Tus primeros clientes casi siempre vienen de tu red cercana. Escríbeles directamente a 10 personas que podrían necesitar lo que ofreces, ofréceles probarlo y pídeles que te recomienden si les gustó.',
    { label: 'Ver paso de clientes', to: '/ruta/clientes' },
  ],
  [
    /valid|entrevist|encuesta/i,
    'Para validar, habla con 5 personas que tengan el problema. No les preguntes si comprarían; pregúntales cómo lo resuelven hoy y cuánto les cuesta. El guion de entrevista tiene las 10 preguntas clave.',
    { label: 'Abrir guion de entrevista', to: '/plantillas/guion' },
  ],
  [
    /plan de negocio|plan/i,
    'Para empezar no necesitas un documento largo. Responde cinco cosas: qué problema resuelves, para quién, cuál es tu solución, cómo ganas dinero y por qué canales llegas a tus clientes. La plantilla de 1 página te guía.',
    { label: 'Abrir plan de negocio', to: '/plantillas/plan' },
  ],
  [
    /idea|empezar|por d[oó]nde/i,
    'Si no sabes por dónde empezar, haz esto hoy: escribe 10 problemas que veas a tu alrededor y elige el que más se repite. Luego escribe tu idea en una frase: "Ayudo a [quién] a [resolver qué] con [tu solución]".',
    { label: 'Ir al paso 1', to: '/ruta/idea' },
  ],
  [
    /tiempo|organiz|ritmo/i,
    'Con 15 minutos al día puedes avanzar. Te recomiendo bloquear un horario fijo (por ejemplo, antes de dormir) y hacer solo la siguiente actividad de tu ruta. En Inicio siempre verás tus tareas de la semana.',
    { label: 'Ver mis tareas', to: '/' },
  ],
]

const FALLBACK = {
  text: 'Buena pregunta. Todavía estoy aprendiendo sobre ese tema. Mientras tanto, revisa tu ruta: cada paso tiene guías y plantillas para avanzar. Si me cuentas más detalles de tu negocio, puedo orientarte mejor.',
  action: { label: 'Ver mi ruta', to: '/ruta' },
}

function localReply(question) {
  for (const [re, text, action] of RULES) if (re.test(question)) return { text, action }
  return FALLBACK
}

// Llama al backend. Recibe el historial completo de mensajes { role, text }.
export async function reply(messages) {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.map((m) => ({ role: m.role, content: m.text })),
      }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const { content } = await res.json()
    return { text: content, action: null }
  } catch {
    // Fallback al sistema de reglas si el backend no está disponible.
    const last = messages.at(-1)?.text ?? ''
    return localReply(last)
  }
}
