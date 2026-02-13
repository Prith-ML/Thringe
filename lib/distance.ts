/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in miles
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Check if a point is within a given radius of another point
 */
export function isWithinRadius(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  radiusMiles: number
): boolean {
  const distance = calculateDistance(lat1, lon1, lat2, lon2)
  return distance <= radiusMiles
}

/**
 * Filter items by location (for client-side filtering if needed)
 */
export function filterItemsByDistance<T extends { latitude?: number | null; longitude?: number | null }>(
  items: T[],
  userLat: number,
  userLng: number,
  radiusMiles: number
): T[] {
  return items.filter((item) => {
    if (!item.latitude || !item.longitude) return false
    return isWithinRadius(userLat, userLng, item.latitude, item.longitude, radiusMiles)
  })
}
