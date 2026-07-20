/**
 * Wraps a localStorage write operation to catch QuotaExceededError
 * and show a user-friendly notification instead of crashing.
 *
 * @param {Function} fn - The function that performs localStorage writes
 * @returns {*} The result of fn(), or undefined if quota was exceeded
 */
export function withQuotaGuard(fn) {
  try {
    return fn();
  } catch (error) {
    if (
      error instanceof DOMException &&
      (error.name === 'QuotaExceededError' ||
        error.code === 22 ||
        error.code === 1014)
    ) {
      console.warn(
        'Storage quota exceeded. Try removing some images or data to free up space.'
      );
      // Dispatch a custom event so the app can show a toast/banner
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('storage-quota-error', {
            detail: {
              message:
                'No hay suficiente espacio de almacenamiento. Elimina algunas imágenes para continuar.',
            },
          })
        );
      }
      return undefined;
    }
    throw error;
  }
}
