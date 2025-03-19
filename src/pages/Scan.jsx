import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

// This page is being deprecated, so we'll redirect to Home page
export default function ScanPage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to home page immediately
    navigate(createPageUrl("Home") + "?from=scan", { replace: true });
  }, [navigate]);
  
  // Return minimal content in case redirect takes time
  return <div className="min-h-screen py-8 px-4 bg-gray-900">Redirecting...</div>;
}