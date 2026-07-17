import React, { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Hexagon } from 'lucide-react';
import { useContent, usePages } from '../hooks';

const Navbar = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const { content } = useContent();
  const { pages } = usePages();

  const scrollToTop = () => {
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={scrollToTop}>
          <Hexagon fill="url(#coffee-grad)" color="transparent" size={28} />
          <svg width="0" height="0">
            <linearGradient id="coffee-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop stopColor="#8B4513" offset="0%" />
              <stop stopColor="#D2691E" offset="100%" />
            </linearGradient>
          </svg>
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
          <li style={{ marginLeft: isOpen ? '0' : '1rem' }}>
            <Link to="/contacto" className="btn-primary" onClick={() => setIsOpen(false)} style={{ padding: '10px 24px', fontSize: '0.95rem' }}>
              {content.ctaButton}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
