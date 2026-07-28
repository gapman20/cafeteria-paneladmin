import React, { memo, useState, useCallback, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Coffee, Leaf, Globe, ChevronDown, ArrowRight,
  Gift, Truck, Star,
} from 'lucide-react';
import { useProducts } from '../hooks';
import { useSite } from '../context/SiteContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import SEO from '../components/SEO';
import RomaBrewHero from '../components/RomaBrewHero';

// ── Data arrays (outside component to avoid re-creation) ─────────────────────

const features = [
  {
    Icon: Coffee,
    title: 'Café de Especialidad',
    desc: 'Solo los mejores granos de origen único, seleccionados directamente en fincas de Colombia, Etiopía y Guatemala.',
  },
  {
    Icon: Leaf,
    title: 'Tueste Artesanal',
    desc: 'Tostamos en pequeños lotes cada semana para garantizar frescura y resaltar las notas únicas de cada origen.',
  },
  {
    Icon: Globe,
    title: 'Baristas Certificados',
    desc: 'Nuestro equipo domina cada método de preparación: espresso, pour over, cold brew, Aeropress y más.',
  },
];

const services = [
  {
    emoji: '\u2615',
    title: 'Cata de Origen',
    desc: 'Degusta cafés de diferentes regiones y descubre perfiles de sabor únicos en sesiones guiadas por expertos.',
  },
  {
    emoji: '\uD83C\uDF93',
    title: 'Taller de Barismo',
    desc: 'Aprende técnicas profesionales de preparación: latte art, pour over, espresso y más.',
  },
  {
    emoji: '\uD83D\uDCE6',
    title: 'Suscripción Mensual',
    desc: 'Recibe café fresco tostado cada mes directamente en tu puerta con selecciones curadas.',
  },
];

// The testimonials are now dynamic and fetched from SiteContext

const faqData = [
  {
    q: '¿Cuál es el tiempo de entrega?',
    a: 'Realizamos entregas de lunes a sábado en la CDMX y área metropolitana. Los pedidos realizados antes de las 2:00 PM se entregan al día siguiente. Para el resto del país, el envío toma de 3 a 5 días hábiles.',
  },
  {
    q: '¿Cómo puedo reservar una mesa?',
    a: 'Puedes reservar directamente por WhatsApp o a través de nuestra página de contacto. Aceptamos reservaciones para grupos de hasta 12 personas. Para eventos privados o catas personalizadas, contáctanos con al menos una semana de anticipación.',
  },
  {
    q: '¿De dónde viene su café?',
    a: 'Trabajamos directamente con fincas en Colombia, Etiopía, Guatemala y México. Cada origen se selecciona por su perfil de sabor único y se tuesta en lotes pequeños cada semana para garantizar la máxima frescura.',
  },
  {
    q: '¿Qué incluye la Suscripción Premium?',
    a: 'La suscripción incluye mensualmente una bolsa de café de origen rotatorio (250g), acceso a catas exclusivas, preventas de ediciones limitadas, envío gratuito y acumulación de puntos de fidelidad canjeables en tienda.',
  },
  {
    q: '¿Puedo cancelar o pausar mi suscripción?',
    a: 'Sí, puedes pausar o cancelar en cualquier momento desde tu cuenta o contactándonos por WhatsApp. No hay penalizaciones ni permanencia mínima. Si pausas, conservas todos tus puntos acumulados.',
  },
  {
    q: '¿Ofrecen capacitación para baristas?',
    a: 'Sí, organizamos talleres mensuales de preparación de café: latte art, pour over, cold brew y más. También ofrecemos certificaciones para profesionales. Consulta nuestro calendario de eventos para las próximas fechas.',
  },
];

