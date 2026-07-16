import React from 'react';
import { useSite } from '../context/SiteContext';
import SEO from '../components/SEO';

const About = () => {
  const { content } = useSite();
  const a = content.about;

  return (
    <div className="page" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      <SEO
        title={`${a.title} | ${content.siteName}`}
        description={a.subtitle}
      />
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="h1-premium mb-4">{a.title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
          {a.subtitle}
        </p>
      </header>

      {/* Story */}
      {a.description && (
        <div style={{ maxWidth: '800px', margin: '0 auto 4rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.8' }}>
            {a.description}
          </p>
        </div>
      )}

      {/* Mission & Vision */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
        <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '2rem', borderRadius: '12px' }}>
          <h2 className="h2-premium" style={{ color: 'var(--accent-primary)', fontSize: '1.8rem' }}>Nuestra Misión</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>{a.mission}</p>
        </div>
        <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '2rem', borderRadius: '12px' }}>
          <h2 className="h2-premium" style={{ color: 'var(--accent-primary)', fontSize: '1.8rem' }}>Nuestra Visión</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>{a.vision}</p>
        </div>
      </div>

      {/* Values */}
      {a.values && a.values.length > 0 && (
        <section style={{ marginBottom: '4rem' }}>
          <h2 className="h2-premium" style={{ textAlign: 'center', marginBottom: '3rem' }}>Nuestros Valores</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {a.values.map((value, i) => (
              <div key={i} className="glass-card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-accent-subtle)', border: '1px solid var(--color-accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1.1rem' }}>
                  {i + 1}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>{value}</h3>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default About;
