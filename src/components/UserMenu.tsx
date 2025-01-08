import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserState } from '@/hooks/useUserState';
import { useParkingSpotsStore, useUsersStore } from '@/store/parkingSpots';

export const UserMenu = () => {
  const { userId, handleLogout } = useUserState();

  if (!userId) return null;

  return (
    <div className="flex items-center pl-4 border-l border-gray-200">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="mr-4">
            <span className="text-primary font-medium">{userId}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-96">
          <DropdownMenuLabel>Account Balance</DropdownMenuLabel>
          <DropdownMenuItem disabled>
            <div className="flex flex-col w-full">
              <span className="font-medium">
                {useUsersStore.getState().users.find(u => u.owner === userId)?.tokens || 0} tokens
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Your Parking Spots</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {useParkingSpotsStore.getState().spots.length > 0 ? useParkingSpotsStore.getState().spots.filter((spot) => !spot.available && spot.owner === userId).map((spot) => (
            <DropdownMenuItem key={spot.id}>
              <div className="flex flex-col w-full">
                <span className="font-medium">{spot.location}</span>
                <span className="text-sm text-gray-500">{spot.price} tokens</span>
              </div>
            </DropdownMenuItem>
          )) :
          <DropdownMenuItem disabled>
            No parking spots purchased yet
          </DropdownMenuItem>}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>
  );
};