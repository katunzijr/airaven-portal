import { EAST_AFRICA_VIEWBOX, isWithinEastAfrica } from '@/lib/eastAfrica'

export interface GeocodeResult {
  displayName: string
  lat: number
  lng: number
  city: string
  country: string
  address: string
}

const NOMINATIM = 'https://nominatim.openstreetmap.org'

function parseAddress(parts: Record<string, string>): Pick<GeocodeResult, 'city' | 'country' | 'address'> {
  const city =
    parts.city ||
    parts.town ||
    parts.village ||
    parts.municipality ||
    parts.county ||
    parts.state ||
    ''
  const country = parts.country || ''
  const road = parts.road || parts.pedestrian || parts.neighbourhood || ''
  const house = parts.house_number || ''
  const address = [house, road].filter(Boolean).join(' ') || parts.display_name || city

  return { city, country, address }
}

function mapSearchResult(item: {
  display_name: string
  lat: string
  lon: string
  address?: Record<string, string>
}): GeocodeResult {
  const parts = item.address ?? {}
  const parsed = parseAddress({ ...parts, display_name: item.display_name })
  return {
    displayName: item.display_name,
    lat: Number(item.lat),
    lng: Number(item.lon),
    ...parsed,
  }
}

async function nominatimFetch(path: string): Promise<unknown> {
  const res = await fetch(`${NOMINATIM}${path}`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error('Location search failed')
  return res.json()
}

export async function searchPlaces(query: string): Promise<GeocodeResult[]> {
  const q = query.trim()
  if (q.length < 3) return []

  const data = (await nominatimFetch(
    `/search?format=json&addressdetails=1&limit=10&bounded=1&viewbox=${EAST_AFRICA_VIEWBOX}&q=${encodeURIComponent(q)}`,
  )) as Array<{
    display_name: string
    lat: string
    lon: string
    address?: Record<string, string>
  }>

  return data
    .map(mapSearchResult)
    .filter((r) => isWithinEastAfrica(r.lat, r.lng))
    .slice(0, 6)
}

export async function reverseGeocode(lat: number, lng: number): Promise<GeocodeResult> {
  const data = (await nominatimFetch(
    `/reverse?format=json&addressdetails=1&lat=${lat}&lon=${lng}`,
  )) as {
    display_name: string
    lat: string
    lon: string
    address?: Record<string, string>
  }

  return mapSearchResult(data)
}
