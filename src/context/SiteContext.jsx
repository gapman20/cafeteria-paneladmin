import React, { createContext, useContext, useState, useEffect } from 'react';

// ─── Default Text Content ─────────────────────────────────────────────────────
const defaultContent = {
  siteName:  'Café Aromático',
  tagline:   'El mejor café de especialidad, recién tostado',
  ctaButton: 'Ordenar Ahora',

  seo: {
    title:       'Café Aromático | Café de Especialidad',
    description: 'Café de especialidad recién tostado. Espresso, cold brew, pour over y repostería artesanal. Visítanos en el centro de la ciudad.',
    keywords:    'café de especialidad, espresso, cold brew, cafetería, café artesanal, tostado artesanal, pour over',
  },

  social: {
    facebook:  'https://facebook.com/cafearomatico',
    instagram: 'https://instagram.com/cafearomatico',
    tiktok:    'https://tiktok.com/@cafearomatico',
    youtube:   '',
    linkedin:  '',
  },

  whatsappFloat: {
    number:  '+521234567890',
    message: 'Hola! Me gustaría reservar una mesa o hacer un pedido.',
  },

  home: {
    badge:              '☕ Café de Especialidad',
    title:              'Sabor que',
    titleAccent:        'Enamora',
    subtitle:           'Granos seleccionados de las mejores fincas latinoamericanas, tostados artesanalmente en pequeños lotes para ofrecerte una experiencia única en cada taza.',
    ctaText:            'Ver Menú',
    ctaSecondary:       'Nuestra Historia',
    ctaSectionTitle:    'Visítanos Hoy',
    ctaSectionSubtitle: 'Ambiente acogedor, wifi gratuito y el mejor café de la ciudad. Tu lugar favorito para desconectar.',
    // Stats
    stats: [
      { number: '500+', label: 'Tazas Diarias' },
      { number: '4.9', label: 'Calificación' },
      { number: '12', label: 'Orígenes' },
      { number: '8', label: 'Años' },
    ],
    // Process
    processTitle: 'Del Grano a Tu Taza',
    processSubtitle: 'Cada paso es una decisión de calidad que se refleja en tu experiencia.',
    steps: [
      { number: '01', title: 'Selección', desc: 'Viajamos a las mejores fincas de Colombia, Etiopía y Guatemala para seleccionar granos de altura con perfiles únicos.' },
      { number: '02', title: 'Tueste', desc: 'Tostamos en pequeños lotes cada semana, controlando temperatura y tiempo para resaltar las notas de cada origen.' },
      { number: '03', title: 'Preparación', desc: 'Nuestros baristas certificados dominan cada método: espresso, pour over, cold brew y más.' },
      { number: '04', title: 'Servicio', desc: 'Te lo servimos con atención personalizada, porque cada taza es una experiencia que merece ser disfrutada.' },
    ],
    // Testimonials
    testimonialsTitle: 'Lo Que Dicen Nuestros Clientes',
    testimonialsSubtitle: 'La mejor recompensa es verte sonreír con cada sorbo.',
    testimonials: [
      { name: 'Laura Méndez', role: 'Fotógrafa', text: 'El mejor cold brew que he probado. Vengo todos los martes y nunca me falla. El ambiente es perfecto para trabajar.' },
      { name: 'Roberto Silva', role: 'Emprendedor', text: 'El café de origen de Etiopía me cambió la perspectiva del café. Ahora entiendo lo que es un buen tueste. Imperdible.' },
      { name: 'Sofía Torres', role: 'Diseñadora', text: 'El pour over es una obra de arte. Se nota la pasión en cada detalle, desde la selección del grano hasta la presentación.' },
    ],
    // Tech stack
    techTitle: 'Nuestros Métodos',
    techSubtitle: 'Dominamos las técnicas más exigentes del mundo cafetero.',
    tech: ['Espresso', 'Pour Over', 'Cold Brew', 'Aeropress', 'Chemex', 'Sifón'],
  },

  about: {
    title:      'Nuestra Historia',
    subtitle:   'Desde 2017, dedicados a la excelencia cafetera',
    description: 'Café Aromático nació del sueño de dos amigos apasionados por el café de especialidad. Lo que comenzó como un pequeño tueste artesanal en un garaje, hoy es una comunidad de amantes del buen café. Creemos que cada grano tiene una historia, y nuestro trabajo es contarla a través del sabor.',
    mission:    'Acercar a las personas el verdadero sabor del café de especialidad, conectando productores, baristas y comunidad en una experiencia que trasciende la taza.',
    vision:     'Ser la cafetería de referencia en la ciudad, reconocida por nuestra transparencia, calidad y por crear un espacio donde la gente se sienta como en casa.',
    values: ['Calidad sin Compromiso', 'Transparencia', 'Comunidad', 'Sostenibilidad'],
  },

  services: {
    title:    'Nuestro Menú',
    subtitle: 'Descubre nuestra selección de cafés, bebidas y repostería artesanal preparados con pasión.',
    cards: [
      { id: '1', title: 'Espresso & Tradición',     desc: 'Nuestro espresso signature con notas de chocolate oscuro y un toque ahumado. Doble extracción con granulometría perfecta.', active: true },
      { id: '2', title: 'Métodos Especiales',  desc: 'Pour over, Aeropress, Chemex y más. Cada método resalta notas únicas del café de origen que elijas.', active: true },
      { id: '3', title: 'Cold Brew & Helados',    desc: '12 horas de infusión en frío. Suave, refrescante y con un sabor que te conquista. También affogato y bebidas frías.', active: true },
      { id: '4', title: 'Repostería Artesanal',       desc: 'Croissants, muffins, pasteles y galletas preparados cada mañana con ingredientes premium y recetas de la casa.', active: true },
    ],
  },

  contact: {
    title:    'Encuéntranos',
    subtitle: 'Te esperamos para compartir una buena taza de café',
    email:    'hola@cafearomatico.com',
    whatsapp: '+52 (55) 1234-5678',
    address:  'Calle Principal #123, Colonia Centro, Ciudad de México',
    mapLat:   19.4326,
    mapLng:   -99.1332,
  },

  products: {
    title:    'Nuestros Cafés',
    subtitle: 'Cada taza cuenta una historia. Descubre nuestros cafés de especialidad y encuentra tu favorito.',
  },

  footer: {
    description: 'Café de especialidad, recién tostado y preparado con pasión. Tu taza perfecta te espera.',
    copyright:   'Café Aromático. Todos los derechos reservados.',
  },
};

