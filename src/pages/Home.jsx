import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Coffee, Leaf, Globe, MapPin, Heart, Clock, ChevronRight } from 'lucide-react';
import { useContent, useImages } from '../hooks';
import SEO from '../components/SEO';

const featureIcons = [Coffee, Leaf, Globe];
const serviceIcons = [Coffee, MapPin, Heart, Clock];

const Home = memo(() => {
  const { content } = useContent();
  const { images } = useImages();
  const h = content.home;

  return (
    <div className="home-page">
      <SEO 
        title="Inicio" 
        description={h.subtitle || "Café de especialidad recién tostado. Espresso, cold brew, pour over y repostería artesanal."} 
      />

      {/* Hero */}
      <section className="home-hero" style={{ backgroundImage: images.heroBg ? `url(${images.heroBg})` : 'none' }}>
        {images.heroBg && <div className="hero-overlay"></div>}
        <div className="animate-fade-up hero-content-wrapper">
          <div className="hero-badge">{h.badge}</div>
          <h1 className="h1-premium hero-title">
            {h.title} <br />
            <span className="text-gradient">{h.titleAccent}</span>
          </h1>
          <p className="subtitle hero-subtitle">{h.subtitle}</p>
          <div className="hero-buttons">
            <Link to="/menu" className="btn-primary">
              {h.ctaText} <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn-outline">{h.ctaSecondary}</Link>
          </div>
        </div>
        <div className="hero-steam" aria-hidden="true"></div>
      </section>



      {/* Features */}
      <section className="home-features">
        <div className="container">
          <div className="features-header">
            <h2 className="h2-premium">Lo Que Nos Hace Únicos</h2>
            <p className="subtitle">No servimos café común. Preparamos experiencias que conectan origen, proceso y pasión en cada sorbo.</p>
          </div>
          <div className="features-grid">
            {[
              { title: 'Café de Especialidad', desc: 'Solo los mejores granos de origen único, seleccionados directamente en fincas de Colombia, Etiopía y Guatemala.' },
              { title: 'Tueste Artesanal', desc: 'Tostamos en pequeños lotes cada semana para garantizar frescura y resaltar las notas únicas de cada origen.' },
              { title: 'Baristas Certificados', desc: 'Nuestro equipo domina cada método de preparación: espresso, pour over, cold brew, Aeropress y más.' }
            ].map((feat, i) => {
              const Icon = featureIcons[i];
              return (
                <div key={i} className={`glass-card animate-fade-up delay-${(i + 1) * 100}`}>
                  <div className="icon-wrapper"><Icon size={22} /></div>
                  <h3 className="feature-title">{feat.title}</h3>
                  <p>{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="home-services">
        <div className="container">
          <div className="services-header">
            <h2 className="h2-premium">{h.techTitle || 'Nuestros Métodos'}</h2>
            <p className="subtitle">{h.techSubtitle || 'Dominamos las técnicas más exigentes del mundo cafetero.'}</p>
          </div>
          <div className="services-grid">
            {content.services.cards.filter(s => s.active).map((service, i) => {
              const Icon = serviceIcons[i] || Coffee;
              return (
                <Link to="/menu" key={service.id} className="service-card">
                  <div className="service-icon"><Icon size={24} /></div>
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                  <span className="service-link">Ver más <ChevronRight size={16} /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="home-process">
        <div className="container">
          <div className="process-header">
            <h2 className="h2-premium">{h.processTitle}</h2>
            <p className="subtitle">{h.processSubtitle}</p>
          </div>
          <div className="process-grid">
            {h.steps?.map((step, i) => (
              <div key={i} className="process-step">
                <span className="step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="home-testimonials">
        <div className="container">
          <div className="testimonials-header">
            <h2 className="h2-premium">{h.testimonialsTitle}</h2>
            <p className="subtitle">{h.testimonialsSubtitle}</p>
          </div>
          <div className="testimonials-grid">
            {h.testimonials?.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-quote">"</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.name.charAt(0)}</div>
                  <div>
                    <span className="testimonial-name">{t.name}</span>
                    <span className="testimonial-role">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="home-cta-section">
        <div className="home-cta-card">
          <h2 className="h2-premium cta-title">{h.ctaSectionTitle}</h2>
          <p className="subtitle cta-subtitle">{h.ctaSectionSubtitle}</p>
          <Link to="/menu" className="btn-primary cta-button">Ver Nuestro Menú</Link>
        </div>
      </section>
    </div>
  );
});

Home.displayName = 'Home';

export default Home;
