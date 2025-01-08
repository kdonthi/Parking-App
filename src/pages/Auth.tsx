import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Auth = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/');
      }
      if (event === 'SIGNED_OUT') {
        setErrorMessage(""); // Clear errors on sign out
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-primary">Welcome to ParkSpot</h2>
        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <SupabaseAuth 
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            style: {
              button: { background: 'rgb(var(--primary))', color: 'white' },
              anchor: { color: 'rgb(var(--primary))' },
            },
          }}
          theme="light"
          providers={[]}
        />
      </div>
    </div>
  );
};

export default Auth;