---
name: EmprendiApp
description: Ruta paso a paso para emprender en Colombia, sobria y clara como una libreta de trabajo.
colors:
  tinta-pizarra: "#0F172A"
  papel: "#F7F7F8"
  hoja: "#FFFFFF"
  tinta: "#111827"
  gris-nota: "#6B7280"
  pizarra-clara: "#94A3B8"
  bruma: "#E2E8F0"
  niebla: "#F1F5F9"
  linea: "#E5E7EB"
  alerta: "#DC2626"
  alerta-texto: "#B91C1C"
typography:
  display-xl:
    fontFamily: "Bricolage Grotesque, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "68px"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  display-lg:
    fontFamily: "Bricolage Grotesque, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "60px"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  display:
    fontFamily: "Bricolage Grotesque, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "44px"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  headline-lg:
    fontFamily: "Bricolage Grotesque, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "36px"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline-md:
    fontFamily: "Bricolage Grotesque, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "34px"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Bricolage Grotesque, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline-sm:
    fontFamily: "Bricolage Grotesque, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline-xs:
    fontFamily: "Bricolage Grotesque, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 800
    lineHeight: 1.15
  title-lg:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.25
  title-md:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.25
  title-sm:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.3
  title-xs:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.35
  subtitle:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.4
  section:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.4
  body-lg:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
  caption:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.4
  micro:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.3
rounded:
  xs: "5px"
  md: "10px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  section: "80px"
components:
  button-primary:
    backgroundColor: "{colors.tinta-pizarra}"
    textColor: "{colors.hoja}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "14px 20px"
  button-secondary:
    backgroundColor: "{colors.hoja}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.md}"
    padding: "14px 20px"
  button-light:
    backgroundColor: "{colors.bruma}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.md}"
    padding: "14px 20px"
  input:
    backgroundColor: "{colors.hoja}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
  card:
    backgroundColor: "{colors.hoja}"
    rounded: "{rounded.lg}"
    padding: "16px"
  chip:
    backgroundColor: "{colors.niebla}"
    textColor: "{colors.tinta}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  nav-item-active:
    backgroundColor: "{colors.niebla}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
---

# Design System: EmprendiApp

## Overview

**Creative North Star: "La libreta de ruta"**

EmprendiApp se ve como un cuaderno de trabajo bien llevado: tinta oscura sobre papel claro, cada cosa en su paso y nada que distraiga de lo que toca hacer hoy. El sistema es monocromo a propósito. Un solo color fuerte, la tinta pizarra, marca lo que se puede hacer y lo que ya se hizo; todo lo demás son grises fríos, hojas blancas y líneas finas. La personalidad no viene del color sino del orden, de los títulos en Bricolage Grotesque y de pequeños movimientos que muestran avance: un chulo que aparece, una línea que se llena, un precio que se calcula.

La densidad es media y tranquila. La app está pensada para 15 minutos al día en un celular, con una columna de máximo 430 px, tarjetas con borde fino en lugar de sombras y un solo botón principal por pantalla. Las páginas públicas (portada y páginas legales) amplían la escala tipográfica y el espacio entre secciones, pero usan exactamente la misma paleta.

La voz visual es seria y confiable, igual que la voz escrita: sin degradados, sin brillos, sin ilustraciones decorativas y sin promesas visuales que la app no cumpla.

**Key Characteristics:**
- Monocromo: tinta pizarra como único acento, con grises fríos y blanco.
- Plano: profundidad con bordes de 1 px y fondos tonales; sombra solo en lo que flota.
- Dos voces tipográficas: Bricolage Grotesque para titulares públicos, Inter para todo lo demás.
- Movimiento que muestra avance y siempre respeta "reducir movimiento".
- Pensado primero para celular: columna de 430 px, barra inferior y hojas que suben desde abajo.

## Colors

Una paleta de tinta y papel: un azul pizarra casi negro sobre grises fríos y blanco.

