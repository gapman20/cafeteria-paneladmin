/**
 * Geocode an address using Nominatim (OpenStreetMap).
 * Free, no API key required. Respects usage policy (max 1 req/sec).
 *
 * @param {object} addr - Address fields
 * @param {string} addr.address - Street address
 * @param {string} addr.postalCode - Postal/ZIP code
 * @param {string} addr.city - City
 * @param {string} addr.state - State/Province
 * @param {string} addr.country - Country
 * @returns {Promise<{lat: number, lng: number, displayName: string} | null>}
 */
export async function geocodeAddress({ address, postalCode, city, state, country }) {
  const parts = [address, postalCode, city, state, country].filter(Boolean);
  const query = parts.join(', ');
  if (query.length < 3) return null;

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=1`;

  const res = await fetch(url, {
    headers: { 'Accept-Language': 'es' },
  });

  if (!res.ok) return null;

  const data = await res.json();
  if (!data || data.length === 0) return null;

  const result = data[0];
  return {
    lat: parseFloat(result.lat),
    lng: parseFloat(result.lon),
    displayName: result.display_name,
  };
}
