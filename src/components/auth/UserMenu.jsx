import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Settings, History, Crown } from "lucide-react";

// This component now displays a simplified user menu that doesn't require authentication
export default function UserMenu() {
  // Simple guest implementation without authentication requirement
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8 border">
            <AvatarFallback className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium">Guest User</p>
          <p className="text-xs text-gray-500">Access the tools without an account</p>
        </div>
        <DropdownMenuSeparator />
        <Link to={createPageUrl("Premium")}>
          <DropdownMenuItem className="cursor-pointer">
            <Crown className="mr-2 h-4 w-4 text-amber-500" />
            <span>Upgrade to Premium</span>
          </DropdownMenuItem>
        </Link>
        <Link to={createPageUrl("Settings")}>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}