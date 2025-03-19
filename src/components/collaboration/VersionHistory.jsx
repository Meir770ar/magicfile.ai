import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, ArrowDown } from "lucide-react";
import { format } from "date-fns";

export default function VersionHistory({ versions }) {
  return (
    <div className="h-full">
      <div className="p-4 bg-white rounded-lg border h-full">
        <h3 className="font-medium mb-4">Version History</h3>
        
        {versions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No previous versions available
          </div>
        ) : (
          <ScrollArea className="h-[calc(100%-2rem)]">
            <div className="space-y-1 relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100 z-0" />
              
              {versions.map((version, index) => (
                <div
                  key={version.id}
                  className="relative z-10 flex items-start mb-6 pl-10"
                >
                  <div className="absolute left-3 w-3 h-3 bg-blue-600 rounded-full mt-1.5 -ml-1.5" />
                  
                  <div className="flex-1 bg-white rounded-lg border p-3 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">Version {version.version_number}</div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(version.created_date), "PPP 'at' p")}
                        </div>
                        <div className="text-sm">
                          By: {version.created_by_email}
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(version.file_url, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                    
                    {version.changes_description && (
                      <div className="mt-2 pt-2 border-t text-sm">
                        <p className="text-gray-700">{version.changes_description}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}