import { Link, useLocation } from 'react-router-dom';
import { MapPin, Store, User, Coins } from 'lucide-react';

const tabs = [
  { path: '/', label: 'Home', icon: MapPin },
  { path: '/marketplace', label: 'Marketplace', icon: Store },
  { path: '/tokens', label: 'Buy Tokens', icon: Coins },
  { path: '/about', label: 'About', icon: User },
];

export const NavigationTabs = () => {
  const location = useLocation();

  return (
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
  );
};