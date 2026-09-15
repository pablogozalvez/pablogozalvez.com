# Aprendizajes

## Web Development

### Efectos visuales adaptados a la capacidad gráfica

**Explicación sencilla**
Una interfaz no debería insistir en mostrar el mismo efecto si el navegador solo puede renderizarlo por software. En ese caso es mejor conservar el diseño con una variante estática y devolver el cursor nativo.

**Cómo funciona**
Al crear un contexto WebGL con `failIfMajorPerformanceCaveat`, el navegador puede rechazar renderizadores demasiado lentos. También se comprueba el nombre del renderer para detectar alternativas de software conocidas. El resultado se memoriza y los componentes lo reutilizan sin repetir la prueba.

**Por qué importa**
Los filtros grandes, los fondos animados y un cursor interpolado pueden competir por cada fotograma. Desactivarlos como conjunto evita que una mejora puramente estética vuelva difícil de usar toda la página.

**En este proyecto**
`src/lib/actions.js` centraliza la detección. `src/lib/Cursor.svelte` no monta sus listeners en modo reducido, mientras `src/lib/Hero.svelte` y `src/routes/+layout.svelte` sustituyen parallax, blur y halos animados por una composición estática.

**Tradeoffs / pitfalls**
La detección es preventiva, no un benchmark exacto. `prefers-reduced-motion`, poca memoria o pocos núcleos también activan la variante ligera, porque en esos dispositivos la estabilidad y la accesibilidad pesan más que el efecto.

### Cursores personalizados e iframes

**Explicación sencilla**
Un iframe es otra página incrustada. Cuando el puntero entra en ella, la página padre deja de recibir sus movimientos y un cursor personalizado puede parecer congelado.

**Cómo funciona**
Las superficies externas se marcan con `data-native-cursor`. Antes de cruzar el límite del iframe, el cursor personalizado se oculta y se restaura el cursor del sistema. Los modales PDF gestionan esa exclusión durante todo su ciclo de vida y limpian el estado al desmontarse.

**Por qué importa**
No es posible seguir el puntero dentro de un iframe de otro dominio por la política de mismo origen. Cambiar deliberadamente al cursor nativo evita una animación rota sin intentar atravesar esa frontera de seguridad.

**En este proyecto**
Turnstile declara la zona nativa en `src/lib/Contact.svelte`. `src/lib/PdfViewer.svelte` bloquea el cursor global mientras el visor existe, de modo que el currículum y los documentos de proyectos comparten el mismo comportamiento.

**Tradeoffs / pitfalls**
La responsabilidad debe vivir en el componente que crea el modal o el iframe. Repetir clases globales desde cada consumidor produce estados desincronizados y limpiezas incompletas.

### Animaciones de entrada sin repintados costosos

**Explicación sencilla**
Una animación de scroll suele ser más fluida cuando cambia únicamente opacidad y transformaciones. Efectos como `filter: blur()` sobre tarjetas grandes obligan al navegador a recalcular muchos píxeles en cada fotograma.

**Cómo funciona**
`IntersectionObserver` marca cada elemento cuando entra en el viewport. CSS interpola `opacity` y `transform` sin ejecutar lógica por fotograma. Separar la transformación de entrada en una envoltura y la transformación de hover en la tarjeta evita que ambas animaciones compitan por la misma propiedad.

**Por qué importa**
Reduce tirones durante el scroll, mantiene el hover independiente y permite respetar `prefers-reduced-motion` sin duplicar lógica JavaScript.

**En este proyecto**
`src/lib/Projects.svelte` aplica el reveal a `.project-reveal-shell`, mientras `.project-card` conserva la elevación y el escalado de imagen al pasar el ratón.

**Tradeoffs / pitfalls**
Los retrasos basados en el índice global pueden hacer que elementos ya visibles permanezcan ocultos demasiado tiempo. Si se usa stagger, debe limitarse al grupo visible y no acumularse a lo largo de toda la lista.

### Actualizaciones coordinadas de dependencias

**Explicación sencilla**
Las herramientas centrales de un framework forman un bloque compatible. Actualizar solo una puede mantener vulnerabilidades o romper el servidor de desarrollo y el proceso de build.

**Cómo funciona**
Svelte, SvelteKit, Vite y el plugin oficial de Svelte declaran rangos de compatibilidad entre sí. La actualización debe resolver esos rangos conjuntamente y regenerar el lockfile; después, `npm audit` comprueba el árbol instalado completo, incluidas las dependencias transitivas.

**Por qué importa**
Un lockfile actualizado hace que desarrollo, CI y producción instalen exactamente el árbol que se ha validado, sin depender de lo que npm considere más reciente en el futuro.

