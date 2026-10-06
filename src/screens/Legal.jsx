import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { APP_NAME, Logo } from '../ui'

// Fecha de la versión vigente. Se guarda con la cuenta al aceptar, así que hay que cambiarla cuando cambie el texto.
export const LEGAL_VERSION = '2026-10-05'
const VIGENCIA = '5 de octubre de 2026'

// Datos del responsable del tratamiento: completarlos antes de publicar.
const RESPONSABLE = {
  nombre: '[FALTA: nombre completo de la persona o personas responsables]',
  documento: '[FALTA: tipo y número de documento]',
  domicilio: '[FALTA: ciudad y dirección de notificación]',
  correo: '[FALTA: correo de contacto]',
  telefono: '[FALTA: teléfono de contacto]',
}

function LegalPage({ title, children }) {
  return (
    <div className="min-h-dvh bg-bg text-ink">
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4 sm:px-8 sm:py-5">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo size={32} />
          <span className="font-display text-lg font-extrabold tracking-tight">{APP_NAME}</span>
        </Link>
        <Link to="/" className="flex items-center gap-1.5 text-[14px] font-semibold text-mut hover:text-ink">
          <ArrowLeft size={16} aria-hidden="true" /> Volver
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-4 pt-6 pb-20 sm:px-8 md:pt-12">
        <h1 className="font-display text-[34px] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance sm:text-[44px]">{title}</h1>
        <p className="mt-3 text-[14px] text-mut">Vigente desde el {VIGENCIA}.</p>
        <div className="mt-10 flex max-w-[68ch] flex-col gap-10 text-[16px] leading-relaxed [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-[22px] [&_h2]:leading-tight [&_h2]:font-extrabold [&_li]:pl-1 [&_p+p]:mt-3 [&_ul]:mt-3 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5">
          {children}
        </div>
      </main>
      <footer className="mx-auto flex max-w-3xl flex-wrap gap-x-6 gap-y-2 border-t border-line px-4 py-8 text-[13px] text-mut sm:px-8">
        <span>© 2026 {APP_NAME}</span>
        <Link to="/privacidad" className="hover:text-ink">Política de tratamiento de datos</Link>
        <Link to="/terminos" className="hover:text-ink">Términos y condiciones</Link>
      </footer>
    </div>
  )
}

function Contacto() {
  return (
    <ul>
      <li>Responsable: {RESPONSABLE.nombre}, {RESPONSABLE.documento}</li>
      <li>Domicilio: {RESPONSABLE.domicilio}</li>
      <li>Correo: {RESPONSABLE.correo}</li>
      <li>Teléfono: {RESPONSABLE.telefono}</li>
    </ul>
  )
}