// ─── Default Blog Posts ────────────────────────────────────────────────────────
const defaultBlogPosts = [
  {
    id: 'post-1',
    title:     'Los Secretos del Tueste Perfecto',
    excerpt:   'Descubre cómo la temperatura, el tiempo y la humedad transforman un grano verde en una experiencia aromática única.',
    content:   'El tueste del café es tanto un arte como una ciencia. Cada grano de café verde pasa por una transformación química compleja cuando se expone al calor.\n\nEn Café Aromático, tostamos en un tostador Diedrich de 15kg que nos permite controlar con precisión la temperatura de cada fase del tueste. Desde el punto caramelo hasta el segundo crack, cada segundo cuenta.\n\nLos perfiles de tueste ligero preservan las notas frutales y florales del origen, mientras que un tueste medio desarrolla sabores más balanceados de chocolate y caramelo. El tueste oscuro, por su parte, intensifica los sabores achocolatados pero puede enmascarar las notas sutiles del grano.',
    author:    'Carlos Mendoza',
    date:      'Jul 12, 2026',
    image:     null,
    tags:      'tueste, café, proceso, artesanal',
    published: true,
  },
  {
    id: 'post-2',
    title:     'Guía: Cómo Preparar el Cold Brew Perfecto',
    excerpt:   'Paso a paso para lograr un cold brew suave, concentrado y lleno de sabor en la comodidad de tu hogar.',
    content:   'El cold brew se ha convertido en la bebida del verano, pero poca gente sabe prepararlo correctamente. La clave está en la paciencia y la proporción.\n\nNuestra receta: 100g de café molido grueso por cada 700ml de agua fría. Mezcla suavemente, tapa y refrigera durante 12 a 16 horas. No hay atajos aquí.\n\nDespués de la infusión, cuela con un colador fino y un papel de filtro. El resultado es un concentrado que puedes diluir con agua o leche al gusto. Guarda el resto en el refrigerador — dura hasta una semana.',
    author:    'María López',
    date:      'Jul 5, 2026',
    image:     null,
    tags:      'cold brew, receta, café frío, tutorial',
    published: true,
  },
  {
    id: 'post-3',
    title:     'Café de Origen vs Mezcla: ¿Cuál Elegir?',
    excerpt:   'Entiende las diferencias fundamentales entre un single origin y una mezcla, y cuál se adapta mejor a tu paladar.',
    content:   'Si alguna vez te has preguntado por qué un café de Etiopía sabe a frutas mientras que uno de Colombia recuerda al chocolate, la respuesta está en el concepto de origen.\n\nUn café de origen único (single origin) proviene de una sola finca, región o país. Esto significa que cada lote tiene un perfil de sabor único determinado por el clima, la altitud, el suelo y el procesamiento del grano.\n\nLas mezclas, por otro lado, combinan granos de diferentes orígenes para crear un perfil de sabor consistente y equilibrado. Un buen master roaster sabe combinar granos para resaltar lo mejor de cada uno.',
    author:    'Carlos Mendoza',
    date:      'Jun 28, 2026',
    image:     null,
    tags:      'café de origen, mezcla, single origin, guía',
    published: true,
  },
];

