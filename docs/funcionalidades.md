# EmprendiApp: qué hace la aplicación

EmprendiApp acompaña a jóvenes que quieren emprender, o que ya tienen un negocio pequeño, a avanzar paso a paso: de la idea a sus primeros clientes. Está pensada para usarse en el celular y en 15 minutos al día.

Tiene tres herramientas principales, que salen de lo que más pidieron las 40 personas encuestadas (ver [mvp.md](mvp.md)):

- **Una ruta de 6 pasos** con actividades concretas.
- **Un asistente** para resolver dudas sobre el negocio.
- **Plantillas** que se llenan dentro de la app y se guardan solas.

## Recorrido de un usuario nuevo

1. **Pantalla de carga.** Al abrir la app aparece el logo y el nombre de EmprendiApp durante un par de segundos.
2. **Registro.** La persona crea su cuenta con nombre, correo y contraseña. Si ya tiene cuenta, inicia sesión.
3. **Bienvenida.** Escribe su nombre, el de su emprendimiento (opcional) y elige en qué punto está:
   - *Quiero emprender pero no sé por dónde empezar:* la ruta empieza en el paso 1.
   - *Ya tengo una idea:* se da por hecho el paso 1 y empieza en el paso 2.
   - *Ya tengo un negocio en marcha:* se dan por hechos los pasos 1 y 2 y empieza en el paso 3.
4. **Inicio.** Desde aquí usa la app con la barra inferior de 5 pestañas.

## Pantallas

### Acceso (registro e inicio de sesión)

- Selector entre **Registro** e **Iniciar sesión**.
- Registro: nombre, correo y contraseña de mínimo 6 caracteres.
- Inicio de sesión: correo y contraseña.
- Se puede mostrar u ocultar la contraseña.
- Mensajes claros si el correo ya está registrado o si los datos no coinciden.
- Cada cuenta guarda su propio progreso: si dos personas usan el mismo celular, cada una ve lo suyo.

### Inicio

- Saludo con el nombre y un mensaje según el avance ("Vas muy bien. Hoy toca: …").
- Tarjeta con el progreso de la ruta, el siguiente paso y un botón para continuar.
- Caja para hacerle una pregunta al asistente, con preguntas rápidas como "¿Cómo saco el RUT?".
- **Tareas de esta semana:** las 3 siguientes actividades pendientes, que se pueden marcar como hechas desde ahí mismo.

### Ruta

Los 6 pasos, con el paso actual resaltado y los terminados marcados con un chulo:

| Paso | De qué se trata | Tiempo aprox. |
|---|---|---|
| 1. Encuentra y define tu idea | Pasar de "quiero emprender" a una idea que quepa en una frase. | 2 días |
| 2. Valida con clientes reales | Confirmar con 5 personas que el problema existe, usando el guion de entrevista. | 3 días |
| 3. Arma tu plan de negocio | Ordenar el negocio en una página. | 1 día |
| 4. Haz cuentas: costos y precios | Calcular el precio de venta y cuánto dinero se necesita para arrancar. | 1 día |
| 5. Formaliza tu negocio | RUT, Cámara de Comercio y permisos en Colombia. | 1 semana |
| 6. Consigue tus primeros clientes | Redes sociales, contactos cercanos y la primera venta. | 2 semanas |

Al entrar a un paso se ve:

- Su objetivo, el progreso y el tiempo estimado.
- La lista de actividades. Hay cuatro tipos: **lecturas** cortas, **ejercicios** prácticos, actividades con **plantilla** y preguntas para el **asistente**.
- La plantilla relacionada con ese paso, si tiene una.
- Un consejo práctico.

Cada actividad se abre en un panel con su explicación. Desde ahí se marca como hecha o se va directo a la plantilla o al asistente con la pregunta ya escrita. Al terminar todas, el botón lleva al siguiente paso.

### Asistente (botón central de la barra)

- Chat para preguntar sobre el negocio, con sugerencias para empezar.
- Cada respuesta trae un botón que lleva a la parte de la app relacionada, por ejemplo "Abrir calculadora" o "Ver paso de trámites".
- Temas que reconoce: RUT y DIAN, Cámara de Comercio y trámites, precios y costos, financiación (Fondo Emprender, iNNpulsa), redes y marketing, clientes y ventas, validación, plan de negocio, cómo empezar y organización del tiempo.
- **Plan gratis:** 10 preguntas al mes. Al agotarlas, invita a pasarse a Pro.

> Por ahora el asistente usa respuestas predefinidas según palabras clave. Todavía no está conectado a un modelo de IA real.

### Plantillas

Lista con buscador y filtros por categoría (Plan, Finanzas, Marketing). Lo que escribe el usuario se guarda automáticamente.

| Plantilla | Qué hace | Plan |
|---|---|---|
| Plan de negocio en 1 página | Cinco bloques: problema, cliente, solución, cómo ganas dinero y canales. Muestra cuántos bloques van completos y ofrece "Sugerir con IA" en los vacíos. | Gratis |
| Calculadora de costos y precio | Suma los costos por unidad, deja elegir un margen de ganancia (20 % a 50 %) y calcula el precio sugerido y la ganancia por unidad, en pesos colombianos. Tiene un botón para revisar el precio con el asistente. | Gratis |
| Presupuesto inicial | Lista editable de gastos para arrancar y el total que se necesita. | Gratis |
| Guion para entrevistar clientes | 10 preguntas para validar la idea sin influir en las respuestas, con botón para copiarlas. | Gratis |
| Calendario de contenido para redes | Planear publicaciones. | Pro |
| Flujo de caja mensual | Controlar ingresos y gastos del mes. | Pro |

Exportar a PDF o Excel está marcado como función Pro.

### Cuenta

- Foto de perfil con las iniciales, nombre, correo y fecha desde la que es miembro.
- **Tu emprendimiento:** nombre del negocio (editable), etapa elegida en la bienvenida y progreso de la ruta.
- **Tu plan:** plan actual y cuántas preguntas al asistente lleva en el mes, con un botón para mejorar a Pro.
- **Datos personales:** nombre (editable) y correo.
- **Cerrar sesión**, con confirmación antes de salir.

### Planes

| | Gratis | Pro |
|---|---|---|
| Precio | $0 | $19.900 COP al mes |
| Ruta completa | Sí | Sí |
| Asistente | 10 preguntas al mes | Ilimitado |
| Plantillas | Básicas | Todas |
| Exportar a PDF y Excel | No | Sí |
| Recordatorios y tareas semanales | No | Sí |

El botón "Probar 7 días gratis" muestra un aviso: los pagos todavía no están activos.

## Qué falta o está simulado en esta versión

- **Cuentas solo en el dispositivo.** El registro y los datos se guardan en el navegador. Si la persona cambia de celular o borra los datos del navegador, pierde su cuenta y su progreso. No hay recuperación de contraseña.
- **Asistente sin IA real:** responde con textos predefinidos.
- **Sin pagos:** nadie puede pasar al plan Pro todavía, y las plantillas Pro y la exportación están bloqueadas.
- **Sin recordatorios ni notificaciones.**

Los siguientes pasos para cubrir esto están en el [README](../README.md#siguientes-pasos).
