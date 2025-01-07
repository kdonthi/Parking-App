import { Store, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Map from '@/components/Map';

const Marketplace = () => {
  const [spots, setSpots] = useState([
    { id: 1, location: "Downtown Plaza", price: 10, available: true, coordinates: null },
    { id: 2, location: "Central Station", price: 15, available: true, coordinates: null },
    { id: 3, location: "Shopping Mall", price: 8, available: false, coordinates: null },
  ]);
  const { toast } = useToast();

  const getLocationName = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=pk.eyJ1Ijoia2F1c2hpa2RyIiwiYSI6ImNtNW1yNHlqbDAzOTYya3E2MWI3ajBkZzYifQ.rX-4rgYQIUsBrJP8gU0IcA`
      );
      const data = await response.json();
      const address = data.features[0]?.text || "My Parking Spot";
      return address;
    } catch (error) {
      console.error("Error getting location name:", error);
      return "My Parking Spot";
    }
  };

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
          id: spots.length + 1,
          location: locationName,
          price: 10,
          available: true,
          coordinates
        };

        setSpots([...spots, newSpot]);
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
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Parking Spot Marketplace</h1>
        <Button onClick={addCurrentLocationSpot} className="gap-2">
          <Plus className="w-4 h-4" />
          Add My Spot
        </Button>
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
            <p className="text-gray-600 mb-4">Price: {spot.price} tokens</p>
            {spot.coordinates && (
              <div className="mb-4 h-[150px] rounded-lg overflow-hidden">
                <Map 
                  center={[spot.coordinates.lng, spot.coordinates.lat]}
                  zoom={15}
                  interactive={false}
                  className="w-full h-full"
                />
              </div>
            )}
            <button
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors"
              disabled={!spot.available}
            >
              {spot.available ? 'Get Spot' : 'Not Available'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;