# EmprendiApp: qué hace la aplicación

EmprendiApp acompaña a jóvenes que quieren emprender, o que ya tienen un negocio pequeño, a avanzar paso a paso: de la idea a sus primeros clientes. Es una página web que funciona en computador y en celular, pensada para usarse 15 minutos al día.

Tiene tres herramientas principales, que salen de lo que más pidieron las 40 personas encuestadas (ver [mvp.md](mvp.md)):

- **Una ruta de 6 pasos** con actividades concretas.
- **Un asistente** para resolver dudas sobre el negocio.
- **Plantillas** que se llenan dentro de la app y se guardan solas.

## Recorrido de un usuario nuevo

1. **Portada.** Quien entra por primera vez ve una página que explica qué es EmprendiApp, con botones para crear una cuenta o iniciar sesión.
2. **Registro.** Crea su cuenta con nombre, correo y contraseña.
3. **Bienvenida.** Escribe su nombre, el de su emprendimiento (opcional) y elige en qué punto está:
   - *Quiero emprender pero no sé por dónde empezar:* la ruta empieza en el paso 1.
   - *Ya tengo una idea:* se da por hecho el paso 1 y empieza en el paso 2.
   - *Ya tengo un negocio en marcha:* se dan por hechos los pasos 1 y 2 y empieza en el paso 3.
4. **Inicio.** Desde aquí usa la app. En celular navega con la barra inferior; en computador, con el menú lateral.

Cuando vuelve más adelante con su sesión abierta, ve primero una pantalla de carga con el logo y luego su Inicio.

## Pantallas

### Portada

Es lo primero que ve quien no ha iniciado sesión.

- **Encabezado** con el logo y los botones "Iniciar sesión" y "Crear cuenta".
- **Inicio de la página:** "De la idea a tu primera venta, paso a paso.", con el botón "Crear mi cuenta gratis" y los 6 pasos de la ruta, que se van marcando uno a uno hasta llegar a "Tu primera venta".
- **El problema:** la frase "No sé por dónde empezar." y los resultados de la encuesta (78 % pidió guías paso a paso, 60 % un asistente y 58 % plantillas), con barras que crecen al llegar a esa parte.
- **Qué hace la app,** con tres muestras animadas: actividades que se marcan como hechas, una conversación con el asistente sobre el RUT y la calculadora llegando al precio sugerido.
- **Planes** Gratis y Pro, y un cierre con el botón "Empezar mi ruta".

Las secciones aparecen suavemente a medida que se baja por la página. Si la persona tiene activada en su dispositivo la opción de **reducir movimiento**, todo se muestra sin animaciones.

### Acceso (registro e inicio de sesión)

- Selector entre **Registro** e **Iniciar sesión**. Abre en una u otra según el botón que se tocó en la portada.
- Registro: nombre, correo y contraseña de mínimo 6 caracteres.
- Inicio de sesión: correo y contraseña.
- Se puede mostrar u ocultar la contraseña.
- **¿Olvidaste tu contraseña?:** se escribe el correo y llega un enlace para crear una contraseña nueva. Si el enlace venció, la app lo explica y permite pedir otro.
- **Continuar con Google**, cuando esté activado.
- Mensajes claros si el correo ya está registrado o si los datos no coinciden.
- El logo lleva de vuelta a la portada.
- La cuenta y el progreso se guardan en la nube: se puede entrar desde cualquier computador o celular y encontrar todo igual. Cada persona solo ve lo suyo.

### Inicio

- Saludo con el nombre y un mensaje según el avance ("Vas muy bien. Hoy toca: …").
- **Racha:** cuántos días seguidos lleva completando al menos una actividad ("Llevas 3 días seguidos avanzando."). Si ayer avanzó pero hoy todavía no, invita a completar una actividad para no perder la racha.
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

### Asistente

En celular es el botón destacado en el centro de la barra inferior.

- Chat para preguntar sobre el negocio, con sugerencias para empezar.
- **Puede funcionar de dos formas:**
  - **Con inteligencia artificial**, cuando está conectado al servidor del asistente. Responde de forma breve y práctica, pensando en emprendedores jóvenes en Colombia, y tiene en cuenta lo que se ha hablado antes en la conversación.
  - **Con respuestas predefinidas**, si el servidor no está disponible. Reconoce temas como RUT y DIAN, Cámara de Comercio, precios, financiación, redes, clientes, validación, plan de negocio, cómo empezar y organización del tiempo. Estas respuestas traen un botón que lleva a la parte de la app relacionada, por ejemplo "Abrir calculadora".
- **Plan gratis:** 10 preguntas al mes. Debajo del chat se ve cuántas quedan ("Te quedan 7 de 10 preguntas gratis este mes"). Al agotarlas, invita a pasarse a Pro.
- Al desplazarse por la conversación, los mensajes se desvanecen al llegar a la caja de texto.

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

- Iniciales, nombre, correo y fecha desde la que es miembro.
- **Tu emprendimiento:** nombre del negocio (editable), etapa elegida en la bienvenida y progreso de la ruta.
- **Tu plan:** plan actual y cuántas preguntas al asistente le quedan en el mes, con un botón para mejorar a Pro.
- **Datos personales:** nombre (editable) y correo.
- **Cerrar sesión**, con confirmación antes de salir. Al cerrar sesión se vuelve a la portada.
- **Eliminar mi cuenta:** borra para siempre la cuenta y todos sus datos (progreso, plantillas y conversaciones). Para confirmar hay que escribir ELIMINAR.

### Planes

| | Gratis | Pro |
|---|---|---|
| Precio | $0 | $19.900 COP al mes |
| Ruta completa | Sí | Sí |
| Asistente | 10 preguntas al mes | Ilimitado |
| Plantillas | Básicas | Todas |
| Exportar a PDF y Excel | No | Sí |
| Recordatorios y tareas semanales | No | Sí |

El botón "Volver" regresa a la pantalla desde donde se abrió Planes. Pro aparece como "Próximamente", con el aviso de que el pago todavía no está disponible y que por ahora todas las cuentas empiezan en Gratis.

## En computador

- Un **menú lateral** fijo con el logo y las cinco secciones reemplaza la barra inferior.
- El contenido se muestra en una columna central más ancha, y las plantillas en tres columnas.
- Los paneles (actividades, editar nombre, cerrar sesión) se abren como ventanas centradas y se cierran con la tecla **Escape**.
- La portada, el acceso y la bienvenida se ven igual en computador y en celular, adaptados al ancho de la pantalla.

## Qué falta o está simulado en esta versión

- **Los correos para recuperar la contraseña todavía solo le llegan al equipo** del proyecto; falta conectar un servicio de correo propio.
- **Entrar con Google** está listo en la app, pero falta activarlo en Supabase.
- **El asistente con IA solo funciona donde corre su servidor.** Por ahora ese servidor se usa en el computador de desarrollo; en la página publicada, el asistente usaría las respuestas predefinidas.
- **Sin pagos:** nadie puede pasar al plan Pro todavía, y las plantillas Pro y la exportación están bloqueadas.
- **Sin recordatorios ni notificaciones.**
- **No se puede cambiar la etapa ni borrar el historial del chat.**

Los siguientes pasos para cubrir esto están en el [README](../README.md#siguientes-pasos).
