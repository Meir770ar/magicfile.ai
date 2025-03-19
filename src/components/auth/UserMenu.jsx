import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { UserCircle, Settings, LogOut, Crown, FileText, FileImage, History } from "lucide-react";
import GoogleSignIn from "./GoogleSignIn";

export default function UserMenu() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      // User is not authenticated
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getInitials = (fullName) => {
    if (!fullName) return "U";
    return fullName
      .split(" ")
      .map(name => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Show loading skeleton while checking auth
  if (isLoading) {
    return (
      <Skeleton className="h-10 w-10 rounded-full" />
    );
  }

  // If not authenticated, show login button
  if (!user) {
    return (
      <GoogleSignIn onLoginSuccess={(user) => setUser(user)} />
    );
  }

  // If authenticated, show user menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
            <AvatarImage 
              src={user.profile_picture} 
              alt={user.full_name} 
            />
            <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.full_name}</p>
            <p className="text-xs leading-none text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem as={Link} to={createPageUrl("Profile")}>
          <UserCircle className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem as={Link} to={createPageUrl("Settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem as={Link} to={createPageUrl("Documents")}>
          <FileText className="mr-2 h-4 w-4" />
          <span>My Documents</span>
        </DropdownMenuItem>
        <DropdownMenuItem as={Link} to={createPageUrl("ConversionHistory")}>
          <History className="mr-2 h-4 w-4" />
          <span>Recent Conversions</span>
        </DropdownMenuItem>
        {user.subscription_tier === "free" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem as={Link} to={createPageUrl("Premium")}>
              <Crown className="mr-2 h-4 w-4 text-amber-500" />
              <span>Upgrade to Premium</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}