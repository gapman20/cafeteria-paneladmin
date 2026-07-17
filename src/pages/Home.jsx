import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Leaf, Globe, MapPin, Heart, Clock, ChevronRight } from 'lucide-react';
import { useContent } from '../hooks';
import SEO from '../components/SEO';
import CoffeeCarousel from '../components/CoffeeCarousel';

/* eslint-disable react/prop-types */

const featureIcons = [Coffee, Leaf, Globe];
const serviceIcons = [Coffee, MapPin, Heart, Clock];

const Home = memo(() => {
  const { content } = useContent();
  const h = content.home;

  return (
    <div className="home-page">
      <SEO 
        title="Inicio" 
        description={h.subtitle || "Café de especialidad recién tostado. Espresso, cold brew, pour over y repostería artesanal."} 
      />

      {/* Hero — Immersive 3D Coffee Carousel */}
      <CoffeeCarousel />

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

      {/* Gallery / Visual Showcase */}
      <section className="home-gallery">
        <div className="container">
          <div className="gallery-header">
            <h2 className="h2-premium">Nuestro Espacio</h2>
            <p className="subtitle">Un ambiente cálido diseñado para que disfrutes cada momento con tu café favorito.</p>
          </div>
          <div className="gallery-grid">
            {[
              { emoji: '☕', label: 'Espresso Perfecto' },
              { emoji: '🫘', label: 'Granos Frescos' },
              { emoji: '🧁', label: 'Repostería Artesanal' },
              { emoji: '🌿', label: 'Ambiente Acogedor' },
              { emoji: '📖', label: 'Rincón de Lectura' },
              { emoji: '🎵', label: 'Música en Vivo' },
            ].map((item, i) => (
              <div key={i} className="gallery-item">
                <div className="gallery-emoji">{item.emoji}</div>
                <span className="gallery-label">{item.label}</span>
              </div>
            ))}
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
              <div key={i} className={`testimonial-card ${i === 0 ? 'testimonial-featured' : ''}`}>
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

      {/* Location & Hours */}
      <section className="home-location">
        <div className="container">
          <div className="location-grid">
            <div className="location-info">
              <h2 className="h2-premium">Encuéntranos</h2>
              <p className="subtitle" style={{ textAlign: 'left', maxWidth: '100%' }}>Visítanos y descubre por qué somos el lugar favorito de los amantes del café en la ciudad.</p>
              
              <div className="location-details">
                <div className="location-item">
                  <MapPin size={20} className="location-icon" />
                  <div>
                    <strong>Dirección</strong>
                    <p>{content.contact?.address || 'Calle Principal #123, Colonia Centro, CDMX'}</p>
                  </div>
                </div>
                <div className="location-item">
                  <Clock size={20} className="location-icon" />
                  <div>
                    <strong>Horario</strong>
                    <p>Lunes a Sábado: 8:00am - 8:00pm</p>
                    <p>Domingos: 9:00am - 6:00pm</p>
                  </div>
                </div>
                <div className="location-item">
                  <Coffee size={20} className="location-icon" />
                  <div>
                    <strong>Contacto</strong>
                    <p>{content.contact?.email || 'hola@cafearomatico.com'}</p>
                    <p>{content.contact?.whatsapp || '+52 (55) 1234-5678'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="location-map">
              <div className="map-placeholder">
                <MapPin size={48} />
                <p>Mapa interactivo</p>
                <span>Próximamente con Google Maps</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="home-cta-section">
        <div className="container">
          <div className="home-cta-card">
            <h2 className="h2-premium cta-title">{h.ctaSectionTitle}</h2>
            <p className="subtitle cta-subtitle">{h.ctaSectionSubtitle}</p>
            <div className="cta-buttons">
              <Link to="/menu" className="btn-primary cta-button">Ver Nuestro Menú</Link>
              <a href={`https://wa.me/${(content.contact?.whatsapp || '+525512345678').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn-outline cta-button">
                Reservar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

Home.displayName = 'Home';

export default Home;
