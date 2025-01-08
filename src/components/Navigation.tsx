import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, ShoppingBag, Store, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PurchasedSpot {
  id: number;
  full_address: string;
  location_preview: string;
  price: number;
  purchased_at: string;
}

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [purchasedSpots, setPurchasedSpots] = useState<PurchasedSpot[]>([]);
  
  const tabs = [
    { path: '/', label: 'Home', icon: MapPin },
    { path: '/marketplace', label: 'Marketplace', icon: Store },
    { path: '/shop', label: 'Shop', icon: ShoppingBag },
    { path: '/about', label: 'About', icon: User },
  ];
  
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
    
    if (storedUserId) {
      fetchPurchasedSpots(storedUserId);
    }
  }, []);

  const fetchPurchasedSpots = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('spot_purchases')
        .select(`
          spot_id,
          purchased_at,
          parking_spots (
            id,
            full_address,
            location_preview,
            price
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      const spots = data.map(purchase => ({
        id: purchase.parking_spots.id,
        full_address: purchase.parking_spots.full_address,
        location_preview: purchase.parking_spots.location_preview,
        price: purchase.parking_spots.price,
        purchased_at: purchase.purchased_at,
      }));

      setPurchasedSpots(spots);
    } catch (error) {
      console.error('Error fetching purchased spots:', error);
      toast({
        title: "Error",
        description: "Failed to load your parking spots",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setUserId(null);
    navigate('/auth');
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-primary font-bold text-xl">ParkSpot</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-4">
              {tabs.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${location.pathname === path
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Link>
              ))}
            </div>
            <div className="flex items-center pl-4 border-l border-gray-200">
              {userId && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="mr-4">
                      <span className="text-primary font-medium">{userId}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-96">
                    <DropdownMenuLabel>Your Parking Spots</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {purchasedSpots.length === 0 ? (
                      <DropdownMenuItem disabled>
                        No parking spots purchased yet
                      </DropdownMenuItem>
                    ) : (
                      purchasedSpots.map((spot) => (
                        <DropdownMenuItem key={spot.id} className="flex flex-col items-start p-4">
                          <div className="font-medium">{spot.full_address}</div>
                          <div className="text-sm text-gray-500">
                            Price: {spot.price} tokens
                          </div>
                          <div className="text-xs text-gray-400">
                            Purchased on: {new Date(spot.purchased_at).toLocaleDateString()}
                          </div>
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;