// ─── Default Pages ─────────────────────────────────────────────────────────────
const defaultPages = [
  { id: 'home', name: 'Inicio', path: '/', active: true, isCustom: false },
  { id: 'services', name: 'Menú', path: '/menu', active: true, isCustom: false },
  { id: 'products', name: 'Cafés', path: '/cafes', active: true, isCustom: false },
  { id: 'portfolio', name: 'Galería', path: '/galeria', active: true, isCustom: false },
  { id: 'blog', name: 'Noticias', path: '/noticias', active: true, isCustom: false },
];

// ─── Default Products ────────────────────────────────────────────────────────
const defaultProducts = [
  { id: 'prod-1', name: 'Espresso Doble',        description: 'Doble extracción con granulometría perfecta. Notas intensas de cacao, avellana y un final dulce.', price: '$65', image: null, active: true },
  { id: 'prod-2', name: 'Cappuccino Clásico',     description: 'Espresso con espuma de leche sedosa, balance perfecto entre café y cremosidad. Un clásico que nunca falla.', price: '$85', image: null, active: true },
  { id: 'prod-3', name: 'Pour Over Ethiopia',     description: 'Café de origen único con notas de arándano, jazmín y un final cítrico brillante. Preparado método V60.', price: '$120', image: null, active: true },
  { id: 'prod-4', name: 'Affogato Artesanal',     description: 'Espresso caliente sobre helado de vainilla hecho en casa. El postre perfecto para los amantes del café.', price: '$95', image: null, active: true },
];

// ─── Default Theme ────────────────────────────────────────────────────────────
const defaultTheme = {
  accentPrimary:   '#C8956C',  // Caramel/crema — the beautiful layer on espresso
  accentSecondary: '#A67B5B',  // Muted coffee brown
  bgPrimary:       '#1A1410',  // Deep espresso (almost black but warm)
  bgSecondary:     '#231C15',  // Dark roast
  bgTertiary:      '#2C2318',  // Medium roast
  textPrimary:     '#F5EDE4',  // Warm cream (like milk in coffee)
  textSecondary:   '#A89888',  // Dusty brown
  navbarColor:     '#1A1410',  // Deep espresso
  cardBg:          '#231C15',  // Dark roast
  textNavbarPrimary:   '#F5EDE4',
  textNavbarSecondary: '#A89888',
  textCardPrimary:     '#F5EDE4',
  textCardSecondary:   '#A89888',
  // Typography
  fontDisplay: "'Fraunces', Georgia, serif",
  fontBody: "'Outfit', system-ui, sans-serif",
  // Effects
  radiusMultiplier: 1,      // Tighter, more grounded
  glassOpacity: 0.04,       // Subtle
  glowIntensity: 0.3,       // Restrained
};

