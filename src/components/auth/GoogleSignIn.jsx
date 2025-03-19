import React from "react";
import { Button } from "@/components/ui/button";

// This component now simply provides a placeholder button without authentication functionality
export default function GoogleSignIn({ 
  buttonText = "Continue as Guest", 
  onLoginSuccess, 
  className = "" 
}) {
  // The function that would be triggered when "Continue as Guest" is clicked
  const handleGuestAccess = () => {
    if (onLoginSuccess) {
      // Pass a guest user object to maintain API compatibility
      onLoginSuccess({
        isGuest: true,
        email: "guest@example.com",
        full_name: "Guest User"
      });
    }
  };

  return (
    <Button 
      onClick={handleGuestAccess}
      className={`w-full ${className}`}
      variant="outline"
    >
      {buttonText}
    </Button>
  );
}