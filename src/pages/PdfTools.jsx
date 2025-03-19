import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PdfSplitMerge from '../components/pdf/PdfSplitMerge';
import PdfEditSign from '../components/pdf/PdfEditSign';
import {
  SplitSquareHorizontal,
  FileSignature,
  Wand2,
} from "lucide-react";

export default function PdfToolsPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("split-merge");
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get the tool from URL params
    const params = new URLSearchParams(location.search);
    const tool = params.get('tool');
    if (tool && (tool === 'split-merge' || tool === 'edit-sign')) {
      setActiveTab(tool);
    }
  }, [location]);
  
  const handleTabChange = (value) => {
    setActiveTab(value);
    navigate(createPageUrl("PdfTools") + `?tool=${value}`, { replace: true });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">PDF Tools</h1>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
            <TabsTrigger value="split-merge" className="flex items-center gap-2">
              <SplitSquareHorizontal className="h-4 w-4" />
              <span>Split & Merge</span>
            </TabsTrigger>
            <TabsTrigger value="edit-sign" className="flex items-center gap-2">
              <FileSignature className="h-4 w-4" />
              <span>Edit & Sign</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="split-merge" className="mt-6">
            <PdfSplitMerge />
          </TabsContent>
          
          <TabsContent value="edit-sign" className="mt-6">
            <PdfEditSign />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}