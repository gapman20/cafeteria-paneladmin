import React from 'react';
import { Coffee, Star } from 'lucide-react';
import SEO from '../components/SEO';
import { useSite, SECTION_ICON_MAP } from '../context/SiteContext';

/* ─── Card Style ───────────────────────────────────────────────────────────── */
const cardStyle = {
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: 'var(--glass-bg)',
  border: '1px solid var(--glass-border)',
  borderRadius: 'var(--radius-lg)',
  transition: 'transform 0.2s, box-shadow 0.2s',
};

const imageStyle = (color) => ({
  height: '160px',
  background: `linear-gradient(135deg, ${color}20, ${color}08)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  borderBottom: '1px solid var(--glass-border)',
});

const priceBadge = {
  position: 'absolute',
  bottom: '10px',
  right: '10px',
  background: 'var(--accent-gradient)',
  color: 'var(--btn-text)',
  padding: '5px 12px',
  borderRadius: '10px',
  fontWeight: '800',
  fontSize: '0.85rem',
  fontFamily: 'var(--font-display)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
};

const infoStyle = {
  padding: '1.2rem',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.3rem',
};

const nameStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '1rem',
  fontWeight: '700',
  color: 'var(--text-card-primary)',
  margin: 0,
};

const descStyle = {
  fontSize: '0.82rem',
  color: 'var(--text-card-secondary)',
  margin: 0,
  lineHeight: '1.5',
  flex: 1,
};

/* ─── Component ────────────────────────────────────────────────────────────── */
const Menu = () => {
  const { content, products, menuSections } = useSite();
  const services = content.services;

  return (
    <div className="page" style={{ position: 'relative', zIndex: 1 }}>
      <SEO
        title={`${services.title} | ${content.siteName}`}
        description={services.subtitle}
      />

      {/* Background glow */}
      <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '600px', background: 'var(--accent-secondary)', filter: 'blur(200px)', opacity: '0.06', borderRadius: '50%', zIndex: -1 }}></div>

      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
        <div className="animate-fade-up">
          <h1 className="h1-premium mb-4">{services.title}</h1>
          <p className="subtitle" style={{ maxWidth: '550px', margin: '0 auto' }}>
            Grano de origen único, tueste artesanal y preparación cuidada.
            <br/>Cada taza es una experiencia.
          </p>
        </div>
      </header>

      {/* Menu Grid */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
        {menuSections.map((section, sIdx) => (
          <section
            key={section.id}
            className={`animate-fade-up delay-${(sIdx + 1) * 100}`}
            style={{ marginBottom: '4rem' }}
          >
            {/* Section Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
              <div style={{ color: section.color, display: 'flex' }}>{React.createElement(SECTION_ICON_MAP[section.icon] || SECTION_ICON_MAP.coffee, { size: 18 })}</div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                margin: 0,
              }}>
                {section.title}
              </h2>
              <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${section.color}40, transparent)` }}></div>
            </div>

            {/* Items Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1.2rem',
            }}>
              {section.items.map((item, iIdx) => (
                <div key={iIdx} className="glass-card" style={cardStyle}>
                  {/* Image */}
                  {item.image ? (
                    <div style={imageStyle(section.color)}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={priceBadge}>{item.price}</div>
                    </div>
                  ) : (
                    <div style={{ padding: '1.2rem 1.2rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={nameStyle}>{item.name}</h4>
                      <span style={{
                        background: 'var(--accent-gradient)',
                        color: 'var(--btn-text)',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontWeight: '800',
                        fontSize: '0.8rem',
                        fontFamily: 'var(--font-display)',
                        whiteSpace: 'nowrap',
                      }}>
                        {item.price}
                      </span>
                    </div>
                  )}
                  {/* Info */}
                  <div style={infoStyle}>
                    {item.image && <h4 style={nameStyle}>{item.name}</h4>}
                    <p style={descStyle}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Menu;
