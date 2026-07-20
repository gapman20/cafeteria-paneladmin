import React from 'react';
import ImageFallback from '../components/ImageFallback';

const parseText = (text) => {
  if (!text) return '';
  let html = text.replace(/</g, '&lt;').replace(/>/g, '&gt;'); // Evitar inyección HTML directa si lo pegan manual
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-card-primary);">$1</strong>');
  html = html.replace(/^- (.*)$/gm, '<li style="margin-left: 1.5rem; margin-bottom: 0.5rem;">$1</li>');
  // Envolver <li> en <ul>
  html = html.replace(/(<li.*<\/li>)/s, '<ul style="margin-top: 0.5rem; margin-bottom: 1rem;">$1</ul>');
  html = html.replace(/\n/g, '<br/>');
  return html;
};

const CustomPage = ({ page }) => {
  if (!page) return null;

  return (
    <div style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem' }}>
        
        {page.pageTitle && (
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '1rem' }}>
            {page.pageTitle}
          </h1>
        )}

        {page.pageSubtitle && (
          <p style={{ fontSize: '1.2rem', color: 'var(--accent-primary)', fontWeight: '600', marginBottom: '2.5rem', lineHeight: '1.5' }}>
            {page.pageSubtitle}
          </p>
        )}

        {page.pageImage && (
          <div style={{ marginBottom: '3rem', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <ImageFallback src={page.pageImage} alt={page.pageTitle || 'Contenido Visual'} loading="lazy" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
          </div>
        )}

        {page.pageText && (
          <div 
            style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '1.1rem', 
              lineHeight: '1.8'
            }}
            dangerouslySetInnerHTML={{ __html: parseText(page.pageText) }}
          />
        )}

      </div>
    </div>
  );
};

export default CustomPage;
