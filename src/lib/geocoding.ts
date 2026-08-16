// OpenStreetMap Nominatim Geocoding Service for Da Nang properties

const GEO_CACHE_PREFIX = "danang_geo_cache_";

// Clean raw address string to extract clean street name
export function cleanStreetName(rawAddress: string): string {
  if (!rawAddress) return "";

  let clean = rawAddress;
  // Remove floor, unit, bedroom info
  clean = clean.replace(/tầng\s*\d+/gi, "");
  clean = clean.replace(/floor\s*\d+/gi, "");
  clean = clean.replace(/\d+pn/gi, "");
  clean = clean.replace(/\d+-bedroom\s*(apartment)?/gi, "");
  clean = clean.replace(/căn hộ\s*/gi, "");
  clean = clean.replace(/apartment\s*/gi, "");
  clean = clean.replace(/studio\s*/gi, "");
  clean = clean.replace(/phòng\s*/gi, "");
  clean = clean.replace(/trống sẵn/gi, "");
  clean = clean.replace(/–|-/g, " ");

  // Remove extra whitespace
  clean = clean.replace(/\s+/g, " ").trim();
  return clean;
}

export async function geocodeAddress(
  rawAddress: string,
  district: string,
  index: number = 0
): Promise<[number, number]> {
  const streetName = cleanStreetName(rawAddress);
  const cacheKey = `${GEO_CACHE_PREFIX}${streetName}_${district}`.toLowerCase().replace(/\s+/g, "_");

  // Deterministic micro-offset (~15 meters) so multiple units in the same building don't overlap completely
  const offsetLat = ((index % 3) - 1) * 0.00018;
  const offsetLng = Math.floor(index / 3) * 0.0002 - 0.0001;

  // 1. Check browser LocalStorage cache
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const [lat, lng] = JSON.parse(cached);
        return [lat + offsetLat, lng + offsetLng];
      }
    } catch {}
  }

  // 2. Perform Geocoding queries with Nominatim
  const queries = [
    `${streetName}, ${district}, Da Nang, Vietnam`,
    `${streetName}, Da Nang, Vietnam`,
    `${district}, Da Nang, Vietnam`,
    `Da Nang, Vietnam`,
  ];

  for (const query of queries) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&limit=1&addressdetails=1`;

      const response = await fetch(url, {
        headers: {
          "User-Agent": "DaNangHomes/1.0 (contact@dananghomes.com)",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);

          if (!isNaN(lat) && !isNaN(lng)) {
            // Save base coordinates to LocalStorage cache
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem(cacheKey, JSON.stringify([lat, lng]));
              } catch {}
            }
            return [lat + offsetLat, lng + offsetLng];
          }
        }
      }
    } catch {
      // Continue to fallback query
    }
  }

  // Default Da Nang Dragon Bridge fallback
  return [16.0600 + offsetLat, 108.2250 + offsetLng];
}
