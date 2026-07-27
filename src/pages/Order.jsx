import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ShoppingCart, Plus, Minus, Send, Trash2, ShoppingBag, MapPin, User, Phone, FileText } from 'lucide-react';
import { useSite, SECTION_ICON_MAP } from '../context/SiteContext';
import { parsePrice } from '../utils/priceParser';
import { buildOrderMessage, getWhatsAppUrl } from '../utils/whatsappMessage';
import { validateRequired, validatePhone } from '../utils/validation';
import SEO from '../components/SEO';
import ImageFallback from '../components/ImageFallback';
import DrinkCustomizer from '../components/DrinkCustomizer';

const CART_KEY = 'order_cart_v1';
const INITIAL_CART = { items: [], customer: { name: '', address: '', phone: '', notes: '' } };

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.items)) return parsed;
    }
  } catch { /* ignore */ }
  return INITIAL_CART;
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch { /* quota exceeded — work in memory only */ }
}

/* ─── Input Style ──────────────────────────────────────────────────────────── */
const inputStyle = {
  width: '100%',
  padding: '0.625rem 0.875rem',
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  color: 'var(--color-text)',
  borderRadius: 'var(--radius-md)',
  outline: 'none',
  fontFamily: 'var(--font-body)',
  fontSize: '0.875rem',
  transition: 'border-color 120ms ease',
};
const inputErrorStyle = { ...inputStyle, borderColor: '#EF4444' };
const labelStyle = {
  display: 'block',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'var(--color-text-secondary)',
  marginBottom: '0.25rem',
};
const errorTextStyle = {
  color: '#EF4444',
  fontSize: '0.75rem',
  marginTop: '0.15rem',
};

