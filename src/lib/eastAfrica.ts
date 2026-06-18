/** Southwest and northeast corners for Leaflet / map clamping. */
export const EAST_AFRICA_SW = { lat: -12, lng: 28.5 } as const
export const EAST_AFRICA_NE = { lat: 12.5, lng: 42 } as const

/** Nominatim viewbox: left, top, right, bottom (lon/lat). */
export const EAST_AFRICA_VIEWBOX = `${EAST_AFRICA_SW.lng},${EAST_AFRICA_NE.lat},${EAST_AFRICA_NE.lng},${EAST_AFRICA_SW.lat}`

export function clampToEastAfrica(lat: number, lng: number): { lat: number; lng: number } {
  return {
    lat: Math.min(Math.max(lat, EAST_AFRICA_SW.lat), EAST_AFRICA_NE.lat),
    lng: Math.min(Math.max(lng, EAST_AFRICA_SW.lng), EAST_AFRICA_NE.lng),
  }
}

export function isWithinEastAfrica(lat: number, lng: number): boolean {
  return (
    lat >= EAST_AFRICA_SW.lat &&
    lat <= EAST_AFRICA_NE.lat &&
    lng >= EAST_AFRICA_SW.lng &&
    lng <= EAST_AFRICA_NE.lng
  )
}
