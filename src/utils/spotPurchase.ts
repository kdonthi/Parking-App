import { useToast } from '@/hooks/use-toast';
import { useParkingSpotsStore, useUsersStore } from '@/store/parkingSpots';

export const useHandleSpotPurchase = () => {
    const { toast } = useToast();
    const purchaseSpot = useParkingSpotsStore((state) => state.purchaseSpot);
    const users = useUsersStore((state) => state.users);
    const spots = useParkingSpotsStore((state) => state.spots);

    const handleSpotPurchase = (spotId: number) => {
        const userId = localStorage.getItem("userId");
        const user = users.find(u => u.owner === userId);
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

            if (spot.owner === user.owner) {
                toast({
                    title: "Error",
                    description: "Dis your spot lol",
                    variant: "destructive",
                });
                return;
            }

            purchaseSpot(spotId, userId);

            const owner = users.find(u => u.owner === spot.owner);
            spot.buyer = user.owner;
            user.tokens -= spot.price;
            owner.tokens += spot.price;

            toast({
                title: "Success!",
                description: "Parking spot purchased successfully.",
            });
        }
    };

    return handleSpotPurchase;
}; 