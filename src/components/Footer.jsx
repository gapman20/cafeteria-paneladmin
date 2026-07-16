import React from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { Hexagon, Instagram, Youtube, Facebook } from 'lucide-react';

const Footer = () => {
  const { content } = useSite();
  const social = content.social || {};

  return (
    <footer style={{ background: 'var(--bg-tertiary)', borderTop: '1px solid var(--glass-border)', padding: '1.5rem 2rem 1rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.2rem', marginBottom: '1.2rem' }}>

        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
            <Hexagon fill="url(#footer-grad)" color="transparent" size={22} />
            <svg width="0" height="0">
              <linearGradient id="footer-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop stopColor="var(--accent-primary)"   offset="0%" />
                <stop stopColor="var(--accent-secondary)" offset="100%" />
              </linearGradient>
            </svg>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '0.95rem' }}>{content.siteName}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: '1.5', marginBottom: '0.7rem' }}>
            {content.footer.description}
          </p>
          {/* Social Icons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {social.instagram && (
              <a href={social.instagram} target="_blank" rel="noreferrer" style={socialBtn}>
                <Instagram size={15} />
              </a>
            )}
            {social.youtube && (
              <a href={social.youtube} target="_blank" rel="noreferrer" style={socialBtn}>
                <Youtube size={15} />
              </a>
            )}
            {social.facebook && (
              <a href={social.facebook} target="_blank" rel="noreferrer" style={socialBtn}>
                <Facebook size={15} />
              </a>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', marginBottom: '0.5rem', fontSize: '0.82rem' }}>Navegación</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { to: '/',          label: 'Inicio' },
              { to: '/nosotros',  label: 'Nosotros' },
              { to: '/servicios', label: 'Servicios' },
              { to: '/portafolio',label: 'Portafolio' },
              { to: '/blog',      label: 'Blog' },
              { to: '/contacto',  label: 'Contacto' },
            ].map(l => (
              <li key={l.to}>
                <Link to={l.to} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.82rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            {/* Admin link — separated and very subtle */}
            <li style={{ marginTop: '0.3rem', paddingTop: '0.3rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <Link to="/admin"
                style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.82rem', opacity: 0.45, display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = 'var(--accent-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = 0.45; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                ⚙️ Panel Admin
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', marginBottom: '0.5rem', fontSize: '0.82rem' }}>Contacto</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>📧 {content.contact.email}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>📱 {content.contact.whatsapp}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>📍 {content.contact.address}</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '0.7rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
          © {new Date().getFullYear()} {content.footer.copyright}
        </p>
      </div>
    </footer>
  );
};

const socialBtn = {
  width: '30px', height: '30px', borderRadius: '6px',
  background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--text-secondary)', textDecoration: 'none',
  transition: 'all 0.2s',
};

export default Footer;
