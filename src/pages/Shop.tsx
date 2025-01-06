import { Coins } from 'lucide-react';

const Shop = () => {
  const packages = [
    { id: 1, tokens: 10, price: "$9.99", popular: false },
    { id: 2, tokens: 50, price: "$44.99", popular: true },
    { id: 3, tokens: 100, price: "$84.99", popular: false },
  ];

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Token Shop</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-white rounded-lg shadow-md p-6 ${
              pkg.popular ? 'border-2 border-primary' : ''
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm">
                Most Popular
              </span>
            )}
            <div className="flex justify-center mb-4">
              <Coins className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">{pkg.tokens} Tokens</h3>
            <p className="text-3xl font-bold text-center text-primary mb-4">{pkg.price}</p>
            <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors">
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;