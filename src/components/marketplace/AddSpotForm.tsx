import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getLocationName } from '@/lib/mapUtils';
import { useParkingSpotsStore } from '@/store/parkingSpots';

interface AddSpotFormProps {
  onSpotAdded: (spot: {
    id: number;
    location: string;
    price: number;
    available: boolean;
    owner: string;
    buyer: string;
    coordinates: { lat: number; lng: number };
  }) => void;
}

const AddSpotForm: React.FC<AddSpotFormProps> = ({ onSpotAdded }) => {
  const [price, setPrice] = useState<number>(10);
  const { toast } = useToast();
  const userId = localStorage.getItem("userId");
  const spots = useParkingSpotsStore((state) => state.spots);

  const addCurrentLocationSpot = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        const isDuplicate = spots.some(spot => {
          const distance = calculateDistance(spot.coordinates.lat, spot.coordinates.lng, coordinates.lat, coordinates.lng);
          return distance < 10 && spot.available;
        });
        if (isDuplicate) {
          toast({
            title: "Error",
            description: "There is already a spot nearby.",
            variant: "destructive",
          });
          return;
        }
        const locationName = await getLocationName(coordinates.lat, coordinates.lng);
        
        const newSpot = {
          id: Date.now(),
          location: locationName,
          price,
          available: true,
          coordinates,
          owner: userId,
          buyer: "",
        };

        onSpotAdded(newSpot);
        
        toast({
          title: "Success",
          description: "New parking spot added at your current location!",
        });
      },
      (error) => {
        toast({
          title: "Error",
          description: "Failed to get your location. Please try again.",
          variant: "destructive",
        });
        console.error("Error getting location:", error);
      }
    );
  };

  return (
    <div className="flex items-center gap-4">
      <Input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        placeholder="Set price in tokens"
        className="max-w-[200px]"
      />
      <Button onClick={addCurrentLocationSpot} className="gap-2">
        <Plus className="w-4 h-4" />
        Add My Spot
      </Button>
    </div>
  );
};

export default AddSpotForm;

function calculateDistance (lat1: number, lng1: number, lat2: number, lng2: number) {
  const earthRadius = 6371; // in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c * 1000; // in meters

  return distance;
};