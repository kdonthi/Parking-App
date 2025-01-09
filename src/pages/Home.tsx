import { useEffect, useState } from 'react';
import Map from '../components/Map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useParkingSpotsStore, useUsersStore } from '@/store/parkingSpots';
import { useUserState } from '@/hooks/useUserState';
import { useHandleSpotPurchase } from '@/utils/spotPurchase';

const Home = () => {
  const spots = useParkingSpotsStore((state) => state.spots);
  const users = useUsersStore((store) => store.users);
  const handleSpotPurchase = useHandleSpotPurchase();

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Available Parking Spots</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[400px]">
          <Map 
            spots={spots} 
            className="w-full h-full rounded-lg"
            onMarkerClick={(spotId) => handleSpotPurchase(spotId)}
          />
        </div>
        <div className="space-y-4">
          {spots.map((spot) => (
            <Card key={spot.id}>
              <CardHeader>
                <CardTitle className="text-lg">{spot.location.replace(/^\d+\s*/, '')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{spot.price} tokens</p>
                <p className={`text-sm ${spot.available ? 'text-green-600' : 'text-red-600'}`}>
                  {spot.available ? 'Available' : 'Taken'}
                </p>
                {spot.available && (
                  <Button 
                    className="mt-2"
                    onClick={() => handleSpotPurchase(spot.id)}
                  >
                    Get Spot
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;