import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import EmptyState from "../components/documents/EmptyState";
import { FileText, ArrowRight } from "lucide-react";

// Simplified Documents page that works without authentication
export default function DocumentsPage() {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Documents</h1>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Guest Mode Active</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              You're browsing as a guest. Your documents won't be saved between sessions.
            </p>
          </div>
          <Button 
            variant="link" 
            className="ml-auto text-blue-600 dark:text-blue-400"
            onClick={() => navigate(createPageUrl("Home"))}
          >
            Go to Home <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      <EmptyState />
    </div>
  );
}