import React from 'react';
import { Button } from "@/components/ui/button";
import { User } from '@/api/entities';
import { LogIn, LogOut } from 'lucide-react';

export default function LoginButton() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const handleLogin = async () => {
    await User.login();
    // Page will refresh after Google login
  };

  const handleLogout = async () => {
    await User.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return isAuthenticated ? (
    <Button 
      variant="outline" 
      onClick={handleLogout}
      className="gap-2"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  ) : (
    <Button 
      variant="outline" 
      onClick={handleLogin}
      className="gap-2"
    >
      <LogIn className="h-4 w-4" />
      Login with Google
    </Button>
  );
}