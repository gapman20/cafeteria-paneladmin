import { describe, it, expect, vi } from 'vitest';
import { compressImage } from '../../utils/compressImage';

// Mock canvas and Image for jsdom
class MockImage {
  constructor() {
    this.onload = null;
    this.onerror = null;
    this._src = null;
  }
  set src(val) {
    this._src = val;
    // Simulate async load
    if (this.onload) {
      setTimeout(() => this.onload(), 0);
    }
  }
  get naturalWidth() { return 2000; }
  get naturalHeight() { return 1500; }
  get width() { return 2000; }
  get height() { return 1500; }
}

// Mock canvas.getContext
const mockToDataURL = vi.fn((format) => `data:${format || 'image/jpeg'};base64,mockdata`);

HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  drawImage: vi.fn(),
}));
HTMLCanvasElement.prototype.toDataURL = mockToDataURL;

describe('compressImage', () => {
  it('returns a data URL with format info', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    // Mock Image constructor globally
    const OriginalImage = globalThis.Image;
    globalThis.Image = MockImage;

    try {
      const result = await compressImage(file);
      expect(result).toHaveProperty('dataUrl');
      expect(result).toHaveProperty('format');
      expect(result.dataUrl).toContain('data:');
    } finally {
      globalThis.Image = OriginalImage;
    }
  });

  it('falls back to JPEG when WebP is not supported', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const OriginalImage = globalThis.Image;
    globalThis.Image = MockImage;

    // Make toDataURL return non-webp for webp probe
    mockToDataURL.mockImplementationOnce((format) => {
      if (format === 'image/webp') return 'data:undefined;base64,';
      return `data:${format};base64,mockdata`;
    });

    try {
      const result = await compressImage(file, { preferWebP: true });
      expect(result.format).toBe('image/jpeg');
    } finally {
      globalThis.Image = OriginalImage;
    }
  });

  it('uses JPEG format when preferWebP is false', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const OriginalImage = globalThis.Image;
    globalThis.Image = MockImage;

    try {
      const result = await compressImage(file, { preferWebP: false });
      expect(result.format).toBe('image/jpeg');
    } finally {
      globalThis.Image = OriginalImage;
    }
  });
});