### Primary
- **Tinta pizarra** (#0F172A): el único color con peso. Botones principales, actividades completadas, la línea de la ruta, la tarjeta de progreso del Inicio, el plan Pro y el bloque de cierre de la portada. También es el color de los titulares grandes de la portada.

### Neutral
- **Papel** (#F7F7F8): fondo de todas las pantallas.
- **Hoja** (#FFFFFF): superficie de tarjetas, campos, hojas inferiores, barra de pestañas y menú lateral.
- **Tinta** (#111827): texto principal.
- **Gris nota** (#6B7280): texto secundario, descripciones y metadatos. Sobre papel queda justo en el contraste mínimo, así que no se usa por debajo de 13 px.
- **Pizarra clara** (#94A3B8): texto secundario sobre tinta pizarra, iconos dentro de campos y marcadores de posición.
- **Bruma** (#E2E8F0): fondo del botón claro, pista de las barras de progreso y chulos sobre fondo oscuro.
- **Niebla** (#F1F5F9): rellenos suaves: chips, preguntas rápidas, elemento activo del menú, burbuja del usuario en las muestras.
- **Línea** (#E5E7EB): bordes de tarjetas y campos, y divisores.

### Estados
- **Alerta** (#DC2626) y **texto de alerta** (#B91C1C): solo para errores y acciones destructivas (eliminar cuenta, cerrar sesión). Nunca como decoración.

### Named Rules
**The One Ink Rule.** La tinta pizarra es el único acento. No se agrega otro color de marca; el rojo existe solo para errores y acciones destructivas.

**The Ink-for-Action Rule.** El relleno sólido de tinta pizarra se reserva para acciones, estados completados y un solo momento destacado por pantalla. Las ilustraciones y muestras usan niebla o borde de línea, para que el botón principal siempre sea lo más fuerte.

## Typography

**Display Font:** Bricolage Grotesque (con Inter de respaldo), pesos 600 y 800.
**Body Font:** Inter (con ui-sans-serif y system-ui), pesos 400 a 700.

**Character:** Bricolage Grotesque pone carácter y algo de calidez en los titulares grandes; Inter se queda en lo funcional y se lee bien en celulares de gama media. Inter se conserva a propósito: la personalidad la dan los titulares.

### Hierarchy
La escala completa está en los tokens de `typography`; cada tamaño tiene un solo papel.

**Páginas públicas (Bricolage Grotesque 800, tracking -0.03em en display y -0.02em en headline):**
- **Display** (44 px en celular, 60 px desde 640 px y 68 px desde 1024 px; interlineado 0.98): solo el titular principal de la portada, en tinta pizarra y con equilibrio de líneas.
- **Headline** (30 px, 36 px desde 640 px; interlineado 1.1): títulos de sección de la portada.
- **Headline md** (34 px, 44 px desde 640 px; interlineado 1.05): la cita "No sé por dónde empezar", el cierre de la portada y el título de las páginas legales.
- **Headline sm** (26 px, 30 px desde 640 px): la franja "¿En qué punto estás hoy?".
- **Headline xs** (22 px): subtítulos numerados de las páginas legales.
- Las tarjetas de muestra de la portada usan Bricolage a 16 y 18 px para sus títulos y a 24 px para el precio sugerido; el precio de los planes va a 30 px.

**Dentro de la app (Inter):**
- **Title lg** (700, 28 px): título de Acceso, de la nueva contraseña y de la bienvenida.
- **Title** (700, 26 px): título de las pantallas con barra de pestañas (Inicio, Ruta, Plantillas, Planes).
- **Title md** (700, 24 px): título de un paso y de una plantilla.
- **Title sm** (700, 22 px): el nombre en Cuenta y las iniciales de su avatar.
- **Title xs** (700, 20 px): título dentro de las hojas inferiores.
- **Subtitle** (700, 18 px): nombre de un plan y la frase principal de la tarjeta de progreso.
- **Section** (600, 17 px): títulos de sección dentro de una pantalla ("Tareas de esta semana") y de las hojas de confirmación.
- **Body lg** (400, 16 px; 17 px con interlineado amplio en la portada): texto de las páginas públicas y de las opciones de la bienvenida. En páginas de lectura, máximo 68 caracteres por línea.
- **Body** (400, 15 px): texto corrido de la app, campos y botones.
- **Body sm** (400 a 600, 14 px): texto de listas, enlaces del encabezado y el correo en Cuenta.
- **Label** (500, 13 px): etiquetas de campos, metadatos ("Lectura · 4 min"), chips y notas.
- **Caption** (500, 12 px): ayudas y errores de campo, "Miembro desde" y el pie de las hojas.
- **Micro** (600, 11 px): etiquetas de la barra de pestañas, la pastilla "Pro" y los encabezados de columna de las plantillas. Nunca para texto corrido.

### Named Rules
**The Two Voices Rule.** Bricolage Grotesque solo aparece en tamaños de headline o mayores y en las tarjetas de muestra de la portada. Dentro de la app, los títulos van en Inter.

**The Tabular Money Rule.** Toda cifra en pesos que cambia (precio sugerido, totales) usa números tabulares para que no salte al actualizarse.

## Layout

La app es una sola columna de máximo 430 px, centrada en celular, con 20 px de margen lateral y 20 px entre bloques. La barra de pestañas fija abajo deja 112 px libres al final de cada pantalla; cuando hay botón fijo inferior, 128 px.

Desde 768 px la barra de pestañas se cambia por un menú lateral blanco de 224 px, y el contenido se centra en 672 px. Las hojas inferiores pasan a ventanas centradas.

Las páginas públicas usan un contenedor de 1152 px con márgenes de 16 px en celular y 32 px desde 640 px. Las secciones se separan con 80–112 px verticales y alternan fondo papel y franjas blancas con bordes de línea arriba y abajo. Las páginas de lectura se limitan a 768 px de ancho.

**The One Next Step Rule.** Cada pantalla tiene un solo botón principal. Las acciones secundarias van como botón blanco con borde o como enlace.

## Elevation & Depth

El sistema es plano. La profundidad viene del contraste entre el fondo papel y las hojas blancas con borde de línea de 1 px, no de sombras. Las sombras se reservan para lo que flota sobre el contenido.

### Shadow Vocabulary
- **Tarjeta destacada** (`box-shadow: 0 24px 48px -24px rgb(15 23 42 / 0.25)`): solo la tarjeta de la ruta en la portada.
- **Botón al pasar el mouse** (`box-shadow: 0 10px 24px -10px rgb(15 23 42 / 0.55)`, con 1 px de elevación): botones de registro de la portada.
- **Botón flotante** (sombra grande teñida de tinta pizarra al 25 % y anillo blanco de 4 px): el botón central del Asistente en la barra de pestañas.
- **Aviso** (sombra grande neutra): el aviso de "No se pudo guardar".
- **Velo** (negro al 30 %): fondo detrás de las hojas inferiores y ventanas.

### Named Rules
**The Border-Before-Shadow Rule.** Una tarjeta en reposo se separa con borde de línea, nunca con sombra. La sombra es para elementos que flotan o responden al puntero.

## Shapes

Esquinas suaves y consistentes, sin formas angulosas ni orgánicas. Los controles usan 10 px; las tarjetas de la app 12 px; las tarjetas grandes de la portada, las hojas inferiores y las ventanas 16 px. Chips, pastillas, barras de progreso, avatares y marcadores de paso son totalmente redondos. Las casillas de verificación usan 5 px. Los bordes siempre son de 1 px en color línea; el único borde de 2 px marca la opción elegida en la bienvenida.

## Components

### Buttons
Firmes y sin adornos: el botón dice qué pasa al tocarlo.
- **Shape:** esquinas suaves (10 px), alto mínimo de unos 48 px en la app.
- **Primary:** fondo tinta pizarra, texto blanco en Inter 600 a 15 px, 14 × 20 px de relleno, con un icono de flecha cuando lleva a otra pantalla.
- **Hover / Focus:** al presionar se encoge a 98 %. El principal sube 1 px y gana sombra al pasar el mouse; el secundario se rellena de niebla; el claro pasa a blanco; los de alerta se oscurecen o se tiñen de rojo muy claro. Al enfocarse con teclado, todos muestran un contorno de 2 px con 2 px de separación: tinta pizarra en general, blanco en el botón claro sobre fondo oscuro y rojo en los de alerta. Deshabilitado: 40 % de opacidad y sin reacción al mouse.
- **Secondary:** hoja blanca con borde de línea y texto en tinta.
- **Light:** fondo bruma y texto en tinta, para acciones dentro de superficies oscuras.
- **Danger / Danger outline:** rojo de alerta, solo para cerrar sesión y eliminar la cuenta.

### Chips
- **Style:** fondo niebla, texto en tinta a 12–13 px, totalmente redondos.
- **State:** las preguntas rápidas del Inicio son chips tocables; la etiqueta "Próximamente" del plan Pro es una pastilla blanca translúcida sobre tinta pizarra.

### Cards / Containers
- **Corner Style:** 12 px en la app, 16 px en la portada.
- **Background:** hoja blanca. La tarjeta de progreso del Inicio es la excepción: fondo tinta pizarra con texto blanco y barra en bruma.
- **Shadow Strategy:** ninguna en reposo (ver Elevation & Depth).
- **Border:** 1 px en línea; los divisores internos también.
- **Internal Padding:** 16 px en la app, 20–24 px en la portada.

### Inputs / Fields
- **Style:** hoja blanca, borde de línea, 10 px de esquina, icono en pizarra clara a la izquierda, texto a 15 px y etiqueta en gris nota a 13 px encima.
- **Focus:** el borde cambia a tinta pizarra.
- **Error:** borde rojo de alerta y mensaje de 12 px debajo, en texto de alerta. El mensaje aparece solo después de intentar enviar.

### Navigation
- **Celular:** barra de pestañas blanca fija abajo con cinco destinos (icono de 22 px y etiqueta de 11 px). Activo en tinta pizarra y 600; inactivo en gris nota. El Asistente va al centro como botón circular elevado de tinta pizarra.
- **Computador:** menú lateral blanco con borde derecho de línea. El elemento activo usa fondo niebla y texto en tinta; al pasar el mouse, igual.
- **Pantallas internas:** encabezado con flecha de volver y la ubicación ("Paso 2 de 6") en gris nota a la derecha.

### Hoja inferior
Paneles que suben desde abajo en celular (16 px de esquina arriba, tirador de bruma) y se abren como ventana centrada en computador. Se cierran con Escape o tocando el velo.

### Movimiento de avance
La firma del sistema. La entrada usa `rise` (sube 12 px y aparece en 0,5 s); los chulos usan `pop-in` (de 60 % a 100 % en 0,35 s), ambos con la curva cubic-bezier(0.2, 0.8, 0.2, 1). La línea de la ruta se llena con `grow-y` y el precio sugerido cuenta hacia arriba. En la portada, las secciones aparecen al entrar en pantalla (0,7 s). Todo movimiento tiene su versión sin animación cuando el dispositivo pide reducir movimiento.

## Do's and Don'ts

### Do:
- **Do** usar tinta pizarra (#0F172A) para el único botón principal de cada pantalla y para marcar lo completado.
- **Do** separar tarjetas con borde de línea (#E5E7EB) sobre fondo papel (#F7F7F8).
- **Do** usar Bricolage Grotesque 800 con tracking negativo solo en titulares de 30 px o más.
- **Do** animar solo para mostrar avance (un chulo, una línea, una cifra) y agregar siempre la versión sin movimiento.
- **Do** dar estado de foco visible (contorno de 2 px en tinta pizarra) a todo lo que se puede tocar.
- **Do** escribir las cifras de dinero en pesos colombianos y con números tabulares.

### Don't:
- **Don't** agregar un segundo color de marca, degradados ni texto con degradado.
- **Don't** usar el relleno sólido de tinta pizarra en ilustraciones o decoraciones que compitan con el botón principal.
- **Don't** poner sombras en tarjetas en reposo.
- **Don't** usar gris nota (#6B7280) por debajo de 13 px.
- **Don't** usar rojo fuera de errores y acciones destructivas.
- **Don't** poner más de un botón principal por pantalla.
