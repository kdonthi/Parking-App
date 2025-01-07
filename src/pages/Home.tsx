import Map from '../components/Map';
import { useParkingSpotsStore } from '../store/parkingSpots';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Home = () => {
  const spots = useParkingSpotsStore((state) => state.spots);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Available Parking Spots</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[400px]">
          <Map spots={spots} className="w-full h-full rounded-lg" />
        </div>
        <div className="space-y-4">
          {spots.map((spot) => (
            <Card key={spot.id}>
              <CardHeader>
                <CardTitle className="text-lg">{spot.location}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{spot.price} tokens</p>
                <p className="text-sm text-gray-500">
                  {spot.available ? 'Available' : 'Taken'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;