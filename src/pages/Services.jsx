import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, FlaskConical, Snowflake, CakeSlice, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { useSite } from '../context/SiteContext';

const iconMap = {
  '1': <Coffee size={36} color="var(--accent-primary)" />,
  '2': <FlaskConical size={36} color="var(--accent-secondary)" />,
  '3': <Snowflake size={36} color="var(--accent-primary)" />,
  '4': <CakeSlice size={36} color="var(--accent-secondary)" />,
};

const Services = () => {
  const { content } = useSite();
  const services = content.services;

  return (
    <div className="page" style={{ position: 'relative', zIndex: 1 }}>
      <SEO
        title={`${services.title} | ${content.siteName}`}
        description={services.subtitle}
      />

      {/* Subtle background glow */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '600px', background: 'var(--accent-secondary)', filter: 'blur(200px)', opacity: '0.08', borderRadius: '50%', zIndex: -1 }}></div>

      <header style={{ textAlign: 'center', marginBottom: '5rem', marginTop: '2rem' }}>
        <div className="animate-fade-up">
           <h1 className="h1-premium mb-4">{services.title}</h1>
           <p className="subtitle">{services.subtitle}</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
        {services.cards.filter(c => c.active).map((srv, index) => (
          <div key={srv.id} className={`glass-card animate-fade-up delay-${(index+1)*100}`} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="icon-wrapper">
               {iconMap[srv.id] || <Coffee size={36} color="var(--accent-primary)" />}
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{srv.title}</h3>
            <p style={{ marginBottom: '2rem', flex: 1 }}>{srv.desc}</p>
            <Link to={`/menu/${srv.id}`} className="btn-outline" style={{ display: 'inline-flex', padding: '10px 20px', fontSize: '0.95rem', alignSelf: 'flex-start' }}>
              Ver Detalles <ArrowRight size={18} style={{ marginLeft: '6px' }} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