**En este proyecto**
`package.json` mantiene alineados Svelte 5, SvelteKit 2, Vite 8 y `@sveltejs/vite-plugin-svelte` 7. El override temporal de `cookie` fija la primera línea corregida que elimina el aviso heredado de SvelteKit estable.

**Tradeoffs / pitfalls**
No se debe usar `npm audit fix --force` como sustituto de revisar compatibilidades. Los overrides transitivos deben ser específicos, probarse con el build y retirarse cuando la dependencia principal adopte directamente una versión corregida.

### SEO multidioma con rutas indexables

**Explicación sencilla**
Cada idioma necesita una URL y un HTML propios. Cambiar textos solo en el navegador no permite que los buscadores entiendan cada versión como una página independiente.

**Cómo funciona**
La versión inglesa usa `/` y la española `/es`. El idioma se obtiene de la ruta, se proporciona mediante contexto de Svelte y cada renderizado genera su `lang`, título, descripción, canonical y `hreflang` correspondientes.

**Por qué importa**
Evita contenido dependiente de JavaScript, canonicals contradictorios y stores globales que podrían compartir estado entre peticiones SSR concurrentes.

**En este proyecto**
Las reglas de URL viven en `src/lib/locales.js`, el contexto por renderizado en `src/lib/i18n.js`, el atributo `lang` en `src/hooks.server.js` y los metadatos en `src/lib/SEO.svelte`.

**Tradeoffs / pitfalls**
Todas las variantes deben enlazarse de forma recíproca. La preferencia guardada del usuario mejora la navegación, pero la URL sigue siendo la fuente de verdad para el servidor y los buscadores.

### Desambiguación de una identidad personal

**Explicación sencilla**
Cuando dos personas tienen nombres parecidos, repetir el nombre no basta. Hay que asociarlo de forma consistente a profesión, ubicación, dominio y perfiles oficiales.

**Cómo funciona**
El nombre sin tilde coincide con el dominio y actúa como nombre canónico de búsqueda. La grafía correcta con tilde se conserva como nombre alternativo. El esquema `Person` conecta ambas variantes con Alicante, la especialización profesional y los perfiles `sameAs`.

**Por qué importa**
Estas señales ayudan al buscador a formar una entidad distinta y a relacionar resultados dispersos de LinkedIn, GitHub, itch.io y el portfolio.

**En este proyecto**
La entidad y el esquema `WebSite` se generan en `src/lib/SEO.svelte`; el hero refuerza de forma visible el contexto de desarrollador de software y videojuegos.

**Tradeoffs / pitfalls**
No conviene mencionar a la persona con la que existe confusión ni incluir variantes ortográficas que no pertenecen a la identidad propia. Eso puede reforzar justo la asociación que se intenta evitar.

### Formularios estáticos con un endpoint de servidor

**Explicación sencilla**
Una página puede seguir siendo estática y tener un formulario funcional. El navegador envía los datos a una ruta de servidor independiente, que ejecuta solo la parte sensible, como enviar un correo.

**Cómo funciona**
El componente publica JSON en `POST /api/contact`. La ruta valida el contenido, lee las variables privadas de entorno y usa Resend. También recibe el idioma activo y reutiliza los archivos i18n para generar en servidor la copia localizada del correo y su confirmación. Cada correo incluye HTML con estilos en línea y una alternativa de texto plano; los datos del visitante se escapan antes de insertarse en el HTML. La página principal no deja de prerenderizarse porque el endpoint declara `prerender = false` de forma aislada.

**Por qué importa**
La clave de Resend nunca llega al navegador y el HTML indexable no depende de la ejecución de la función. El servidor también es el único lugar fiable para validar datos y aplicar medidas antispam.

**En este proyecto**
`src/lib/Contact.svelte` controla la interfaz y obtiene un token de Cloudflare Turnstile. `src/routes/api/contact/+server.js` valida ese token mediante Siteverify antes de enviar nada, además de mantener la validación de campos y el honeypot. Las variables de Resend y `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` se configuran fuera del repositorio.

**Tradeoffs / pitfalls**
Un honeypot reduce spam básico, pero no detiene ataques dirigidos. Turnstile añade una prueba de riesgo sin exponer su clave secreta: la clave de sitio llega al HTML, mientras que la secreta permanece en el servidor. El token caduca, es de un solo uso y siempre debe verificarse en el backend; validar solo el widget del navegador no aporta seguridad real. El correo del visitante debe ser `replyTo`, no el remitente, para no romper la autenticación del dominio.
