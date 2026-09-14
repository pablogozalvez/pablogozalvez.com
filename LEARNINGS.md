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
