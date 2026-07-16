import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Tag, Search, BookOpen } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import SEO from '../components/SEO';

const Blog = () => {
  const { blogPosts, content } = useSite();
  const [search, setSearch] = useState('');

  const published = (blogPosts || []).filter(p => p.published);
  const filtered = published.filter(p =>
    !search ||
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.excerpt.toLowerCase().includes(search.toLowerCase()) ||
    (p.tags || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page" style={{ position: 'relative', zIndex: 1, padding: '2rem', maxWidth: '1000px', margin: '0 auto', minHeight: '80vh' }}>
      <SEO 
        title={`Noticias | ${content.siteName}`}
        description="Descubre los secretos del café de especialidad, recetas, técnicas de barismo y la historia detrás de cada taza."
      />

      {/* Subtle background glow */}
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', height: '400px', background: 'var(--accent-primary)', filter: 'blur(180px)', opacity: '0.05', borderRadius: '50%', zIndex: -1 }}></div>

      <header style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '1rem' }}>
        <div className="animate-fade-up">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--color-accent-subtle)', border: '1px solid var(--color-accent-border)', padding: '8px 18px', borderRadius: '30px', marginBottom: '1.5rem' }}>
            <BookOpen size={16} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-primary)', letterSpacing: '1px', textTransform: 'uppercase' }}>Blog & Noticias</span>
          </div>
          <h1 className="h1-premium mb-4">
            Blog & <span className="text-gradient">Noticias</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem', maxWidth: '550px', margin: '0 auto 2rem' }}>
            Descubre los secretos del café de especialidad, recetas, técnicas de barismo y todo lo que necesitas saber.
          </p>
          <div style={{ position: 'relative', maxWidth: '420px', margin: '0 auto' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Buscar artículos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '11px 14px 11px 40px',
                background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                borderRadius: '50px', color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
            />
          </div>
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <BookOpen size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem', opacity: 0.3 }} />
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{search ? 'No se encontraron artículos.' : 'Aún no hay artículos publicados.'}</p>
          {!search && <p style={{ color: 'var(--text-secondary)', opacity: 0.5, fontSize: '0.88rem' }}>Ve al panel de admin para crear el primero.</p>}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filtered.map((post, index) => (
            <article 
              key={post.id} 
              className={`glass-card animate-fade-up delay-${(index + 1) * 100}`}
              style={{
                overflow: 'hidden',
                display: 'grid',
                gridTemplateColumns: post.image ? '240px 1fr' : '1fr',
              }}
            >
              {post.image && (
                <div style={{ overflow: 'hidden' }}>
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} 
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
              )}
              <div style={{ padding: '1.5rem' }}>
                {post.tags && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                    {post.tags.split(',').map(tag => tag.trim()).filter(Boolean).map(tag => (
                      <span key={tag} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '3px 10px', background: 'rgba(245,158,11,0.1)',
                        border: '1px solid rgba(245,158,11,0.25)', borderRadius: '20px',
                        fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: '600',
                      }}>
                        <Tag size={9} /> {tag}
                      </span>
                    ))}
                  </div>
                )}
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-card-primary)', lineHeight: '1.3' }}>
                  {post.title}
                </h2>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.8rem', color: 'var(--text-card-secondary)', fontSize: '0.8rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {post.date}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={12} /> {post.author}</span>
                </div>
                <p style={{ color: 'var(--text-card-secondary)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                  {post.excerpt}
                </p>
                <Link to={`/blog/${post.id}`} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  color: 'var(--accent-primary)', fontWeight: '600', textDecoration: 'none', fontSize: '0.88rem',
                  transition: 'gap 0.2s'
                }}
                  onMouseEnter={e => e.currentTarget.style.gap = '10px'}
                  onMouseLeave={e => e.currentTarget.style.gap = '6px'}
                >
                  Leer artículo <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
