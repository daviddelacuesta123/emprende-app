# EmprendiApp — MVP

App para ayudar a jóvenes a empezar su emprendimiento: una ruta paso a paso, un asistente para resolver dudas y plantillas listas para usar. Las funciones salen de una encuesta a 40 personas (78 % pidió guías paso a paso, 60 % un asistente con IA y 58 % plantillas).

Diseño en Figma: https://www.figma.com/design/5XNY7S2Mg8aK01iACjcpVV

## Cómo correrla

### Solo el frontend (asistente con respuestas predefinidas)

```bash
npm install
npm run dev
```

### Frontend + asistente con IA local (recomendado)

Requiere [Ollama](https://ollama.com) instalado en la máquina.

**1. Descarga un modelo**

Con 4 GB de VRAM o más (recomendado):
```bash
ollama pull qwen2.5:3b
```

Con menos de 4 GB de VRAM o solo CPU:
```bash
ollama pull llama3.2:1b
```

**2. Configura las variables de entorno**

Copia el archivo de ejemplo y ajusta si es necesario:
```bash
cp .env.example .env
```

Por defecto usa `qwen2.5:3b`. Si descargaste otro modelo, cambia `OLLAMA_MODEL` en el `.env`.

**3. Arranca ambos servidores en terminales separadas**

```bash
# Terminal 1 — backend (puerto 3001)
npm run server

# Terminal 2 — frontend (puerto 5173)
npm run dev
```

Abre `http://localhost:5173` en el navegador. El frontend redirige automáticamente las llamadas a `/api` al backend.

> Si el backend no está corriendo, el asistente cae al sistema de respuestas predefinidas sin mostrar errores.

## Cambiar de proveedor de IA

El backend está desacoplado del proveedor. Para agregar uno nuevo (Claude API, OpenAI, etc.):

1. Crea `server/llm/providers/<nombre>.js` con la función `export async function chat(messages) { ... }` que reciba un array de mensajes `{ role, content }` y devuelva un string.
2. Regístralo en `server/llm/index.js`.
3. Cambia `LLM_PROVIDER=<nombre>` en el `.env`.

## Qué incluye esta versión

La descripción completa de cada pantalla está en [docs/funcionalidades.md](docs/funcionalidades.md).

- **Pantalla de carga** con la marca EmprendiApp.
- **Registro e inicio de sesión:** cada cuenta guarda su propio progreso.
- **Bienvenida:** nombre, emprendimiento y etapa del emprendedor. La ruta arranca según la etapa.
- **Inicio:** progreso, siguiente paso, acceso rápido al asistente y tareas de la semana.
- **Ruta:** 6 pasos con actividades (lecturas, ejercicios, plantillas y preguntas a la IA) que se marcan como hechas.
- **Asistente:** chat conectado a un modelo de IA local vía Ollama. Sin backend activo, usa respuestas predefinidas. Límite de 10 preguntas al mes en el plan gratis.
- **Plantillas:** plan de negocio en 1 página, calculadora de precio, presupuesto inicial y guion de entrevista.
- **Cuenta:** perfil, emprendimiento, plan actual y cierre de sesión.
- **Planes:** Gratis y Pro ($19.900 COP/mes). El pago todavía no está conectado.

Todo se guarda en el navegador (localStorage), incluidas las cuentas: solo existen en el dispositivo donde se crearon.

## Estructura

```
src/                        # Frontend (React + Vite + Tailwind)
  data.js                   # Contenido de la ruta, plantillas y preguntas
  assistant.js              # Llama al backend; fallback a respuestas predefinidas
  store.jsx                 # Estado global y guardado por usuario
  auth.jsx                  # Registro, inicio y cierre de sesión
  screens/                  # Una pantalla por archivo
  ui.jsx                    # Componentes compartidos

server/                     # Backend (Node.js + Express)
  index.js                  # Servidor HTTP en puerto 3001
  prompt.js                 # System prompt del asistente
  llm/
    index.js                # Selecciona proveedor según LLM_PROVIDER
    providers/
      ollama.js             # Implementación para Ollama
```

## Siguientes pasos

1. **Cuentas y datos en la nube** con Supabase, para que el registro y el progreso no dependan del dispositivo.
2. **Desplegar el backend** en un servidor (Railway, Fly.io, etc.) con Ollama o cambiando a Claude API / OpenAI para que todos los usuarios accedan al mismo asistente.
3. **Pagos** para el plan Pro (Wompi o Mercado Pago, que funcionan en Colombia).
4. **Publicar el frontend** en Vercel o Netlify e instalarlo como PWA en el celular.
5. Fase 2 según la encuesta: dashboard de métricas y comunidad con mentores.
