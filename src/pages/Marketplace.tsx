import { Store } from 'lucide-react';

const Marketplace = () => {
  const spots = [
    { id: 1, location: "Downtown Plaza", price: 10, available: true },
    { id: 2, location: "Central Station", price: 15, available: true },
    { id: 3, location: "Shopping Mall", price: 8, available: false },
  ];

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Parking Spot Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spots.map((spot) => (
          <div key={spot.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Store className="w-6 h-6 text-primary" />
              <span className={`px-2 py-1 rounded text-sm ${
                spot.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {spot.available ? 'Available' : 'Taken'}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{spot.location}</h3>
            <p className="text-gray-600 mb-4">Price: {spot.price} tokens</p>
            <button
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors"
              disabled={!spot.available}
            >
              {spot.available ? 'Get Spot' : 'Not Available'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;