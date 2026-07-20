/**
 * Mock factories for localStorage and SiteContext.
 */

import { vi } from 'vitest';

/**
 * Create a localStorage mock with controllable behavior.
 * @param {object} [initial={}] - Initial key-value pairs
 * @returns {object} Mock localStorage instance
 */
export function createLocalStorageMock(initial = {}) {
  const store = { ...initial };
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
    get length() { return Object.keys(store).length; },
    key: (index) => Object.keys(store)[index] || null,
    _store: store,
  };
}

/**
 * Create a minimal mock of the SiteContext value.
 * @param {object} [overrides] - Override specific context methods
 * @returns {object} Mock context value
 */
export function createSiteContextMock(overrides = {}) {
  return {
    content: {
      siteName: 'Test Café',
      tagline: 'Test tagline',
      seo: { title: 'Test SEO', description: 'Test desc', keywords: 'test' },
      social: { facebook: '', instagram: '', tiktok: '', youtube: '', linkedin: '' },
      whatsappFloat: { number: '+521234567890', message: 'Hola' },
      home: { badge: 'Test', title: 'Test', titleAccent: 'Title', subtitle: 'Sub', ctaText: 'CTA', ctaSecondary: 'CTA2' },
      about: { title: 'About', subtitle: 'Sub', description: 'Desc', mission: 'M', vision: 'V', values: [] },
      services: { title: 'Services', subtitle: 'Sub', cards: [] },
      contact: { title: 'Contact', subtitle: 'Sub', email: 'test@test.com', whatsapp: '+52123', address: 'Addr', mapLat: 19, mapLng: -99 },
      products: { title: 'Products', subtitle: 'Sub' },
      footer: { description: 'Footer', copyright: 'Copy' },
    },
    updateContent: vi.fn(),
    images: { logo: null, portfolio: [] },
    updateImage: vi.fn(),
    removeImage: vi.fn(),
    theme: { accentPrimary: '#8B4513', bgPrimary: '#FAF6F1' },
    updateTheme: vi.fn(),
    resetTheme: vi.fn(),
    pages: [],
    createPage: vi.fn(),
    updatePage: vi.fn(),
    deletePage: vi.fn(),
    movePage: vi.fn(),
    products: [],
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
    moveProduct: vi.fn(),
    analytics: { whatsapp_clicks: 0, visits_simulated: [] },
    trackAnalytics: vi.fn(),
    menuSections: [],
    updateMenuSection: vi.fn(),
    updateMenuItem: vi.fn(),
    addMenuItem: vi.fn(),
    removeMenuItem: vi.fn(),
    addMenuSection: vi.fn(),
    removeMenuSection: vi.fn(),
    moveMenuSection: vi.fn(),
    moveMenuItem: vi.fn(),
    inbox: [],
    addMessage: vi.fn(),
    markMessageRead: vi.fn(),
    deleteMessage: vi.fn(),
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
    changePassword: vi.fn(),
    saveContent: vi.fn(),
    resetContent: vi.fn(),
    saveStatus: null,
    loadingDb: false,
    ...overrides,
  };
}
