import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useParkingSpotsStore, useUsersStore } from '@/store/parkingSpots';
import AddSpotForm from '@/components/marketplace/AddSpotForm';
import ParkingSpotCard from '@/components/marketplace/ParkingSpotCard';
import { useUserState } from '@/hooks/useUserState';

const Marketplace = () => {
  const spots = useParkingSpotsStore((state) => state.spots);
  const addSpot = useParkingSpotsStore((state) => state.addSpot);
  const purchaseSpot = useParkingSpotsStore((state) => state.purchaseSpot);
  const { userId } = useUserState();
  const { toast } = useToast();

  const users = useUsersStore((state) => state.users);
  const user = users.find(u => u.owner === userId);
  const handleSpotPurchase = (spotId: number) => {
    const spot = spots.find(s => s.id === spotId);
    if (spot && spot.available) {
      if (spot.price > user.tokens) {
        toast({
          title: "Error",
          description: "Insufficient tokens to purchase this spot.",
          variant: "destructive",
        });
        return;
      }
    
      purchaseSpot(spotId, userId);
      
      const owner =  users.find(u => u.owner === spot.owner);
      spot.buyer = user.owner;
      user.tokens -= spot.price;
      owner.tokens += spot.price
      
      toast({
        title: "Success!",
        description: "Parking spot purchased successfully.",
      });
    }
    
    console.log(spot.buyer, userId, user);

  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col gap-6 mb-6">
        <h1 className="text-3xl font-bold">Parking Spot Marketplace</h1>
        <AddSpotForm onSpotAdded={(newSpot) => {
          addSpot(newSpot, userId);
        }} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spots.map((spot) => (
          <ParkingSpotCard
            key={spot.id}
            spot={spot}
            onPurchase={handleSpotPurchase}
          />
        ))}
      </div>
    </div>
  );
};

export default Marketplace;