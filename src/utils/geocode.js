/**
 * Geocode an address using Nominatim (OpenStreetMap).
 * Free, no API key required. Respects usage policy (max 1 req/sec).
 *
 * @param {string} address - Full address string
 * @returns {Promise<{lat: number, lng: number, displayName: string} | null>}
 */
export async function geocodeAddress(address) {
  if (!address || address.trim().length < 3) return null;

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&addressdetails=1`;

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
