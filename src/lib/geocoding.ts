// High-Precision Geocoding Service for Da Nang Properties

const GEO_CACHE_PREFIX = "v3_danang_geo_cache_";

// High-precision coordinates for popular streets & quarters in Da Nang
const EXACT_STREET_COORDINATES: Record<string, [number, number]> = {
  // Sơn Trà District
  "an my 7": [16.0618, 108.2325], // Đường An Mỹ 7 (Sơn Trà - sát Cầu Rồng / Nguyễn Công Trừ / Võ Văn Kiệt)
  "an mỹ 7": [16.0618, 108.2325],
  "an my": [16.0618, 108.2325],
  "an mỹ": [16.0618, 108.2325],
  "pham cu luong": [16.0612, 108.2305],
  "phạm cự lượng": [16.0612, 108.2305],
  "nguyen cong tru": [16.0635, 108.2320],
  "nguyễn công trừ": [16.0635, 108.2320],
  "vo van kiet": [16.0615, 108.2340],
  "võ văn kiệt": [16.0615, 108.2340],
  "phuoc my": [16.0590, 108.2420],
  "phước mỹ": [16.0590, 108.2420],
  "my khe": [16.0580, 108.2410],
  "mỹ khê": [16.0580, 108.2410],

  // Ngũ Hành Sơn District (Expat Quarter & An Thượng Streets)
  "an thuong 38": [16.0478, 108.2435], // Đường An Thượng 38
  "an thượng 38": [16.0478, 108.2435],
  "an thuong 26": [16.0490, 108.2425],
  "an thượng 26": [16.0490, 108.2425],
  "an thuong": [16.0485, 108.2420],
  "an thượng": [16.0485, 108.2420],
  "pham kiet": [16.0350, 108.2434], // Đường Phạm Kiệt
  "phạm kiệt": [16.0350, 108.2434],
  "my an": [16.0480, 108.2425],
  "mỹ an": [16.0480, 108.2425],
  "khue my": [16.0350, 108.2440],
  "khuê mỹ": [16.0350, 108.2440],
  "vo nguyen giap": [16.0450, 108.2460],
  "võ nguyên giáp": [16.0450, 108.2460],

  // Hải Châu District
  "bach dang": [16.0610, 108.2220],
  "bạch đằng": [16.0610, 108.2220],
  "tran phu": [16.0615, 108.2210],
  "trần phú": [16.0615, 108.2210],
  "nguyen van linh": [16.0600, 108.2180],
  "nguyễn văn linh": [16.0600, 108.2180],
};

// Clean raw address string to extract clean street name
export function cleanStreetName(rawAddress: string): string {
  if (!rawAddress) return "";

  let clean = rawAddress;
  // Strip English and Vietnamese prefixes/suffixes
  clean = clean.replace(/\bstreet\b/gi, "");
  clean = clean.replace(/\bst\b/gi, "");
  clean = clean.replace(/\bđường\b/gi, "");
  clean = clean.replace(/\bđ\.\b/gi, "");
  clean = clean.replace(/\broad\b/gi, "");

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
  clean = clean.replace(/\s+/g, " ").trim();

  return clean;
}

export async function geocodeAddress(
  rawAddress: string,
  district: string,
  index: number = 0
): Promise<[number, number]> {
  const streetName = cleanStreetName(rawAddress);
  const normalizedStreet = streetName.toLowerCase();
  const cacheKey = `${GEO_CACHE_PREFIX}${normalizedStreet}_${district}`
    .toLowerCase()
    .replace(/\s+/g, "_");

  // Micro-offset (~15 meters) so multiple units in the same building don't overlap completely
  const offsetLat = ((index % 3) - 1) * 0.00018;
  const offsetLng = Math.floor(index / 3) * 0.0002 - 0.0001;

  // 1. High-precision Dictionary Lookup
  for (const [key, coords] of Object.entries(EXACT_STREET_COORDINATES)) {
    if (normalizedStreet.includes(key)) {
      return [coords[0] + offsetLat, coords[1] + offsetLng];
    }
  }

  // 2. Check browser LocalStorage cache
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const [lat, lng] = JSON.parse(cached);
        return [lat + offsetLat, lng + offsetLng];
      }
    } catch {}
  }

  // 3. Smart Geocoding API Queries (Supports English "An Thuong 38 Street", "Pham Kiet Street", etc.)
  const queries = [
    `Đường ${streetName}, ${district}, Đà Nẵng, Việt Nam`,
    `Đường ${streetName}, Đà Nẵng, Việt Nam`,
    `${streetName} Street, ${district}, Da Nang, Vietnam`,
    `${streetName}, Da Nang, Vietnam`,
    `${district}, Da Nang, Vietnam`,
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
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem(cacheKey, JSON.stringify([lat, lng]));
              } catch {}
            }
            return [lat + offsetLat, lng + offsetLng];
          }
        }
      }
    } catch {}
  }

  // Default Da Nang Dragon Bridge fallback
  return [16.0600 + offsetLat, 108.2250 + offsetLng];
}
