import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './CoffeeCarousel.css';

const coffees = [
  {
    id: 0,
    name: 'Espresso Supremo',
    origin: 'Colombia, Huila',
    notes: 'Chocolate oscuro, caramelo, almendra',
    process: 'Lavado • 1,800 msnm',
    roast: 'Oscuro',
    color: '#6B3A2A',
    accent: '#C8956C',
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&q=80',
  },
  {
    id: 1,
    name: 'Ethiopian Yirgacheffe',
    origin: 'Etiopía, Sidama',
    notes: 'Jazmín, durazno, té negro',
    process: 'Natural • 2,000 msnm',
    roast: 'Medio',
    color: '#3D2B1F',
    accent: '#E8A87C',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
  },
  {
    id: 2,
    name: 'Guatemala Antigua',
    origin: 'Guatemala, Sacatepéquez',
    notes: 'Nuez moscada, miel, frutos rojos',
    process: 'Honey • 1,650 msnm',
    roast: 'Medio-Oscuro',
    color: '#4A2E1A',
    accent: '#D4956A',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80',
  },
  {
    id: 3,
    name: 'Cold Brew Reserve',
    origin: 'Brasil, Cerrado',
    notes: 'Vainilla, avellana, cacao',
    process: 'Natural • 1,200 msnm',
    roast: 'Oscuro',
    color: '#2A1A0E',
    accent: '#B8845A',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&q=80',
  },
  {
    id: 4,
    name: 'Pour Over Floral',
    origin: 'Kenia, Kirinyaga',
    notes: 'Grosella negra, hibisco, limón',
    process: 'Lavado • 1,900 msnm',
    roast: 'Claro',
    color: '#5C3317',
    accent: '#F0A882',
    image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=600&q=80',
  },
];

// Floating bean positions — deterministic so no hydration mismatch
const BEANS = [
  { x: 12, y: 18, r: 0, size: 22, speed: 6.5, delay: 0 },
  { x: 78, y: 12, r: 45, size: 18, speed: 8.2, delay: 1.1 },
  { x: 88, y: 55, r: -20, size: 26, speed: 7.0, delay: 0.4 },
  { x: 5,  y: 70, r: 70, size: 20, speed: 9.1, delay: 2.0 },
  { x: 65, y: 82, r: -45, size: 24, speed: 6.0, delay: 0.7 },
  { x: 30, y: 88, r: 30, size: 16, speed: 10.0, delay: 1.5 },
  { x: 92, y: 25, r: -60, size: 20, speed: 7.8, delay: 0.2 },
  { x: 50, y: 8,  r: 15, size: 14, speed: 11.0, delay: 3.0 },
  { x: 20, y: 45, r: -30, size: 28, speed: 5.5, delay: 0.9 },
  { x: 72, y: 40, r: 55, size: 18, speed: 8.5, delay: 1.8 },
];

function CoffeeCup({ coffee, spinning }) {
  return (
    <div className={`cup-scene ${spinning ? 'cup-spinning' : ''}`}>
      {/* Steam wisps overlay */}
      <div className="steam-container" aria-hidden="true" style={{ top: '-30px', zIndex: 10 }}>
        <div className="steam steam-1" />
        <div className="steam steam-2" />
        <div className="steam steam-3" />
        <div className="steam steam-4" />
      </div>

      {/* Taza temporal con imagen */}
      <div className="cup-wrapper" style={{ '--accent': coffee.accent }}>
        <div className="latte-photo-frame" style={{ borderRadius: '50%', overflow: 'hidden', width: '240px', height: '240px' }}>
          <img 
            src="https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop" 
            alt="Café Latte" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div className="latte-tint" style={{ background: coffee.accent, opacity: 0.15, position: 'absolute', inset: 0 }} />
          <div className="latte-glow-ring" style={{ borderColor: coffee.accent, position: 'absolute', inset: 0, border: '4px solid', borderRadius: '50%' }} />
        </div>
      </div>

      {/* Floor reflection */}
      <div className="cup-reflection" style={{ background: coffee.accent }} />
    </div>
  );
}


