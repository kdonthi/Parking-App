import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getLocationName } from '@/lib/mapUtils';

interface AddSpotFormProps {
  onSpotAdded: (spot: {
    id: number;
    location: string;
    price: number;
    available: boolean;
    coordinates: { lat: number; lng: number };
  }) => void;
}

const AddSpotForm: React.FC<AddSpotFormProps> = ({ onSpotAdded }) => {
  const [price, setPrice] = useState<number>(10);
  const { toast } = useToast();

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
        
        const locationName = await getLocationName(coordinates.lat, coordinates.lng);
        
        const newSpot = {
          id: Date.now(),
          location: locationName,
          price,
          available: true,
          coordinates
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