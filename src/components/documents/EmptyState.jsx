import React from 'react';
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <FileText className="w-10 h-10 text-blue-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No documents yet
      </h3>
      <p className="text-gray-500 mb-6">
        Start by scanning your first document
      </p>
      <Link to={createPageUrl("Scan")}>
        <Button className="bg-blue-600 hover:bg-blue-700">Start Scanning</Button>
      </Link>
    </div>
  );
}