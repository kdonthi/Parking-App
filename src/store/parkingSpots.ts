import { create } from 'zustand';

interface ParkingSpot {
  id: number;
  location: string;
  price: number;
  available: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface ParkingSpotsState {
  spots: ParkingSpot[];
  addSpot: (spot: ParkingSpot) => void;
  updateSpot: (spotId: number, updates: Partial<ParkingSpot>) => void;
  purchaseSpot: (spotId: number) => void;
}

export const useParkingSpotsStore = create<ParkingSpotsState>((set) => ({
  spots: [
    {
      id: 1,
      location: "123 Main St, San Francisco",
      price: 10,
      available: true,
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    {
      id: 2,
      location: "456 Market St, San Francisco",
      price: 15,
      available: true,
      coordinates: { lat: 37.7897, lng: -122.4000 }
    }
  ],
  addSpot: (spot) => 
    set((state) => ({
      spots: [...state.spots, spot]
    })),
  updateSpot: (spotId, updates) =>
    set((state) => ({
      spots: state.spots.map((spot) =>
        spot.id === spotId ? { ...spot, ...updates } : spot
      )
    })),
  purchaseSpot: (spotId) =>
    set((state) => ({
      spots: state.spots.map((spot) =>
        spot.id === spotId ? { ...spot, available: false } : spot
      )
    }))
}));