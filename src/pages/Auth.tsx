import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useUsersStore } from '@/store/parkingSpots';

const Auth = () => {
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const addUser = useUsersStore(state => state.addUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedUserId = userId.trim();

    if (trimmedUserId) {
      localStorage.setItem('userId', trimmedUserId);
      
      toast({
        title: "Success",
        description: "Logged in successfully",
      });

      addUser(trimmedUserId);      
      
      navigate('/');
    } else {
      toast({
        title: "Error",
        description: "Please enter a User ID",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter User ID"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            />
          </div>
          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;