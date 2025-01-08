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
          <DropdownMenuLabel>Your Parking Spots</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            No parking spots purchased yet
          </DropdownMenuItem>
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