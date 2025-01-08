import { Store, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import Map from '@/components/Map';
import { supabase } from '@/integrations/supabase/client';
import { useUserState } from '@/hooks/useUserState';

interface ParkingSpot {
  id: number;
  location: string;
  price: number;
  available: boolean;
  coordinates: { lat: number; lng: number } | null;
}

const Marketplace = () => {
  const [price, setPrice] = useState<number>(10);
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const { toast } = useToast();
  const { userId } = useUserState();

  useEffect(() => {
    fetchSpots();
  }, []);

  const fetchSpots = async () => {
    try {
      const { data, error } = await supabase
        .from('parking_spots')
        .select('*')
        .eq('available', true);

      if (error) throw error;

      setSpots(data.map(spot => ({
        id: spot.id,
        location: spot.location_preview,
        price: spot.price,
        available: spot.available ?? true,
        coordinates: typeof spot.coordinates === 'string' 
          ? JSON.parse(spot.coordinates) 
          : spot.coordinates
      })));
    } catch (error) {
      console.error('Error fetching spots:', error);
      toast({
        title: "Error",
        description: "Failed to load parking spots",
        variant: "destructive",
      });
    }
  };

  const getLocationName = async (lat: number, lng: number): Promise<string> => {
    const accessToken = 'pk.eyJ1Ijoia2F1c2hpa2RyIiwiYSI6ImNtNW1yNHlqbDAzOTYya3E2MWI3ajBkZzYifQ.rX-4rgYQIUsBrJP8gU0IcA';
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.features[0]?.place_name || "My Parking Spot";
    } catch (error) {
      console.error("Error getting location name:", error);
      return "My Parking Spot";
    }
  };

  const handleSpotPurchase = async (spotId: number) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to purchase spots",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error: purchaseError } = await supabase
        .from('spot_purchases')
        .insert([
          { spot_id: spotId, user_id: userId }
        ]);

      if (purchaseError) throw purchaseError;

      // Update spot availability
      const { error: updateError } = await supabase
        .from('parking_spots')
        .update({ available: false })
        .eq('id', spotId);

      if (updateError) throw updateError;

      toast({
        title: "Success!",
        description: "Parking spot purchased successfully.",
      });

      // Refresh spots list
      fetchSpots();
    } catch (error) {
      console.error('Error purchasing spot:', error);
      toast({
        title: "Error",
        description: "Failed to purchase spot. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addCurrentLocationSpot = async () => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add spots",
        variant: "destructive",
      });
      return;
    }

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
        
        try {
          const { error } = await supabase
            .from('parking_spots')
            .insert([{
              location_preview: locationName,
              full_address: locationName,
              price: price,
              available: true,
              coordinates: coordinates
            }]);

          if (error) throw error;

          toast({
            title: "Success",
            description: "New parking spot added at your current location!",
          });

          // Refresh spots list
          fetchSpots();
        } catch (error) {
          console.error('Error adding spot:', error);
          toast({
            title: "Error",
            description: "Failed to add parking spot. Please try again.",
            variant: "destructive",
          });
        }
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
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col gap-6 mb-6">
        <h1 className="text-3xl font-bold">Parking Spot Marketplace</h1>
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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spots.map((spot) => (
          <div key={spot.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
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
            {spot.coordinates && (
              <div className="mb-4 h-[150px] rounded-lg overflow-hidden">
                <Map 
                  center={[spot.coordinates.lng, spot.coordinates.lat]}
                  zoom={15}
                  interactive={false}
                  className="w-full h-full"
                  spots={[spot]}
                  onMarkerClick={handleSpotPurchase}
                />
              </div>
            )}
            <Button
              className="w-full"
              onClick={() => handleSpotPurchase(spot.id)}
              disabled={!spot.available}
            >
              {spot.available ? 'Get Spot' : 'Not Available'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;