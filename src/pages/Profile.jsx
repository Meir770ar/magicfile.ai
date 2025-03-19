import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// Modified Profile page that works without authentication
export default function ProfilePage() {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Guest Mode Active</CardTitle>
          <CardDescription>
            You're currently using MagicFile.ai as a guest
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-10">
          <UserCircle className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500 mb-6 text-center max-w-md">
            All file conversion tools are available to you as a guest user.
            No account is required to use our services.
          </p>
          <div className="grid gap-4 md:grid-cols-2 w-full max-w-md">
            <Link to={createPageUrl("Home")}>
              <Button variant="outline" className="w-full">
                Return to Home
              </Button>
            </Link>
            <Link to={createPageUrl("Premium")}>
              <Button className="w-full">
                See Premium Features
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-lg mb-4">Benefits Available for Guest Users:</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <FileText className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <span>Convert documents, images, audio and video files</span>
          </li>
          <li className="flex items-start">
            <FileText className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <span>Use basic AI analysis features</span>
          </li>
          <li className="flex items-start">
            <FileText className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <span>Access to all standard conversion formats</span>
          </li>
          <li className="flex items-start">
            <FileText className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <span>100MB file size limit per conversion</span>
          </li>
        </ul>
      </div>
    </div>
  );
}