const subscriptionBenefits = [
  { Icon: Coffee, title: 'Catas Mensuales', desc: 'Degusta orígenes exclusivos antes que nadie en sesiones privadas con nuestro master roaster.' },
  { Icon: Gift, title: 'Preventas VIP', desc: 'Acceso anticipado a ediciones limitadas y lotes especiales con precio preferente.' },
  { Icon: Truck, title: 'Envío Gratuito', desc: 'Recibe tu café en la puerta de tu casa sin costo en todos los pedidos mensuales.' },
  { Icon: Star, title: 'Puntos de Fidelidad', desc: 'Acumula puntos canjeables por productos, experiencias y eventos exclusivos.' },
];

// ── Component ────────────────────────────────────────────────────────────────

const Home = memo(() => {
  const { content: siteContent, addHomeTestimonial } = useSite();
  const { products } = useProducts();
  const navigate = useNavigate();
  const h = siteContent.home || {};
  const [openFaq, setOpenFaq] = useState(null);
  
  // Testimonial Form State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', role: '', text: '' });
  const [reviewSent, setReviewSent] = useState(false);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.text) return;
    addHomeTestimonial(reviewForm);
    setReviewSent(true);
    setReviewForm({ name: '', role: '', text: '' });
    setTimeout(() => {
      setReviewSent(false);
      setShowReviewModal(false);
    }, 2000);
  };
  const [searchParams] = useSearchParams();
  const mesa = searchParams.get('mesa');

  useEffect(() => {
    if (mesa) {
      navigate(`/pedir?mesa=${mesa}`, { replace: true });
    }
  }, [mesa, navigate]);

  // Scroll reveal hooks — one per section
  const featuresReveal = useScrollReveal();
  const shopReveal = useScrollReveal();
  const historiaReveal = useScrollReveal();
  const serviciosReveal = useScrollReveal();
  const testimonialsReveal = useScrollReveal();
  const faqReveal = useScrollReveal();
  const premiumReveal = useScrollReveal();

  const toggleFaq = useCallback((index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  }, []);

  return (
    <div className="home-luxury">
      <SEO
        title="Inicio"
        description={h.subtitle || "Café de especialidad recién tostado. Espresso, cold brew, pour over y repostería artesanal."}
      />

      {/* ── Hero (DO NOT MODIFY) ──────────────────────────────────────────── */}
      <RomaBrewHero title={h.heroTitle} description={h.heroDescription} />

      {/* ── Features — Restyled ───────────────────────────────────────────── */}
      <section
        className={`home-section home-section--cream sr ${featuresReveal.isVisible ? 'sr--visible' : ''}`}
        ref={featuresReveal.ref}
      >
        <div className="lux-container">
          <h2 className={`lux-section-title sr-title ${featuresReveal.isVisible ? 'sr-title--visible' : ''}`}>Lo Que Nos Hace Únicos</h2>
          <p className="lux-section-subtitle">
            No servimos café común. Preparamos experiencias que conectan
            origen, proceso y pasión en cada sorbo.
          </p>
          <div className={`lux-features-grid sr-stagger ${featuresReveal.isVisible ? 'sr-stagger--visible' : ''}`}>
            {features.map((feat, i) => (
              <div key={i} className="lux-feature-card sr-child">
                <div className="lux-feature-icon">
                  <feat.Icon size={24} />
                </div>
                <h3 className="lux-feature-title">{feat.title}</h3>
                <p className="lux-feature-desc">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick Shop — Redesigned ───────────────────────────────────────── */}
      <section
        className={`home-section home-section--cream sr ${shopReveal.isVisible ? 'sr--visible' : ''}`}
        ref={shopReveal.ref}
      >
        <div className="lux-container">
          <h2 className={`lux-section-title sr-title ${shopReveal.isVisible ? 'sr-title--visible' : ''}`}>Nuestros Productos Estrella</h2>
          <p className="lux-section-subtitle">
            Lo mejor de nuestra selección artesanal, listo para llegar a tu puerta.
          </p>
          <div className={`lux-shop-grid sr-stagger ${shopReveal.isVisible ? 'sr-stagger--visible' : ''}`}>
            {products.filter(p => p.active).map((product) => (
              <div 
                key={product.id} 
                className="lux-shop-card sr-child"
                onClick={() => navigate(`/pedir?featured=${encodeURIComponent(product.id)}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="lux-shop-card-image-wrap">
                  {product.tag && (
                    <span className="lux-shop-badge">{product.tag}</span>
                  )}
                  <img
                    className="lux-shop-card-image"
                    src={product.image || 'https://via.placeholder.com/600x800?text=Sin+Imagen'}
                    alt={product.name}
                    loading="lazy"
                  />
                </div>
                <div className="lux-shop-card-info">
                  <h3 className="lux-shop-card-name">{product.name}</h3>
                  <span className="lux-shop-card-price">
                    <span className="lux-currency">$</span>{product.price}{' '}
                    <span className="lux-currency">MXN</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="lux-shop-cta">
            <Link to="/menu" className="lux-btn">
              Ver Tienda Completa <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Nuestra Historia — New (dark) ─────────────────────────────────── */}
      <section
        className={`home-section home-section--dark sr ${historiaReveal.isVisible ? 'sr--visible' : ''}`}
        ref={historiaReveal.ref}
      >
        <div className="lux-container">
          <div className="lux-about-grid">
            <div className="lux-about-text">
              <h2 className={`lux-section-title lux-section-title--light sr-title ${historiaReveal.isVisible ? 'sr-title--visible' : ''}`}>
                Nuestra Historia
              </h2>
              <p className="lux-about-paragraph">
                Desde 2018, Café Aromático nació de un sueño simple: traer el café
                de especialidad más excepcional de Latinoamérica a las mesas de la
                Ciudad de México. Comenzamos como un pequeño tueste artesanal en la
                colonia Roma, con apenas una tostadora y una pasión inquebrantable
                por la calidad.
              </p>
              <p className="lux-about-paragraph">
                Hoy, trabajamos directamente con fincas en Colombia, Etiopía,
                Guatemala y México, seleccionando cuidadosamente cada lote por su
                perfil de sabor único. Nuestro equipo de baristas certificados domina
                las técnicas más exigentes del mundo cafetero, transformando cada
                grano en una experiencia sensorial incomparable.
              </p>
              <p className="lux-about-paragraph">
                Cada taza que servimos cuenta una historia — de origen, de proceso,
                de pasión. No solo servimos café; conectamos personas con la arte y
                ciencia detrás de cada sorbo perfecto.
              </p>
            </div>
            <div className={`lux-about-visual sr-zoom ${historiaReveal.isVisible ? 'sr-zoom--visible' : ''}`}>
              <svg
                viewBox="0 0 400 500"
                className="lux-about-svg"
                aria-hidden="true"
              >
                {/* Large coffee bean */}
                <ellipse
                  cx="200" cy="220" rx="90" ry="140"
                  style={{ fill: 'var(--lux-caramel-glow, rgba(141,85,36,0.12))' }}
                  transform="rotate(-25 200 220)"
                />
                <ellipse
                  cx="200" cy="220" rx="85" ry="135"
                  fill="none"
                  style={{ stroke: 'color-mix(in srgb, var(--accent-primary, #8D5524) 18%, transparent)' }}
                  strokeWidth="1.5"
                  transform="rotate(-25 200 220)"
                />
                <path
                  d="M200 95 Q195 160 200 220 Q205 280 200 345"
                  fill="none"
                  style={{ stroke: 'color-mix(in srgb, var(--accent-primary, #8D5524) 15%, transparent)' }}
                  strokeWidth="1.5"
                  transform="rotate(-25 200 220)"
                />
                {/* Small decorative bean */}
                <ellipse
                  cx="320" cy="120" rx="35" ry="55"
                  style={{ fill: 'color-mix(in srgb, var(--accent-primary, #8D5524) 8%, transparent)' }}
                  transform="rotate(15 320 120)"
                />
                <ellipse
                  cx="320" cy="120" rx="30" ry="50"
                  fill="none"
                  style={{ stroke: 'color-mix(in srgb, var(--accent-primary, #8D5524) 12%, transparent)' }}
                  strokeWidth="1"
                  transform="rotate(15 320 120)"
                />
                {/* Accent circles */}
                <circle cx="80" cy="400" r="50" style={{ fill: 'color-mix(in srgb, var(--accent-primary, #8D5524) 5%, transparent)' }} />
                <circle cx="350" cy="380" r="35" style={{ fill: 'color-mix(in srgb, var(--accent-primary, #8D5524) 4%, transparent)' }} />
                <circle cx="60" cy="150" r="25" style={{ fill: 'color-mix(in srgb, var(--accent-primary, #8D5524) 6%, transparent)' }} />
                {/* Small bean bottom-left */}
                <ellipse
                  cx="100" cy="350" rx="28" ry="42"
                  style={{ fill: 'color-mix(in srgb, var(--accent-primary, #8D5524) 7%, transparent)' }}
                  transform="rotate(-40 100 350)"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── Servicios — New ───────────────────────────────────────────────── */}
      <section
        className={`home-section home-section--cream sr ${serviciosReveal.isVisible ? 'sr--visible' : ''}`}
        ref={serviciosReveal.ref}
      >
        <div className="lux-container">
          <h2 className={`lux-section-title sr-title ${serviciosReveal.isVisible ? 'sr-title--visible' : ''}`}>Nuestros Servicios</h2>
          <p className="lux-section-subtitle">
            Más que un café, una experiencia completa para tu paladar y tu conocimiento.
          </p>
          <div className={`lux-services-grid sr-stagger ${serviciosReveal.isVisible ? 'sr-stagger--visible' : ''}`}>
            {services.map((service, i) => (
              <div key={i} className="lux-service-card sr-child">
                <div className="lux-service-emoji">{service.emoji}</div>
                <h3 className="lux-service-title">{service.title}</h3>
                <p className="lux-service-desc">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials — New (dark) ─────────────────────────────────────── */}
      <section
        className={`home-section home-section--dark sr ${testimonialsReveal.isVisible ? 'sr--visible' : ''}`}
        ref={testimonialsReveal.ref}
      >
        <div className="lux-container">
          <h2 className={`lux-section-title lux-section-title--light sr-title ${testimonialsReveal.isVisible ? 'sr-title--visible' : ''}`}>
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="lux-section-subtitle lux-section-subtitle--light">
            Historias reales de personas que encontraron su café perfecto.
          </p>
          <div className={`lux-testimonials-marquee-wrapper sr-stagger ${testimonialsReveal.isVisible ? 'sr-stagger--visible' : ''}`}>
            <div className="lux-testimonials-marquee">
              {[...(h.testimonials || []), ...(h.testimonials || [])].map((t, i) => (
                <div key={i} className="lux-testimonial-card sr-child">
                  <div className="lux-testimonial-quote">&ldquo;</div>
                  <p className="lux-testimonial-text">{t.text}</p>
                  <div className="lux-testimonial-author">
                    <div className="lux-testimonial-avatar">
                      {t.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <span className="lux-testimonial-name">{t.name}</span>
                      <span className="lux-testimonial-role">{t.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <button 
              className="lux-btn" 
              onClick={() => setShowReviewModal(true)}
              style={{ background: 'transparent', border: '1px solid var(--lux-accent)', color: 'var(--lux-accent)' }}
            >
              Déjanos tu Reseña
            </button>
          </div>
        </div>
      </section>

      {/* Review Modal */}
      {showReviewModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem', backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: 'var(--color-surface)', padding: '2rem', borderRadius: '12px',
            border: '1px solid var(--color-border)', width: '100%', maxWidth: '400px',
            position: 'relative', animation: 'fadeInUp 0.3s ease forwards'
          }}>
            <button 
              onClick={() => setShowReviewModal(false)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--color-text)', fontSize: '1.2rem', cursor: 'pointer' }}
            >
              &times;
            </button>
            <h3 style={{ color: 'var(--color-text)', textAlign: 'center', marginBottom: '1.5rem', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Tu Reseña</h3>
            <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder="Tu Nombre *" required value={reviewForm.name} onChange={e => setReviewForm({...reviewForm, name: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)' }} />
              <input type="text" placeholder="Tu Ocupación (opcional)" value={reviewForm.role} onChange={e => setReviewForm({...reviewForm, role: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)' }} />
              <textarea placeholder="Cuéntanos tu experiencia... *" required rows="4" value={reviewForm.text} onChange={e => setReviewForm({...reviewForm, text: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', resize: 'vertical' }} />
              <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', justifyContent: 'center', background: reviewSent ? '#10b981' : '' }}>
                {reviewSent ? '¡Enviado!' : 'Publicar Reseña'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── FAQ — Restyled ────────────────────────────────────────────────── */}
      <section
        className={`home-section home-section--cream sr ${faqReveal.isVisible ? 'sr--visible' : ''}`}
        ref={faqReveal.ref}
      >
        <div className="lux-container lux-container--narrow">
          <h2 className={`lux-section-title sr-title ${faqReveal.isVisible ? 'sr-title--visible' : ''}`}>Preguntas Frecuentes</h2>
          <p className="lux-section-subtitle">
            Todo lo que necesitas saber antes de tu primera visita o tu primera
            suscripción.
          </p>
          <div className="lux-faq-list">
            {faqData.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className={`lux-faq-item${isOpen ? ' lux-faq-item--open' : ''}`}
                >
                  <button
                    className="lux-faq-question"
                    onClick={() => toggleFaq(i)}
                    aria-expanded={isOpen}
                  >
                    <span className="lux-faq-question-text">{item.q}</span>
                    <ChevronDown
                      size={20}
                      className={`lux-faq-chevron${isOpen ? ' lux-faq-chevron--open' : ''}`}
                    />
                  </button>
                  <div
                    className={`lux-faq-answer-wrap${isOpen ? ' lux-faq-answer-wrap--open' : ''}`}
                  >
                    <div className="lux-faq-answer-inner">
                      <p className="lux-faq-answer">{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Suscripción Premium — Redesigned (darkest) ────────────────────── */}
      <section
        className={`home-section home-section--darkest sr ${premiumReveal.isVisible ? 'sr--visible' : ''}`}
        ref={premiumReveal.ref}
      >
        <div className="lux-container">
          <h2 className={`lux-section-title lux-section-title--light sr-title ${premiumReveal.isVisible ? 'sr-title--visible' : ''}`}>
            Suscripción Premium
          </h2>
          <p className="lux-section-subtitle lux-section-subtitle--light">
            Únete al círculo de verdaderos amantes del café y desbloquea
            beneficios que transformarán tu experiencia diaria.
          </p>
          <div className="lux-sub-card">
            <div className="lux-sub-benefits">
              {subscriptionBenefits.map((b, i) => (
                <div key={i} className="lux-sub-benefit">
                  <div className="lux-sub-benefit-icon">
                    <b.Icon size={20} />
                  </div>
                  <div>
                    <h4 className="lux-sub-benefit-title">{b.title}</h4>
                    <p className="lux-sub-benefit-desc">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="lux-sub-cta">
              <div className="lux-sub-price">
                <span className="lux-sub-amount">$299</span>
                <span className="lux-sub-period">/mes</span>
              </div>
              <p className="lux-sub-cta-desc">
                Cancela cuando quieras. Sin compromisos, solo café excepcional
                cada mes.
              </p>
              <Link to="/menu" className="lux-btn lux-btn--glow">
                Suscribirme Ahora
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

Home.displayName = 'Home';

export default Home;
