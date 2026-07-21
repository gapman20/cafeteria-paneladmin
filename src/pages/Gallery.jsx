import React from 'react';
import { Camera, ArrowUpRight } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import SEO from '../components/SEO';
import ImageFallback from '../components/ImageFallback';

const FALLBACK_IMAGES = [
  { title: 'Nuestro Tostador Artisan', cat: 'Proceso', img: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80' },
  { title: 'Latte Art Perfecto', cat: 'Barismo', img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80' },
  { title: 'Orígenes Seleccionados', cat: 'Materia Prima', img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80' },
  { title: 'Nuestro Espacio', cat: 'Ambiente', img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80' },
  { title: 'Pour Over en Acción', cat: 'Métodos', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80' },
  { title: 'Repostería Artesanal', cat: 'Panadería', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80' },
];

const Gallery = () => {
  const { content, images } = useSite();

  const gallery = FALLBACK_IMAGES.map((item, i) => {
    const adminImg = (images.portfolio || [])[i];
    return adminImg ? { ...item, img: adminImg, fromAdmin: true } : item;
  }).filter(item => item.img);

  return (
    <div className="page" style={{ position: 'relative', zIndex: 1 }}>
      <SEO
        title={`Galería | ${content.siteName}`}
        description="Descubre el mundo de Café Aromático: nuestro proceso, nuestro espacio y la pasión en cada detalle."
      />

      {/* Subtle background glow */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', width: '700px', height: '500px', background: 'var(--accent-primary)', filter: 'blur(200px)', opacity: '0.06', borderRadius: '50%', zIndex: -1 }}></div>

      <header style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
        <div className="animate-fade-up">
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--color-accent-subtle)', border: '1px solid var(--color-accent-border)', padding: '8px 18px', borderRadius: '30px', marginBottom: '1.5rem' }}>
              <Camera size={16} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-primary)', letterSpacing: '1px', textTransform: 'uppercase' }}>Nuestro Mundo</span>
           </div>
            <h1 className="h1-premium mb-4">
              Galería <span className="text-gradient">Cafetera</span>
            </h1>
            <p className="subtitle" style={{ maxWidth: '650px', margin: '0 auto' }}>
              Imágenes que capturan la esencia de Café Aromático: pasión, arte y la mejor materia prima.
            </p>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {gallery.map((item, i) => (
            <div key={i} className={`glass-card animate-fade-up delay-${(i+1)*100}`} style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>

              <div style={{ width: '100%', overflow: 'hidden', position: 'relative', background: 'var(--color-surface)' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, var(--bg-secondary) 0%, transparent 60%)', zIndex: 1 }}></div>
                <ImageFallback
                  src={item.img}
                  alt={item.title}
                  loading="lazy"
                  style={{ width: '100%', display: 'block', transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />

                {/* Category Badge */}
                <div style={{
                  position: 'absolute', top: '14px', left: '14px', zIndex: 2,
                  background: 'var(--accent-primary)',
                  color: 'var(--btn-text, #FAFAFA)',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>
                  {item.cat}
                </div>

                {/* Icon */}
                <div style={{
                  position: 'absolute', top: '14px', right: '14px', zIndex: 2,
                  background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  padding: '8px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s'
                }}>
                   <ArrowUpRight size={16} color="white" />
                </div>
              </div>

              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: 'var(--text-card-primary)',
                  marginBottom: '0.6rem',
                  lineHeight: '1.3'
                }}>
                  {item.title}
                </h3>
                <p style={{ color: 'var(--text-card-secondary)', fontSize: '0.88rem', lineHeight: '1.6', flex: 1 }}>
                  Detrás de cada taza hay historia, técnica y dedicación. Descubre nuestro mundo cafetero.
                </p>
                <div style={{ marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid var(--glass-border)' }}>
                  <span style={{
                    color: 'var(--accent-primary)',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    Ver más <ArrowUpRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
