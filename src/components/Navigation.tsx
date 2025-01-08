import { NavigationTabs } from './NavigationTabs';
import { UserMenu } from './UserMenu';

const Navigation = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-primary font-bold text-xl">ParkSpot</span>
          </div>
          <div className="flex items-center space-x-4">
            <NavigationTabs />
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;