---
target: landing page
total_score: 22
max_score: 32
na_heuristics: 7,9
p0_count: 0
p1_count: 3
target_identity: "file:C:\\Users\\david\\Desktop\\emprende-app\\emprende-app\\src\\screens\\Landing.jsx"
target_fingerprint: "sha256:9c80198dd8455939ea2344030d87ac4bc797b6da004ec26d5d50ffd3c839170e"
target_path: "C:\\Users\\david\\Desktop\\emprende-app\\emprende-app\\src\\screens\\Landing.jsx"
timestamp: 2026-10-05T23-10-50Z
slug: src-screens-landing-jsx
---
# Critique: src/screens/Landing.jsx (Persuade, objetivo: registros)

Method: dual-agent (A: a33a57596129fe18b · B: acdb03ac999de246a). Browser no disponible: revisión sobre el código.

## Heurísticas (22/32, 69 %, Acceptable)
1 Estado del sistema 3 · 2 Lenguaje del usuario 3 · 3 Control 3 · 4 Consistencia 3 · 5 Prevención de errores 2 (Pro con precio y el pago no está conectado) · 6 Reconocimiento 4 · 7 n/a · 8 Estética 3 · 9 n/a · 10 Ayuda 1 (no hay FAQ, ni "qué pasa después", ni privacidad, ni quién está detrás)

## Specificity
El contenido es propio (pasos reales, RUT y DIAN, COP), pero la estructura es la secuencia SaaS de siempre. El relleno sólido `pri` se usa en todo, así que el botón de registro no destaca.

## Detector
1 hallazgo, bounce-easing en L221 (los puntos de "escribiendo"). Es un falso positivo como regla, pero falta `motion-reduce:animate-none`.

## Problemas prioritarios
- [P1] Ignora a la mitad de la audiencia que ya vende (hero, "tu primera venta", encuesta). Nunca dice que si ya vendes empiezas en el paso 3.
- [P1] No hay CTA entre el hero y el cierre, los planes no tienen botón y en celular el encabezado oculta "Crear cuenta" (L326).
- [P1] No responde objeciones ni da confianza: falta FAQ, privacidad (Ley 1581), quién está detrás y "qué pasa al registrarte". Pro no dice "próximamente".
- [P2] En celular la animación del hero corre fuera de pantalla. La encuesta se lee como nota interna y no usa el 80 % de "la usaría".
- [P2] Se abusa del relleno sólido `pri`, así que el CTA no es lo más fuerte de la página. `btn` no tiene estado hover.

## Menores
aria-label en un span (L217). Las previews no tienen aria-hidden. La pastilla de "Tu primera venta" es un `<li>` (7 elementos). La cita es un `<p>` y no un encabezado. Faltan meta description y Open Graph para compartir por WhatsApp. "Margen 40 %" es ambiguo. El texto `mut` sobre `bg` queda justo en 13 px.