// ─── Default Images ────────────────────────────────────────────────────────────
const defaultImages = {
  logo:      null,
  heroBg:    null,
  aboutHero: null,
  portfolio: [null, null, null, null, null, null],
};

// ─── Storage Keys ──────────────────────────────────────────────────────────────
const CONTENT_KEY = 'site_content_v1';
const IMAGES_KEY  = 'site_images_v1';
const THEME_KEY   = 'site_theme_v1';
const BLOG_KEY    = 'site_blog_v1';
const PAGES_KEY   = 'site_pages_v1';
const PRODS_KEY   = 'site_products_v1';
const ANALYTICS_KEY = 'site_analytics_v1';
const AUTH_KEY    = 'site_auth_v1';
const PASS_KEY    = 'site_pass_v1';
const INBOX_KEY   = 'site_inbox_v1';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

function moveArrayItem(arr, index, direction) {
  const newArr = [...arr];
  if (direction === 'up' && index > 0) {
    [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
  } else if (direction === 'down' && index < newArr.length - 1) {
    [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
  }
  return newArr;
}

// Applies ALL theme variables to CSS custom properties — controls navbar, cards, etc.
function applyTheme(theme) {
  const root = document.documentElement;

  root.style.setProperty('--accent-primary',   theme.accentPrimary);
  root.style.setProperty('--accent-secondary',  theme.accentSecondary);
  root.style.setProperty('--accent-gradient',   `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`);
  root.style.setProperty('--accent-glow',       `${theme.accentPrimary}66`);
  root.style.setProperty('--color-accent',      theme.accentPrimary);
  root.style.setProperty('--color-accent-hover', theme.accentSecondary);
  // Button text: dark for light accents, white for dark accents
  const accentHex = theme.accentPrimary.replace('#', '');
  const ar = parseInt(accentHex.substring(0, 2), 16);
  const ag = parseInt(accentHex.substring(2, 4), 16);
  const ab = parseInt(accentHex.substring(4, 6), 16);
  const accentLuminance = (0.299 * ar + 0.587 * ag + 0.114 * ab) / 255;
  root.style.setProperty('--btn-text', accentLuminance > 0.5 ? '#09090B' : '#FAFAFA');
  root.style.setProperty('--bg-primary',        theme.bgPrimary);
  root.style.setProperty('--bg-secondary',      theme.bgSecondary);
  root.style.setProperty('--bg-tertiary',       theme.bgTertiary);
  root.style.setProperty('--text-primary',      theme.textPrimary);
  root.style.setProperty('--text-secondary',    theme.textSecondary);

  // Module-specific text colors
  root.style.setProperty('--text-navbar-primary',   theme.textNavbarPrimary || theme.textPrimary);
  root.style.setProperty('--text-navbar-secondary', theme.textNavbarSecondary || theme.textSecondary);
  root.style.setProperty('--text-card-primary',     theme.textCardPrimary || theme.textPrimary);
  root.style.setProperty('--text-card-secondary',   theme.textCardSecondary || theme.textSecondary);

  // Navbar — uses navbarColor with 90% opacity for the glassmorphism effect
  const navColor = theme.navbarColor || theme.bgSecondary;
  root.style.setProperty('--nav-bg',      navColor + 'e6');  // 90% opacity
  root.style.setProperty('--nav-menu-bg', navColor + 'fa');  // 98% opacity (mobile menu)

  // Cards / glass elements — uses cardBg directly
  const card = theme.cardBg || theme.bgSecondary;
  root.style.setProperty('--glass-bg', card);

  // Border: automatically adapts to dark/light
  const isLight = theme.bgPrimary > '#888888';
  root.style.setProperty('--glass-border',
    isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.09)');

  // ── Typography ────────────────────────────────────────────────────────────
  root.style.setProperty('--font-display', theme.fontDisplay || "'Space Grotesk', system-ui, sans-serif");
  root.style.setProperty('--font-body', theme.fontBody || "'Inter', system-ui, sans-serif");

  // ── Border radius (multiplied) ────────────────────────────────────────────
  const rm = theme.radiusMultiplier || 1;
  root.style.setProperty('--radius-sm', `${4 * rm}px`);
  root.style.setProperty('--radius-md', `${6 * rm}px`);
  root.style.setProperty('--radius-lg', `${8 * rm}px`);
  root.style.setProperty('--radius-xl', `${12 * rm}px`);

  // ── Glass opacity ─────────────────────────────────────────────────────────
  const go = theme.glassOpacity ?? 0.06;
  root.style.setProperty('--glass-bg', theme.cardBg || theme.bgSecondary);
  root.style.setProperty('--glass-border',
    isLight ? `rgba(0,0,0,${0.08 + go})` : `rgba(255,255,255,${0.05 + go})`);

  // ── Legacy color-* variables (used by index.css and admin.css) ──────────
  root.style.setProperty('--color-base',            theme.bgPrimary);
  root.style.setProperty('--color-surface',         theme.bgSecondary);
  root.style.setProperty('--color-elevated',        theme.bgTertiary);
  root.style.setProperty('--color-overlay',         theme.bgTertiary);
  root.style.setProperty('--color-text',            theme.textPrimary);
  root.style.setProperty('--color-text-secondary',  theme.textSecondary);
  root.style.setProperty('--color-text-muted',      isLight ? '#64748b' : '#71717A');
  root.style.setProperty('--color-accent-subtle',   `${theme.accentPrimary}14`);
  root.style.setProperty('--color-accent-border',   `${theme.accentPrimary}33`);
  root.style.setProperty('--color-border',
    isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)');
  root.style.setProperty('--color-border-hover',
    isLight ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.14)');
  root.style.setProperty('--hero-overlay',
    isLight
      ? 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.7) 100%)'
      : 'linear-gradient(180deg, rgba(9,9,11,0.5) 0%, rgba(9,9,11,0.85) 100%)');

  // ── Glow intensity ────────────────────────────────────────────────────────
  const gi = theme.glowIntensity ?? 1;
  const glowAlpha = Math.round(gi * 0.15 * 255).toString(16).padStart(2, '0');
  root.style.setProperty('--shadow-glow', `0 0 ${20 * gi}px ${theme.accentPrimary}${glowAlpha}`);
}

