# Aprendizajes

## Web Development

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
