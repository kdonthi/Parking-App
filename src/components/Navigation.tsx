import { Link, useLocation } from 'react-router-dom';
import { MapPin, ShoppingBag, Store, User } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  
  const tabs = [
    { path: '/', label: 'Home', icon: MapPin },
    { path: '/marketplace', label: 'Marketplace', icon: Store },
    { path: '/shop', label: 'Shop', icon: ShoppingBag },
    { path: '/about', label: 'About', icon: User },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-primary font-bold text-xl">ParkSpot</span>
          </div>
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
        </div>
      </div>
    </nav>
  );
};

export default Navigation;