import React from 'react';
import { Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Map from '@/components/Map';

interface ParkingSpotCardProps {
  spot: {
    id: number;
    location: string;
    price: number;
    available: boolean;
    coordinates: { lat: number; lng: number };
  };
  onPurchase: (spotId: number) => void;
}

const ParkingSpotCard: React.FC<ParkingSpotCardProps> = ({ spot, onPurchase }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <Store className="w-6 h-6 text-primary" />
        <span className={`px-2 py-1 rounded text-sm ${
          spot.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {spot.available ? 'Available' : 'Taken'}
        </span>
      </div>
      <h3 className="text-lg font-semibold mb-2">{spot.location}</h3>
      <p className="text-gray-600 mb-4">{spot.price} tokens</p>
      <div className="mb-4 h-[150px] rounded-lg overflow-hidden">
        <Map 
          center={[spot.coordinates.lng, spot.coordinates.lat]}
          zoom={10} 
          interactive={false}
          className="w-full h-full"
          spots={[spot]}
          onMarkerClick={onPurchase}
        />
      </div>
      <Button
        className="w-full"
        onClick={() => onPurchase(spot.id)}
        disabled={!spot.available}
      >
        {spot.available ? 'Get Spot' : 'Not Available'}
      </Button>
    </div>
  );
};

export default ParkingSpotCard;