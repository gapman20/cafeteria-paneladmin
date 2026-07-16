import React from 'react';
import { Package, Tag, ShoppingCart, Star, Box } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import SEO from '../components/SEO';

const parseText = (text) => {
  if (!text) return '';
  let html = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-card-primary);">$1</strong>');
  html = html.replace(/^- (.*)$/gm, '<li style="margin-left: 1.5rem; margin-bottom: 0.5rem;">$1</li>');
  html = html.replace(/(<li.*<\/li>)/s, '<ul style="margin-top: 0.5rem; margin-bottom: 1rem; padding-left: 0;">$1</ul>');
  html = html.replace(/\n/g, '<br/>');
  return html;
};

const Products = () => {
  const { products, content } = useSite();

  const activeProducts = products?.filter(p => p.active) || [];

  return (
    <div className="page" style={{ position: 'relative', zIndex: 1 }}>
      <SEO 
        title={`${content.products?.title || 'Cafés'} | ${content.siteName}`}
        description={content.products?.subtitle || "Cada taza cuenta una historia. Descubre nuestros cafés de especialidad."} 
      />

      {/* Subtle background glow */}
      <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '400px', background: 'var(--accent-primary)', filter: 'blur(180px)', opacity: '0.06', borderRadius: '50%', zIndex: -1 }}></div>

      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
        <div className="animate-fade-up">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: '8px 18px', borderRadius: '30px', marginBottom: '1.5rem' }}>
            <Package size={16} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-primary)', letterSpacing: '1px', textTransform: 'uppercase' }}>Catálogo de Productos</span>
          </div>
          <h1 className="h1-premium mb-4">
            Nuestros <span className="text-gradient">Productos</span>
          </h1>
          <p className="subtitle" style={{ maxWidth: '650px', margin: '0 auto' }}>
            Explora nuestra selección de productos de alta calidad. Herramientas, iluminación y material al mejor precio del mercado.
          </p>
        </div>
      </header>

      {/* Product Grid */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 6rem' }}>
        {activeProducts.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Box size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem', opacity: 0.4 }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Aún no hay productos disponibles.</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.6 }}>Agrega productos desde el panel de administración.</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '2rem' 
          }}>
            {activeProducts.map((product, index) => (
              <div 
                key={product.id} 
                className={`glass-card animate-fade-up delay-${(index + 1) * 100}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
              >
                
                {/* Product Image */}
                <div style={{ 
                  height: '200px', 
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.05), rgba(245,158,11,0.02))', 
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', opacity: 0.4 }}>
                      <Package size={40} />
                      <span style={{ fontSize: '0.8rem' }}>Sin imagen</span>
                    </div>
                  )}
                  
                  {/* Price Badge */}
                  {product.price && (
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      background: 'var(--accent-gradient)',
                      color: 'white',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontWeight: '800',
                      fontSize: '0.9rem',
                      fontFamily: 'var(--font-heading)',
                      boxShadow: '0 4px 15px rgba(245,158,11,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <Tag size={13} />
                      {product.price}
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {index === 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(16,185,129,0.9)',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Star size={11} fill="white" />
                      DESTACADO
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ 
                    fontFamily: 'var(--font-heading)', 
                    fontSize: '1.1rem', 
                    fontWeight: '700', 
                    color: 'var(--text-card-primary)', 
                    marginBottom: '0.6rem',
                    lineHeight: '1.3'
                  }}>
                    {product.name}
                  </h3>
                  
                  <div 
                    style={{ 
                      color: 'var(--text-card-secondary)', 
                      fontSize: '0.88rem', 
                      lineHeight: '1.6', 
                      flex: 1 
                    }}
                    dangerouslySetInnerHTML={{ __html: parseText(product.description) }}
                  />

                  {/* CTA Button */}
                  <div style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                    <button 
                      className="btn-outline"
                      style={{ 
                        width: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '6px',
                        padding: '10px 16px',
                        fontSize: '0.85rem'
                      }}
                    >
                      <ShoppingCart size={15} />
                      Solicitar Cotización
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Products;
