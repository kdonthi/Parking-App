import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUsersStore } from '@/store/parkingSpots';
import { useUserState } from '@/hooks/useUserState';

const tokenPackages = [
  { amount: 10, price: 10, bonus: 0 },
  { amount: 50, price: 45, bonus: 5 },
  { amount: 100, price: 85, bonus: 15 },
];

const Tokens = () => {
  const { toast } = useToast();
  const { userId } = useUserState();
  const updateUser = useUsersStore((state) => state.updateUser);
  const users = useUsersStore((state) => state.users);
  const currentUser = users.find(u => u.owner === userId);

  const handlePurchase = (amount: number) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please log in to purchase tokens",
        variant: "destructive",
      });
      return;
    }

    updateUser(userId, (currentUser?.tokens || 0) + amount);
    toast({
      title: "Success!",
      description: `Successfully purchased ${amount} tokens`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col gap-6 mb-6">
        <h1 className="text-3xl font-bold">Purchase Tokens</h1>
        <p className="text-gray-600">
          Current Balance: {currentUser?.tokens || 0} tokens
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tokenPackages.map(({ amount, price, bonus }) => (
          <div key={amount} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold mb-2">{amount} Tokens</h3>
            {bonus > 0 && (
              <p className="text-green-600 font-medium mb-2">+{bonus} Bonus Tokens!</p>
            )}
            <p className="text-gray-600 mb-4">${price}</p>
            <Button
              className="w-full"
              onClick={() => handlePurchase(amount + bonus)}
            >
              Purchase
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tokens;