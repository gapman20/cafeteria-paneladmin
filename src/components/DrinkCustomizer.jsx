import React, { useState, useMemo, useEffect } from 'react';
import { X } from 'lucide-react';
import { parsePrice } from '../utils/priceParser';
import { useSite } from '../context/SiteContext';

/* ─── Fallback Customization Options ────────────────────────────────────────── */
const FALLBACK_SIZES = [
  { key: 'chico', label: 'Chico', detail: '12oz', modifier: 0, active: true },
  { key: 'mediano', label: 'Mediano', detail: '16oz', modifier: 10, active: true },
  { key: 'grande', label: 'Grande', detail: '20oz', modifier: 20, active: true },
];

const FALLBACK_MILKS = [
  { key: 'entera', label: 'Entera', modifier: 0, active: true },
  { key: 'deslactosada', label: 'Deslactosada', modifier: 0, active: true },
  { key: 'almendra', label: 'Almendra', modifier: 15, active: true },
  { key: 'avena', label: 'Avena', modifier: 15, active: true },
];

const FALLBACK_SWEETNESS = [
  { key: '100', label: '100%', active: true },
  { key: '50', label: '50%', active: true },
  { key: 'sin-azucar', label: 'Sin Azúcar', active: true },
];

const FALLBACK_EXTRAS = [
  { key: 'shot-extra', label: 'Shot extra de Espresso', modifier: 15, active: true },
  { key: 'crema-batida', label: 'Crema Batida', modifier: 0, active: true },
  { key: 'jarabe-caramelo', label: 'Jarabe de Caramelo', modifier: 10, active: true },
];

const DEFAULT_SELECTIONS = {
  size: 'chico',
  milk: 'entera',
  sweetness: '100',
  extras: [],
  excludedIngredients: [],
};

/* ─── Helper: build summary string ──────────────────────────────────────────── */
function buildSummary(selections, item, options) {
  const size = options.sizes.find(o => o.key === selections.size);
  const milk = options.milks.find(o => o.key === selections.milk);
  const sweet = options.sweetness.find(o => o.key === selections.sweetness);
  const parts = [];
  if (size) parts.push(size.label);
  if (milk) parts.push(milk.label);
  if (sweet) parts.push(sweet.label);
  if (selections.excludedIngredients?.length > 0) {
    parts.push(`Sin: ${selections.excludedIngredients.join(', ')}`);
  }
  return parts.join(' · ');
}

/* ─── Pill Option Button ─────────────────────────────────────────────────────── */
const Pill = ({ label, detail, modifier, selected, color, onClick }) => {
  const selectedStyle = selected
    ? { background: 'var(--accent-gradient)', color: 'var(--btn-text, #fff)' }
    : { background: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)' };

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: '0.5rem 0.875rem',
        borderRadius: 'var(--radius-full)',
        border: selected ? 'none' : '1px solid var(--color-border)',
        fontFamily: 'var(--font-body)',
        fontSize: '0.8125rem',
        fontWeight: selected ? 600 : 500,
        cursor: 'pointer',
        transition: 'all var(--duration-fast) var(--ease-out)',
        whiteSpace: 'nowrap',
        ...selectedStyle,
      }}
    >
      <span>{label}</span>
      {detail && (
        <span style={{
          fontSize: '0.6875rem',
          opacity: 0.7,
          fontWeight: 400,
        }}>{detail}</span>
      )}
      {modifier > 0 && (
        <span style={{
          fontSize: '0.6875rem',
          opacity: 0.8,
          fontWeight: 600,
        }}>+${modifier}</span>
      )}
    </button>
  );
};

/* ─── Toggle Extra Pill ─────────────────────────────────────────────────────── */
const ExtraPill = ({ label, modifier, selected, onClick }) => {
  const selectedStyle = selected
    ? { background: 'var(--accent-gradient)', color: 'var(--btn-text, #fff)' }
    : { background: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)' };

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: '0.5rem 0.875rem',
        borderRadius: 'var(--radius-full)',
        border: selected ? 'none' : '1px solid var(--color-border)',
        fontFamily: 'var(--font-body)',
        fontSize: '0.8125rem',
        fontWeight: selected ? 600 : 500,
        cursor: 'pointer',
        transition: 'all var(--duration-fast) var(--ease-out)',
        whiteSpace: 'nowrap',
        ...selectedStyle,
      }}
    >
      <span>{label}</span>
      {modifier > 0 && (
        <span style={{
          fontSize: '0.6875rem',
          opacity: 0.8,
          fontWeight: 600,
        }}>+${modifier}</span>
      )}
    </button>
  );
};

/* ─── Section Header ────────────────────────────────────────────────────────── */
const SectionHeader = ({ title, color }) => (
  <div style={{
    fontFamily: 'var(--font-display)',
    fontSize: '0.8125rem',
    fontWeight: 700,
    color: color || 'var(--color-text)',
    marginBottom: '0.625rem',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  }}>
    {title}
  </div>
);