function BeanParticle({ bean }) {
  return (
    <div
      className="bean-particle"
      style={{
        left: `${bean.x}%`,
        top: `${bean.y}%`,
        width: `${bean.size}px`,
        height: `${bean.size * 0.65}px`,
        animationDuration: `${bean.speed}s`,
        animationDelay: `${bean.delay}s`,
        transform: `rotate(${bean.r}deg)`,
      }}
    >
      <svg viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="15" cy="10" rx="14" ry="9" fill="#4A2E1A" />
        <ellipse cx="15" cy="10" rx="11" ry="6" fill="#6B3A2A" />
        <path d="M15 2 Q17 10 15 18" stroke="#3A2010" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}

export default function CoffeeCarousel() {
  const [active, setActive] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [cardVisible, setCardVisible] = useState(true);
  const autoRef = useRef(null);
  const coffee = coffees[active];

  const goTo = useCallback(
    (nextIdx, dir = 1) => {
      if (spinning) return;
      setDirection(dir);
      setSpinning(true);
      setCardVisible(false);

      setTimeout(() => {
        setActive(nextIdx);
        setTimeout(() => {
          setSpinning(false);
          setCardVisible(true);
        }, 300);
      }, 450);
    },
    [spinning]
  );

  const next = useCallback(() => {
    goTo((active + 1) % coffees.length, 1);
  }, [active, goTo]);

  const prev = useCallback(() => {
    goTo((active - 1 + coffees.length) % coffees.length, -1);
  }, [active, goTo]);

  // Auto-advance
  useEffect(() => {
    autoRef.current = setInterval(next, 5000);
    return () => clearInterval(autoRef.current);
  }, [next]);

  const resetAuto = () => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(next, 5000);
  };

  const handlePrev = () => { prev(); resetAuto(); };
  const handleNext = () => { next(); resetAuto(); };

  return (
    <section
      className="coffee-carousel-hero"
      style={{ '--cup-accent': coffee.accent, '--cup-color': coffee.color }}
    >
      {/* Ambient glow */}
      <div className="carousel-ambient" style={{ background: coffee.accent }} />

      {/* Floating beans */}
      <div className="beans-layer" aria-hidden="true">
        {BEANS.map((b, i) => (
          <BeanParticle key={i} bean={b} />
        ))}
      </div>

      <div className="carousel-inner">
        {/* Left: Text info */}
        <div className={`carousel-info ${cardVisible ? 'info-visible' : 'info-hidden'}`}>
          <span className="carousel-eyebrow">Selección del mes</span>
          <h2 className="carousel-name">{coffee.name}</h2>
          <p className="carousel-origin">
            <span className="origin-dot" style={{ background: coffee.accent }} />
            {coffee.origin}
          </p>
          <p className="carousel-notes">{coffee.notes}</p>

          <div className="carousel-tags">
            <span className="carousel-tag">{coffee.process}</span>
            <span className="carousel-tag carousel-tag-accent">{coffee.roast}</span>
          </div>

          {/* Nav controls */}
          <div className="carousel-controls">
            <button
              className="carousel-btn"
              onClick={handlePrev}
              aria-label="Café anterior"
            >
              ←
            </button>
            <div className="carousel-dots">
              {coffees.map((_, i) => (
                <button
                  key={i}
                  className={`carousel-dot ${i === active ? 'dot-active' : ''}`}
                  onClick={() => { goTo(i, i > active ? 1 : -1); resetAuto(); }}
                  aria-label={`Ver ${coffees[i].name}`}
                  style={i === active ? { background: coffee.accent } : {}}
                />
              ))}
            </div>
            <button
              className="carousel-btn"
              onClick={handleNext}
              aria-label="Café siguiente"
            >
              →
            </button>
          </div>
        </div>

        {/* Center: 3D Cup */}
        <div className="carousel-cup-area">
          <CoffeeCup coffee={coffee} spinning={spinning} direction={direction} />
        </div>

        {/* Right: Image cards */}
        <div className="carousel-cards">
          {coffees.map((c, i) => {
            const offset = (i - active + coffees.length) % coffees.length;
            const isActive = offset === 0;
            const isNext = offset === 1;
            const isPrev = offset === coffees.length - 1;
            const visible = isActive || isNext || isPrev;

            return (
              <div
                key={c.id}
                className={`coffee-card
                  ${isActive ? 'coffee-card-active' : ''}
                  ${isNext ? 'coffee-card-next' : ''}
                  ${isPrev ? 'coffee-card-prev' : ''}
                  ${!visible ? 'coffee-card-hidden' : ''}
                `}
                onClick={() => { goTo(i, i > active ? 1 : -1); resetAuto(); }}
                role="button"
                tabIndex={0}
                aria-label={`Ver ${c.name}`}
                onKeyDown={(e) => e.key === 'Enter' && goTo(i, i > active ? 1 : -1)}
              >
                <div className="coffee-card-img-wrap">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    draggable="false"
                  />
                  {isActive && (
                    <div
                      className="coffee-card-glow"
                      style={{ '--glow-color': c.accent }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom progress bar */}
      <div className="carousel-progress">
        <div
          className="carousel-progress-fill"
          key={active}
          style={{ '--accent': coffee.accent }}
        />
      </div>
    </section>
  );
}
