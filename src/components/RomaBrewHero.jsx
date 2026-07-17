import React, { useRef, useEffect, useState, memo } from 'react';
import { ArrowRight } from 'lucide-react';
import './RomaBrewHero.css';

/* eslint-disable react/prop-types */

const BEANS = [
  // Far layer (depth 1 — blurred, smaller, slower)
  { x: 8,  y: 15, depth: 1, size: 26, speed: 7,   delay: 0   },
  { x: 85, y: 20, depth: 1, size: 22, speed: 9,   delay: 1.2 },
  { x: 15, y: 75, depth: 1, size: 20, speed: 8,   delay: 2.1 },
  { x: 70, y: 85, depth: 1, size: 24, speed: 10,  delay: 0.5 },
  // Mid layer (depth 2)
  { x: 5,  y: 40, depth: 2, size: 32, speed: 6,   delay: 0.8 },
  { x: 92, y: 55, depth: 2, size: 28, speed: 7.5, delay: 1.8 },
  { x: 30, y: 10, depth: 2, size: 30, speed: 8.5, delay: 0.3 },
  { x: 60, y: 78, depth: 2, size: 26, speed: 7,   delay: 2.5 },
  // Near layer (depth 3 — sharp, larger, faster parallax)
  { x: 12, y: 55, depth: 3, size: 40, speed: 5.5, delay: 0.4 },
  { x: 88, y: 35, depth: 3, size: 36, speed: 6.5, delay: 1.5 },
  { x: 45, y: 5,  depth: 3, size: 34, speed: 5,   delay: 2.8 },
  { x: 75, y: 65, depth: 3, size: 38, speed: 6,   delay: 1.0 },
];

function CoffeeBean({ bean }) {
  const blur = bean.depth === 1 ? 3 : bean.depth === 2 ? 1.5 : 0;
  const opacity = bean.depth === 1 ? 0.3 : bean.depth === 2 ? 0.5 : 0.7;

  return (
    <div
      className="roma-bean"
      style={{
        left: `${bean.x}%`,
        top: `${bean.y}%`,
        width: `${bean.size}px`,
        height: `${bean.size * 0.65}px`,
        filter: `blur(${blur}px)`,
        opacity,
        animationDuration: `${bean.speed}s`,
        animationDelay: `${bean.delay}s`,
      }}
    >
      <svg viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="15" cy="10" rx="14" ry="9" fill="#3D2B1F" />
        <ellipse cx="15" cy="10" rx="11" ry="6" fill="#5C3A28" />
        <path d="M15 2 Q17 10 15 18" stroke="#2A1A0E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <ellipse cx="11" cy="7" rx="4" ry="2.5" fill="rgba(255,255,255,0.06)" />
      </svg>
    </div>
  );
}

export default memo(function RomaBrewHero() {
  const containerRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      setMouse({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  const px = (mouse.x - 0.5) * 2;
  const py = (mouse.y - 0.5) * 2;

  return (
    <section className="roma-hero" ref={containerRef}>
      {/* Background glow orbs */}
      <div className="roma-glow roma-glow--emerald" />
      <div className="roma-glow roma-glow--amber" />
      <div className="roma-glow roma-glow--center" />

      {/* Floating beans layer (parallax) */}
      <div className="roma-beans-layer" aria-hidden="true">
        {BEANS.map((b, i) => (
          <CoffeeBean key={i} bean={b} />
        ))}
      </div>

      {/* Main content */}
      <div className="roma-content">
        <div
          className="roma-text"
          style={{ transform: `translate(${px * -6}px, ${py * -4}px)` }}
        >
          <span className="roma-eyebrow roma-word--reveal">ESPECIALIDAD PREMIUM</span>
          <h1 className="roma-headline">
            <span className="roma-word roma-word--reveal">CAF&Eacute;</span>{' '}
            <span className="roma-headline-accent roma-word--reveal">CON</span>{' '}
            <span className="roma-word roma-word--reveal">ALMA</span>
          </h1>
          <p className="roma-subtitle">
            Granos de origen &uacute;nico, tostados artesanalmente. Creado para quienes no se conforman con lo ordinary.
          </p>
          <div className="roma-cta-group">
            <button className="roma-cta-primary">
              Explorar Nuestro Men&uacute; <ArrowRight size={18} />
            </button>
            <button className="roma-cta-secondary">Nuestra Historia</button>
          </div>
        </div>

        <div
          className="roma-cup-area"
          style={{ transform: `translate(${px * 10}px, ${py * 7}px)` }}
        >
          {/* Vapor particles */}
          <div className="roma-vapor" aria-hidden="true">
            {[...Array(8)].map((_, i) => (
              <span key={i} className="roma-vapor-particle" />
            ))}
          </div>
          <div className="roma-cup-glow" />
          <div className="roma-cup-float">
            <img
              src="/still-life-with-iced-coffee-beverage-removebg-preview.png"
              alt="Frapp&eacute; de caf&eacute; helado con crema batida y salsa de caramelo"
              className="roma-cup-img"
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* Bottom fade into page */}
      <div className="roma-bottom-fade" />
    </section>
  );
});
