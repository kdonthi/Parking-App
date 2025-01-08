import { get } from 'react-hook-form';
import { create } from 'zustand';

export interface ParkingSpot {
  id: number;
  location: string;
  price: number;
  available: boolean;
  owner: string;
  buyer: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface User {
  owner: string,
  tokens: number
}

interface ParkingSpotsState {
  spots: ParkingSpot[];
  addSpot: (spot: ParkingSpot, owner: string) => void;
  purchaseSpot: (spotId: number, userId: string) => void;
}

interface UsersState {
  users: User[];
  getUser: (owner: string) => User;
  addUser: (owner: string) => void;
  updateUser: (owner: string, tokens: number) => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  getUser: (owner) => {
    const state = useUsersStore.getState();
    const user = state.users.find((user) => user.owner === owner);
    if (!user) {
      throw new Error(`User ${owner} not found`);
    }
    return user;
  },
  addUser: (owner) =>
    set((state) => ({
      users: [...state.users, { owner, tokens: 0 }]
    })),
  updateUser: (owner, tokens) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.owner === owner ? { ...user, tokens } : user
      )
    }))
}));


export const useParkingSpotsStore = create<ParkingSpotsState>((set) => ({
  spots: [
    {
      id: 1,
      location: "123 Main St, San Francisco",
      price: 10,
      available: true,
      owner: "",
      buyer: "",
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    {
      id: 2,
      location: "456 Market St, San Francisco",
      price: 15,
      available: true,
      owner: "",
      buyer: "",
      coordinates: { lat: 37.7897, lng: -122.4000 }
    }
  ],
  addSpot: (spot) => 
    set((state) => ({
      spots: [...state.spots, spot]
    })),
  purchaseSpot: (spotId, userId) =>
    set((state) => ({
      spots: state.spots.map((spot) =>
        spot.id === spotId ? { ...spot, available: false, owner: userId } : spot
      )
    }))
}));