// ─── Context ──────────────────────────────────────────────────────────────────
const SiteContext = createContext(null);

export const SiteProvider = ({ children }) => {
  const [content, setContent] = useState(() => {
    try {
      const saved = localStorage.getItem(CONTENT_KEY);
      if (saved) return deepMerge(defaultContent, JSON.parse(saved));
    } catch { /* ignore */ }
    return defaultContent;
  });

  const [images, setImages] = useState(() => {
    try {
      const saved = localStorage.getItem(IMAGES_KEY);
      if (saved) return { ...defaultImages, ...JSON.parse(saved) };
    } catch { /* ignore */ }
    return defaultImages;
  });

  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) return { ...defaultTheme, ...JSON.parse(saved) };
    } catch { /* ignore */ }
    return defaultTheme;
  });

  const [blogPosts, setBlogPosts] = useState(() => {
    try {
      const saved = localStorage.getItem(BLOG_KEY);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return defaultBlogPosts;
  });

  const [pages, setPages] = useState(() => {
    try {
      const saved = localStorage.getItem(PAGES_KEY);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return defaultPages;
  });

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(PRODS_KEY);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return defaultProducts;
  });

  const [analytics, setAnalytics] = useState(() => {
    try {
      const saved = localStorage.getItem(ANALYTICS_KEY);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return {
      whatsapp_clicks: 0,
      visits_simulated: [120, 150, 200, 180, 250, 310, 290] // Simulamos 7 días
    };
  });

  const [inbox, setInbox] = useState(() => {
    try {
      const saved = localStorage.getItem(INBOX_KEY);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return [];
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [loadingDb, setLoadingDb] = useState(true);

  // Check localStorage for existing session on mount
  useEffect(() => {
    const session = localStorage.getItem('site_session_v1');
    if (session) setIsAuthenticated(true);
  }, []);

  // Load data from localStorage on mount
  useEffect(() => {
    setLoadingDb(false);
  }, []);

  // Apply every theme change live (real-time preview)
  useEffect(() => { applyTheme(theme); }, [theme]);

  // ── Content helpers ───────────────────────────────────────────────────────
  const updateContent = (path, value) => {
    setContent(prev => {
      const next = deepMerge({}, prev);
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const updateServiceCard = (index, field, value) => {
    setContent(prev => {
      const next = deepMerge({}, prev);
      next.services.cards[index][field] = value;
      return next;
    });
  };

  const moveServiceCard = (index, direction) => {
    setContent(prev => {
      const next = deepMerge({}, prev);
      next.services.cards = moveArrayItem(next.services.cards, index, direction);
      return next;
    });
  };

  // ── Home helpers ──────────────────────────────────────────────────────────
  const updateHomeStat = (index, field, value) => {
    setContent(prev => {
      const next = deepMerge({}, prev);
      next.home.stats[index][field] = value;
      return next;
    });
  };

  const updateHomeStep = (index, field, value) => {
    setContent(prev => {
      const next = deepMerge({}, prev);
      next.home.steps[index][field] = value;
      return next;
    });
  };

  const updateHomeTestimonial = (index, field, value) => {
    setContent(prev => {
      const next = deepMerge({}, prev);
      next.home.testimonials[index][field] = value;
      return next;
    });
  };

  // ── Blog helpers ──────────────────────────────────────────────────────────
  const createBlogPost = () => {
    const newPost = {
      id:        `post-${Date.now()}`,
      title:     'Nuevo Artículo',
      excerpt:   'Escribe aquí un resumen del artículo...',
      content:   'Escribe el contenido completo del artículo aquí...',
      author:    'Admin',
      date:      new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' }),
      image:     null,
      tags:      '',
      published: false,
    };
    setBlogPosts(prev => [newPost, ...prev]);
    return newPost.id;
  };

  const updateBlogPost = (id, field, value) => {
    setBlogPosts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const deleteBlogPost = (id) => {
    setBlogPosts(prev => prev.filter(p => p.id !== id));
  };

  const duplicateBlogPost = (id) => {
    setBlogPosts(prev => {
      const original = prev.find(p => p.id === id);
      if (!original) return prev;
      const copy = { ...original, id: `post-${Date.now()}`, title: `${original.title} (copia)`, published: false };
      return [copy, ...prev];
    });
  };

  // ── Pages helpers ─────────────────────────────────────────────────────────
  const createPage = () => {
    const newPage = {
      id:          `page-${Date.now()}`,
      name:        'Nueva Página',
      path:        `/nueva-pagina-${Date.now().toString().slice(-4)}`,
      active:      false,
      isCustom:    true,
      pageTitle:   'Título de tu nueva página',
      pageSubtitle:'Describe brevemente de qué trata esta página.',
      pageText:    'Escribe aquí todo lo que quieras contar. Puedes presionar "Enter" para crear nuevos párrafos.',
      pageImage:   null
    };
    setPages(prev => [...prev, newPage]);
    return newPage.id;
  };

  const updatePage = (id, field, value) => {
    setPages(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const deletePage = (id) => {
    setPages(prev => prev.filter(p => p.id !== id));
  };

  const movePage = (index, direction) => {
    setPages(prev => moveArrayItem(prev, index, direction));
  };

  // ── Products helpers ──────────────────────────────────────────────────────
  const createProduct = () => {
    const newProduct = {
      id:          `prod-${Date.now()}`,
      name:        'Nuevo Producto',
      description: 'Descripción breve del producto.',
      price:       '$0.00',
      image:       null,
      active:      true
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct.id;
  };

  const updateProduct = (id, field, value) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const moveProduct = (index, direction) => {
    setProducts(prev => moveArrayItem(prev, index, direction));
  };

  // ── Analytics helpers ───────────────────────────────────────────────────
  const trackAnalytics = (event) => {
    setAnalytics(prev => {
      const next = { ...prev };
      if (event === 'whatsapp') next.whatsapp_clicks = (next.whatsapp_clicks || 0) + 1;
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(next));
      return next;
    });
  };

  // ── Auth helpers (localStorage-based) ──────────────────────────────────
  const ADMIN_KEY = 'site_admin_v1';

  const getAdminUser = () => {
    try {
      const stored = localStorage.getItem(ADMIN_KEY);
      if (stored) return JSON.parse(stored);
      // Default admin user on first run
      const defaultUser = { email: 'admin@admin.com', password: 'admin123' };
      localStorage.setItem(ADMIN_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    } catch {
      return { email: 'admin@admin.com', password: 'admin123' };
    }
  };

  const login = async (email, pass) => {
    const admin = getAdminUser();
    if (email === admin.email && pass === admin.password) {
      localStorage.setItem('site_session_v1', 'active');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = async () => {
    localStorage.removeItem('site_session_v1');
    setIsAuthenticated(false);
  };

  const changePassword = async (oldPass, newPass) => {
    const admin = getAdminUser();
    if (oldPass === admin.password) {
      const updated = { ...admin, password: newPass };
      localStorage.setItem(ADMIN_KEY, JSON.stringify(updated));
      return true;
    }
    return false;
  };

  // ── Inbox helpers ───────────────────────────────────────────────────────
  const addMessage = (msg) => {
    const newMsg = { ...msg, id: Date.now(), date: new Date().toISOString(), read: false };
    setInbox(prev => {
      const updated = [newMsg, ...prev];
      localStorage.setItem(INBOX_KEY, JSON.stringify(updated));
      return updated;
    });
  };
  const markMessageRead = (id) => {
    setInbox(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, read: true } : m);
      localStorage.setItem(INBOX_KEY, JSON.stringify(updated));
      return updated;
    });
  };
  const deleteMessage = (id) => {
    setInbox(prev => {
      const updated = prev.filter(m => m.id !== id);
      localStorage.setItem(INBOX_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // ── Theme helpers ─────────────────────────────────────────────────────────
  const updateTheme = (key, value) => setTheme(prev => ({ ...prev, [key]: value }));
  const resetTheme  = () => setTheme(defaultTheme);

  // ── Image helpers ─────────────────────────────────────────────────────────
  const updateImage = (key, base64, index = null) => {
    setImages(prev => {
      if (index !== null) {
        const arr = [...(prev[key] || [])];
        arr[index] = base64;
        return { ...prev, [key]: arr };
      }
      return { ...prev, [key]: base64 };
    });
  };
  const removeImage = (key, index = null) => updateImage(key, null, index);

  // ── Persist (localStorage only) ───────────────────────────────────────
  const saveContent = async () => {
    try {
      setSaveStatus('saving');
      
      localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
      localStorage.setItem(IMAGES_KEY,  JSON.stringify(images));
      localStorage.setItem(THEME_KEY,   JSON.stringify(theme));
      localStorage.setItem(BLOG_KEY,    JSON.stringify(blogPosts));
      localStorage.setItem(PAGES_KEY,   JSON.stringify(pages));
      localStorage.setItem(PRODS_KEY,   JSON.stringify(products));
      localStorage.setItem(ANALYTICS_KEY,JSON.stringify(analytics));
      localStorage.setItem(INBOX_KEY,   JSON.stringify(inbox));

      setSaveStatus('saved');
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      setSaveStatus('error');
    } finally {
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const resetContent = () => {
    [CONTENT_KEY, IMAGES_KEY, THEME_KEY, BLOG_KEY, PAGES_KEY, PRODS_KEY, ANALYTICS_KEY].forEach(k => localStorage.removeItem(k));
    setContent(defaultContent);
    setImages(defaultImages);
    setTheme(defaultTheme);
    setBlogPosts(defaultBlogPosts);
    setPages(defaultPages);
    setProducts(defaultProducts);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <SiteContext.Provider value={{
      content, updateContent, updateServiceCard, moveServiceCard,
      updateHomeStat, updateHomeStep, updateHomeTestimonial,
      images,  updateImage, removeImage,
      theme,   updateTheme, resetTheme,
      blogPosts, createBlogPost, updateBlogPost, deleteBlogPost, duplicateBlogPost,
      pages, createPage, updatePage, deletePage, movePage,
      products, createProduct, updateProduct, deleteProduct, moveProduct,
      analytics, trackAnalytics,
      inbox, addMessage, markMessageRead, deleteMessage,
      isAuthenticated, login, logout, changePassword,
      saveContent, resetContent, saveStatus, loadingDb,
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used inside SiteProvider');
  return ctx;
};

export { defaultContent, defaultTheme };
