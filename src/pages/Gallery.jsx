import React, { useState } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import SEO from '../components/SEO';
import ImageFallback from '../components/ImageFallback';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1521302080334-4bebac2763a6?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80'
];

const Gallery = () => {
  const { content, images } = useSite();
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [loadedImages, setLoadedImages] = useState(0);
  const [forceLoad, setForceLoad] = useState(false);
  const isLoaded = loadedImages >= 16 || forceLoad;

  React.useEffect(() => {
    const timer = setTimeout(() => setForceLoad(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Mezclar las imágenes del panel (si hay) con los fallbacks, respetando la posición
  let portfolioImages = images.portfolio || [];
  let gallery = Array.from({ length: 16 }).map((_, i) => {
    return portfolioImages[i] || FALLBACK_IMAGES[i];
  });

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  
  const prevImage = (e) => {
    e.stopPropagation();
    setLightboxIndex(prev => (prev === 0 ? gallery.length - 1 : prev - 1));
  };
  
  const nextImage = (e) => {
    e.stopPropagation();
    setLightboxIndex(prev => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="page" style={{ position: 'relative', zIndex: 1, minHeight: '100vh', paddingBottom: '6rem' }}>
      <SEO
        title={`Galería | ${content.siteName}`}
        description="Descubre el mundo de Café Aromático en nuestra galería."
      />

      {/* Subtle background glow */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', width: '700px', height: '500px', background: 'var(--accent-primary)', filter: 'blur(200px)', opacity: '0.06', borderRadius: '50%', zIndex: -1 }}></div>

      <header style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '2rem' }}>
        <div className="animate-fade-up">
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--color-accent-subtle)', border: '1px solid var(--color-accent-border)', padding: '8px 18px', borderRadius: '30px', marginBottom: '1.5rem' }}>
              <Camera size={16} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-primary)', letterSpacing: '1px', textTransform: 'uppercase' }}>Galería Visual</span>
           </div>
            <h1 className="h1-premium mb-4">
              Nuestro <span className="text-gradient">Mundo</span>
            </h1>
            <p className="subtitle" style={{ maxWidth: '650px', margin: '0 auto' }}>
              Haz clic en cualquier imagen para verla en pantalla completa.
            </p>
        </div>
      </header>

      {/* Masked Gallery Container */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div 
          className="gallery-mask-container animate-fade-up delay-200"
          style={{ 
            width: '100%', 
            maxWidth: '650px', 
            aspectRatio: '1 / 1',
            background: 'var(--color-surface)',
            // Mask properties
            WebkitMaskImage: 'url(/cat-mask.svg)',
            maskImage: 'url(/cat-mask.svg)',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            // Grid layout inside the mask
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'repeat(4, 1fr)',
            gap: '4px', // slight gap makes the grid effect visible inside the shape
            position: 'relative'
          }}
        >
          {/* Loading Overlay (Skeleton) */}
          {!isLoaded && (
            <div 
              className="skeleton-cat"
              style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 10
              }}
            />
          )}

          {gallery.map((imgUrl, i) => (
            <div 
              key={i} 
              style={{ 
                position: 'relative', 
                overflow: 'hidden',
                cursor: 'pointer',
                opacity: isLoaded ? 1 : 0,
                transition: 'opacity 0.5s ease'
              }}
              onClick={() => openLightbox(i)}
              className="gallery-grid-item"
            >
              <ImageFallback
                src={imgUrl}
                alt={`Galería ${i + 1}`}
                loading="eager"
                onLoad={() => setLoadedImages(prev => prev + 1)}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.5s ease'
                }}
              />
              <div 
                className="gallery-grid-overlay"
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }}
              >
                <ZoomIn size={24} color="white" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div 
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.95)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)'
          }}
          onClick={closeLightbox}
        >
          <button 
            onClick={closeLightbox}
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', zIndex: 10 }}
            aria-label="Cerrar"
          >
            <X size={32} />
          </button>
          
          <button 
            onClick={prevImage}
            style={{ position: 'absolute', left: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', padding: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Anterior"
          >
            <ChevronLeft size={32} />
          </button>

          <img 
            src={gallery[lightboxIndex]} 
            alt="Ampliación"
            style={{
              maxWidth: '90%',
              maxHeight: '90vh',
              objectFit: 'contain',
              animation: 'zoomIn 0.3s ease forwards',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}
            onClick={e => e.stopPropagation()} // Evitar cerrar al hacer clic en la imagen
          />

          <button 
            onClick={nextImage}
            style={{ position: 'absolute', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', padding: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Siguiente"
          >
            <ChevronRight size={32} />
          </button>
          
          <div style={{ position: 'absolute', bottom: '20px', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', letterSpacing: '2px' }}>
            {lightboxIndex + 1} / {gallery.length}
          </div>
        </div>
      )}
      
      {/* CSS para hovers y skeleton */}
      <style>{`
        .gallery-grid-item:hover .gallery-grid-overlay {
          opacity: 1 !important;
        }
        .gallery-grid-item:hover img {
          transform: scale(1.1) !important;
        }
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .skeleton-cat {
          background: var(--color-surface);
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          overflow: hidden;
          z-index: 10;
        }
        .skeleton-cat::after {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default Gallery;
