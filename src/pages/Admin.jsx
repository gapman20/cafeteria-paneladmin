import React, { useState, useEffect, useRef, memo } from 'react';
import {
  useContent, useImages, useTheme,
  usePages, useInbox, useAuth, useAnalytics, useMenu,
} from '../hooks';
import { SECTION_ICON_MAP, SECTION_ICON_OPTIONS } from '../context/SiteContext';
import ImageUploader from '../components/ImageUploader';
import '../styles/admin.css';
import {
  LayoutDashboard, FileText, Settings, Mail, Info,
  Save, RotateCcw, CheckCircle, AlertCircle, Eye,
  Image as ImageIcon, Palette, BarChart2, Globe,
  MessageSquare, Zap, Users, TrendingUp, Monitor,
  ToggleLeft, ToggleRight, RefreshCw, Plus, Trash2, Package,
  Columns, ArrowUp, ArrowDown, Bold, List, BarChart, Lock, Search,
  Download, Upload, Copy, Utensils, Coffee,
  Folder, Calendar, LayoutGrid, Edit3, MousePointer, Clock,
  Link, ImagePlus, MapPin, Phone, AtSign, Building2
} from 'lucide-react';



// ─── Shared input style ───────────────────────────────────────────────────────
const inputSt = {
  width: '100%', padding: '11px 14px',
  background: 'var(--color-elevated)',
  border: '1px solid var(--color-border)',
  borderRadius: '8px', color: 'var(--color-text)',
  fontFamily: 'var(--font-body)', fontSize: '0.95rem',
  outline: 'none', resize: 'vertical',
  transition: 'border-color 0.2s',
};

const labelSt = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: '700',
  color: 'var(--color-text-secondary)',
  textTransform: 'uppercase',
  marginBottom: '0.3rem',
};

const sectionTitle = {
  fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '800',
  marginBottom: '2rem', paddingBottom: '1rem',
  borderBottom: '1px solid var(--color-border)', color: 'var(--color-text)',
  display: 'flex', alignItems: 'center', gap: '10px',
};

// ─── Reusable components ──────────────────────────────────────────────────────
const Field = ({ label, path, value, type = 'text', onChange, hint }) => (
  <div style={{ marginBottom: '1.2rem' }}>
    <label className="admin-label">{label}</label>
    {hint && <p className="admin-hint">{hint}</p>}
    {type === 'textarea'
      ? <textarea className="admin-input" value={value} rows={3} onChange={e => onChange(path, e.target.value)} />
      : <input className="admin-input" type={type} value={value} onChange={e => onChange(path, e.target.value)} />
    }
  </div>
);

