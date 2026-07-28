const API_BASE = '/api/sheet';

/**
 * Check if the response is valid JSON (not a raw JS file served by Vite).
 */
function isApiAvailable(response) {
  const contentType = response.headers.get('content-type') || '';
  return contentType.includes('application/json');
}

/**
 * Fetch all data from the Google Sheet backend.
 * Returns null if the API is not available (local dev without serverless functions).
 * @returns {Promise<Object|null>}
 */
export async function fetchAllData() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) return null;
    if (!isApiAvailable(res)) return null;
    return res.json();
  } catch {
    // API not reachable (local dev, no env vars, network error)
    return null;
  }
}

/**
 * Save a single key-value pair to the Google Sheet backend.
 * @param {string} key - The data key (e.g. "content", "theme", "pages")
 * @param {*} value - The value to store (will be JSON-stringified)
 * @returns {Promise<Object>}
 */
export async function saveData(key, value) {
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    if (!res.ok) throw new Error(`Failed to save: ${res.status}`);
    if (!isApiAvailable(res)) throw new Error('API not available');
    return res.json();
  } catch (err) {
    console.warn(`saveData('${key}') failed:`, err.message);
    throw err;
  }
}
