# EmprendiApp — MVP

App para ayudar a jóvenes a empezar su emprendimiento: una ruta paso a paso, un asistente para resolver dudas y plantillas listas para usar. Las funciones salen de una encuesta a 40 personas (78 % pidió guías paso a paso, 60 % un asistente con IA y 58 % plantillas).

Diseño en Figma: https://www.figma.com/design/5XNY7S2Mg8aK01iACjcpVV

## Cómo correrla

```bash
npm install
npm run dev
```

Abre la dirección que aparece en la terminal. Está pensada para celular: en el computador, usa las herramientas de desarrollador del navegador en vista móvil.

## Qué incluye esta versión

La descripción completa de cada pantalla está en [docs/funcionalidades.md](docs/funcionalidades.md).

- **Pantalla de carga** con la marca EmprendiApp.
- **Registro e inicio de sesión:** cada cuenta guarda su propio progreso.
- **Bienvenida:** nombre, emprendimiento y etapa del emprendedor. La ruta arranca según la etapa.
- **Inicio:** progreso, siguiente paso, acceso rápido al asistente y tareas de la semana.
- **Ruta:** 6 pasos con actividades (lecturas, ejercicios, plantillas y preguntas a la IA) que se marcan como hechas.
- **Asistente:** chat con respuestas predefinidas por tema (trámites, precios, clientes, redes, financiación). Límite de 10 preguntas al mes en el plan gratis.
- **Plantillas:** plan de negocio en 1 página, calculadora de precio, presupuesto inicial y guion de entrevista. Funcionan y guardan lo que escribe el usuario.
- **Cuenta:** perfil, emprendimiento, plan actual y cierre de sesión.
- **Planes:** Gratis y Pro ($19.900 COP/mes). El pago todavía no está conectado.

Todo se guarda en el navegador (localStorage), incluidas las cuentas: solo existen en el dispositivo donde se crearon.

## Estructura

- `src/data.js`: contenido de la ruta, plantillas y preguntas de entrevista. Para cambiar textos, edita aquí.
- `src/assistant.js`: respuestas del asistente.
- `src/store.jsx`: estado de la app y guardado por usuario.
- `src/auth.jsx`: registro, inicio y cierre de sesión.
- `src/screens/`: una pantalla por archivo.
- `src/ui.jsx`: componentes compartidos.

## Siguientes pasos

1. **Cuentas y datos en la nube** con Supabase, para que el registro y el progreso no dependan del dispositivo.
2. **IA real:** conectar el asistente a un modelo de lenguaje desde una función del servidor, con el contexto del negocio y del paso actual del usuario.
3. **Pagos** para el plan Pro (por ejemplo Wompi o Mercado Pago, que funcionan en Colombia).
4. **Publicarla** (por ejemplo en Vercel o Netlify) e instalarla en el celular como app web.
5. Fase 2 según la encuesta: dashboard de métricas y comunidad con mentores.
