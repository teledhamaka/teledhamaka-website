// Haversine formula to calculate distance in meters
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

// Optimized nearest BTS finder
export function findNearestBTS(
  villageLat: number,
  villageLon: number,
  btsList: Array<{latitude: number, longitude: number, site: string}>
): { distance: number, name: string } {
  let minDistance = Infinity;
  let nearestBts = '';

  for (const bts of btsList) {
    // Quick approximation first
    const latDiff = Math.abs(villageLat - bts.latitude);
    const lonDiff = Math.abs(villageLon - bts.longitude);
    const approxDistance = latDiff + lonDiff;
    
    if (approxDistance * 111000 < minDistance * 1.2) {
      const distance = calculateDistance(
        villageLat, villageLon,
        bts.latitude, bts.longitude
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestBts = bts.site;
      }
    }
  }

  return { distance: minDistance, name: nearestBts };
}