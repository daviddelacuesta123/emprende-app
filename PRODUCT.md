# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Jóvenes en Colombia, sobre todo de 18 a 25 años, en dos situaciones que pesan por igual:

- **Quieren emprender y no han empezado.** No saben por dónde empezar, no tienen una idea clara, temen fracasar o no tienen dinero.
- **Ya tienen un negocio pequeño.** Les cuesta organizar el tiempo, el marketing y las redes, conseguir clientes, los trámites y las finanzas.

Usan la app en celular y en computador, unos 15 minutos al día. Hoy resuelven sus dudas con ChatGPT u otra IA, con amigos, familia o profesores, con Google y con YouTube.

## Product Purpose

EmprendiApp acompaña al usuario de la idea a su primera venta: le dice qué hacer cada día con una ruta de 6 pasos, un asistente para las dudas y plantillas que se llenan y se guardan dentro de la app. El éxito es que el usuario avance en la ruta, vuelva con frecuencia (racha de días) y llegue a vender.

## Positioning

Una ruta concreta y ordenada para emprender en Colombia (RUT, Cámara de Comercio, precio, primeros clientes), en lugar de respuestas sueltas de una IA genérica o de buscar en muchos sitios. El asistente y las plantillas llevan de vuelta a la ruta. La bienvenida pone a cada usuario en el paso que le corresponde según su etapa.

## Operating Context

- Registro con correo (Google cuando se configure). La bienvenida pide nombre, emprendimiento y etapa: sin empezar (paso 1), con idea (paso 2) o con negocio en marcha (paso 3).
- Inicio con progreso, racha, siguiente paso, acceso rápido al asistente y tareas de la semana.
- Las cuentas y los datos se guardan en Supabase y se sincronizan entre dispositivos.

## Capabilities and Constraints

- Ruta de 6 pasos con actividades (lecturas, ejercicios y preguntas para el asistente).
- Asistente con IA local (Ollama) o con respuestas predefinidas. El plan gratis tiene 10 preguntas al mes y la base de datos aplica el límite.
- Plantillas: plan de negocio en 1 página, calculadora de precio, presupuesto inicial y guion de entrevista.
- Planes: Gratis ($0: la ruta completa, 10 preguntas al mes y plantillas básicas) y Pro ($19.900 COP al mes: asistente ilimitado, todas las plantillas, exportar a PDF y Excel, y recordatorios). **El pago todavía no está conectado.**
- Quedan para la fase 2: el dashboard de métricas y la comunidad con mentores. No se pueden presentar como disponibles.
- Stack: React 19, Vite, Tailwind 4 y React Router. Los colores y las animaciones de la portada ya existen y hay que conservarlos.

## Brand Commitments

- Nombre: **EmprendiApp**.
- Voz: **seria y confiable**. Trata de "tú", con frases claras y sin jerga corporativa, exageraciones ni promesas de éxito. La credibilidad va antes que el entusiasmo.
- Español de Colombia.

## Evidence on Hand

- Encuesta a 40 personas del 30 de septiembre al 2 de octubre de 2026 (`docs/encuesta-respuestas.csv`, resumen en `docs/mvp.md`):
  - 78 % pidió guías paso a paso, 60 % un asistente con IA y 58 % plantillas.
  - El 80 % dio 4 o 5 de 5 a "¿la usarías?".
  - Razón principal para no empezar: "no sé por dónde empezar" (17).
- Etapa: startup temprana **sin usuarios reales todavía**. No existen testimonios, número de usuarios, casos de éxito, prensa ni alianzas. No se pueden inventar ni insinuar. Las citas de la encuesta solo se pueden usar como lo que son.

## Product Principles

1. **Siempre un siguiente paso claro.** Cada pantalla responde a "¿qué hago ahora?".
2. **Concreto para Colombia.** Habla de trámites, precios y pesos reales, no de consejos genéricos de emprendimiento.
3. **Honestidad sobre la etapa.** Solo se afirma lo que la app hace hoy y lo que dice la encuesta.
4. **Sirve para los dos puntos de partida.** El que no ha empezado y el que ya vende tienen que verse reflejados.
5. **Hábito antes que intensidad.** 15 minutos al día y rachas, no maratones.

## Accessibility & Inclusion

Toda animación respeta "reducir movimiento" (`prefers-reduced-motion`). Tiene que funcionar bien en celulares de gama media.
