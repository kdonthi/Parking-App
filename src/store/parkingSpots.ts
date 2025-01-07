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
  addSpot: (spot: ParkingSpot) => void;
}

export const useParkingSpotsStore = create<ParkingSpotsStore>((set) => ({
  spots: [],
  addSpot: (spot) => set((state) => ({ spots: [...state.spots, spot] })),
}));