/**
 * Shared image compression utility.
 * Resizes images to a max dimension while preserving aspect ratio.
 * Auto-detects WebP support and falls back to JPEG.
 *
 * @param {File} file - The image file to compress
 * @param {object} [options]
 * @param {number} [options.maxWidth=800] - Max dimension in pixels
 * @param {number} [options.quality=0.7] - Output quality (0-1)
 * @param {boolean} [options.preferWebP=true] - Try WebP first, fall back to JPEG
 * @returns {Promise<{ dataUrl: string, format: string }>}
 */
export async function compressImage(file, options = {}) {
  const { maxWidth = 800, quality = 0.7, preferWebP = true } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;

        if (w > maxWidth || h > maxWidth) {
          if (w > h) {
            h = Math.round((h / w) * maxWidth);
            w = maxWidth;
          } else {
            w = Math.round((w / h) * maxWidth);
            h = maxWidth;
          }
        }

        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);

        let format = 'image/jpeg';
        let dataUrl;

        if (preferWebP) {
          try {
            const webpDataUrl = canvas.toDataURL('image/webp', quality);
            // Verify the browser actually produced a WebP data URL
            if (webpDataUrl.startsWith('data:image/webp')) {
              dataUrl = webpDataUrl;
              format = 'image/webp';
            } else {
              throw new Error('WebP not supported');
            }
          } catch {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
            format = 'image/jpeg';
          }
        } else {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve({ dataUrl, format });
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
