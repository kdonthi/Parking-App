import { create } from 'zustand';

interface ParkingSpot {
  id: number;
  location: string;
  price: number;
  available: boolean;
  coordinates: { lat: number; lng: number } | null;
}

interface ParkingSpotsStore {
  spots: ParkingSpot[];
  addSpot: (spot: ParkingSpot) => boolean;
}

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const MIN_DISTANCE = 10; // minimum distance in meters between spots

export const useParkingSpotsStore = create<ParkingSpotsStore>((set, get) => ({
  spots: [],
  addSpot: (spot) => {
    if (!spot.coordinates) return false;

    // Check if there's already a spot nearby
    const existingSpots = get().spots;
    const isDuplicate = existingSpots.some((existingSpot) => {
      if (!existingSpot.coordinates) return false;

      const distance = calculateDistance(
        spot.coordinates.lat,
        spot.coordinates.lng,
        existingSpot.coordinates.lat,
        existingSpot.coordinates.lng
      );

      return distance < MIN_DISTANCE;
    });

    if (isDuplicate) {
      return false;
    }

    set((state) => ({ spots: [...state.spots, spot] }));
    return true;
  },
}));