export function Privacy() {
  return (
    <LegalPage title="Política de tratamiento de datos personales">
      <section>
        <p>
          Esta política explica qué datos personales recoge {APP_NAME}, para qué los usa y cómo puedes conocerlos, corregirlos o pedir que
          se eliminen. Se rige por la Ley 1581 de 2012, el Decreto 1377 de 2013 (compilado en el Decreto 1074 de 2015) y las demás normas
          colombianas de protección de datos.
        </p>
      </section>

      <section>
        <h2>1. Quién es el responsable</h2>
        <p>El responsable del tratamiento de tus datos es:</p>
        <Contacto />
        <p>Este mismo contacto atiende tus consultas y reclamos sobre tus datos.</p>
      </section>

      <section>
        <h2>2. Qué datos recogemos</h2>
        <ul>
          <li><strong>Cuenta:</strong> nombre, correo electrónico y contraseña (la contraseña se guarda cifrada y nadie puede leerla). Si entras con Google, recibimos tu nombre y tu correo de Google.</li>
          <li><strong>Perfil:</strong> el nombre de tu emprendimiento, si lo escribes, y la etapa en la que estás.</li>
          <li><strong>Tu avance:</strong> las actividades de la ruta que completas y cuándo las completas.</li>
          <li><strong>Plantillas:</strong> lo que escribes en el plan de negocio, la calculadora de precio y el presupuesto inicial.</li>
          <li><strong>Asistente:</strong> las preguntas que le haces y sus respuestas, y cuántas preguntas usas cada mes.</li>
          <li><strong>Datos técnicos:</strong> la sesión que mantiene tu cuenta abierta en el navegador. No usamos herramientas de analítica ni publicidad.</li>
        </ul>
        <p>
          No te pedimos datos sensibles (como salud, origen étnico, orientación sexual u opiniones políticas). Te pedimos que no los
          escribas en el asistente ni en las plantillas.
        </p>
      </section>

      <section>
        <h2>3. Para qué los usamos</h2>
        <ul>
          <li>Crear y mantener tu cuenta, y dejarte entrar desde cualquier dispositivo.</li>
          <li>Mostrarte tu ruta, tu progreso, tu racha y tus tareas de la semana.</li>
          <li>Guardar tus plantillas y responder tus preguntas en el asistente.</li>
          <li>Aplicar los límites de tu plan, como las 10 preguntas al mes del plan Gratis.</li>
          <li>Enviarte correos necesarios para el servicio, como el enlace para recuperar tu contraseña.</li>
          <li>Atender tus consultas, reclamos y solicitudes.</li>
          <li>Mejorar la app con información agregada, que no te identifica.</li>
        </ul>
        <p>No vendemos ni alquilamos tus datos, y no los usamos para publicidad.</p>
      </section>

      <section>
        <h2>4. Tus derechos</h2>
        <p>Como titular de tus datos tienes derecho a:</p>
        <ul>
          <li>Conocer, actualizar y corregir tus datos.</li>
          <li>Pedir prueba de la autorización que nos diste.</li>
          <li>Saber cómo hemos usado tus datos.</li>
          <li>Revocar tu autorización y pedir que eliminemos tus datos, cuando no exista un deber legal de conservarlos.</li>
          <li>Acceder gratis a tus datos.</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC), después de haber hecho tu reclamo ante nosotros.</li>
        </ul>
        <p>
          Puedes corregir tu nombre y tu emprendimiento desde la pantalla Cuenta, y también puedes eliminar tu cuenta desde ahí: se
          borran tu cuenta y todos los datos guardados con ella.
        </p>
      </section>

      <section>
        <h2>5. Cómo hacer una consulta o un reclamo</h2>
        <p>
          Escríbenos al correo del punto 1 desde el correo de tu cuenta, o identifícate para que podamos confirmar que eres el titular.
          Cuéntanos qué necesitas y, si es un reclamo, qué hechos lo motivan.
        </p>
        <ul>
          <li><strong>Consultas</strong> (conocer tus datos o cómo los usamos): respondemos en máximo 10 días hábiles. Si no alcanzamos, te avisamos el motivo y respondemos en máximo 5 días hábiles más.</li>
          <li><strong>Reclamos</strong> (corregir, actualizar, eliminar o revocar la autorización): respondemos en máximo 15 días hábiles. Si no alcanzamos, te avisamos el motivo y respondemos en máximo 8 días hábiles más. Si al reclamo le falta información, te la pedimos en los 5 días siguientes; si no la recibimos en 2 meses, entendemos que desististe.</li>
        </ul>
      </section>

      <section>
        <h2>6. Quién más trata tus datos</h2>
        <p>Para que la app funcione usamos proveedores que guardan o procesan datos por cuenta nuestra y solo para prestarnos el servicio:</p>
        <ul>
          <li><strong>Supabase</strong> guarda tu cuenta y tus datos. Sus servidores están en Canadá.</li>
          <li><strong>[CONFIRMAR: Vercel]</strong> aloja la página web.</li>
          <li><strong>Google</strong>, solo si eliges entrar con tu cuenta de Google.</li>
          <li>
            <strong>Asistente:</strong> [FALTA: si las preguntas al asistente las procesa un servidor propio o un proveedor externo de IA,
            y cuál]. Al asistente solo le enviamos los últimos mensajes de tu conversación.
          </li>
        </ul>
        <p>
          Como algunos de estos proveedores tienen servidores fuera de Colombia, tus datos se transfieren o transmiten a otros países.
          Al aceptar esta política autorizas esa transferencia, que se hace con proveedores que protegen los datos con medidas de
          seguridad adecuadas.
        </p>
      </section>

      <section>
        <h2>7. Cómo protegemos tus datos</h2>
        <p>
          Las conexiones van cifradas, las contraseñas se guardan cifradas y la base de datos tiene reglas para que cada persona solo
          pueda leer y modificar sus propios datos. Ningún sistema es infalible: si detectamos un incidente que afecte tus datos, te
          avisaremos y lo informaremos a la SIC como exige la ley.
        </p>
      </section>

      <section>
        <h2>8. Menores de edad</h2>
        <p>
          {APP_NAME} es solo para mayores de 18 años. Si nos enteramos de que una cuenta pertenece a un menor de edad, la eliminaremos.
        </p>
      </section>

      <section>
        <h2>9. Cuánto tiempo guardamos tus datos</h2>
        <p>
          Mientras tengas tu cuenta. Si la eliminas, borramos tus datos en ese momento; las copias de seguridad técnicas del proveedor
          pueden conservarlos por un tiempo limitado antes de borrarse. Solo guardaremos algo por más tiempo si una ley nos obliga.
        </p>
      </section>

      <section>
        <h2>10. Cambios a esta política</h2>
        <p>
          Si cambiamos algo importante, te lo avisaremos en la app o por correo antes de que empiece a regir, y te pediremos una nueva
          autorización cuando la ley lo exija. Esta política rige desde el {VIGENCIA}, y tus datos se tratarán mientras tengas tu cuenta.
        </p>
        <p>
          Lee también los <Link to="/terminos">Términos y condiciones</Link>.
        </p>
      </section>
    </LegalPage>
  )
}

