# EmprendiApp — MVP

Aplicación web para ayudar a jóvenes a empezar su emprendimiento en Colombia: una ruta paso a paso, un asistente para resolver dudas y plantillas listas para usar. Las funciones salen de una encuesta a 40 personas (78 % pidió guías paso a paso, 60 % un asistente con IA y 58 % plantillas). Los resultados están en [docs/mvp.md](docs/mvp.md).

Funciona en computador y en celular. La descripción de cada pantalla, pensada para cualquier persona, está en [docs/funcionalidades.md](docs/funcionalidades.md).

Diseño en Figma: https://www.figma.com/design/5XNY7S2Mg8aK01iACjcpVV

## Cómo correrla

### Solo la página (asistente con respuestas predefinidas)

```bash
npm install
cp .env.example .env     # trae la dirección y la clave pública de Supabase
npm run dev
```

Abre `http://localhost:5173`. Sin sesión iniciada verás la portada; desde ahí puedes crear una cuenta.

Sin el archivo `.env`, la página no arranca y la consola indica que faltan `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`.

### Página + asistente con IA local

Requiere [Ollama](https://ollama.com) instalado.

**1. Descarga un modelo**

Con 4 GB de VRAM o más:

```bash
ollama pull qwen2.5:3b
```

Con menos de 4 GB de VRAM o solo CPU:

```bash
ollama pull llama3.2:1b
```

**2. Arranca los dos servidores, cada uno en su terminal**

```bash
# Terminal 1: servidor del asistente (puerto 3001)
npm run server

# Terminal 2: la página (puerto 5173)
npm run dev
```

Durante el desarrollo, la página reenvía las llamadas a `/api` al servidor del asistente (ver `vite.config.js`). Si el servidor no está corriendo, el asistente usa las respuestas predefinidas sin mostrar error.

El servidor **solo responde a usuarios con sesión**: la página le envía el token de Supabase y el servidor lo verifica. Además, descarta mensajes con rol `system`, usa solo los últimos 12 mensajes de la conversación y limita a 30 preguntas por hora a cada usuario.

**Configuración**

El servidor lee el mismo archivo `.env` que la página (necesita `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` para verificar las sesiones). Si faltan, no arranca y lo indica. Usa Node 20.12 o más reciente.

Ojo: `.env.example` trae `OLLAMA_MODEL=llama3.2:3b`. Si descargaste otro modelo, cámbialo ahí.

| Variable | Para qué sirve | Valor si no está en `.env` |
|---|---|---|
| `LLM_PROVIDER` | Proveedor de IA | `ollama` |
| `OLLAMA_URL` | Dirección de Ollama | `http://localhost:11434` |
| `OLLAMA_MODEL` | Modelo a usar | `qwen2.5:3b` |
| `PORT` | Puerto del servidor del asistente | `3001` |

### Cambiar de proveedor de IA

El servidor no depende de un proveedor específico. Para agregar uno (Claude API, OpenAI, etc.):

1. Crea `server/llm/providers/<nombre>.js` con `export async function chat(messages) { ... }`, que recibe una lista de mensajes `{ role, content }` y devuelve el texto de la respuesta.
2. Regístralo en `server/llm/index.js`.
3. Usa `LLM_PROVIDER=<nombre>`.

## Qué incluye esta versión

- **Portada** en `/` para quien no ha iniciado sesión, con animaciones que muestran cómo funciona la app.
- **Registro e inicio de sesión** con correo, recuperación de contraseña y, cuando se configure, con Google.
- **Pantalla de carga**, solo para quien ya tiene sesión.
- **Bienvenida:** nombre, emprendimiento y etapa. La ruta arranca según la etapa.
- **Inicio:** progreso, racha de días seguidos, siguiente paso, acceso rápido al asistente y tareas de la semana.
- **Ruta:** 6 pasos con actividades que se marcan como hechas.
- **Asistente:** chat con IA local (Ollama) o respuestas predefinidas. 10 preguntas al mes en el plan gratis.
- **Plantillas:** plan de negocio en 1 página, calculadora de precio, presupuesto inicial y guion de entrevista.
- **Cuenta:** perfil, emprendimiento, plan actual, cierre de sesión y eliminar la cuenta.
- **Planes:** Gratis y Pro ($19.900 COP al mes). El pago todavía no está conectado.
- **Computador:** menú lateral en lugar de la barra inferior; los paneles se abren como ventanas centradas y se cierran con Escape.

Las cuentas y los datos de cada usuario se guardan en Supabase, así que se pueden usar desde cualquier dispositivo.

## Supabase (cuentas y datos)

Proyecto: **Emprende-app** (`cnsomjvdcvkplgxvnywf`). La página se conecta con la dirección y la clave pública (`sb_publishable_…`) del archivo `.env`. Esa clave está hecha para usarse en el navegador; la protección de los datos la dan las reglas de cada tabla. **Nunca pongas en el proyecto la clave secreta** (`sb_secret_…` o `service_role`).

| Tabla | Qué guarda |
|---|---|
| `perfiles` | Nombre, emprendimiento, etapa, plan y margen de la calculadora. Se crea sola al registrarse. |
| `actividades_completadas` | Qué actividades de la ruta terminó cada usuario y cuándo |
| `costos` | Filas de la calculadora de precio y del presupuesto inicial |
| `plan_negocio` | Los 5 bloques del plan de negocio |
| `mensajes_chat` | La conversación con el asistente |
| `uso_asistente` | Preguntas usadas por mes (la escribe solo la base de datos) |

Reglas importantes:

- **Cada usuario solo puede leer y modificar sus propias filas** (RLS en todas las tablas). Sin sesión no se puede leer nada.
- **El plan (Gratis/Pro) no lo puede cambiar el usuario:** solo se cambia desde Supabase.
- **El límite de 10 preguntas gratis lo aplica la base de datos:** la pregunta 11 del mes se rechaza al guardarla. Si cambias el límite, cámbialo en `AI_FREE_LIMIT` (`src/store.jsx`) y en `private.contar_pregunta()`.
- **Confirmación de correo:** debe estar **desactivada** mientras prueban (Authentication → Sign In / Providers → Email → *Confirm email*). Si se activa, la app ya muestra el aviso de "revisa tu correo".
- **Eliminar la cuenta:** la función `eliminar_mi_cuenta()` borra al usuario que la llama y, en cascada, todos sus datos. Está en `supabase/migrations/20261005150000_eliminar_cuenta.sql`.

### Correos (recuperar contraseña)

El servicio de correo gratuito de Supabase **solo envía correos a los miembros del equipo del proyecto** y muy pocos por hora. Para que "Olvidé mi contraseña" les llegue a todos los usuarios hay que configurar un servicio de correo propio (por ejemplo Resend o Brevo) en Authentication → Emails → SMTP Settings. Mientras tanto, la app muestra "Por ahora no podemos enviar correos a esa dirección".

El enlace del correo lleva a `/nueva-contrasena`. Esa dirección tiene que estar permitida en **Authentication → URL Configuration**:

- **Site URL:** la dirección de la página publicada (o `http://localhost:5173` mientras desarrollan).
- **Redirect URLs:** agregar `http://localhost:5173/**` y, al publicar, `https://<tu-dominio>/**`.

### Entrar con Google

El botón "Continuar con Google" aparece solo si `VITE_AUTH_GOOGLE=true` en el `.env`. Antes de activarlo:

1. En [Google Cloud Console](https://console.cloud.google.com/) crea un proyecto y, en **APIs y servicios → Credenciales**, un **ID de cliente de OAuth** de tipo *Aplicación web*.
2. En **URIs de redireccionamiento autorizados** agrega `https://cnsomjvdcvkplgxvnywf.supabase.co/auth/v1/callback`.
3. En Supabase, **Authentication → Sign In / Providers → Google**: actívalo y pega el *Client ID* y el *Client Secret*.
4. Pon `VITE_AUTH_GOOGLE=true` en el `.env` (y en Vercel al publicar).

Las cuentas de Google toman el nombre de la cuenta de Google para el perfil.

Los cambios a la base de datos están en `supabase/migrations/`, en el orden en que se aplicaron. Cualquier cambio nuevo debe ir en un archivo nuevo ahí.

## Direcciones y publicación

La app usa direcciones limpias (`/ruta`, `/cuenta`), sin `#`. Los enlaces viejos con `#/` se convierten solos a la dirección nueva (`src/main.jsx`).

Para que recargar cualquier página funcione una vez publicada, el servidor debe devolver `index.html` en todas las rutas. Ya está configurado para:

- **Vercel:** `vercel.json`
- **Netlify:** `public/_redirects`

Al publicar solo la página, el asistente usará las respuestas predefinidas, porque el servidor de IA (`server/`) no se publica con ella.

## Estructura

```
src/                          # Página (React + Vite + Tailwind)
  main.jsx                    # Punto de entrada; convierte enlaces viejos con "#/"
  App.jsx                     # Rutas, protección de sesión y diseño general
  supabase.js                 # Conexión con Supabase
  auth.jsx                    # Registro, inicio y cierre de sesión con Supabase
  store.jsx                   # Carga los datos del usuario y guarda cada cambio en su tabla
  data.js                     # Contenido de la ruta, plantillas y preguntas de entrevista
  assistant.js                # Llama al servidor del asistente; si falla, usa respuestas predefinidas
  ui.jsx                      # Componentes compartidos (botones, paneles, barra y menú lateral)
  index.css                   # Colores, tipografías y animaciones
  screens/                    # Una pantalla por archivo
    Landing.jsx               # Portada
    Splash.jsx                # Pantalla de carga
    Auth.jsx                  # Registro, inicio de sesión y recuperar contraseña
    NewPassword.jsx           # Crear una contraseña nueva (desde el enlace del correo)
    Onboarding.jsx            # Bienvenida
    Home.jsx, RouteList.jsx, StepDetail.jsx, Assistant.jsx,
    Templates.jsx, TemplateDetail.jsx, Account.jsx, Plans.jsx

server/                       # Servidor del asistente (Node.js + Express)
  index.js                    # POST /api/chat en el puerto 3001
  prompt.js                   # Instrucciones del asistente
  llm/
    index.js                  # Elige el proveedor según LLM_PROVIDER
    providers/ollama.js       # Conexión con Ollama

docs/
  funcionalidades.md          # Qué hace la app, pantalla por pantalla
  mvp.md                      # Resultados de la encuesta y decisiones del MVP
  encuesta-respuestas.csv     # Respuestas completas de la encuesta

supabase/migrations/          # Cambios a la base de datos, en orden

vercel.json, public/_redirects  # Reglas de publicación
```

## Problemas conocidos

- **Las respuestas de la IA se muestran como texto plano:** si el modelo usa negritas o listas, se ven los asteriscos.
- **No hay tiempo límite de espera:** si la IA se cuelga, el chat se queda en "Escribiendo…".
- **Si la IA falla, el usuario no se entera:** recibe una respuesta predefinida y la pregunta igual se descuenta.
- **El límite de 30 preguntas por hora del servidor se guarda en memoria:** se reinicia si el servidor se reinicia. El límite del plan gratis sí es permanente, porque lo aplica Supabase.
- **Los correos de recuperación solo llegan al equipo** hasta configurar un servicio de correo propio (ver "Correos").

## Siguientes pasos

1. **Publicar la página** en Vercel (la configuración ya está lista; hay que agregar las variables `VITE_SUPABASE_*` en Vercel).
2. **Servicio de correo propio** para la recuperación de contraseña, y **configurar Google** (ver arriba).
3. **Política de privacidad y términos** (Ley 1581 de 2012).
4. **Publicar el servidor del asistente** (Railway, Fly.io, etc.) o pasar a una IA en la nube.
5. **Pagos** para el plan Pro (Wompi o Mercado Pago) y construir lo que promete: exportar, recordatorios y plantillas Pro.
6. Fase 2 según la encuesta: dashboard de métricas y comunidad con mentores.
