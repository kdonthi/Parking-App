import { Store } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Map from '@/components/Map';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface ParkingSpot {
  id: number;
  location_preview: string;
  full_address: string;
  price: number;
  available: boolean;
  coordinates: { lat: number; lng: number };
}

const Shop = () => {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSpots();
  }, []);

  const fetchSpots = async () => {
    try {
      const { data, error } = await supabase
        .from('parking_spots')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSpots(data || []);
    } catch (error) {
      console.error('Error fetching spots:', error);
      toast({
        title: "Error",
        description: "Failed to load parking spots",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSpotPurchase = async (spotId: number) => {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to purchase a spot",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      const { error } = await supabase
        .from('spot_purchases')
        .insert([
          { spot_id: spotId, user_id: session.data.session.user.id }
        ]);

      if (error) throw error;

      // Update local state to mark spot as unavailable
      setSpots(spots.map(spot => 
        spot.id === spotId ? { ...spot, available: false } : spot
      ));

      toast({
        title: "Success!",
        description: "Parking spot purchased successfully. Check your purchases for the full address.",
      });
    } catch (error) {
      console.error('Error purchasing spot:', error);
      toast({
        title: "Error",
        description: "Failed to purchase spot. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col gap-6 mb-6">
        <h1 className="text-3xl font-bold">Available Parking Spots</h1>
      </div>
      
      {/* Map View */}
      <div className="mb-8 h-[400px] rounded-lg overflow-hidden shadow-lg">
        <Map 
          spots={spots.map(spot => ({
            id: spot.id,
            location: spot.location_preview,
            price: spot.price,
            available: spot.available,
            coordinates: {
              lat: spot.coordinates.lat,
              lng: spot.coordinates.lng
            }
          }))}
          onMarkerClick={handleSpotPurchase}
          className="w-full h-full"
        />
      </div>

      {/* Grid View */}
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
            <h3 className="text-lg font-semibold mb-2">{spot.location_preview}</h3>
            <p className="text-gray-600 mb-4">{spot.price} tokens</p>
            <div className="mb-4 h-[150px] rounded-lg overflow-hidden">
              <Map 
                center={[spot.coordinates.lng, spot.coordinates.lat]}
                zoom={15}
                interactive={false}
                className="w-full h-full"
                spots={[{
                  id: spot.id,
                  location: spot.location_preview,
                  price: spot.price,
                  available: spot.available,
                  coordinates: spot.coordinates
                }]}
              />
            </div>
            <Button
              className="w-full"
              onClick={() => handleSpotPurchase(spot.id)}
              disabled={!spot.available}
            >
              {spot.available ? 'Purchase Spot' : 'Not Available'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;