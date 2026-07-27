import React, { useState, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Hexagon } from 'lucide-react';
import { useContent, usePages, useImages } from '../hooks';
import { useSite } from '../context/SiteContext';
import { MapPin } from 'lucide-react';

const Navbar = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const { content } = useContent();
  const { pages } = usePages();
  const { images } = useImages();
  const { tableNumber } = useSite();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const showTableBanner = tableNumber && searchParams.has('mesa');

  const scrollToTop = () => {
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {showTableBanner && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          background: 'var(--color-accent)',
          color: '#ffffff',
          textAlign: 'center',
          padding: '8px 16px',
          fontSize: '0.9rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          zIndex: 1001,
          boxShadow: 'var(--shadow-sm)'
        }}>
          <MapPin size={16} /> Estás pidiendo desde la Mesa {tableNumber}
        </div>
      )}
      <nav className="navbar" style={{ top: showTableBanner ? '36px' : '0' }}>
        <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={scrollToTop}>
          {images.logo ? (
            <img src={images.logo} alt={content.siteName} style={{ height: '44px', width: 'auto', maxWidth: '140px', objectFit: 'contain', borderRadius: '6px' }} />
          ) : (
            <>
              <Hexagon fill="url(#coffee-grad)" color="transparent" size={28} />
              <svg width="0" height="0">
                <linearGradient id="coffee-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop stopColor="#8B4513" offset="0%" />
                  <stop stopColor="#D2691E" offset="100%" />
                </linearGradient>
              </svg>
            </>
          )}
          {content.siteName}
        </Link>

        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </div>

        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          {pages.filter(p => p.active).map(page => (
            <li key={page.id}>
              <Link to={page.path} className="nav-links" onClick={page.path === '/' ? scrollToTop : () => setIsOpen(false)}>{page.name}</Link>
            </li>
          ))}
          <li>
            <Link to="/contacto" className="nav-links" onClick={() => setIsOpen(false)}>Visítanos</Link>
          </li>
          <li style={{ marginLeft: isOpen ? '0' : '1rem' }}>
            <Link to="/pedir" className="btn-primary" onClick={() => setIsOpen(false)} style={{ padding: '10px 24px', fontSize: '0.95rem' }}>
              Ordenar
            </Link>
          </li>
        </ul>
      </div>
      </nav>
    </>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
