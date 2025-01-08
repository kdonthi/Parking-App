import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, ShoppingBag, Store, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  
  const tabs = [
    { path: '/', label: 'Home', icon: MapPin },
    { path: '/marketplace', label: 'Marketplace', icon: Store },
    { path: '/shop', label: 'Shop', icon: ShoppingBag },
    { path: '/about', label: 'About', icon: User },
  ];
  
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

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
              <div className="mr-4 text-primary font-medium">
                {userId}
              </div>
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