/* ─── Main Modal ────────────────────────────────────────────────────────────── */
const DrinkCustomizer = ({ item, sectionId, sectionColor, sectionEmoji, onClose, onAdd }) => {
  const { customizerOptions } = useSite();
  const [selections, setSelections] = useState({ ...DEFAULT_SELECTIONS });
  const [priceKey, setPriceKey] = useState(0);

  // Read from context with fallback, filter to active only
  const SIZE_OPTIONS = (customizerOptions?.sizes || FALLBACK_SIZES).filter(o => o.active !== false);
  const MILK_OPTIONS = (customizerOptions?.milks || FALLBACK_MILKS).filter(o => o.active !== false);
  const SWEETNESS_OPTIONS = (customizerOptions?.sweetness || FALLBACK_SWEETNESS).filter(o => o.active !== false);
  const EXTRAS_OPTIONS = (customizerOptions?.extras || FALLBACK_EXTRAS).filter(o => o.active !== false);

  // Set defaults from first available option if current selection is no longer valid
  useEffect(() => {
    if (SIZE_OPTIONS.length > 0 && !SIZE_OPTIONS.find(o => o.key === selections.size)) {
      setSelections(prev => ({ ...prev, size: SIZE_OPTIONS[0].key }));
    }
    if (MILK_OPTIONS.length > 0 && !MILK_OPTIONS.find(o => o.key === selections.milk)) {
      setSelections(prev => ({ ...prev, milk: MILK_OPTIONS[0].key }));
    }
    if (SWEETNESS_OPTIONS.length > 0 && !SWEETNESS_OPTIONS.find(o => o.key === selections.sweetness)) {
      setSelections(prev => ({ ...prev, sweetness: SWEETNESS_OPTIONS[0].key }));
    }
    setSelections(prev => ({
      ...prev,
      extras: prev.extras.filter(k => EXTRAS_OPTIONS.find(o => o.key === k)),
    }));
  }, [customizerOptions]);

  const basePrice = useMemo(() => parsePrice(item?.price || '$0'), [item]);

  const totalPrice = useMemo(() => {
    let total = basePrice;

    // Size modifier
    const sizeOpt = SIZE_OPTIONS.find(o => o.key === selections.size);
    if (sizeOpt) total += sizeOpt.modifier;

    // Milk modifier
    const milkOpt = MILK_OPTIONS.find(o => o.key === selections.milk);
    if (milkOpt) total += milkOpt.modifier;

    // Extras modifiers
    for (const extraKey of selections.extras) {
      const extraOpt = EXTRAS_OPTIONS.find(o => o.key === extraKey);
      if (extraOpt) total += extraOpt.modifier;
    }

    return total;
  }, [basePrice, selections]);

  // Trigger price animation whenever price changes
  useEffect(() => {
    setPriceKey(k => k + 1);
  }, [totalPrice]);

  const toggleSelect = (category, key) => {
    setSelections(prev => ({ ...prev, [category]: key }));
  };

  const toggleExtra = (key) => {
    setSelections(prev => {
      const extras = prev.extras.includes(key)
        ? prev.extras.filter(k => k !== key)
        : [...prev.extras, key];
      return { ...prev, extras };
    });
  };

  const toggleIngredient = (name) => {
    setSelections(prev => {
      const excluded = prev.excludedIngredients.includes(name)
        ? prev.excludedIngredients.filter(n => n !== name)
        : [...prev.excludedIngredients, name];
      return { ...prev, excludedIngredients: excluded };
    });
  };

  const handleAdd = () => {
    const sizeOpt = SIZE_OPTIONS.find(o => o.key === selections.size);
    const milkOpt = MILK_OPTIONS.find(o => o.key === selections.milk);
    const sweetOpt = SWEETNESS_OPTIONS.find(o => o.key === selections.sweetness);
    const selectedExtras = EXTRAS_OPTIONS.filter(o => selections.extras.includes(o.key));

    onAdd({
      size: sizeOpt,
      milk: milkOpt,
      sweetness: sweetOpt,
      extras: selectedExtras,
      excludedIngredients: selections.excludedIngredients,
      totalPrice,
      summary: buildSummary(selections, item, { sizes: SIZE_OPTIONS, milks: MILK_OPTIONS, sweetness: SWEETNESS_OPTIONS }),
    });
  };

  if (!item) return null;

  return (
    <div
      className="dc-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        animation: 'dc-fadeIn 0.2s ease-out',
        padding: '1rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '480px',
          maxHeight: '85vh',
          overflowY: 'auto',
          position: 'relative',
          animation: 'dc-scaleIn 0.25s var(--ease-out)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* ── Close Button ── */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          style={{
            position: 'absolute',
            top: '0.875rem',
            right: '0.875rem',
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all var(--duration-fast) var(--ease-out)',
          }}
        >
          <X size={16} />
        </button>

        {/* ── Header ── */}
        <div style={{
          padding: '1.5rem 1.5rem 0',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>
            {item.img || sectionEmoji || '☕'}
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--color-text)',
            margin: 0,
            paddingRight: '2rem',
          }}>
            {item.name}
          </h2>
          <p style={{
            fontSize: '0.8125rem',
            color: 'var(--color-text-secondary)',
            marginTop: '0.25rem',
            fontFamily: 'var(--font-body)',
          }}>
            {item.desc || 'Personaliza tu bebida'}
          </p>
        </div>

        {/* ── Sections ── */}
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Size */}
          <div>
            <SectionHeader title="Tamaño" color={sectionColor} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {SIZE_OPTIONS.map(opt => (
                <Pill
                  key={opt.key}
                  label={opt.label}
                  detail={opt.detail}
                  modifier={opt.modifier}
                  selected={selections.size === opt.key}
                  color={sectionColor}
                  onClick={() => toggleSelect('size', opt.key)}
                />
              ))}
            </div>
          </div>

          {/* Milk */}
          <div>
            <SectionHeader title="Base de Leche" color={sectionColor} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {MILK_OPTIONS.map(opt => (
                <Pill
                  key={opt.key}
                  label={opt.label}
                  modifier={opt.modifier}
                  selected={selections.milk === opt.key}
                  color={sectionColor}
                  onClick={() => toggleSelect('milk', opt.key)}
                />
              ))}
            </div>
          </div>

          {/* Sweetness */}
          <div>
            <SectionHeader title="Nivel de Dulzor" color={sectionColor} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {SWEETNESS_OPTIONS.map(opt => (
                <Pill
                  key={opt.key}
                  label={opt.label}
                  selected={selections.sweetness === opt.key}
                  color={sectionColor}
                  onClick={() => toggleSelect('sweetness', opt.key)}
                />
              ))}
            </div>
          </div>

          {/* Ingredients */}
          {item?.ingredients?.length > 0 && (
            <div>
              <SectionHeader title="Ingredientes" color={sectionColor} />
              <p style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-secondary)',
                marginBottom: '0.5rem',
                fontFamily: 'var(--font-body)',
              }}>
                Toca para quitar lo que no quieras
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {item.ingredients.map((name) => {
                  const included = !selections.excludedIngredients.includes(name);
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggleIngredient(name)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.5rem 0.875rem',
                        borderRadius: 'var(--radius-full)',
                        border: included ? 'none' : '1px solid var(--color-border)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8125rem',
                        fontWeight: included ? 600 : 500,
                        cursor: 'pointer',
                        transition: 'all var(--duration-fast) var(--ease-out)',
                        whiteSpace: 'nowrap',
                        background: included ? 'var(--accent-gradient)' : 'var(--color-surface)',
                        color: included ? 'var(--btn-text, #fff)' : 'var(--color-text)',
                        textDecoration: included ? 'none' : 'line-through',
                        opacity: included ? 1 : 0.6,
                      }}
                    >
                      <span>{included ? '✓' : '✗'}</span>
                      <span>{name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Extras */}
          <div>
            <SectionHeader title="Extras / Toppings" color={sectionColor} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {EXTRAS_OPTIONS.map(opt => (
                <ExtraPill
                  key={opt.key}
                  label={opt.label}
                  modifier={opt.modifier}
                  selected={selections.extras.includes(opt.key)}
                  onClick={() => toggleExtra(opt.key)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Price Display ── */}
        <div style={{
          padding: '0 1.5rem',
          textAlign: 'center',
          marginBottom: '1rem',
        }}>
          <div style={{
            fontSize: '0.8125rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '0.25rem',
          }}>
            {buildSummary(selections, item, { sizes: SIZE_OPTIONS, milks: MILK_OPTIONS, sweetness: SWEETNESS_OPTIONS })}
          </div>
          <div
            key={priceKey}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 800,
              color: 'var(--color-accent)',
              animation: 'dc-pricePop 0.3s var(--ease-out)',
            }}
          >
            ${totalPrice}
          </div>
        </div>

        {/* ── Add Button ── */}
        <div style={{ padding: '0 1.5rem 1.5rem' }}>
          <button
            onClick={handleAdd}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '0.875rem',
              fontSize: '0.9375rem',
              borderRadius: 'var(--radius-md)',
            }}
          >
            Agregar al pedido — ${totalPrice}
          </button>
        </div>
      </div>

      {/* ── Inline Keyframes ── */}
      <style>{`
        @keyframes dc-fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes dc-scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes dc-pricePop {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @media (max-width: 480px) {
          .dc-overlay {
            align-items: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default DrinkCustomizer;
