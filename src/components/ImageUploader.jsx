import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle } from 'lucide-react';

/**
 * ImageUploader – drag-and-drop + click-to-browse image picker.
 *
 * Props:
 *   label       {string}  Label shown above the uploader
 *   description {string}  Small hint (recommended dimensions, etc.)
 *   value       {string|null}  Current image (base64 data URL or null)
 *   onChange    {fn(base64: string|null)}  Called with the new base64 string
 *   maxMB       {number}  Max file size in MB (default 2)
 */
const ImageUploader = ({ label, description, value, onChange, maxMB = 2 }) => {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState(null);

  const processFile = (file) => {
    setError(null);
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('El archivo debe ser una imagen (JPG, PNG, WebP, GIF).');
      return;
    }
    if (file.size > maxMB * 1024 * 1024) {
      setError(`La imagen excede el límite de ${maxMB} MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => processFile(e.target.files?.[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const handleRemove = () => {
    onChange(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      {label && (
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
          {label}
        </label>
      )}
      {description && (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.8rem', opacity: 0.7 }}>{description}</p>
      )}

      {/* Preview Mode */}
      {value ? (
        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
          <img src={value} alt="Uploaded" style={{ width: '100%', maxHeight: '240px', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.55)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'}
          >
            <button
              onClick={() => inputRef.current?.click()}
              style={{ opacity: 0, background: 'var(--accent-primary)', color: 'var(--btn-text, #FAFAFA)', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', transition: 'opacity 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = 1; }}
              onFocus={e => { e.currentTarget.style.opacity = 1; }}
            >
              <Upload size={16} /> Cambiar
            </button>
            <button
              onClick={handleRemove}
              style={{ opacity: 0, background: 'rgba(239,68,68,0.9)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', transition: 'opacity 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = 1; }}
              onFocus={e => { e.currentTarget.style.opacity = 1; }}
            >
              <X size={16} /> Eliminar
            </button>
          </div>
          <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(16,185,129,0.9)', borderRadius: '50px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: '700', color: 'white' }}>
            <CheckCircle size={12} /> Cargada
          </div>
        </div>
      ) : (
        /* Drop Zone */
        <div
          onClick={() => inputRef.current?.click()}
          onDragEnter={() => setDrag(true)}
          onDragLeave={() => setDrag(false)}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${drag ? 'var(--color-accent)' : 'var(--color-border)'}`,
            borderRadius: '12px',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: drag ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.02)',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <ImageIcon size={28} color="var(--color-accent)" />
          </div>
          <p style={{ color: 'var(--text-primary)', fontWeight: '600', fontFamily: 'var(--font-heading)', marginBottom: '0.4rem' }}>
            Arrastra una imagen aquí o <span style={{ color: 'var(--accent-primary)' }}>selecciona un archivo</span>
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            JPG, PNG, WebP o GIF — máximo {maxMB} MB.
          </p>
        </div>
      )}

      {error && (
        <p style={{ color: '#ef4444', fontSize: '0.82rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
          ⚠️ {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageUploader;