/* ─── Order Page ────────────────────────────────────────────────────────────── */
const Order = () => {
  const { menuSections, content, tableNumber } = useSite();
  const [cart, setCart] = useState(loadCart);
  const [errors, setErrors] = useState({});
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [customizerItem, setCustomizerItem] = useState(null); // { item, sectionId, sectionColor, sectionEmoji }

  // Sync cart to localStorage
  useEffect(() => { saveCart(cart); }, [cart]);

  // Auto-dismiss submitted banner with cleanup
  useEffect(() => {
    if (!submitted) return;
    const id = setTimeout(() => setSubmitted(false), 3000);
    return () => clearTimeout(id);
  }, [submitted]);

  const whatsappNumber = content?.whatsappFloat?.number || '';

  // ── Cart helpers ──────────────────────────────────────────────────────────
  const addItemWithCustomization = useCallback((item, sectionId, sectionEmoji, customization) => {
    setCart(prev => ({
      ...prev,
      items: [...prev.items, {
        cartId: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: item.name,
        price: customization.totalPrice,
        qty: 1,
        sectionId,
        emoji: sectionEmoji,
        customization: {
          size: customization.size?.key || null,
          sizeLabel: customization.size?.label || null,
          milk: customization.milk?.key || null,
          milkLabel: customization.milk?.label || null,
          sweetness: customization.sweetness?.key || null,
          sweetnessLabel: customization.sweetness?.label || null,
          extras: customization.extras?.map(e => e.key) || [],
          extrasLabels: customization.extras?.map(e => e.label) || [],
          excludedIngredients: customization.excludedIngredients || [],
          summary: customization.summary || '',
        },
      }],
    }));
  }, []);

  const decrementItem = useCallback((cartId) => {
    setCart(prev => {
      const idx = prev.items.findIndex(i => i.cartId === cartId);
      if (idx < 0) return prev;
      const item = prev.items[idx];
      if (item.qty <= 1) {
        return { ...prev, items: prev.items.filter((_, j) => j !== idx) };
      }
      return { ...prev, items: prev.items.map((i, j) => j === idx ? { ...i, qty: i.qty - 1 } : i) };
    });
  }, []);

  const incrementCartItem = useCallback((cartId) => {
    setCart(prev => {
      const idx = prev.items.findIndex(i => i.cartId === cartId);
      if (idx < 0) return prev;
      return { ...prev, items: prev.items.map((i, j) => j === idx ? { ...i, qty: i.qty + 1 } : i) };
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart(prev => ({ ...prev, items: [] }));
  }, []);

  const updateCustomer = useCallback((field, value) => {
    setCart(prev => ({ ...prev, customer: { ...prev.customer, [field]: value } }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  // ── Computed ──────────────────────────────────────────────────────────────
  const totalItems = useMemo(() => cart.items.reduce((sum, i) => sum + i.qty, 0), [cart.items]);
  const totalPrice = useMemo(() => cart.items.reduce((sum, i) => sum + i.price * i.qty, 0), [cart.items]);

  const getItemQty = useCallback((name, sectionId) => {
    const found = cart.items.find(i => i.name === name && i.sectionId === sectionId);
    return found ? found.qty : 0;
  }, [cart.items]);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (cart.items.length === 0) return;

    // Validate required fields
    const newErrors = {};
    const nameResult = validateRequired(cart.customer.name, 'Nombre');
    const phoneResult = validatePhone(cart.customer.phone);

    if (!nameResult.valid) newErrors.name = nameResult.error;
    if (!phoneResult.valid) newErrors.phone = phoneResult.error;
    
    if (!tableNumber) {
      const addressResult = validateRequired(cart.customer.address, 'Dirección');
      if (!addressResult.valid) newErrors.address = addressResult.error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!whatsappNumber) {
      setErrors({ submit: 'Número de WhatsApp no configurado' });
      return;
    }

    const customerData = { ...cart.customer, tableNumber, siteName: content.siteName };
    const message = buildOrderMessage(cart.items, customerData);
    const url = getWhatsAppUrl(whatsappNumber, message);
    window.open(url, '_blank', 'noopener,noreferrer');

    // Clear cart
    setCart(prev => ({ ...prev, items: [] }));
    setErrors({});
    setSubmitted(true);
  }, [cart, whatsappNumber]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="page order-page" style={{ position: 'relative', zIndex: 1 }}>
      <SEO title={`Pedir | ${content.siteName}`} description="Arma tu pedido y envíalo por WhatsApp" />

      {/* Background glow */}
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '400px', background: 'var(--color-accent)', filter: 'blur(200px)', opacity: '0.05', borderRadius: '50%', zIndex: -1 }} />

      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem', marginTop: '1rem' }}>
        <div className="animate-fade-up">
          <h1 className="h1-premium">Arma tu Pedido</h1>
          <p className="subtitle" style={{ maxWidth: '480px', margin: '0 auto' }}>
            Explora nuestro menú, agrega lo que gustes y envía tu pedido directo por WhatsApp.
          </p>
        </div>
      </header>

      {submitted && (
        <div className="animate-fade-up" style={{
          textAlign: 'center', padding: '1rem', marginBottom: '1.5rem',
          background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: 'var(--radius-md)', color: '#22c55e', fontWeight: 600, fontSize: '0.9rem',
        }}>
          ¡Pedido enviado por WhatsApp! Tu carrito se ha vaciado.
        </div>
      )}

      {/* Two-column grid */}
      <div className="order-grid">
        {/* ── Menu Column ── */}
        <div className="order-menu">
          {menuSections.length === 0 && (
            <div className="glass-card-static" style={{ textAlign: 'center', padding: '3rem' }}>
              <ShoppingBag size={32} style={{ color: 'var(--color-text-muted)', marginBottom: '0.75rem' }} />
              <p style={{ color: 'var(--color-text-secondary)' }}>No hay productos disponibles</p>
            </div>
          )}

          {menuSections.map((section) => {
            const Icon = SECTION_ICON_MAP[section.icon] || SECTION_ICON_MAP.coffee;
            return (
              <section key={section.id} style={{ marginBottom: '2rem' }}>
                {/* Section Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ color: section.color, display: 'flex' }}><Icon size={18} /></div>
                  <h2 style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700,
                    color: 'var(--color-text)', margin: 0,
                  }}>{section.title}</h2>
                  <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${section.color}40, transparent)` }} />
                </div>

                {/* Items */}
                {section.items.map((item, idx) => {
                  const qty = getItemQty(item.name, section.id);
                  return (
                    <div key={idx} className="glass-card" style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.875rem 1rem', marginBottom: '0.5rem', gap: '0.75rem',
                      cursor: 'pointer',
                    }}
                    onClick={(e) => {
                      // Don't open customizer if clicking on the +/- buttons
                      if (e.target.closest('button')) return;
                      setCustomizerItem({ item, sectionId: section.id, sectionColor: section.color, sectionEmoji: item.img || '🍽️' });
                    }}
                    >
                      {/* Thumbnail image or emoji */}
                      {item.image ? (
                        <div style={{
                          width: '56px', height: '56px', borderRadius: 'var(--radius-md)',
                          overflow: 'hidden', flexShrink: 0,
                          background: `linear-gradient(135deg, ${section.color}20, ${section.color}08)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <ImageFallback
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      ) : (
                        <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{item.img}</span>
                      )}

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{
                            fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem',
                            color: 'var(--color-text)',
                          }}>{item.name}</span>
                        </div>
                        <span style={{
                          fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 700,
                          fontFamily: 'var(--font-display)',
                        }}>{item.price}</span>
                      </div>

                      {/* Quantity controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexShrink: 0 }}>
                        {qty > 0 && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const found = cart.items.find(i => i.name === item.name && i.sectionId === section.id && !i.customization);
                                if (found) decrementItem(found.cartId);
                              }}
                              aria-label={`Reducir ${item.name}`}
                              style={{
                                width: '30px', height: '30px', borderRadius: 'var(--radius-full)',
                                border: '1px solid var(--color-border)', background: 'var(--color-surface)',
                                color: 'var(--color-text)', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', cursor: 'pointer', fontSize: '0.8rem',
                              }}
                            >
                              <Minus size={14} />
                            </button>
                            <span style={{
                              minWidth: '24px', textAlign: 'center', fontWeight: 700,
                              fontFamily: 'var(--font-display)', fontSize: '0.9rem',
                              color: 'var(--color-text)',
                            }}>{qty}</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </section>
            );
          })}
        </div>

        {/* ── Cart Column ── */}
        <div className={`order-cart${mobileCartOpen ? ' mobile-open' : ''}`}>
          <div className="glass-card-static" style={{ padding: '1.25rem', position: 'sticky', top: 'calc(var(--nav-height) + 1rem)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingCart size={18} style={{ color: 'var(--color-accent)' }} />
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700,
                  color: 'var(--color-text)', margin: 0,
                }}>Tu Pedido</h3>
              </div>
              {cart.items.length > 0 && (
                <button onClick={clearCart} className="btn-ghost" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}
                  aria-label="Vaciar carrito"
                >
                  <Trash2 size={12} /> Limpiar
                </button>
              )}
            </div>

            {/* Cart items */}
            {cart.items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                <ShoppingCart size={28} style={{ marginBottom: '0.5rem', opacity: 0.4 }} />
                <p>Tu carrito está vacío</p>
              </div>
            ) : (
              <div style={{ maxHeight: '220px', overflowY: 'auto', marginBottom: '1rem' }}>
                {cart.items.map((item, idx) => (
                  <div key={item.cartId || idx} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.5rem 0', borderBottom: idx < cart.items.length - 1 ? '1px solid var(--color-border)' : 'none',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.emoji} {item.name}
                      </div>
                      {item.customization?.summary && (
                        <div style={{ fontSize: '0.6875rem', color: 'var(--color-accent)', marginTop: '0.1rem' }}>
                          {item.customization.summary}
                        </div>
                      )}
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        ×{item.qty} — ${item.price * item.qty}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0, marginLeft: '0.5rem' }}>
                      <button
                        onClick={() => decrementItem(item.cartId)}
                        style={{
                          width: '24px', height: '24px', borderRadius: 'var(--radius-full)',
                          border: '1px solid var(--color-border)', background: 'transparent',
                          color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', cursor: 'pointer', fontSize: '0.7rem',
                        }}
                        aria-label={`Reducir ${item.name}`}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, minWidth: '16px', textAlign: 'center', color: 'var(--color-text)' }}>{item.qty}</span>
                      <button
                        onClick={() => incrementCartItem(item.cartId)}
                        style={{
                          width: '24px', height: '24px', borderRadius: 'var(--radius-full)',
                          background: 'var(--color-accent)', border: 'none',
                          color: 'var(--btn-text)', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', cursor: 'pointer',
                        }}
                        aria-label={`Agregar ${item.name}`}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            {cart.items.length > 0 && (
              <div style={{
                display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0',
                borderTop: '1px solid var(--color-border)', marginBottom: '1rem',
              }}>
                <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                  Total ({totalItems} {totalItems === 1 ? 'artículo' : 'artículos'})
                </span>
                <span style={{ fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--color-accent)' }}>
                  ${totalPrice}
                </span>
              </div>
            )}

            {/* Checkout form */}
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1rem' }}>
                <div>
                  <label style={labelStyle}><User size={12} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} /> Nombre *</label>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={cart.customer.name}
                    onChange={e => updateCustomer('name', e.target.value)}
                    style={errors.name ? inputErrorStyle : inputStyle}
                  />
                  {errors.name && <div style={errorTextStyle}>{errors.name}</div>}
                </div>

                {!tableNumber && (
                  <div>
                    <label style={labelStyle}><MapPin size={12} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} /> Dirección *</label>
                    <input
                      type="text"
                      placeholder="Calle, número, colonia"
                      value={cart.customer.address}
                      onChange={e => updateCustomer('address', e.target.value)}
                      style={errors.address ? inputErrorStyle : inputStyle}
                    />
                    {errors.address && <div style={errorTextStyle}>{errors.address}</div>}
                  </div>
                )}

                <div>
                  <label style={labelStyle}><Phone size={12} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} /> Teléfono *</label>
                  <input
                    type="tel"
                    placeholder="+52 123 456 7890"
                    value={cart.customer.phone}
                    onChange={e => updateCustomer('phone', e.target.value)}
                    style={errors.phone ? inputErrorStyle : inputStyle}
                  />
                  {errors.phone && <div style={errorTextStyle}>{errors.phone}</div>}
                </div>

                <div>
                  <label style={labelStyle}><FileText size={12} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} /> Notas</label>
                  <textarea
                    placeholder="Instrucciones especiales (opcional)"
                    rows={2}
                    value={cart.customer.notes}
                    onChange={e => updateCustomer('notes', e.target.value)}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }}
                  />
                </div>
              </div>

              {/* Error banner */}
              {errors.submit && (
                <div style={{
                  padding: '0.5rem 0.75rem', marginBottom: '0.75rem',
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 'var(--radius-md)', color: '#EF4444', fontSize: '0.8rem',
                }}>
                  {errors.submit}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={cart.items.length === 0}
                className="btn-primary"
                style={{
                  width: '100%', padding: '0.75rem',
                  opacity: cart.items.length === 0 ? 0.5 : 1,
                  cursor: cart.items.length === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                <Send size={16} />
                Enviar Pedido por WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Mobile Floating Bar ── */}
      {totalItems > 0 && (
        <div
          className="order-floating-bar"
          onClick={() => setMobileCartOpen(!mobileCartOpen)}
          role="button"
          tabIndex={0}
          aria-label={`Ver carrito: ${totalItems} artículos, $${totalPrice}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingCart size={18} />
            <span style={{ fontWeight: 700 }}>{totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}</span>
          </div>
          <span style={{ fontWeight: 800, fontFamily: 'var(--font-display)' }}>${totalPrice}</span>
        </div>
      )}

      {/* ── Drink Customizer Modal ── */}
      {customizerItem && (
        <DrinkCustomizer
          item={customizerItem.item}
          sectionId={customizerItem.sectionId}
          sectionColor={customizerItem.sectionColor}
          sectionEmoji={customizerItem.sectionEmoji}
          onClose={() => setCustomizerItem(null)}
          onAdd={(customization) => {
            addItemWithCustomization(
              customizerItem.item,
              customizerItem.sectionId,
              customizerItem.sectionEmoji,
              customization,
            );
            setCustomizerItem(null);
          }}
        />
      )}
    </div>
  );
};

export default Order;