// StatCard for Dashboard
const StatCard = ({ label, val, sub, color, Icon }) => (
  <div className="admin-stat-card" style={{ '--stat-color': color }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: color, borderRadius: 'var(--admin-radius) var(--admin-radius) 0 0' }} />
    <div style={{ position: 'absolute', top: 0, right: 0, opacity: 0.04, transform: 'translate(15%, -15%)' }}>
      <Icon size={100} />
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', position: 'relative', zIndex: 1 }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)', fontWeight: '500' }}>{label}</p>
      <div style={{ width: '36px', height: '36px', background: `${color}12`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={18} color={color} />
      </div>
    </div>
    <h3 style={{ fontFamily: 'var(--admin-font-display)', fontSize: '1.75rem', fontWeight: '700', color: 'var(--admin-text)', marginBottom: '0.25rem', position: 'relative', zIndex: 1 }}>{val}</h3>
    <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
      {typeof sub === 'string' && sub.includes('+') && <TrendingUp size={12} color="var(--admin-success)" />}
      {sub}
    </p>
  </div>
);

// CSS Bar Chart Component
const SimpleBarChart = ({ data }) => {
  const max = Math.max(...data, 1);
  const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  
  return (
    <div className="admin-card" style={{ marginTop: '1.5rem', marginBottom: '2.5rem', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.2rem', fontWeight: '700' }}>Visitas del Sitio</h4>
          <p style={{ color: 'var(--admin-text-secondary)', fontSize: '0.85rem' }}>Últimos 7 días (Datos Simulados)</p>
        </div>
        <div style={{ background: 'var(--admin-accent-subtle)', color: 'var(--admin-accent)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <TrendingUp size={14} /> +12% esta semana
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '180px', paddingTop: '20px' }}>
        {data.map((val, i) => {
          const heightPct = Math.max((val / max) * 100, 2);
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'var(--admin-surface-hover)', borderRadius: '6px 6px 0 0' }}>
                <div 
                  className="chart-bar"
                  title={`${val} visitas`}
                  style={{ 
                    width: '80%', height: `${heightPct}%`, 
                    background: i === data.length - 1 ? 'linear-gradient(135deg, #8D5524, #7A4820)' : 'var(--admin-accent)',
                    opacity: i === data.length - 1 ? 1 : 0.6,
                    borderRadius: '4px 4px 0 0',
                    transition: 'all 0.5s ease-out',
                    animation: `growUp 1s ease-out forwards ${i * 0.1}s`
                  }} 
                />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>{labels[i]}</span>
            </div>
          );
        })}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes growUp { from { transform: scaleY(0); transform-origin: bottom; } to { transform: scaleY(1); transform-origin: bottom; } }
        .chart-bar:hover { opacity: 1 !important; filter: brightness(1.2); cursor: pointer; }
      `}} />
    </div>
  );
};

// MD Toolbar
const Toolbar = ({ onFormat }) => (
  <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
    <button onClick={() => onFormat('bold')} title="Negrita" style={{ padding: '4px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '4px', cursor: 'pointer', color: 'var(--color-text-secondary)' }}><Bold size={14} /></button>
    <button onClick={() => onFormat('list')} title="Lista" style={{ padding: '4px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '4px', cursor: 'pointer', color: 'var(--color-text-secondary)' }}><List size={14} /></button>
  </div>
);

// Format helper
const insertFormat = (path, value, formatType, onChange) => {
  const formats = { 'bold': '**Texto Destacado**', 'list': '\\n- Punto de lista' };
  const strVal = value || '';
  onChange(path, strVal + (strVal && strVal !== '' ? ' ' : '') + formats[formatType]);
};

// ─── Sidebar Sections (Categorized) ──────────────────────────────────────────
const sidebarTopItem = { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={17} /> };

const sidebarCategories = [
  {
    label: 'CONTENIDO',
    items: [
      { id: 'pages', label: 'Páginas', icon: <FileText size={17} /> },
      { id: 'images', label: 'Imágenes & Galería', icon: <ImageIcon size={17} /> },
      { id: 'home', label: 'Inicio', icon: <Monitor size={17} /> },
      { id: 'menu', label: 'Menú', icon: <Utensils size={17} /> },
      { id: 'contact', label: 'Contacto', icon: <Mail size={17} /> },
      { id: 'footer', label: 'Footer', icon: <FileText size={17} /> },
    ],
  },
  {
    label: 'MARKETING',
    items: [
      { id: 'inbox', label: 'Bandeja de Entrada', icon: <Mail size={17} /> },
      { id: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare size={17} /> },
      { id: 'social', label: 'Redes Sociales', icon: <Globe size={17} /> },
    ],
  },
  {
    label: 'CONFIGURACIÓN',
    items: [
      { id: 'theme', label: 'Colores & Tema', icon: <Palette size={17} /> },
      { id: 'seo', label: 'SEO', icon: <Globe size={17} /> },
      { id: 'general', label: 'General', icon: <Settings size={17} /> },
    ],
  },
];

// ─── Default Data Arrays for Home Editor ──────────────────────────────────────
const defaultFeatures = [
  { title: 'Café de Especialidad', desc: 'Solo los mejores granos de origen único, seleccionados directamente en fincas de Colombia, Etiopía y Guatemala.' },
  { title: 'Tueste Artesanal', desc: 'Tostamos en pequeños lotes cada semana para garantizar frescura y resaltar las notas únicas de cada origen.' },
  { title: 'Baristas Certificados', desc: 'Nuestro equipo domina cada método de preparación: espresso, pour over, cold brew, Aeropress y más.' },
];

const defaultShopProducts = [
  { name: 'Café de Origen Premium', price: '285', tag: 'Edición Limitada', image: '' },
  { name: 'Prensa Francesa', price: '450', tag: 'Más Vendido', image: '' },
  { name: 'Granos Artesanales Tostados', price: '195', tag: '', image: '' },
  { name: 'Molino de Precisión', price: '680', tag: 'Nuevo', image: '' },
];

const defaultServices = [
  { icon: '☕', title: 'Cata de Origen', desc: 'Degusta cafés de diferentes regiones y descubre perfiles de sabor únicos en sesiones guiadas por expertos.' },
  { icon: '🎓', title: 'Taller de Barismo', desc: 'Aprende técnicas profesionales de preparación: latte art, pour over, espresso y más.' },
  { icon: '📦', title: 'Suscripción Mensual', desc: 'Recibe café fresco tostado cada mes directamente en tu puerta con selecciones curadas.' },
];

const defaultTestimonials = [
  { name: 'María García', role: 'Chef Pastelera', text: 'El mejor café que he probado en la ciudad. Cada visita es una experiencia única que conecta todos los sentidos.' },
  { name: 'Carlos Mendoza', role: 'Diseñador Gráfico', text: 'La suscripción Premium cambió mi rutina matutina. Recibir café fresco cada mes es un regalo que no me cambio por nada.' },
  { name: 'Ana Rodríguez', role: 'Barista Profesional', text: 'Los talleres de barismo son transformadores. Aprender a preparar mi propio café en casa me dio una nueva perspectiva.' },
];

const defaultFaqs = [
  { q: '¿Cuál es el tiempo de entrega?', a: 'Realizamos entregas de lunes a sábado en la CDMX y área metropolitana. Los pedidos realizados antes de las 2:00 PM se entregan al día siguiente.' },
  { q: '¿Cómo puedo reservar una mesa?', a: 'Puedes reservar directamente por WhatsApp o a través de nuestra página de contacto. Aceptamos reservaciones para grupos de hasta 12 personas.' },
  { q: '¿De dónde viene su café?', a: 'Trabajamos directamente con fincas en Colombia, Etiopía, Guatemala y México. Cada origen se selecciona por su perfil de sabor único.' },
  { q: '¿Qué incluye la Suscripción Premium?', a: 'La suscripción incluye mensualmente una bolsa de café de origen rotatorio, acceso a catas exclusivas, preventas de ediciones limitadas, envío gratuito y puntos de fidelidad.' },
  { q: '¿Puedo cancelar o pausar mi suscripción?', a: 'Sí, puedes pausar o cancelar en cualquier momento desde tu cuenta o contactándonos por WhatsApp. No hay penalizaciones.' },
  { q: '¿Ofrecen capacitación para baristas?', a: 'Sí, organizamos talleres mensuales de preparación de café: latte art, pour over, cold brew y más. También ofrecemos certificaciones.' },
];

const defaultSubBenefits = [
  { icon: '☕', title: 'Catas Mensuales', desc: 'Degusta orígenes exclusivos antes que nadie en sesiones privadas con nuestro master roaster.' },
  { icon: '🎁', title: 'Preventas VIP', desc: 'Acceso anticipado a ediciones limitadas y lotes especiales con precio preferente.' },
  { icon: '🚀', title: 'Envío Gratuito', desc: 'Recibe tu café en la puerta de tu casa sin costo en todos los pedidos mensuales.' },
  { icon: '⭐', title: 'Puntos de Fidelidad', desc: 'Acumula puntos canjeables por productos, experiencias y eventos exclusivos.' },
];

// ─── Image compression utility ────────────────────────────────────────────────
function compressImage(file, maxDimension = 400, quality = 0.7) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;
        if (w > maxDimension || h > maxDimension) {
          if (w > h) { h = Math.round((h / w) * maxDimension); w = maxDimension; }
          else { w = Math.round((w / h) * maxDimension); h = maxDimension; }
        }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ─── Main Admin Component ─────────────────────────────────────────────────────
const Admin = memo(() => {
  const { content, updateContent, updateServiceCard, moveServiceCard, saveContent, resetContent, saveStatus, updateHomeStat, updateHomeStep, updateHomeTestimonial } = useContent();
  const { images, updateImage } = useImages();
  const { theme, updateTheme, resetTheme } = useTheme();
  const { pages, createPage, updatePage, deletePage, movePage } = usePages();
  const { inbox, markMessageRead, deleteMessage } = useInbox();
  const { logout } = useAuth();
  const { analytics } = useAnalytics();
  const { menuSections, updateMenuSection, updateMenuItem, addMenuItem, removeMenuItem, addMenuSection, removeMenuSection, moveMenuSection, moveMenuItem } = useMenu();

  const [active, setActive] = useState('dashboard');
  const [splitView, setSplitView] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [inboxSearch, setInboxSearch] = useState('');
  const [inboxFilter, setInboxFilter] = useState('all');
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [galleryView, setGalleryView] = useState('grid');
  const [gallerySearch, setGallerySearch] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [waEnabled, setWaEnabled] = useState(true);
  const [hours, setHours] = useState({
    lunes: { open: true, start: '08:00', end: '20:00' },
    martes: { open: true, start: '08:00', end: '20:00' },
    miercoles: { open: true, start: '08:00', end: '20:00' },
    jueves: { open: true, start: '08:00', end: '20:00' },
    viernes: { open: true, start: '08:00', end: '21:00' },
    sabado: { open: true, start: '09:00', end: '21:00' },
    domingo: { open: false, start: '10:00', end: '16:00' },
  });
  const [seoIndex, setSeoIndex] = useState(true);
  const [seoFollow, setSeoFollow] = useState(true);
  const [ogImage, setOgImage] = useState(null);

  const onChange = (path, val) => updateContent(path, val);

  const showToast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };

  useEffect(() => {
    if (saveStatus === 'saved') {
      showToast('¡Cambios Guardados Exitosamente!', 'success');
    } else if (saveStatus === 'error') {
      showToast('Error al guardar', 'error');
    }
  }, [saveStatus]);

  const renderSection = () => {
    switch (active) {

      // ── Dashboard ─────────────────────────────────────────────────────────
      case 'dashboard':
        const activePages = pages.filter(p => p.active).length;
        const totalImages = [images.logo, images.heroBg, images.aboutHero, ...(images.portfolio || [])].filter(Boolean).length;
        const totalMenuItems = menuSections.reduce((acc, s) => acc + s.items.length, 0);
        const unreadMsgs = inbox.filter(m => !m.read).length;
        
        return (
          <div>
            <h3 className="admin-section-title"><LayoutDashboard size={20} color="var(--admin-accent)" /> Resumen de Rendimiento</h3>
            
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <StatCard label="Clics WhatsApp" val={analytics.whatsapp_clicks || 0} sub="+3% vs sem. ant." color="#25d366" Icon={MessageSquare} />
              <StatCard label="Páginas Activas" val={activePages} sub={`de ${pages.length} totales`} color="var(--admin-accent)" Icon={FileText} />
              <StatCard label="Imágenes Subidas" val={`${totalImages}/9`} sub="Formatos óptimos" color="#10b981" Icon={ImageIcon} />
            </div>

            {/* Smooth Area Line Chart */}
            <div className="admin-card" style={{ padding: '1.5rem 2rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ fontFamily: 'var(--admin-font-display)', fontSize: '1.125rem', fontWeight: '700', color: 'var(--admin-text)' }}>Visitas del Sitio</h4>
                  <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.8125rem' }}>Últimos 7 días (Datos Simulados)</p>
                </div>
                <div style={{ background: 'var(--admin-accent-subtle)', color: 'var(--admin-accent)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TrendingUp size={14} /> +12% esta semana
                </div>
              </div>
              {(() => {
                const data = analytics.visits_simulated || [0,0,0,0,0,0,0];
                const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
                const max = Math.max(...data, 1);
                const w = 600, h = 180, pad = 20;
                const points = data.map((v, i) => {
                  const x = pad + (i / (data.length - 1)) * (w - pad * 2);
                  const y = h - pad - (v / max) * (h - pad * 2);
                  return { x, y, v, label: labels[i] };
                });
                const lineD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
                const areaD = `${lineD} L${points[points.length - 1].x},${h - pad} L${points[0].x},${h - pad} Z`;
                return (
                  <div className="admin-line-chart">
                    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8D5524" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#8D5524" stopOpacity="0.02" />
                        </linearGradient>
                      </defs>
                      {/* Grid lines */}
                      {[0, 0.25, 0.5, 0.75, 1].map(pct => {
                        const y = h - pad - pct * (h - pad * 2);
                        return <line key={pct} x1={pad} y1={y} x2={w - pad} y2={y} stroke="var(--admin-border)" strokeWidth="1" strokeDasharray="4,4" />;
                      })}
                      {/* Area fill */}
                      <path d={areaD} fill="url(#areaGrad)" />
                      {/* Line */}
                      <path d={lineD} fill="none" stroke="#8D5524" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      {/* Dots */}
                      {points.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r="4" fill="white" stroke="#8D5524" strokeWidth="2" />
                      ))}
                      {/* X labels */}
                      {points.map((p, i) => (
                        <text key={i} x={p.x} y={h - 4} textAnchor="middle" fill="var(--admin-text-muted)" fontSize="11" fontFamily="var(--admin-font-body)">{p.label}</text>
                      ))}
                      {/* Y labels */}
                      {[0, 0.5, 1].map(pct => {
                        const y = h - pad - pct * (h - pad * 2);
                        const val = Math.round(pct * max);
                        return <text key={pct} x={pad - 4} y={y + 4} textAnchor="end" fill="var(--admin-text-muted)" fontSize="10" fontFamily="var(--admin-font-body)">{val}</text>;
                      })}
                    </svg>
                  </div>
                );
              })()}
            </div>

            {/* Quick Links + System Status */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {/* Quick Links */}
              <div className="admin-card" style={{ padding: '1.5rem' }}>
                <h4 style={{ fontFamily: 'var(--admin-font-display)', fontWeight: '700', marginBottom: '1rem', fontSize: '1rem', color: 'var(--admin-text)' }}>Accesos Rápidos</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { label: 'Menú & Páginas', section: 'pages', icon: <FileText size={15} /> },
                    { label: 'Cambiar Colores', section: 'theme', icon: <Palette size={15} /> },
                    { label: 'Editar Inicio', section: 'home', icon: <Monitor size={15} /> },
                    { label: 'Configurar WhatsApp', section: 'whatsapp', icon: <MessageSquare size={15} /> },
                    { label: 'Subir Imágenes', section: 'images', icon: <ImageIcon size={15} /> },
                    { label: 'Redes Sociales', section: 'social', icon: <Globe size={15} /> },
                  ].map(q => (
                    <button key={q.section} className="admin-quick-link" onClick={() => setActive(q.section)}>
                      {q.icon} {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* System Status */}
              <div className="admin-card" style={{ padding: '1.5rem' }}>
                <h4 style={{ fontFamily: 'var(--admin-font-display)', fontWeight: '700', marginBottom: '1rem', fontSize: '1rem', color: 'var(--admin-text)' }}>Estado del Sistema</h4>
                <div className="admin-status-grid">
                  <div className="admin-status-item">
                    <div className="admin-status-dot admin-status-dot--ok"></div>
                    <div>
                      <div className="admin-status-label">Menú</div>
                      <div className="admin-status-value">{totalMenuItems} ítems</div>
                    </div>
                  </div>
                  <div className="admin-status-item">
                    <div className="admin-status-dot admin-status-dot--ok"></div>
                    <div>
                      <div className="admin-status-label">Imágenes</div>
                      <div className="admin-status-value">{totalImages}/9 slots</div>
                    </div>
                  </div>
                  <div className="admin-status-item">
                    <div className={`admin-status-dot ${unreadMsgs > 0 ? 'admin-status-dot--warn' : 'admin-status-dot--ok'}`}></div>
                    <div>
                      <div className="admin-status-label">Mensajes</div>
                      <div className="admin-status-value">{unreadMsgs} sin leer</div>
                    </div>
                  </div>
                  <div className="admin-status-item">
                    <div className="admin-status-dot admin-status-dot--ok"></div>
                    <div>
                      <div className="admin-status-label">Tema</div>
                      <div className="admin-status-value">Activo</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Site Info */}
            <div className="admin-card" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontFamily: 'var(--admin-font-display)', fontWeight: '700', marginBottom: '1rem', fontSize: '1rem', color: 'var(--admin-text)' }}>Información del Sitio</h4>
              {[
                { label: 'Nombre', val: content.siteName },
                { label: 'Tagline', val: content.tagline },
                { label: 'Email', val: content.contact.email },
                { label: 'WhatsApp', val: content.contact.whatsapp },
                { label: 'Instagram', val: content.social?.instagram || '—' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: i < 4 ? '1px solid var(--admin-border)' : 'none' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--admin-text-secondary)', fontFamily: 'var(--admin-font-body)' }}>{row.label}</span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--admin-text)', fontFamily: 'var(--admin-font-body)', maxWidth: '200px', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.val}</span>
                </div>
              ))}
            </div>
          </div>
        );

      // ── Pages / Menu ──────────────────────────────────────────────────────
      case 'pages': {
        const activePages = pages.filter(p => p.active).length;
        const customPages = pages.filter(p => p.isCustom).length;

        return (
          <div>
            <h3 className="admin-section-title"><FileText size={20} color="var(--admin-accent)" /> Gestión de Páginas</h3>
            
            <div className="admin-pages-layout">
              {/* Table */}
              <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}></th>
                      <th>Nombre de la Página</th>
                      <th>URL Slug</th>
                      <th>Última Edición</th>
                      <th>Estado</th>
                      <th style={{ width: '100px' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.map((page, i) => {
                      const pageIcons = { home: <Monitor size={16} />, about: <Info size={16} />, menu: <Utensils size={16} />, contact: <Mail size={16} />, images: <ImageIcon size={16} /> };
                      const IconComp = pageIcons[page.id] || <FileText size={16} />;
                      const isPublished = page.active && !page.isCustom;
                      const isDraft = !page.active || page.isCustom;

                      return (
                        <tr key={page.id}>
                          <td style={{ color: 'var(--admin-text-muted)' }}>{IconComp}</td>
                          <td style={{ fontWeight: 600 }}>{page.name}</td>
                          <td>
                            <code style={{ fontSize: '0.78rem', color: 'var(--admin-accent)', background: 'var(--admin-accent-subtle)', padding: '2px 8px', borderRadius: '4px' }}>
                              {page.path}
                            </code>
                          </td>
                          <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.8125rem' }}>
                            {page.lastEdited || 'Hoy'}
                          </td>
                          <td>
                            <span className="admin-badge" style={isPublished 
                              ? { background: 'var(--admin-success-subtle)', color: 'var(--admin-success)', border: '1px solid rgba(45,106,79,0.15)' }
                              : { background: 'rgba(245,158,11,0.08)', color: '#D97706', border: '1px solid rgba(245,158,11,0.15)' }
                            }>
                              {isPublished ? 'Publicado' : 'Borrador'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                              <button onClick={() => movePage(i, 'up')} className="admin-move-btn" title="Arriba"><ArrowUp size={13} /></button>
                              <button onClick={() => movePage(i, 'down')} className="admin-move-btn" title="Abajo"><ArrowDown size={13} /></button>
                              <label className="admin-toggle" title="Visibilidad">
                                <input type="checkbox" checked={page.active} onChange={e => updatePage(page.id, 'active', e.target.checked)} />
                              </label>
                              {page.isCustom && (
                                <button onClick={() => { if (confirm(`¿Eliminar "${page.name}"?`)) deletePage(page.id); }} className="admin-btn-danger" style={{ padding: '3px 6px', fontSize: '0.7rem' }}>
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Quick Action Card */}
              <div className="admin-quick-action">
                <div className="admin-quick-action-title">Acción Rápida</div>
                <button className="admin-btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '1.25rem' }} onClick={() => createPage()}>
                  <Plus size={16} /> Añadir Nueva Página
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  <div className="admin-quick-stat">
                    <span className="admin-quick-stat-label">Total Páginas</span>
                    <span className="admin-quick-stat-value">{pages.length}</span>
                  </div>
                  <div className="admin-quick-stat">
                    <span className="admin-quick-stat-label">Publicadas</span>
                    <span className="admin-quick-stat-value" style={{ color: 'var(--admin-success)' }}>{activePages}</span>
                  </div>
                  <div className="admin-quick-stat">
                    <span className="admin-quick-stat-label">Personalizadas</span>
                    <span className="admin-quick-stat-value" style={{ color: 'var(--admin-accent)' }}>{customPages}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // ── Menu / Carta ────────────────────────────────────────────────────────
      case 'menu': {
        return (
          <div>
            <h3 className="admin-section-title"><Utensils size={20} color="var(--admin-accent)" /> Gestión de la Carta</h3>
            
            <div className="admin-menu-columns">
              {menuSections.map((section, sIdx) => {
                const IconComp = SECTION_ICON_MAP[section.icon] || SECTION_ICON_MAP.coffee;
                return (
                  <div key={section.id} className="admin-menu-column">
                    {/* Column Header */}
                    <div className="admin-menu-column-header">
                      <span style={{ color: section.color, display: 'flex' }}><IconComp size={18} /></span>
                      <span className="admin-menu-column-title">{section.title}</span>
                      <span className="admin-menu-column-count">{section.items.length}</span>
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: '2px' }}>
                        <button onClick={() => moveMenuSection(sIdx, 'up')} className="admin-move-btn" style={{ width: '22px', height: '22px' }}><ArrowUp size={11} /></button>
                        <button onClick={() => moveMenuSection(sIdx, 'down')} className="admin-move-btn" style={{ width: '22px', height: '22px' }}><ArrowDown size={11} /></button>
                        <button onClick={() => { if (confirm(`¿Eliminar sección "${section.title}"?`)) removeMenuSection(section.id); }} style={{ background: 'transparent', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer', padding: '2px' }}><Trash2 size={12} /></button>
                      </div>
                    </div>

                    {/* Section Config (compact) */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <input value={section.title} onChange={e => updateMenuSection(section.id, 'title', e.target.value)} className="admin-input" style={{ flex: 1, padding: '6px 8px', fontSize: '0.8125rem' }} placeholder="Título" />
                      <input type="color" value={section.color} onChange={e => updateMenuSection(section.id, 'color', e.target.value)} style={{ width: '32px', height: '32px', border: '1px solid var(--admin-border)', borderRadius: '6px', cursor: 'pointer', padding: '2px' }} />
                      <select value={section.icon} onChange={e => updateMenuSection(section.id, 'icon', e.target.value)} className="admin-input" style={{ width: '80px', padding: '4px 6px', fontSize: '0.75rem' }}>
                        {SECTION_ICON_OPTIONS.map(opt => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
                      </select>
                    </div>

                    {/* Product Cards */}
                    {section.items.map((item, iIdx) => (
                      <div key={iIdx} className="admin-menu-product">
                        {/* Image thumbnail if exists */}
                        {item.image && (
                          <img src={item.image} alt={item.name} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.5rem' }} />
                        )}
                        <div className="admin-menu-product-name">{item.name || 'Sin nombre'}</div>
                        <div className="admin-menu-product-desc">{item.desc || 'Sin descripción'}</div>
                        <div className="admin-menu-product-footer">
                          <span className="admin-menu-product-price">{item.price || '$0'}</span>
                          <div 
                            className={`admin-menu-availability ${item.available !== false ? 'admin-menu-availability--available' : 'admin-menu-availability--unavailable'}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => updateMenuItem(section.id, iIdx, 'available', item.available === false ? true : false)}
                          >
                            <span className="admin-menu-availability-dot"></span>
                            {item.available !== false ? 'Disponible' : 'Agotado'}
                          </div>
                        </div>
                        <div className="admin-menu-product-actions">
                          <button onClick={() => moveMenuItem(section.id, iIdx, 'up')} className="admin-move-btn" style={{ width: '22px', height: '22px' }}><ArrowUp size={11} /></button>
                          <button onClick={() => moveMenuItem(section.id, iIdx, 'down')} className="admin-move-btn" style={{ width: '22px', height: '22px' }}><ArrowDown size={11} /></button>
                          <button onClick={() => removeMenuItem(section.id, iIdx)} style={{ background: 'transparent', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer', padding: '2px' }}><Trash2 size={11} /></button>
                          
                          {/* Inline edit fields (hidden by default, shown on click) */}
                          <input value={item.name} onChange={e => updateMenuItem(section.id, iIdx, 'name', e.target.value)} className="admin-input" style={{ flex: 1, marginLeft: '4px', padding: '3px 6px', fontSize: '0.75rem' }} placeholder="Nombre" />
                          <input value={item.price} onChange={e => updateMenuItem(section.id, iIdx, 'price', e.target.value)} className="admin-input" style={{ width: '60px', padding: '3px 6px', fontSize: '0.75rem' }} placeholder="$0" />
                        </div>

                        {/* Image upload */}
                        <div style={{ marginTop: '0.4rem' }}>
                          {item.image ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <img src={item.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                              <button onClick={() => updateMenuItem(section.id, iIdx, 'image', null)} style={{ fontSize: '0.65rem', color: 'var(--admin-danger)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>Quitar imagen</button>
                            </div>
                          ) : (
                            <div
                              style={{ fontSize: '0.65rem', color: 'var(--admin-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                              onClick={() => document.getElementById(`menu-file-${section.id}-${iIdx}`)?.click()}
                            >
                              <ImageIcon size={10} /> Subir imagen
                            </div>
                          )}
                          <input
                            id={`menu-file-${section.id}-${iIdx}`}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={async e => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const compressed = await compressImage(file);
                              updateMenuItem(section.id, iIdx, 'image', compressed);
                            }}
                          />
                        </div>
                      </div>
                    ))}

                    {/* Add Item Button */}
                    <button className="admin-menu-add-btn" onClick={() => addMenuItem(section.id)}>
                      <Plus size={14} /> Añadir Ítem
                    </button>
                  </div>
                );
              })}

              {/* Add Category Column */}
              <div className="admin-menu-column" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', minHeight: '200px' }}>
                <button className="admin-menu-add-btn" onClick={addMenuSection} style={{ border: 'none', width: 'auto', padding: '1rem' }}>
                  <Plus size={18} /> Nueva Categoría
                </button>
              </div>
            </div>

            {/* ═══ Mobile Preview ═══ */}
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '2px solid var(--admin-border)' }}>
              <h3 className="admin-section-title"><Monitor size={20} color="var(--admin-accent)" /> Previsualización en Vivo</h3>
              <div className="admin-mobile-preview">
                <div className="admin-phone-frame">
                  <div className="admin-phone-notch"></div>
                  <div className="admin-phone-screen">
                    <div className="admin-phone-status-bar">
                      <span>9:41</span>
                      <span>●●● WiFi 🔋</span>
                    </div>
                    <div className="admin-phone-content">
                      <div className="admin-phone-menu-title">{content.services?.title || 'Nuestra Carta'}</div>
                      
                      {menuSections.map(section => (
                        <div key={section.id}>
                          <div className="admin-phone-section-title">{section.title}</div>
                          {section.items.map((item, i) => (
                            <div key={i} className="admin-phone-item">
                              <div style={{ flex: 1 }}>
                                <div className="admin-phone-item-name">{item.name}</div>
                                <div className="admin-phone-item-desc">{item.desc}</div>
                              </div>
                              <div className="admin-phone-item-dots"></div>
                              <div className="admin-phone-item-price">{item.price}</div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // ── Theme / Colors ────────────────────────────────────────────────────
      case 'theme': {
        const FONT_OPTIONS = [
          { label: 'Space Grotesk', value: "'Space Grotesk', system-ui, sans-serif" },
          { label: 'Inter', value: "'Inter', system-ui, sans-serif" },
          { label: 'Poppins', value: "'Poppins', system-ui, sans-serif" },
          { label: 'Montserrat', value: "'Montserrat', system-ui, sans-serif" },
          { label: 'Playfair Display', value: "'Playfair Display', Georgia, serif" },
          { label: 'Outfit', value: "'Outfit', system-ui, sans-serif" },
          { label: 'DM Sans', value: "'DM Sans', system-ui, sans-serif" },
          { label: 'Manrope', value: "'Manrope', system-ui, sans-serif" },
          { label: 'Sora', value: "'Sora', system-ui, sans-serif" },
          { label: 'Plus Jakarta Sans', value: "'Plus Jakarta Sans', system-ui, sans-serif" },
          { label: 'Custom', value: '__custom__' },
        ];

        const PRESET_THEMES = [
          { name: 'Clásico', p: '#8B4513', s: '#D2691E', bg: '#FAF6F1', bgS: '#F5EDE4', bgT: '#EDE3D5', tP: '#2C1810', tS: '#6B4C3B', nav: '#FAF6F1', card: '#FFFFFF', rm: 1.25, go: 0.03, gi: 0.5 },
          { name: 'Moderno', p: '#1E3A5F', s: '#4A90D9', bg: '#F8F9FA', bgS: '#FFFFFF', bgT: '#E9ECEF', tP: '#212529', tS: '#6C757D', nav: '#FFFFFF', card: '#FFFFFF', rm: 1, go: 0.06, gi: 0.5 },
          { name: 'Rústico', p: '#8D5524', s: '#A0522D', bg: '#FFF9F0', bgS: '#FFF3E0', bgT: '#FFE0B2', tP: '#3E2723', tS: '#795548', nav: '#FFF9F0', card: '#FFFFFF', rm: 1.5, go: 0.03, gi: 0.3 },
          { name: 'Moka', p: '#C8956C', s: '#A67B5B', bg: '#1A1410', bgS: '#231C15', bgT: '#2C2318', tP: '#F5EDE4', tS: '#A89888', nav: '#1A1410', card: '#231C15', rm: 1, go: 0.04, gi: 0.3 },
          { name: 'Amber Oscuro', p: '#f59e0b', s: '#d97706', bg: '#09090B', bgS: '#18181B', bgT: '#27272A', tP: '#FAFAFA', tS: '#A1A1AA', nav: '#09090B', card: '#18181B', rm: 1, go: 0.06, gi: 1 },
          { name: 'Esmeralda', p: '#10b981', s: '#06b6d4', bg: '#050a08', bgS: '#0a1a12', bgT: '#12291e', tP: '#FAFAFA', tS: '#A1A1AA', nav: '#050a08', card: '#0a1a12', rm: 1, go: 0.06, gi: 1 },
          { name: 'Rojo & Fuego', p: '#ef4444', s: '#f97316', bg: '#080505', bgS: '#1a0c0c', bgT: '#2a1515', tP: '#FAFAFA', tS: '#A1A1AA', nav: '#080505', card: '#1a0c0c', rm: 1, go: 0.06, gi: 1 },
          { name: 'Claro', p: '#3b82f6', s: '#8b5cf6', bg: '#f8fafc', bgS: '#ffffff', bgT: '#f1f5f9', tP: '#0f172a', tS: '#64748b', nav: '#f8fafc', card: '#ffffff', rm: 1, go: 0.06, gi: 0.5 },
        ];

        const applyPreset = (preset) => {
          updateTheme('accentPrimary', preset.p);
          updateTheme('accentSecondary', preset.s);
          updateTheme('bgPrimary', preset.bg);
          updateTheme('bgSecondary', preset.bgS);
          updateTheme('bgTertiary', preset.bgT);
          updateTheme('textPrimary', preset.tP);
          updateTheme('textSecondary', preset.tS);
          updateTheme('navbarColor', preset.nav);
          updateTheme('cardBg', preset.card);
          updateTheme('radiusMultiplier', preset.rm);
          updateTheme('glassOpacity', preset.go);
          updateTheme('glowIntensity', preset.gi);
        };

        const getFontLabel = (fontVal) => {
          const match = FONT_OPTIONS.find(o => o.value === fontVal);
          if (match && match.label !== 'Custom') return match.label;
          if (!fontVal) return 'Space Grotesk';
          return fontVal.split("'")[1] || fontVal.split("'")[0] || 'Custom';
        };

        const getBtnText = (accent) => {
          if (!accent) return '#FAFAFA';
          const hex = accent.replace('#', '');
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? '#09090B' : '#FAFAFA';
        };

        const exportTheme = () => {
          const blob = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = 'theme-config.json'; a.click();
          URL.revokeObjectURL(url);
        };

        const importTheme = (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
            try {
              const imported = JSON.parse(ev.target.result);
              Object.keys(imported).forEach(key => updateTheme(key, imported[key]));
            } catch { alert('JSON inválido.'); }
          };
          reader.readAsText(e.target.files[0]);
          e.target.value = '';
        };

        return (
          <div>
            <h3 className="admin-section-title"><Palette size={20} color="var(--admin-accent)" /> Personalización de Colores y Tema</h3>

            <div className="admin-info-banner admin-info-banner--warm" style={{ marginBottom: '1.5rem' }}>
              <span>🎨</span>
              <span><strong style={{ color: 'var(--admin-text)' }}>Los cambios se aplican en tiempo real.</strong> Mirá la vista previa a la derecha y presioná <strong style={{ color: 'var(--admin-text)' }}>Guardar</strong> cuando estés conforme.</span>
            </div>

            <div className="admin-theme-layout">

              {/* ═══ Left Column: Presets + Colors + Typography ═══ */}
              <div>
                {/* ── 1. Preset Themes ── */}
                <div className="admin-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h4 style={{ fontFamily: 'var(--admin-font-display)', fontSize: '1rem', fontWeight: '700', color: 'var(--admin-text)', marginBottom: '1rem' }}>Estilos Predefinidos</h4>
                  <div className="admin-preset-grid">
                    {PRESET_THEMES.map(preset => {
                      const isActive = theme.accentPrimary === preset.p && theme.bgPrimary === preset.bg;
                      return (
                        <div
                          key={preset.name}
                          className={`admin-preset-card ${isActive ? 'admin-preset-card--active' : ''}`}
                          onClick={() => applyPreset(preset)}
                        >
                          <div className="admin-preset-swatches">
                            <div className="admin-preset-swatch" style={{ background: preset.p }} />
                            <div className="admin-preset-swatch" style={{ background: preset.s }} />
                            <div className="admin-preset-swatch" style={{ background: preset.bg, border: '1px solid var(--admin-border)' }} />
                          </div>
                          <div className="admin-preset-name">{preset.name}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── 2. Custom Palette ── */}
                <div className="admin-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h4 style={{ fontFamily: 'var(--admin-font-display)', fontSize: '1rem', fontWeight: '700', color: 'var(--admin-text)', marginBottom: '1rem' }}>Paleta Personalizada</h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {/* Primary Colors */}
                    <div className="admin-color-group">
                      <div className="admin-color-row">
                        <div className="admin-color-swatch">
                          <input type="color" value={theme.accentPrimary} onChange={e => updateTheme('accentPrimary', e.target.value)} />
                        </div>
                        <div className="admin-color-info">
                          <div className="admin-color-label">Color Primario</div>
                          <div className="admin-color-variable">accentPrimary</div>
                        </div>
                        <div className="admin-color-hex">{theme.accentPrimary}</div>
                      </div>
                    </div>
                    <div className="admin-color-group">
                      <div className="admin-color-row">
                        <div className="admin-color-swatch">
                          <input type="color" value={theme.accentSecondary} onChange={e => updateTheme('accentSecondary', e.target.value)} />
                        </div>
                        <div className="admin-color-info">
                          <div className="admin-color-label">Color Secundario</div>
                          <div className="admin-color-variable">accentSecondary</div>
                        </div>
                        <div className="admin-color-hex">{theme.accentSecondary}</div>
                      </div>
                    </div>
                    <div className="admin-color-group">
                      <div className="admin-color-row">
                        <div className="admin-color-swatch">
                          <input type="color" value={theme.textPrimary || '#2C1810'} onChange={e => updateTheme('textPrimary', e.target.value)} />
                        </div>
                        <div className="admin-color-info">
                          <div className="admin-color-label">Acento de Acción</div>
                          <div className="admin-color-variable">textPrimary</div>
                        </div>
                        <div className="admin-color-hex">{theme.textPrimary}</div>
                      </div>
                    </div>
                    <div className="admin-color-group">
                      <div className="admin-color-row">
                        <div className="admin-color-swatch">
                          <input type="color" value={theme.bgPrimary} onChange={e => updateTheme('bgPrimary', e.target.value)} />
                        </div>
                        <div className="admin-color-info">
                          <div className="admin-color-label">Fondo Principal</div>
                          <div className="admin-color-variable">bgPrimary</div>
                        </div>
                        <div className="admin-color-hex">{theme.bgPrimary}</div>
                      </div>
                    </div>
                    <div className="admin-color-group">
                      <div className="admin-color-row">
                        <div className="admin-color-swatch">
                          <input type="color" value={theme.bgSecondary} onChange={e => updateTheme('bgSecondary', e.target.value)} />
                        </div>
                        <div className="admin-color-info">
                          <div className="admin-color-label">Fondo Secundario</div>
                          <div className="admin-color-variable">bgSecondary</div>
                        </div>
                        <div className="admin-color-hex">{theme.bgSecondary}</div>
                      </div>
                    </div>
                    <div className="admin-color-group">
                      <div className="admin-color-row">
                        <div className="admin-color-swatch">
                          <input type="color" value={theme.textSecondary} onChange={e => updateTheme('textSecondary', e.target.value)} />
                        </div>
                        <div className="admin-color-info">
                          <div className="admin-color-label">Texto Secundario</div>
                          <div className="admin-color-variable">textSecondary</div>
                        </div>
                        <div className="admin-color-hex">{theme.textSecondary}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── 3. Typography ── */}
                <div className="admin-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h4 style={{ fontFamily: 'var(--admin-font-display)', fontSize: '1rem', fontWeight: '700', color: 'var(--admin-text)', marginBottom: '1rem' }}>Tipografía</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                      <label className="admin-label">Fuente de Títulos (Display)</label>
                      {getFontLabel(theme.fontDisplay) === 'Custom' ? (
                        <input type="text" value={theme.fontDisplay || ''} onChange={e => updateTheme('fontDisplay', e.target.value)} placeholder="'Font Name', system-ui, sans-serif" className="admin-input" />
                      ) : (
                        <select className="admin-font-select" value={theme.fontDisplay || FONT_OPTIONS[0].value} onChange={e => updateTheme('fontDisplay', e.target.value)}>
                          {FONT_OPTIONS.map(o => (
                            <option key={o.label} value={o.value} style={{ fontFamily: o.value }}>{o.label}</option>
                          ))}
                        </select>
                      )}
                      <div className="admin-font-preview">
                        <div className="admin-font-preview-label">Vista Previa</div>
                        <div className="admin-font-preview-sample" style={{ fontFamily: theme.fontDisplay || FONT_OPTIONS[0].value, fontSize: '1.25rem', fontWeight: 700 }}>
                          Café Aromático
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="admin-label">Fuente de Cuerpo (Body)</label>
                      {getFontLabel(theme.fontBody) === 'Custom' ? (
                        <input type="text" value={theme.fontBody || ''} onChange={e => updateTheme('fontBody', e.target.value)} placeholder="'Font Name', system-ui, sans-serif" className="admin-input" />
                      ) : (
                        <select className="admin-font-select" value={theme.fontBody || FONT_OPTIONS[1].value} onChange={e => updateTheme('fontBody', e.target.value)}>
                          {FONT_OPTIONS.map(o => (
                            <option key={o.label} value={o.value} style={{ fontFamily: o.value }}>{o.label}</option>
                          ))}
                        </select>
                      )}
                      <div className="admin-font-preview">
                        <div className="admin-font-preview-label">Vista Previa</div>
                        <div className="admin-font-preview-sample" style={{ fontFamily: theme.fontBody || FONT_OPTIONS[1].value, fontSize: '0.9rem' }}>
                          Bienvenido a nuestro espacio de café artesanal. Cada taza cuenta una historia.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Export/Import ── */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button className="admin-btn" onClick={exportTheme}><Download size={14} /> Exportar JSON</button>
                  <label className="admin-btn" style={{ cursor: 'pointer' }}>
                    <Upload size={14} /> Importar JSON
                    <input type="file" accept=".json" onChange={importTheme} style={{ display: 'none' }} />
                  </label>
                  <button className="admin-btn" onClick={() => navigator.clipboard.writeText(JSON.stringify(theme, null, 2))}><Copy size={14} /> Copiar</button>
                  <button className="admin-btn-danger" onClick={resetTheme} style={{ marginLeft: 'auto' }}><RefreshCw size={14} /> Restablecer</button>
                </div>
              </div>

              {/* ═══ Right Column: Live Preview ═══ */}
              <div>
                <div className="admin-card" style={{ padding: '1.5rem', position: 'sticky', top: 'calc(var(--nav-height, 60px) + 1rem)' }}>
                  <h4 style={{ fontFamily: 'var(--admin-font-display)', fontSize: '1rem', fontWeight: '700', color: 'var(--admin-text)', marginBottom: '1rem' }}>Vista Previa en Vivo</h4>

                  <div className="admin-preview-mockup">
                    {/* Navbar */}
                    <div className="admin-preview-navbar" style={{ background: theme.navbarColor || theme.bgSecondary }}>
                      <div className="admin-preview-nav-brand" style={{ color: theme.textPrimary, fontFamily: theme.fontDisplay }}>
                        ☕ Café Aromático
                      </div>
                      <div className="admin-preview-nav-links" style={{ color: theme.textSecondary, fontFamily: theme.fontBody }}>
                        <span>Inicio</span>
                        <span>Menú</span>
                        <span>Contacto</span>
                      </div>
                    </div>

                    {/* Hero */}
                    <div className="admin-preview-hero" style={{ background: theme.bgSecondary }}>
                      <div className="admin-preview-hero-title" style={{ color: theme.textPrimary, fontFamily: theme.fontDisplay }}>
                        El Arte del Café
                      </div>
                      <div className="admin-preview-hero-subtitle" style={{ color: theme.textSecondary, fontFamily: theme.fontBody }}>
                        Descubrí sabores que cuentan historias
                      </div>
                      <div className="admin-preview-btn" style={{ background: theme.accentPrimary, color: getBtnText(theme.accentPrimary), fontFamily: theme.fontBody }}>
                        Ver Carta
                      </div>
                    </div>

                    {/* Cards */}
                    <div className="admin-preview-card-row">
                      <div className="admin-preview-card" style={{ background: theme.cardBg || theme.bgSecondary }}>
                        <div className="admin-preview-card-title" style={{ color: theme.textPrimary, fontFamily: theme.fontDisplay }}>Espresso Clásico</div>
                        <div className="admin-preview-card-text" style={{ color: theme.textSecondary, fontFamily: theme.fontBody }}>
                          Notas de chocolate oscuro y avellana tostada.
                        </div>
                        <div style={{ marginTop: '0.5rem', fontWeight: 700, fontSize: '0.75rem', color: theme.accentPrimary }}>$85</div>
                      </div>
                      <div className="admin-preview-card" style={{ background: theme.cardBg || theme.bgSecondary }}>
                        <div className="admin-preview-card-title" style={{ color: theme.textPrimary, fontFamily: theme.fontDisplay }}>Capuchino Vienés</div>
                        <div className="admin-preview-card-text" style={{ color: theme.textSecondary, fontFamily: theme.fontBody }}>
                          Crema sedosa con un toque de canela.
                        </div>
                        <div style={{ marginTop: '0.5rem', fontWeight: 700, fontSize: '0.75rem', color: theme.accentPrimary }}>$95</div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="admin-preview-footer" style={{ background: theme.bgSecondary, color: theme.textSecondary, fontFamily: theme.fontBody }}>
                      © 2026 Café Aromático — Todos los derechos reservados
                    </div>
                  </div>

                  {/* Color Legend */}
                  <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.375rem' }}>
                    {[
                      { label: 'Primario', color: theme.accentPrimary },
                      { label: 'Secundario', color: theme.accentSecondary },
                      { label: 'Fondo', color: theme.bgPrimary },
                      { label: 'Superficie', color: theme.bgSecondary },
                    ].map(c => (
                      <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.6875rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: c.color, border: '1px solid var(--admin-border)', flexShrink: 0 }} />
                        <span style={{ color: 'var(--admin-text-muted)' }}>{c.label}</span>
                        <code style={{ color: 'var(--admin-text-secondary)', fontSize: '0.6rem', marginLeft: 'auto' }}>{c.color}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // ── SEO ───────────────────────────────────────────────────────────────
      case 'seo':
        const seoTitleLen = content.seo?.title?.length || 0;
        const seoDescLen = content.seo?.description?.length || 0;

        return (
          <div>
            <h3 className="admin-section-title"><Globe size={20} color="var(--admin-accent)" /> SEO & Metadatos</h3>
            
            <div className="admin-info-banner admin-info-banner--success">
              <span>🔍</span>
              <span>Estos datos aparecen en Google y redes sociales. Un buen título y descripción aumentan los clicks.</span>
            </div>

            {/* ── Page Metadata ──────────────────────────────────────── */}
            <div className="admin-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h4 className="admin-card-title">📋 Configuración de Metadatos</h4>

              {/* Meta Title */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="admin-label">Meta Título</label>
                <input className="admin-input" value={content.seo?.title || ''} onChange={e => onChange('seo.title', e.target.value)} placeholder="Título que aparece en la pestaña del navegador" />
                <div className="admin-seo-counter">
                  <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>Máximo 60 caracteres</span>
                  <div className="admin-seo-counter-bar">
                    <div className={`admin-seo-counter-fill ${seoTitleLen <= 50 ? 'admin-seo-counter-fill--optimal' : seoTitleLen <= 60 ? 'admin-seo-counter-fill--warning' : 'admin-seo-counter-fill--danger'}`} style={{ width: `${Math.min((seoTitleLen / 60) * 100, 100)}%` }} />
                  </div>
                  <span className={`admin-seo-counter-text ${seoTitleLen <= 50 ? 'admin-seo-counter-text--optimal' : seoTitleLen <= 60 ? 'admin-seo-counter-text--warning' : 'admin-seo-counter-text--danger'}`}>{seoTitleLen}/60</span>
                </div>
              </div>

              {/* Meta Description */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="admin-label">Meta Descripción</label>
                <textarea className="admin-input" rows={3} value={content.seo?.description || ''} onChange={e => onChange('seo.description', e.target.value)} placeholder="Descripción que aparece en resultados de Google" />
                <div className="admin-seo-counter">
                  <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>Máximo 160 caracteres</span>
                  <div className="admin-seo-counter-bar">
                    <div className={`admin-seo-counter-fill ${seoDescLen <= 140 ? 'admin-seo-counter-fill--optimal' : seoDescLen <= 160 ? 'admin-seo-counter-fill--warning' : 'admin-seo-counter-fill--danger'}`} style={{ width: `${Math.min((seoDescLen / 160) * 100, 100)}%` }} />
                  </div>
                  <span className={`admin-seo-counter-text ${seoDescLen <= 140 ? 'admin-seo-counter-text--optimal' : seoDescLen <= 160 ? 'admin-seo-counter-text--warning' : 'admin-seo-counter-text--danger'}`}>{seoDescLen}/160</span>
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="admin-label">Palabras Clave</label>
                <textarea className="admin-input" rows={2} value={content.seo?.keywords || ''} onChange={e => onChange('seo.keywords', e.target.value)} placeholder="ej: café, espresso, artesanal, tueste local" />
                <p style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', marginTop: '0.5rem' }}>Separadas por coma. Usa 3-5 palabras clave relevantes.</p>
              </div>
            </div>

            {/* ── Previews (two-column) ──────────────────────────────── */}
            <div className="admin-grid-2" style={{ alignItems: 'start' }}>
              {/* Google SERP Preview */}
              <div className="admin-card" style={{ padding: '1.5rem' }}>
                <h4 className="admin-card-title">🔎 Vista Previa en Google</h4>
                <div className="admin-serp-preview">
                  <p className="admin-serp-preview-title">
                    {content.seo?.title || 'Título del sitio — Café Aromático'}
                  </p>
                  <p className="admin-serp-preview-url">
                    https://{content.siteName?.toLowerCase().replace(/\s/g, '') || 'tusitioweb'}.com
                  </p>
                  <p className="admin-serp-preview-desc">
                    {content.seo?.description || 'Descripción del sitio que aparece en los resultados de búsqueda de Google...'}
                  </p>
                </div>
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--admin-success-subtle)', borderRadius: 'var(--admin-radius-xs)', border: '1px solid rgba(45, 106, 79, 0.15)' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--admin-success)', marginBottom: '0.25rem' }}>Consejo SEO</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--admin-text-secondary)', lineHeight: '1.4' }}>Un título atractivo y una descripción clara aumentan significativamente tu tasa de clicks en los resultados de búsqueda.</p>
                </div>
              </div>

              {/* Social Sharing Preview */}
              <div className="admin-card" style={{ padding: '1.5rem' }}>
                <h4 className="admin-card-title">📱 Vista Previa en Redes Sociales</h4>
                
                {/* OG Image Upload */}
                <div style={{ marginBottom: '1rem' }}>
                  <label className="admin-label">Imagen de Compartido Social (OG Image)</label>
                  <div className="admin-og-upload" onClick={() => document.getElementById('og-image-input')?.click()}>
                    <div className="admin-og-upload-icon">
                      <ImagePlus size={24} />
                    </div>
                    <p className="admin-og-upload-text">{ogImage ? 'Cambiar imagen' : 'Subir imagen para compartir'}</p>
                    <p className="admin-og-upload-hint">PNG o JPG, mínimo 1200×630px (recomendado para Facebook/Instagram)</p>
                  </div>
                  <input id="og-image-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) setOgImage(URL.createObjectURL(file));
                  }} />
                </div>

                {/* Social Card Preview */}
                <div className="admin-social-preview" style={{ maxWidth: '100%' }}>
                  <div className="admin-social-preview-image">
                    {ogImage ? (
                      <img src={ogImage} alt="OG Preview" />
                    ) : images.logo ? (
                      <img src={images.logo} alt="OG Preview" />
                    ) : (
                      <span>Sin imagen</span>
                    )}
                  </div>
                  <div className="admin-social-preview-body">
                    <div className="admin-social-preview-domain">{content.siteName || 'tusitioweb'}.com</div>
                    <div className="admin-social-preview-title">{content.seo?.title || 'Título del sitio'}</div>
                    <div className="admin-social-preview-desc">{content.seo?.description || 'Descripción del sitio que aparece cuando alguien comparte tu página en redes sociales...'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Advanced Indexing ──────────────────────────────────── */}
            <div className="admin-card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
              <h4 className="admin-card-title">⚙️ Configuración Avanzada de Indexación</h4>
              
              <div className="admin-indexing-grid">
                {/* Index toggle */}
                <div className={`admin-indexing-toggle ${seoIndex ? 'admin-indexing-toggle--active' : ''}`} onClick={() => setSeoIndex(!seoIndex)}>
                  <label className="admin-indexing-toggle-switch" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={seoIndex} onChange={() => setSeoIndex(!seoIndex)} />
                    <span className="admin-indexing-toggle-slider" />
                  </label>
                  <div className="admin-indexing-toggle-text">
                    <span className="admin-indexing-toggle-label">Indexar esta página</span>
                    <span className="admin-indexing-toggle-desc">Permite que Google incluya esta página en los resultados de búsqueda</span>
                  </div>
                </div>

                {/* Follow toggle */}
                <div className={`admin-indexing-toggle ${seoFollow ? 'admin-indexing-toggle--active' : ''}`} onClick={() => setSeoFollow(!seoFollow)}>
                  <label className="admin-indexing-toggle-switch" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={seoFollow} onChange={() => setSeoFollow(!seoFollow)} />
                    <span className="admin-indexing-toggle-slider" />
                  </label>
                  <div className="admin-indexing-toggle-text">
                    <span className="admin-indexing-toggle-label">Seguir enlaces (Follow)</span>
                    <span className="admin-indexing-toggle-desc">Permite que Google siga y indexe los enlaces de esta página</span>
                  </div>
                </div>
              </div>

              {/* Canonical URL */}
              <div style={{ marginTop: '0.5rem' }}>
                <label className="admin-label">URL Canónica</label>
                <div className="admin-canonical-input">
                  <Link size={16} className="admin-canonical-icon" />
                  <input value={content.seo?.canonical || ''} onChange={e => onChange('seo.canonical', e.target.value)} placeholder="https://tudominio.com/pagina" />
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', marginTop: '0.5rem' }}>Úsala si el contenido está duplicado o similar en varias URLs. La canonical indica cuál es la versión preferida.</p>
              </div>
            </div>
          </div>
        );

      case 'general':
        const dayLabels = { lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles', jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo' };

        return (
          <div>
            <h3 className="admin-section-title"><Settings size={20} color="var(--admin-accent)" /> Configuración General</h3>
            
            {/* ── Site Info & Contact ──────────────────────────────── */}
            <div className="admin-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h4 className="admin-card-title">🏪 Información del Sitio y Contacto</h4>
              
              <div className="admin-general-grid">
                {/* Left: Form fields */}
                <div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label className="admin-label">Nombre del Establecimiento</label>
                    <input className="admin-input" value={content.siteName || ''} onChange={e => onChange('siteName', e.target.value)} placeholder="Ej: Café Aromático" />
                    <div style={{ fontSize: '0.7rem', color: (content.siteName?.length || 0) > 30 ? 'var(--admin-danger)' : 'var(--admin-text-muted)', marginTop: '0.375rem' }}>
                      {content.siteName?.length || 0}/30 caracteres
                    </div>
                  </div>

                  <div className="admin-grid-2" style={{ marginBottom: '1rem' }}>
                    <div>
                      <label className="admin-label">Teléfono de Contacto</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius)', transition: 'border-color var(--admin-transition)' }}>
                        <Phone size={16} style={{ color: 'var(--admin-text-muted)', flexShrink: 0 }} />
                        <input style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.875rem', fontFamily: 'var(--admin-font-body)', color: 'var(--admin-text)', background: 'transparent' }} value={content.contact?.whatsapp || ''} onChange={e => onChange('contact.whatsapp', e.target.value)} placeholder="+52 123 456 7890" />
                      </div>
                    </div>
                    <div>
                      <label className="admin-label">Correo Electrónico Principal</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius)', transition: 'border-color var(--admin-transition)' }}>
                        <AtSign size={16} style={{ color: 'var(--admin-text-muted)', flexShrink: 0 }} />
                        <input style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.875rem', fontFamily: 'var(--admin-font-body)', color: 'var(--admin-text)', background: 'transparent' }} type="email" value={content.contact?.email || ''} onChange={e => onChange('contact.email', e.target.value)} placeholder="cafe@aromatico.com" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="admin-label">Dirección Física</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius)', transition: 'border-color var(--admin-transition)' }}>
                      <MapPin size={16} style={{ color: 'var(--admin-text-muted)', flexShrink: 0 }} />
                      <input style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.875rem', fontFamily: 'var(--admin-font-body)', color: 'var(--admin-text)', background: 'transparent' }} value={content.contact?.address || ''} onChange={e => onChange('contact.address', e.target.value)} placeholder="Av. Principal 123, Colonia Centro" />
                    </div>
                  </div>
                </div>

                {/* Right: Map preview */}
                <div>
                  <div className="admin-map-container">
                    <div className="admin-map-placeholder">
                      <div className="admin-map-placeholder-icon">
                        <MapPin size={20} />
                      </div>
                      <span className="admin-map-placeholder-text">Vista Previa del Mapa</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--admin-text-muted)' }}>Lat: {content.contact?.mapLat || '19.4326'} / Lng: {content.contact?.mapLng || '-99.1332'}</span>
                    </div>
                    <div className="admin-map-coords">
                      <div className="admin-map-coord">Lat: {content.contact?.mapLat || '19.4326'}</div>
                      <div className="admin-map-coord">Lng: {content.contact?.mapLng || '-99.1332'}</div>
                    </div>
                  </div>
                  <div className="admin-grid-2" style={{ marginTop: '0.75rem' }}>
                    <div>
                      <label className="admin-label">Latitud</label>
                      <input className="admin-input" type="number" step="any" value={String(content.contact?.mapLat || '')} onChange={e => onChange('contact.mapLat', parseFloat(e.target.value) || 0)} placeholder="19.4326" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem' }} />
                    </div>
                    <div>
                      <label className="admin-label">Longitud</label>
                      <input className="admin-input" type="number" step="any" value={String(content.contact?.mapLng || '')} onChange={e => onChange('contact.mapLng', parseFloat(e.target.value) || 0)} placeholder="-99.1332" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Business Hours ───────────────────────────────────── */}
            <div className="admin-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h4 className="admin-card-title">🕐 Horarios de Apertura</h4>
              
              {/* Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr auto', gap: '0.75rem', padding: '0.5rem 1rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: '700', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Día</span>
                <span style={{ fontSize: '0.6875rem', fontWeight: '700', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Apertura</span>
                <span style={{ fontSize: '0.6875rem', fontWeight: '700', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cierre</span>
                <span style={{ fontSize: '0.6875rem', fontWeight: '700', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Estado</span>
              </div>

              {/* Day cards */}
              <div className="admin-hours-cards">
                {Object.entries(hours).map(([day, data]) => (
                  <div key={day} className={`admin-hours-card ${!data.open ? 'admin-hours-card--closed' : ''}`}>
                    <div className="admin-hours-card-day">{dayLabels[day]}</div>
                    <input
                      type="time"
                      className="admin-hours-time"
                      value={data.start}
                      onChange={e => setHours(prev => ({ ...prev, [day]: { ...prev[day], start: e.target.value } }))}
                      disabled={!data.open}
                    />
                    <input
                      type="time"
                      className="admin-hours-time"
                      value={data.end}
                      onChange={e => setHours(prev => ({ ...prev, [day]: { ...prev[day], end: e.target.value } }))}
                      disabled={!data.open}
                    />
                    <button
                      className={`admin-hours-toggle ${data.open ? 'admin-hours-toggle--open' : 'admin-hours-toggle--closed'}`}
                      onClick={() => setHours(prev => ({ ...prev, [day]: { ...prev[day], open: !prev[day].open } }))}
                    />
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--admin-accent-subtle)', borderRadius: 'var(--admin-radius-xs)', border: '1px solid rgba(141, 85, 36, 0.12)' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--admin-accent)', fontWeight: '600' }}>💡 Los horarios se muestran públicamente en la sección de Contacto del sitio.</p>
              </div>
            </div>

            {/* ── Regional Settings ────────────────────────────────── */}
            <div className="admin-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h4 className="admin-card-title">🌍 Ajustes Regionales y Sistema</h4>
              
              <div className="admin-grid-3">
                <div>
                  <label className="admin-label">Idioma del Sitio</label>
                  <select className="admin-select">
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="pt">Português</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Moneda Predeterminada</label>
                  <select className="admin-select">
                    <option value="MXN">MXN — Peso Mexicano</option>
                    <option value="USD">USD — Dólar</option>
                    <option value="ARS">ARS — Peso Argentino</option>
                    <option value="EUR">EUR — Euro</option>
                    <option value="BRL">BRL — Real Brasileño</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Zona Horaria</label>
                  <select className="admin-select">
                    <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                    <option value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</option>
                    <option value="America/New_York">New York (GMT-5)</option>
                    <option value="Europe/Madrid">Madrid (GMT+1)</option>
                    <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ── Social Media Links ───────────────────────────────── */}
            <div className="admin-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h4 className="admin-card-title">🔗 Redes Sociales Vinculadas</h4>
              
              <div className="admin-social-links">
                {/* Instagram */}
                <div className="admin-social-link">
                  <div className="admin-social-link-icon admin-social-link-icon--instagram">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
                  </div>
                  <input className="admin-social-link-input" value={content.social?.instagram || ''} onChange={e => onChange('social.instagram', e.target.value)} placeholder="https://instagram.com/cafaromatico" />
                  <div className={`admin-social-link-status ${content.social?.instagram ? 'admin-social-link-status--connected' : 'admin-social-link-status--disconnected'}`} />
                </div>

                {/* Facebook */}
                <div className="admin-social-link">
                  <div className="admin-social-link-icon admin-social-link-icon--facebook">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </div>
                  <input className="admin-social-link-input" value={content.social?.facebook || ''} onChange={e => onChange('social.facebook', e.target.value)} placeholder="https://facebook.com/cafaromatico" />
                  <div className={`admin-social-link-status ${content.social?.facebook ? 'admin-social-link-status--connected' : 'admin-social-link-status--disconnected'}`} />
                </div>

                {/* TripAdvisor */}
                <div className="admin-social-link">
                  <div className="admin-social-link-icon admin-social-link-icon--tripadvisor">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="7" cy="15" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="17" cy="15" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="10" r="2" fill="currentColor"/><path d="M4 15h16" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M3.5 12c2-4 5.5-6 8.5-6s6.5 2 8.5 6" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
                  </div>
                  <input className="admin-social-link-input" value={content.social?.tripadvisor || ''} onChange={e => onChange('social.tripadvisor', e.target.value)} placeholder="https://tripadvisor.com/cafe-aromatico" />
                  <div className={`admin-social-link-status ${content.social?.tripadvisor ? 'admin-social-link-status--connected' : 'admin-social-link-status--disconnected'}`} />
                </div>

                {/* YouTube */}
                <div className="admin-social-link">
                  <div className="admin-social-link-icon admin-social-link-icon--youtube">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </div>
                  <input className="admin-social-link-input" value={content.social?.youtube || ''} onChange={e => onChange('social.youtube', e.target.value)} placeholder="https://youtube.com/@cafaromatico" />
                  <div className={`admin-social-link-status ${content.social?.youtube ? 'admin-social-link-status--connected' : 'admin-social-link-status--disconnected'}`} />
                </div>

                {/* TikTok */}
                <div className="admin-social-link">
                  <div className="admin-social-link-icon admin-social-link-icon--tiktok">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.8a8.18 8.18 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.23z"/></svg>
                  </div>
                  <input className="admin-social-link-input" value={content.social?.tiktok || ''} onChange={e => onChange('social.tiktok', e.target.value)} placeholder="https://tiktok.com/@cafaromatico" />
                  <div className={`admin-social-link-status ${content.social?.tiktok ? 'admin-social-link-status--connected' : 'admin-social-link-status--disconnected'}`} />
                </div>

                {/* LinkedIn */}
                <div className="admin-social-link">
                  <div className="admin-social-link-icon admin-social-link-icon--linkedin">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </div>
                  <input className="admin-social-link-input" value={content.social?.linkedin || ''} onChange={e => onChange('social.linkedin', e.target.value)} placeholder="https://linkedin.com/company/cafaromatico" />
                  <div className={`admin-social-link-status ${content.social?.linkedin ? 'admin-social-link-status--connected' : 'admin-social-link-status--disconnected'}`} />
                </div>
              </div>
            </div>

            {/* ── Security ─────────────────────────────────────────── */}
            <div className="admin-card" style={{ padding: '1.5rem' }}>
              <h4 className="admin-card-title">🔒 Seguridad Institucional</h4>
              <p style={{ color: 'var(--admin-text-secondary)', fontSize: '0.8125rem', marginBottom: '1.25rem', lineHeight: '1.6', fontFamily: 'var(--admin-font-body)' }}>Cambia la contraseña maestra de acceso al panel ("admin123" por defecto).</p>
              <div className="admin-grid-2" style={{ marginBottom: '1rem' }}>
                <input id="oldPass" type="password" placeholder="Contraseña Actual" value={oldPass} onChange={e => setOldPass(e.target.value)} className="admin-input" />
                <input id="newPass" type="password" placeholder="Nueva Contraseña" value={newPass} onChange={e => setNewPass(e.target.value)} className="admin-input" />
              </div>
              <button
                className="admin-security-btn"
                onClick={async () => {
                  if (!oldPass || !newPass) { showToast('Llena ambos campos', 'error'); return; }
                  const success = await changePassword(oldPass, newPass);
                  if (success) { setOldPass(''); setNewPass(''); showToast('Contraseña Actualizada', 'success'); }
                  else showToast('Error al actualizar', 'error');
                }}
              >
                Actualizar Contraseña Maestra
              </button>
            </div>
          </div>
        );

      case 'home':
        return (
          <div>
            <h3 className="admin-section-title"><Monitor size={20} color="var(--admin-accent)" /> Página de Inicio</h3>

            {/* Section 1: Features */}
            <div className="admin-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h4 className="admin-card-title">✨ Lo Que Nos Hace Únicos</h4>
              {(content.home?.features || defaultFeatures).map((f, i) => (
                <div key={i} className="admin-card" style={{ padding: '1rem', marginBottom: '1rem' }}>
                  <p className="admin-card-subtitle">FEATURE #{i + 1}</p>
                  <Field label="Título" path={`home.features.${i}.title`} value={f.title} onChange={onChange} />
                  <Field label="Descripción" path={`home.features.${i}.desc`} value={f.desc} onChange={onChange} type="textarea" />
                </div>
              ))}
            </div>

            {/* Section 2: Quick Shop Products */}
            <div className="admin-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h4 className="admin-card-title">🛍️ Tienda Rápida</h4>
              {(content.home?.shopProducts || defaultShopProducts).map((p, i) => (
                <div key={i} className="admin-card" style={{ padding: '1rem', marginBottom: '1rem' }}>
                  <p className="admin-card-subtitle">PRODUCTO #{i + 1}</p>
                  <div className="admin-grid-2">
                    <Field label="Nombre" path={`home.shopProducts.${i}.name`} value={p.name} onChange={onChange} />
                    <Field label="Precio" path={`home.shopProducts.${i}.price`} value={p.price} onChange={onChange} />
                  </div>
                  <div className="admin-grid-2">
                    <Field label="Etiqueta (badge)" path={`home.shopProducts.${i}.tag`} value={p.tag || ''} onChange={onChange} hint="Ej: Edición Limitada, Más Vendido, Nuevo" />
                    <Field label="URL de imagen" path={`home.shopProducts.${i}.image`} value={p.image} onChange={onChange} />
                  </div>
                </div>
              ))}
            </div>

            {/* Section 3: Nuestra Historia */}
            <div className="admin-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h4 className="admin-card-title">📖 Nuestra Historia</h4>
              <Field label="Título" path="home.storyTitle" value={content.home?.storyTitle || ''} onChange={onChange} />
              <Field label="Párrafo 1" path="home.storyP1" value={content.home?.storyP1 || ''} onChange={onChange} type="textarea" />
              <Field label="Párrafo 2" path="home.storyP2" value={content.home?.storyP2 || ''} onChange={onChange} type="textarea" />
            </div>

            {/* Section 4: Servicios */}
            <div className="admin-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h4 className="admin-card-title">🎯 Servicios</h4>
              {(content.home?.services || defaultServices).map((s, i) => (
                <div key={i} className="admin-card" style={{ padding: '1rem', marginBottom: '1rem' }}>
                  <p className="admin-card-subtitle">SERVICIO #{i + 1}</p>
                  <div className="admin-grid-2">
                    <Field label="Icono (emoji)" path={`home.services.${i}.icon`} value={s.icon} onChange={onChange} hint="Usa un emoji: ☕ 🎓 📦" />
                    <Field label="Título" path={`home.services.${i}.title`} value={s.title} onChange={onChange} />
                  </div>
                  <Field label="Descripción" path={`home.services.${i}.desc`} value={s.desc} onChange={onChange} type="textarea" />
                </div>
              ))}
            </div>

            {/* Section 5: Testimonials */}
            <div className="admin-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h4 className="admin-card-title">💬 Testimonios</h4>
              {(content.home?.testimonials || defaultTestimonials).map((t, i) => (
                <div key={i} className="admin-card" style={{ padding: '1rem', marginBottom: '1rem' }}>
                  <p className="admin-card-subtitle">TESTIMONIO #{i + 1}</p>
                  <Field label="Nombre" path={`home.testimonials.${i}.name`} value={t.name} onChange={onChange} />
                  <Field label="Rol / Empresa" path={`home.testimonials.${i}.role`} value={t.role} onChange={onChange} />
                  <Field label="Texto del testimonio" path={`home.testimonials.${i}.text`} value={t.text} onChange={onChange} type="textarea" />
                </div>
              ))}
            </div>

            {/* Section 6: FAQ */}
            <div className="admin-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h4 className="admin-card-title">❓ Preguntas Frecuentes</h4>
              {(content.home?.faqs || defaultFaqs).map((faq, i) => (
                <div key={i} className="admin-card" style={{ padding: '1rem', marginBottom: '1rem' }}>
                  <p className="admin-card-subtitle">FAQ #{i + 1}</p>
                  <Field label="Pregunta" path={`home.faqs.${i}.q`} value={faq.q} onChange={onChange} />
                  <Field label="Respuesta" path={`home.faqs.${i}.a`} value={faq.a} onChange={onChange} type="textarea" />
                </div>
              ))}
            </div>

            {/* Section 7: Suscripción Premium */}
            <div className="admin-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h4 className="admin-card-title">⭐ Suscripción Premium</h4>
              {(content.home?.subBenefits || defaultSubBenefits).map((b, i) => (
                <div key={i} className="admin-card" style={{ padding: '1rem', marginBottom: '1rem' }}>
                  <p className="admin-card-subtitle">BENEFICIO #{i + 1}</p>
                  <div className="admin-grid-2">
                    <Field label="Icono (emoji)" path={`home.subBenefits.${i}.icon`} value={b.icon} onChange={onChange} hint="Usa un emoji: ☕ 🎁 🚀 ⭐" />
                    <Field label="Título" path={`home.subBenefits.${i}.title`} value={b.title} onChange={onChange} />
                  </div>
                  <Field label="Descripción" path={`home.subBenefits.${i}.desc`} value={b.desc} onChange={onChange} type="textarea" />
                </div>
              ))}
              <div className="admin-section-divider">
                <div className="admin-grid-2">
                  <Field label="Precio" path="home.subPrice" value={content.home?.subPrice || '299'} onChange={onChange} />
                  <Field label="Texto del botón CTA" path="home.subCtaText" value={content.home?.subCtaText || 'Suscribirme Ahora'} onChange={onChange} />
                </div>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div>
            <h3 className="admin-section-title"><Mail size={20} color="var(--admin-accent)" /> Página Contacto</h3>
            <Field label="Título" path="contact.title" value={content.contact.title} onChange={onChange} />
            <Field label="Subtítulo" path="contact.subtitle" value={content.contact.subtitle} onChange={onChange} type="textarea" />
            <div className="admin-grid-2">
              <Field label="WhatsApp (texto visible)" path="contact.whatsapp" value={content.contact.whatsapp} onChange={onChange} type="tel" />
              <Field label="Email" path="contact.email" value={content.contact.email} onChange={onChange} type="email" />
            </div>
            <div className="admin-hint-row">
              <span>{(content.contact.whatsapp?.length || 0) > 0 ? `${content.contact.whatsapp.length} caracteres` : 'Ej: +521234567890'}</span>
              <span>{(content.contact.email?.length || 0) > 0 ? `${content.contact.email.length} caracteres` : 'Ej: correo@ejemplo.com'}</span>
            </div>
            <Field label="Dirección" path="contact.address" value={content.contact.address} onChange={onChange} />
            <div className="admin-grid-2">
              <Field label="Latitud del Mapa" path="contact.mapLat" value={String(content.contact.mapLat)} onChange={(p, v) => onChange(p, parseFloat(v) || 0)} type="number" />
              <Field label="Longitud del Mapa" path="contact.mapLng" value={String(content.contact.mapLng)} onChange={(p, v) => onChange(p, parseFloat(v) || 0)} type="number" />
            </div>
          </div>
        );

      case 'social':
        return (
          <div>
            <h3 className="admin-section-title"><Globe size={20} color="var(--admin-accent)" /> Redes Sociales</h3>
            <p className="admin-info-banner admin-info-banner--success">
              <span>ℹ️</span>
              <span>Estas URLs se usan en el Navbar, Footer y cualquier lugar donde aparezcan íconos de redes sociales.</span>
            </p>
            {[
              { label: '📸 Instagram', path: 'social.instagram', placeholder: 'https://instagram.com/tuusuario' },
              { label: '▶️ YouTube', path: 'social.youtube', placeholder: 'https://youtube.com/@tucanal' },
              { label: '👍 Facebook', path: 'social.facebook', placeholder: 'https://facebook.com/tupagina' },
              { label: '🎵 TikTok', path: 'social.tiktok', placeholder: 'https://tiktok.com/@tuusuario' },
              { label: '💼 LinkedIn', path: 'social.linkedin', placeholder: 'https://linkedin.com/company/tuempresa' },
            ].map(s => (
              <Field key={s.path} label={s.label} path={s.path} value={content.social?.[s.path.split('.')[1]] || ''} onChange={onChange} />
            ))}
          </div>
        );

      case 'whatsapp': {
        const waTemplates = [
          { id: 1, name: 'Confirmación de Pedido', msg: '¡Hola! Tu pedido de Café Aromático está confirmado y en preparación. Te avisamos cuando esté listo para recoger. ☕', approved: true },
          { id: 2, name: 'Promoción de Temporada', msg: '¡Hola! Esta semana tenemos una oferta especial en todos nuestros cafés de especialidad. ¡Ven a visitarnos y disfruta un 20% de descuento!', approved: true },
          { id: 3, name: 'Bienvenida Nuevo Cliente', msg: '¡Bienvenido a Café Aromático! 🎉 Gracias por registrarte. Usá el código BIENVENIDO10 en tu primer pedido.', approved: false },
          { id: 4, name: 'Evento de Cata', msg: 'Te invitamos a nuestra próxima cata de cafés de origen único. Reservá tu lugar: solo 15 cupos disponibles.', approved: false },
          { id: 5, name: 'Recordatorio de Pedido Listo', msg: '¡Tu pedido está listo para recoger! Te esperamos en Café Aromático. Horario: 8am - 9pm.', approved: true },
          { id: 6, name: 'Solicitud de Reseña', msg: '¡Gracias por visitarnos! Si disfrutaste tu experiencia, nos encantaría que nos dejes una reseña. ¡Gracias! ⭐', approved: false },
        ];

        return (
          <div>
            <h3 className="admin-section-title"><MessageSquare size={20} color="#25d366" /> Configuración de WhatsApp</h3>

            <div className="admin-wa-layout">
              {/* ═══ 1. Widget Config (full width) ═══ */}
              <div className="admin-wa-full">
                <div className="admin-wa-widget-card">
                  <div className="admin-wa-widget-config">
                    <h4 style={{ fontFamily: 'var(--admin-font-display)', fontSize: '1rem', fontWeight: '700', color: 'var(--admin-text)', marginBottom: '1rem' }}>Widget en Vivo</h4>
                    
                    {/* Toggle */}
                    <div className="admin-wa-toggle-row">
                      <div className="admin-wa-toggle-info">
                        <span className="admin-wa-toggle-label">Widget Flotante</span>
                        <span className="admin-wa-toggle-desc">Mostrar botón de WhatsApp en todas las páginas</span>
                      </div>
                      <button
                        className={`admin-hours-toggle ${waEnabled ? 'admin-hours-toggle--open' : 'admin-hours-toggle--closed'}`}
                        onClick={() => setWaEnabled(!waEnabled)}
                      />
                    </div>

                    {/* Fields */}
                    <Field label="Número de WhatsApp (formato internacional)" path="whatsappFloat.number" value={content.whatsappFloat?.number || ''} onChange={onChange} type="tel" hint="Ej: +521234567890 (sin espacios ni guiones)" />
                    <Field label="Mensaje de Bienvenida Predeterminado" path="whatsappFloat.message" value={content.whatsappFloat?.message || ''} onChange={onChange} type="textarea" hint="Mensaje que aparece pre-escrito cuando el usuario abre WhatsApp" />

                    {/* Generated Link */}
                    <div style={{ padding: '0.75rem', background: 'var(--admin-surface-hover)', border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius-sm)' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', fontWeight: '600' }}>Enlace generado:</span>
                      <code style={{ display: 'block', fontSize: '0.7rem', color: '#25d366', wordBreak: 'break-all', lineHeight: '1.6', marginTop: '4px', fontFamily: 'monospace' }}>
                        {`https://wa.me/${(content.whatsappFloat?.number || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(content.whatsappFloat?.message || '')}`}
                      </code>
                    </div>
                  </div>

                  {/* Floating Icon Preview */}
                  <div className="admin-wa-widget-preview">
                    <div className="admin-wa-widget-preview-icon">
                      <MessageSquare size={24} />
                    </div>
                    <span className="admin-wa-widget-preview-label">Preview</span>
                  </div>
                </div>
              </div>

              {/* ═══ 2. Templates Grid (full width) ═══ */}
              <div className="admin-wa-full">
                <div className="admin-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div>
                      <h4 style={{ fontFamily: 'var(--admin-font-display)', fontSize: '1rem', fontWeight: '700', color: 'var(--admin-text)' }}>Plantillas de Marketing</h4>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-muted)', marginTop: '0.25rem' }}>Mensajes predefinidos para comunicarte con clientes</p>
                    </div>
                    <button className="admin-btn-primary" style={{ fontSize: '0.8125rem' }}>
                      <Plus size={14} /> Nueva Plantilla
                    </button>
                  </div>

                  <div className="admin-wa-templates-grid">
                    {waTemplates.map(tpl => (
                      <div key={tpl.id} className="admin-wa-template-card">
                        <div className="admin-wa-template-header">
                          <span className="admin-wa-template-name">{tpl.name}</span>
                          <span className="admin-badge" style={tpl.approved
                            ? { background: 'var(--admin-success-subtle)', color: 'var(--admin-success)', border: '1px solid rgba(45,106,79,0.15)', fontSize: '0.6rem' }
                            : { background: 'rgba(245,158,11,0.08)', color: '#D97706', border: '1px solid rgba(245,158,11,0.15)', fontSize: '0.6rem' }
                          }>
                            {tpl.approved ? 'Aprobada' : 'Pendiente'}
                          </span>
                        </div>
                        <div className="admin-wa-template-preview">{tpl.msg}</div>
                        <div className="admin-wa-template-actions">
                          <button className="admin-btn" style={{ flex: 1, justifyContent: 'center', fontSize: '0.8125rem' }}>
                            <Edit3 size={13} /> Editar
                          </button>
                          <button className="admin-btn" style={{ flex: 1, justifyContent: 'center', fontSize: '0.8125rem', borderColor: '#25d36630', color: '#25d366' }}>
                            <MessageSquare size={13} /> Enviar Prueba
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ═══ 3. Interaction KPIs ═══ */}
              <div className="admin-wa-full">
                <div className="admin-card" style={{ padding: '1.5rem' }}>
                  <h4 style={{ fontFamily: 'var(--admin-font-display)', fontSize: '1rem', fontWeight: '700', color: 'var(--admin-text)', marginBottom: '1rem' }}>Estadísticas de Interacción</h4>
                  <div className="admin-wa-kpi-grid">
                    <div className="admin-wa-kpi">
                      <div className="admin-wa-kpi-icon" style={{ background: 'rgba(37,211,102,0.08)' }}>
                        <MousePointer size={18} color="#25d366" />
                      </div>
                      <div className="admin-wa-kpi-value">{analytics.whatsapp_clicks || 0}</div>
                      <div className="admin-wa-kpi-label">Clicks Totales</div>
                    </div>
                    <div className="admin-wa-kpi">
                      <div className="admin-wa-kpi-icon" style={{ background: 'var(--admin-accent-subtle)' }}>
                        <MessageSquare size={18} color="var(--admin-accent)" />
                      </div>
                      <div className="admin-wa-kpi-value">{Math.floor((analytics.whatsapp_clicks || 0) * 0.68)}</div>
                      <div className="admin-wa-kpi-label">Chats Iniciados</div>
                    </div>
                    <div className="admin-wa-kpi">
                      <div className="admin-wa-kpi-icon" style={{ background: 'var(--admin-success-subtle)' }}>
                        <Clock size={18} color="var(--admin-success)" />
                      </div>
                      <div className="admin-wa-kpi-value">~4m</div>
                      <div className="admin-wa-kpi-label">Tiempo de Respuesta</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'footer':
        return (
          <div>
            <h3 className="admin-section-title"><FileText size={20} color="var(--admin-accent)" /> Footer</h3>
            <Field label="Descripción de la empresa" path="footer.description" value={content.footer.description} onChange={onChange} type="textarea" />
            <Field label="Texto de Copyright" path="footer.copyright" value={content.footer.copyright} onChange={onChange} hint={`Ej: MiEmpresa. Todos los derechos reservados.`} />
          </div>
        );

      case 'images': {
        const imageSlots = [
          { key: 'logo', label: 'logo-brand.png', category: 'cafe', size: '~45 KB', optimized: true },
          { key: 'heroBg', label: 'hero-fondo.jpg', category: 'interior', size: '~320 KB', optimized: true },
          { key: 'aboutHero', label: 'nosotros-equipo.jpg', category: 'equipo', size: '~180 KB', optimized: true },
          ...(images.portfolio || []).map((_, i) => ({ 
            key: `portfolio.${i}`, 
            label: `galeria-${i + 1}.jpg`, 
            category: i < 2 ? 'cafe' : i < 4 ? 'eventos' : 'interior', 
            size: `~${120 + i * 30} KB`, 
            optimized: i % 2 === 0 
          })),
        ];

        const categories = [
          { key: 'all', label: 'Todo', icon: <Folder size={15} /> },
          { key: 'cafe', label: 'Café & Bebidas', icon: <Coffee size={15} /> },
          { key: 'interior', label: 'Interior Local', icon: <Monitor size={15} /> },
          { key: 'equipo', label: 'Equipo / Team', icon: <Users size={15} /> },
          { key: 'eventos', label: 'Eventos', icon: <Calendar size={15} /> },
        ];

        const filteredSlots = imageSlots.filter(s => {
          const matchesFilter = galleryFilter === 'all' || s.category === galleryFilter;
          const matchesSearch = !gallerySearch || s.label.toLowerCase().includes(gallerySearch.toLowerCase());
          return matchesFilter && matchesSearch;
        });

        const totalUsed = [images.logo, images.heroBg, images.aboutHero, ...(images.portfolio || [])].filter(Boolean).length;
        const maxSlots = 9;
        const usagePercent = Math.round((totalUsed / maxSlots) * 100);

        const handleFileUpload = async (file, slot) => {
          if (!file) { return; }
          const compressed = await compressImage(file, 600, 0.75);
          if (slot.key.startsWith('portfolio.')) {
            const idx = parseInt(slot.key.split('.')[1]);
            updateImage('portfolio', compressed, idx);
          } else {
            updateImage(slot.key, compressed);
          }
        };

        return (
          <div>
            <h3 className="admin-section-title"><ImageIcon size={20} color="var(--admin-accent)" /> Centro de Medios</h3>

            {/* Info Banner */}
            <div className="admin-info-banner admin-info-banner--warm" style={{ marginBottom: '1.5rem' }}>
              <span>💡</span>
              <span>Las imágenes se guardan en tu navegador como base64. <strong style={{ color: 'var(--admin-text)' }}>Máximo 2 MB por imagen.</strong></span>
            </div>

            <div className="admin-gallery-layout">
              {/* ── Left: Sidebar ── */}
              <div className="admin-gallery-sidebar">
                {categories.map(cat => {
                  const count = cat.key === 'all' ? imageSlots.length : imageSlots.filter(s => s.category === cat.key).length;
                  return (
                    <div
                      key={cat.key}
                      className={`admin-gallery-sidebar-item ${galleryFilter === cat.key ? 'admin-gallery-sidebar-item--active' : ''}`}
                      onClick={() => setGalleryFilter(cat.key)}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {cat.icon} {cat.label}
                      </span>
                      <span className="admin-gallery-count">{count}</span>
                    </div>
                  );
                })}

                {/* Storage Widget */}
                <div className="admin-storage-widget">
                  <div className="admin-storage-label">
                    <span>Almacenamiento</span>
                    <span style={{ fontWeight: 600 }}>{usagePercent}%</span>
                  </div>
                  <div className="admin-storage-track">
                    <div className="admin-storage-fill" style={{ width: `${usagePercent}%` }} />
                  </div>
                  <div className="admin-storage-detail">
                    {totalUsed} de {maxSlots} slots utilizados
                  </div>
                </div>
              </div>

              {/* ── Right: Main Area ── */}
              <div>
                {/* Dropzone */}
                <label
                  className={`admin-dropzone ${dragOver ? 'admin-dropzone--active' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => {
                    e.preventDefault();
                    setDragOver(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      const emptySlot = imageSlots.find(s => !images[s.key.split('.')[0]] || (s.key.startsWith('portfolio.') && !(images.portfolio || [])[parseInt(s.key.split('.')[1])]));
                      if (emptySlot) handleFileUpload(file, emptySlot);
                    }
                  }}
                >
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const emptySlot = imageSlots.find(s => !images[s.key.split('.')[0]] || (s.key.startsWith('portfolio.') && !(images.portfolio || [])[parseInt(s.key.split('.')[1])]));
                      if (emptySlot) handleFileUpload(file, emptySlot);
                    }
                    e.target.value = '';
                  }} />
                  <div className="admin-dropzone-icon">
                    <Upload size={32} />
                  </div>
                  <div className="admin-dropzone-text">Arrastrá una imagen aquí o hacé click para subir</div>
                  <div className="admin-dropzone-hint">JPG, PNG, WebP — Máximo 2 MB</div>
                </label>

                {/* Toolbar */}
                <div className="admin-gallery-toolbar">
                  <div className="admin-gallery-search">
                    <Search size={14} className="admin-gallery-search-icon" />
                    <input
                      className="admin-input"
                      placeholder="Buscar imágenes..."
                      value={gallerySearch}
                      onChange={e => setGallerySearch(e.target.value)}
                      style={{ paddingLeft: '32px', fontSize: '0.8125rem', padding: '0.5rem 0.75rem 0.5rem 32px' }}
                    />
                  </div>
                  <div className="admin-view-toggle">
                    <button
                      className={`admin-view-toggle-btn ${galleryView === 'grid' ? 'admin-view-toggle-btn--active' : ''}`}
                      onClick={() => setGalleryView('grid')}
                      title="Vista Cuadrícula"
                    >
                      <LayoutGrid size={16} />
                    </button>
                    <button
                      className={`admin-view-toggle-btn ${galleryView === 'list' ? 'admin-view-toggle-btn--active' : ''}`}
                      onClick={() => setGalleryView('list')}
                      title="Vista Lista"
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>

                {/* Gallery Content */}
                {galleryView === 'grid' ? (
                  <div className="admin-gallery-grid">
                    {filteredSlots.map(slot => {
                      const isPortfolio = slot.key.startsWith('portfolio.');
                      const imgKey = isPortfolio ? 'portfolio' : slot.key;
                      const imgIndex = isPortfolio ? parseInt(slot.key.split('.')[1]) : undefined;
                      const imgVal = isPortfolio ? (images.portfolio || [])[imgIndex] : images[slot.key];

                      return (
                        <div key={slot.key} className="admin-gallery-card">
                          {/* Hover Actions */}
                          <div className="admin-gallery-card-actions">
                            <label className="admin-gallery-action-btn" title="Reemplazar">
                              <Edit3 size={13} />
                              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                                if (e.target.files?.[0]) handleFileUpload(e.target.files[0], slot);
                              }} />
                            </label>
                            {imgVal && (
                              <button className="admin-gallery-action-btn admin-gallery-action-btn--danger" title="Eliminar" onClick={() => {
                                if (isPortfolio) updateImage('portfolio', null, imgIndex);
                                else updateImage(imgKey, null);
                              }}>
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>

                          {/* Image or Empty */}
                          {imgVal ? (
                            <img src={imgVal} alt={slot.label} className="admin-gallery-card-img" />
                          ) : (
                            <label className="admin-gallery-card-empty" style={{ cursor: 'pointer' }}>
                              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                                if (e.target.files?.[0]) handleFileUpload(e.target.files[0], slot);
                              }} />
                              <div style={{ textAlign: 'center' }}>
                                <Upload size={20} style={{ marginBottom: '4px' }} />
                                <div style={{ fontSize: '0.7rem' }}>Subir imagen</div>
                              </div>
                            </label>
                          )}

                          {/* Body */}
                          <div className="admin-gallery-card-body">
                            <div className="admin-gallery-card-name">{slot.label}</div>
                            <div className="admin-gallery-card-meta">
                              <span className="admin-gallery-card-size">{slot.size}</span>
                              <span className="admin-badge" style={imgVal && slot.optimized
                                ? { background: 'var(--admin-success-subtle)', color: 'var(--admin-success)', border: '1px solid rgba(45,106,79,0.15)', fontSize: '0.55rem', padding: '1px 5px' }
                                : imgVal 
                                  ? { background: 'rgba(245,158,11,0.08)', color: '#D97706', border: '1px solid rgba(245,158,11,0.15)', fontSize: '0.55rem', padding: '1px 5px' }
                                  : { background: 'var(--admin-surface-hover)', color: 'var(--admin-text-muted)', border: '1px solid var(--admin-border)', fontSize: '0.55rem', padding: '1px 5px' }
                              }>
                                {imgVal ? (slot.optimized ? 'Optimizado' : 'Pendiente') : 'Vacío'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="admin-gallery-list">
                    {filteredSlots.map(slot => {
                      const isPortfolio = slot.key.startsWith('portfolio.');
                      const imgIndex = isPortfolio ? parseInt(slot.key.split('.')[1]) : undefined;
                      const imgVal = isPortfolio ? (images.portfolio || [])[imgIndex] : images[slot.key];

                      return (
                        <div key={slot.key} className="admin-gallery-row">
                          {imgVal ? (
                            <img src={imgVal} alt={slot.label} className="admin-gallery-row-thumb" />
                          ) : (
                            <div className="admin-gallery-row-thumb" style={{ background: 'var(--admin-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <ImageIcon size={16} color="var(--admin-text-muted)" />
                            </div>
                          )}
                          <div>
                            <div className="admin-gallery-row-name">{slot.label}</div>
                            <div className="admin-gallery-row-path">{slot.key}</div>
                          </div>
                          <div className="admin-gallery-row-size">{slot.size}</div>
                          <div>
                            <span className="admin-badge" style={imgVal && slot.optimized
                              ? { background: 'var(--admin-success-subtle)', color: 'var(--admin-success)', border: '1px solid rgba(45,106,79,0.15)', fontSize: '0.6rem' }
                              : imgVal
                                ? { background: 'rgba(245,158,11,0.08)', color: '#D97706', border: '1px solid rgba(245,158,11,0.15)', fontSize: '0.6rem' }
                                : { background: 'var(--admin-surface-hover)', color: 'var(--admin-text-muted)', border: '1px solid var(--admin-border)', fontSize: '0.6rem' }
                            }>
                              {imgVal ? (slot.optimized ? 'Optimizado' : 'Pendiente') : 'Vacío'}
                            </span>
                          </div>
                          <div className="admin-gallery-row-actions">
                            <label className="admin-gallery-action-btn" title="Reemplazar" style={{ opacity: 1 }}>
                              <Edit3 size={13} />
                              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                                if (e.target.files?.[0]) handleFileUpload(e.target.files[0], slot);
                              }} />
                            </label>
                            {imgVal && (
                              <button className="admin-gallery-action-btn admin-gallery-action-btn--danger" title="Eliminar" style={{ opacity: 1 }} onClick={() => {
                                if (isPortfolio) updateImage('portfolio', null, imgIndex);
                                else updateImage(slot.key, null);
                              }}>
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }

      case 'inbox': {
        const unreadCount = inbox.filter(m => !m.read).length;

        const filteredInbox = inbox.filter(m => {
          const matchesSearch = !inboxSearch || 
            m.name?.toLowerCase().includes(inboxSearch.toLowerCase()) ||
            m.email?.toLowerCase().includes(inboxSearch.toLowerCase()) ||
            m.message?.toLowerCase().includes(inboxSearch.toLowerCase());
          const matchesFilter = inboxFilter === 'all' || 
            (inboxFilter === 'unread' && !m.read) ||
            (inboxFilter === 'read' && m.read);
          return matchesSearch && matchesFilter;
        });

        const selected = selectedMsg ? inbox.find(m => m.id === selectedMsg) : null;

        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="admin-section-title" style={{ border: 'none', marginBottom: 0, paddingBottom: 0 }}>
                <Mail size={20} color="var(--admin-accent)" /> Bandeja de Entrada
              </h3>
              {unreadCount > 0 && (
                <span style={{ background: '#C2703E', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>
                  {unreadCount} sin leer
                </span>
              )}
            </div>

            {inbox.length === 0 ? (
              <div className="admin-card admin-inbox-empty">
                <Mail size={56} color="var(--admin-border)" style={{ marginBottom: '1rem' }} />
                <p style={{ fontFamily: 'var(--admin-font-display)', fontSize: '1.125rem', fontWeight: '700', color: 'var(--admin-text)', marginBottom: '0.5rem' }}>Tu bandeja está vacía</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>Los mensajes del formulario de contacto aparecerán aquí.</p>
              </div>
            ) : (
              <div className="admin-inbox-layout">
                {/* ── Left: Message List ── */}
                <div className="admin-inbox-list" style={{ paddingRight: '1.5rem' }}>
                  {/* Search */}
                  <div className="admin-inbox-search">
                    <Search size={15} className="admin-inbox-search-icon" />
                    <input
                      className="admin-input"
                      placeholder="Buscar mensajes..."
                      value={inboxSearch}
                      onChange={e => setInboxSearch(e.target.value)}
                      style={{ paddingLeft: '36px' }}
                    />
                  </div>

                  {/* Filters */}
                  <div className="admin-inbox-filters">
                    {[
                      { key: 'all', label: 'Todos' },
                      { key: 'unread', label: 'Sin leer' },
                      { key: 'read', label: 'Leídos' },
                    ].map(f => (
                      <button
                        key={f.key}
                        className={`admin-inbox-filter-btn ${inboxFilter === f.key ? 'admin-inbox-filter-btn--active' : ''}`}
                        onClick={() => setInboxFilter(f.key)}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Message Cards */}
                  {filteredInbox.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '2rem', fontSize: '0.875rem' }}>
                      No hay mensajes que coincidan
                    </p>
                  ) : (
                    filteredInbox.map(msg => (
                      <div
                        key={msg.id}
                        className={`admin-inbox-item ${selectedMsg === msg.id ? 'admin-inbox-item--active' : ''} ${!msg.read ? 'admin-inbox-item--unread' : ''}`}
                        onClick={() => { setSelectedMsg(msg.id); if (!msg.read) markMessageRead(msg.id); }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                          <span className="admin-inbox-item-name">{msg.name}</span>
                          <span className="admin-badge" style={!msg.read 
                            ? { background: 'rgba(194,112,62,0.1)', color: '#C2703E', border: '1px solid rgba(194,112,62,0.2)', fontSize: '0.6rem' }
                            : { background: 'var(--admin-surface-hover)', color: 'var(--admin-text-muted)', border: '1px solid var(--admin-border)', fontSize: '0.6rem' }
                          }>
                            {!msg.read ? 'Pendiente' : 'Leído'}
                          </span>
                        </div>
                        <div className="admin-inbox-item-snippet">{msg.message?.substring(0, 80)}...</div>
                        <div className="admin-inbox-item-date">{new Date(msg.date).toLocaleDateString()} {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    ))
                  )}
                </div>

                {/* ── Right: Message Detail ── */}
                <div className="admin-inbox-view" style={{ display: 'flex', flexDirection: 'column' }}>
                  {selected ? (
                    <>
                      {/* Header */}
                      <div className="admin-inbox-detail-header">
                        <div className="admin-inbox-avatar">
                          {selected.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <div className="admin-inbox-detail-name">{selected.name}</div>
                          <div className="admin-inbox-detail-email">{selected.email}</div>
                          <div className="admin-inbox-detail-date">{new Date(selected.date).toLocaleDateString()} • {new Date(selected.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="admin-inbox-action-bar">
                        <button className="admin-inbox-reply-btn" onClick={() => window.open(`mailto:${selected.email}?subject=Re: Tu mensaje en Café Aromático&body=Hola ${selected.name},%0A%0A`, '_blank')}>
                          <Mail size={14} /> Responder
                        </button>
                        <button className="admin-btn-danger" onClick={() => { if (confirm(`¿Eliminar mensaje de ${selected.name}?`)) { deleteMessage(selected.id); setSelectedMsg(null); } }}>
                          <Trash2 size={14} /> Eliminar
                        </button>
                        <div style={{ marginLeft: 'auto' }}>
                          <button className="admin-btn" style={{ padding: '0.5rem 0.75rem' }}>⋯</button>
                        </div>
                      </div>

                      {/* Message Body */}
                      <div className="admin-inbox-body-card">
                        {selected.message}
                      </div>

                      {/* Meta Footer */}
                      <div className="admin-inbox-meta">
                        <div className="admin-inbox-meta-item">
                          <div className="admin-inbox-avatar admin-inbox-avatar--sm">A</div>
                          <span>Visto por: Admin</span>
                        </div>
                        <span className="admin-inbox-priority">Normal</span>
                      </div>
                    </>
                  ) : (
                    <div className="admin-inbox-empty" style={{ flex: 1 }}>
                      <Mail size={40} color="var(--admin-border)" style={{ marginBottom: '1rem', opacity: 0.3 }} />
                      <p style={{ fontSize: '0.9375rem', color: 'var(--admin-text-muted)', fontFamily: 'var(--admin-font-display)' }}>Seleccioná un mensaje para verlo</p>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-muted)', marginTop: '0.25rem' }}>Elegí uno de la lista de la izquierda</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      }

      default: return null;
    }
  };

  return (
    <div className="admin-layout">

      {/* ── Sidebar ─────────────────────────── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <div className="admin-sidebar-logo-icon">
            <Coffee size={18} />
          </div>
          <span className="admin-sidebar-logo-text">Café Aromático</span>
        </div>

        {/* Dashboard - standalone top item */}
        <ul className="admin-sidebar-nav" style={{ padding: '0 0.5rem', marginBottom: '0.5rem' }}>
          <li
            className={`admin-sidebar-item ${active === sidebarTopItem.id ? 'admin-sidebar-item--active' : ''}`}
            onClick={() => setActive(sidebarTopItem.id)}
          >
            {sidebarTopItem.icon} {sidebarTopItem.label}
          </li>
        </ul>

        {sidebarCategories.map(cat => (
          <div key={cat.label}>
            <div className="admin-sidebar-category">
              <span className="admin-sidebar-category-label">{cat.label}</span>
            </div>
            <ul className="admin-sidebar-nav">
              {cat.items.map(s => (
                <li
                  key={s.id}
                  className={`admin-sidebar-item ${active === s.id ? 'admin-sidebar-item--active' : ''}`}
                  onClick={() => setActive(s.id)}
                >
                  {s.icon} {s.label}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="admin-sidebar-user">
          <div className="admin-sidebar-user-info">
            <div className="admin-sidebar-avatar">A</div>
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--admin-sidebar-text)' }}>Admin</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--admin-sidebar-text-muted)' }}>Conectado</p>
            </div>
          </div>
          <button className="admin-sidebar-logout" onClick={logout}>Salir</button>
        </div>
      </aside>

      {/* ── Main Layout ──────────────────────── */}
      <div className="admin-main">
        {/* Top Bar */}
        <div className="admin-topbar">
          <div>
            <h1 className="admin-topbar-title">Panel de Administración</h1>
            <p className="admin-topbar-subtitle">Edita cualquier cosa → Guarda → Los cambios persisten.</p>
          </div>
          <div className="admin-topbar-actions">
            <button className="admin-btn" onClick={() => setSplitView(!splitView)}>
              <Columns size={15} /> {splitView ? 'Cerrar Vista Previa' : 'Vista Dividida'}
            </button>
            <button className="admin-btn" onClick={() => { if(confirm('¿Estás seguro?')) resetContent(); }}>
              <RotateCcw size={15} /> Reset
            </button>
            <a href="/" target="_blank" rel="noreferrer" className="admin-btn">
              <Eye size={15} /> Ver Sitio
            </a>
            <button className="admin-btn-primary" onClick={saveContent}>
              <Save size={17} /> Guardar
            </button>
          </div>
        </div>

        {/* Editor Panel */}
        <div className="admin-editor-card">
          {renderSection()}
        </div>

        {/* Live Preview Iframe */}
        {splitView && (
          <div style={{ marginTop: '1.5rem', background: '#fff', borderRadius: 'var(--admin-radius)', border: '1px solid var(--admin-border)', overflow: 'hidden', position: 'relative', height: '500px' }}>
            <iframe src="/" style={{ width: '100%', height: '100%', border: 'none' }} title="Vista Previa" />
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      <div className="admin-toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`admin-toast admin-toast--${t.type}`}>
            {t.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
});

Admin.displayName = 'Admin';

export default Admin;
