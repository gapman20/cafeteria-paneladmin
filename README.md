# Café Aromático — Panel Admin + Sitio Público

Panel de administración CMS y sitio público para **Café Aromático**, una marca de café premium artesanal.

## Stack

- **Frontend**: React 19 + Vite
- **Estilos**: CSS custom properties + diseño modular
- **Estado**: React Context (SiteContext)
- **Persistencia**: localStorage
- **Compresión de imágenes**: Canvas API (WebP with JPEG fallback, max 800px)

## Estructura del proyecto

```
src/
├── components/
│   ├── RomaBrewHero.jsx / .css    — Hero cinemático (vapor, parallax, shimmer)
│   ├── ImageUploader.jsx          — Upload compartido con compresión automática
│   ├── Navbar.jsx                 — Navegación responsive
│   ├── Footer.jsx                 — Footer
│   ├── LoginModal.jsx             — Modal de autenticación
│   └── ScrollReveal.jsx           — Animaciones de entrada
├── context/
│   └── SiteContext.jsx            — Estado global, tema, contenido, menú
├── hooks/
│   ├── useScrollReveal.js         — IntersectionObserver personalizado
│   ├── useContent.js              — Hook de contenido
│   ├── useImages.js               — Hook de imágenes
│   ├── useTheme.js                — Hook de tema
│   ├── useMenu.js                 — Hook de menú
│   ├── usePages.js                — Hook de páginas
│   ├── useInbox.js                — Hook de bandeja de entrada
│   ├── useAnalytics.js            — Hook de analytics
│   └── useAuth.js                 — Hook de autenticación
├── pages/
│   ├── Admin.jsx                  — Panel de administración completo
│   ├── Home.jsx                   — Página principal pública
│   ├── Services.jsx               — Página de menú/servicios
│   ├── Contact.jsx                — Página de contacto
│   └── Login.jsx                  — Página de login
├── styles/
│   ├── index.css                  — Tokens globales de diseño
│   ├── admin.css                  — Sistema de diseño del admin
│   └── home-sections.css          — Estilos de secciones Home
└── App.jsx                        — Router principal
```

## Sistema de Temas

El admin expone un editor de temas completo (`Colores & Tema`) con:

- **8 presets**: Clásico, Moderno, Rústico, Moka, Amber Oscuro, Esmeralda, Rojo & Fuego, Claro
- **Colores personalizados**: Color primario, secundario, fondos, textos
- **Tipografía**: 10 fuentes predefinidas + personalizada
- **Efectos**: Opacidad de vidrio, intensidad de brillo, radio de bordes

El tema se aplica via ~40 CSS custom properties en `:root`. Todos los componentes (Home, Hero, Contact, Services) derivan de estas variables — los cambios en admin se reflejan en vivo en todo el sitio.

## Panel de Administración

Secciones del admin:

| Categoría | Secciones |
|-----------|-----------|
| Dashboard | Resumen general |
| **Contenido** | Páginas, Imágenes, Inicio, Menú, Contacto, Footer |
| **Marketing** | Bandeja de Entrada, WhatsApp, Redes Sociales |
| **Configuración** | Colores & Tema, SEO, General |

### Compresión de imágenes

Todas las subidas de imágenes se comprimen automáticamente antes de guardarse en localStorage:
- **Menú**: max 400px, JPEG 0.7
- **General**: max 600px, JPEG 0.75

Esto previene el error `QuotaExceededError` de localStorage.

## Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build producción
npm run build
```

## Deploy

```bash
npm run build
# Los archivos estáticos quedan en dist/
```