export function Terms() {
  return (
    <LegalPage title="Términos y condiciones">
      <section>
        <p>
          Estos términos regulan el uso de {APP_NAME}. Al crear tu cuenta los aceptas, junto con la{' '}
          <Link to="/privacidad">Política de tratamiento de datos personales</Link>. Si no estás de acuerdo, no uses la app.
        </p>
      </section>

      <section>
        <h2>1. Quién presta el servicio</h2>
        <Contacto />
      </section>

      <section>
        <h2>2. Qué es {APP_NAME}</h2>
        <p>
          Una aplicación web que te acompaña a emprender en Colombia con una ruta de 6 pasos, un asistente para resolver dudas y
          plantillas para tu plan de negocio, tus precios y tu presupuesto. Es una herramienta de orientación y aprendizaje: no presta
          asesoría legal, contable, tributaria ni financiera, y no garantiza que tu negocio tenga éxito.
        </p>
      </section>

      <section>
        <h2>3. Quién puede usarla</h2>
        <p>
          Debes tener 18 años o más. Te comprometes a dar datos verdaderos, a cuidar tu contraseña y a avisarnos si alguien entra a tu
          cuenta sin permiso. Eres responsable de lo que se haga desde tu cuenta.
        </p>
      </section>

      <section>
        <h2>4. El asistente</h2>
        <p>
          Las respuestas del asistente se generan de forma automática y pueden tener errores o estar desactualizadas. Revisa la
          información importante en las fuentes oficiales (como la DIAN o la Cámara de Comercio) y, para decisiones legales o tributarias
          de tu caso, consulta a un profesional.
        </p>
      </section>

      <section>
        <h2>5. Planes</h2>
        <ul>
          <li><strong>Gratis:</strong> la ruta completa de 6 pasos, 10 preguntas al asistente al mes y las plantillas básicas. No te pedimos tarjeta.</li>
          <li>
            <strong>Pro:</strong> todavía no está disponible para compra. Cuando lo esté, publicaremos aquí su precio, cómo se cobra, cómo
            cancelarlo y tus derechos como consumidor, antes de que puedas pagarlo.
          </li>
        </ul>
        <p>Podemos cambiar lo que incluye cada plan; si un cambio te afecta, te avisaremos con anticipación.</p>
      </section>

      <section>
        <h2>6. Tu contenido</h2>
        <p>
          Lo que escribes en la app (tu plan de negocio, tus costos, tus preguntas) es tuyo. Nos das permiso de guardarlo y procesarlo
          solo para prestarte el servicio, como explica la política de datos. Los textos, las guías y el diseño de {APP_NAME} son nuestros:
          puedes usarlos para tu emprendimiento, pero no copiarlos para publicarlos ni venderlos.
        </p>
      </section>

      <section>
        <h2>7. Uso permitido</h2>
        <p>No puedes usar la app para actividades ilegales, intentar entrar a cuentas ajenas, afectar su funcionamiento ni automatizar el uso del asistente para saltarte los límites del plan.</p>
      </section>

      <section>
        <h2>8. Cancelar tu cuenta</h2>
        <p>
          Puedes eliminar tu cuenta cuando quieras desde la pantalla Cuenta. Podemos suspender o cerrar una cuenta que incumpla estos
          términos, y te avisaremos el motivo salvo que la ley lo impida.
        </p>
      </section>

      <section>
        <h2>9. Responsabilidad</h2>
        <p>
          Trabajamos para que la app funcione bien y sin interrupciones, pero puede tener fallas o pausas por mantenimiento. Las decisiones
          que tomes sobre tu negocio son tuyas. Nada de esto limita los derechos que te da el Estatuto del Consumidor (Ley 1480 de 2011).
        </p>
      </section>

      <section>
        <h2>10. Cambios y ley aplicable</h2>
        <p>
          Si cambiamos estos términos te avisaremos antes de que rijan. Se rigen por las leyes de Colombia. Para cualquier duda o reclamo
          escríbenos al correo del punto 1.
        </p>
      </section>
    </LegalPage>
  )
}
