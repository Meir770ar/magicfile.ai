import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileIcon, FolderIcon, UserCircle, UploadCloud } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// Guest-friendly Documents page
export default function DocumentsPage() {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">My Documents</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your documents and files
          </p>
        </div>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Guest Mode Active</CardTitle>
          <CardDescription>
            You're currently using MagicFile.ai as a guest
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-6">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <UserCircle className="h-10 w-10 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
            As a guest user, your documents aren't stored between sessions.
            You can still use all conversion tools, but files won't be saved to your account.
          </p>
          <div className="grid gap-4 md:grid-cols-2 w-full max-w-md">
            <Link to={createPageUrl("DocumentConverter")}>
              <Button variant="outline" className="w-full">
                <UploadCloud className="mr-2 h-5 w-5" />
                Convert Documents
              </Button>
            </Link>
            <Link to={createPageUrl("Home")}>
              <Button className="w-full">
                Return to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Files</CardTitle>
            <CardDescription>Files you've recently converted</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <FileIcon className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 max-w-xs">
                As a guest user, your file history isn't saved between sessions.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">My Folders</CardTitle>
            <CardDescription>Organize your documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <FolderIcon className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 max-w-xs">
                Folder organization is available for registered users.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
