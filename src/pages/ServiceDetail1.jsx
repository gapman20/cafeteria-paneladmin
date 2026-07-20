import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import ImageFallback from '../components/ImageFallback';

const ServiceDetail1 = () => {
  return (
    <div className="page" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', minHeight: '80vh' }}>
      <Link to="/menu" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Volver al Menú
      </Link>
      
      <header style={{ marginBottom: '3rem' }}>
        <h1 className="h1-premium mb-4">Espresso & Tradición</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: '1.8' }}>
          Nuestro espresso signature con notas de chocolate oscuro y un toque ahumado.
          Doble extracción con granulometría perfecta para lograr una taza intensa y equilibrada.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <div style={{ width: '100%', height: '400px', overflow: 'hidden', borderRadius: '12px' }}>
          <ImageFallback 
            src="https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&q=80" 
            alt="Espresso" 
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>

        <div>
          <h2 className="h2-premium" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>¿Qué incluye?</h2>
          <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {['Espresso simple y doble', 'Macchiato tradicional', 'Cortado español', 'Americano balanceado', 'Ristretto para entendidos', 'Café solo con historia'].map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem', background: 'var(--glass-bg)', borderRadius: '8px' }}>
                <Check color="var(--accent-primary)" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail1;
