import React, { useState } from 'react';
import LocationMap from '../components/LocationMap';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { validateEmail, validateRequired, validateMinLength } from '../utils/validation';

const Contact = () => {
  const { content, addMessage } = useSite();
  const c = content.contact;
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const nameResult = validateRequired(formData.name, 'Nombre');
    if (!nameResult.valid) newErrors.name = nameResult.error;

    const emailResult = validateEmail(formData.email);
    if (!emailResult.valid) newErrors.email = emailResult.error;

    const msgResult = validateMinLength(formData.message, 10, 'Mensaje');
    if (!msgResult.valid) newErrors.message = msgResult.error;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    const newErrors = { ...errors };
    if (field === 'name') {
      const r = validateRequired(formData.name, 'Nombre');
      if (!r.valid) newErrors.name = r.error; else delete newErrors.name;
    } else if (field === 'email') {
      const r = validateEmail(formData.email);
      if (!r.valid) newErrors.email = r.error; else delete newErrors.email;
    } else if (field === 'message') {
      const r = validateMinLength(formData.message, 10, 'Mensaje');
      if (!r.valid) newErrors.message = r.error; else delete newErrors.message;
    }
    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    addMessage(formData);
    setSent(true);
    setFormData({ name: '', email: '', message: '' });
    setErrors({});
    setTimeout(() => setSent(false), 4000);
  };

  const inputStyle = (hasError) => ({
    width: '100%', padding: '16px',
    background: 'var(--glass-bg, rgba(5,5,5,0.5))',
    border: `1px solid ${hasError ? '#ef4444' : 'var(--glass-border)'}`,
    color: 'var(--text-primary, white)',
    borderRadius: '12px', fontFamily: 'var(--font-body)',
    outline: 'none', transition: 'border-color 0.3s',
  });

  const errorStyle = {
    color: '#ef4444', fontSize: '0.82rem', marginTop: '0.3rem',
  };

  return (
    <div className="page" style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ position: 'absolute', top: '10%', left: '10%', width: '500px', height: '500px', background: 'var(--accent-secondary)', filter: 'blur(250px)', opacity: '0.1', borderRadius: '50%', zIndex: -1 }}></div>

      <header style={{ textAlign: 'center', marginBottom: '5rem', marginTop: '2rem' }}>
        <div className="animate-fade-up">
          <h1 className="h1-premium mb-4">{c.title}</h1>
          <p className="subtitle">{c.subtitle}</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '4rem', alignItems: 'start' }}>

        {/* Contact Info & Map */}
        <div className="animate-fade-up delay-100" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 className="h2-premium" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Contacto Directo</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { icon: <MessageSquare color="#25d366" size={20} />, label: 'WhatsApp (Prioritario)', val: c.whatsapp, bg: 'linear-gradient(135deg, rgba(37,211,102,0.1), transparent)' },
                { icon: <Mail color="var(--accent-primary)" size={20} />, label: 'Email Corporativo', val: c.email, bg: undefined },
                { icon: <MapPin color="#ef4444" size={20} />, label: 'Oficinas HQ', val: c.address, bg: 'linear-gradient(135deg, rgba(239,68,68,0.1), transparent)' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                  <div className="icon-wrapper" style={{ margin: 0, width: '50px', height: '50px', borderRadius: '12px', background: item.bg }}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>{item.label}</h4>
                    <p>{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', overflow: 'hidden' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Encuéntranos</h4>
            <div style={{ borderRadius: '12px', overflow: 'hidden', height: '300px' }}>
              <LocationMap center={[c.mapLat || 19.4326, c.mapLng || -99.1332]} zoom={14} />
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="glass-card animate-fade-up delay-200" style={{ position: 'sticky', top: '120px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 className="h2-premium" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Solicitar Presupuesto</h3>
            <p style={{ marginBottom: '1.5rem' }}>Déjanos conocer un poco sobre tus objetivos.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-card-secondary)' }}>Nombre o Empresa</label>
              <input
                type="text"
                placeholder="Ej. Juan Pérez"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                onBlur={() => handleBlur('name')}
                style={inputStyle(errors.name)}
                onFocus={e => { if (!errors.name) e.target.style.borderColor = 'var(--accent-primary)'; }}
              />
              {errors.name && <p style={errorStyle}>{errors.name}</p>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-card-secondary)' }}>Correo Electrónico</label>
              <input
                type="email"
                placeholder="correo@empresa.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                onBlur={() => handleBlur('email')}
                style={inputStyle(errors.email)}
                onFocus={e => { if (!errors.email) e.target.style.borderColor = 'var(--accent-primary)'; }}
              />
              {errors.email && <p style={errorStyle}>{errors.email}</p>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-card-secondary)' }}>¿Qué necesitas?</label>
              <textarea
                placeholder="Cuéntanos..."
                rows="5"
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                onBlur={() => handleBlur('message')}
                style={{ ...inputStyle(errors.message), resize: 'vertical' }}
                onFocus={e => { if (!errors.message) e.target.style.borderColor = 'var(--accent-primary)'; }}
              />
              {errors.message && <p style={errorStyle}>{errors.message}</p>}
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center', background: sent ? '#10b981' : '' }}>
              {sent ? '¡Mensaje Enviado!' : 'Enviar Solicitud Inmediata'} <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
