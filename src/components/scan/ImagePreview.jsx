import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, CheckCircle2, ZoomIn, ZoomOut, RotateCw, Wand2, ArrowRight } from "lucide-react";

export default function ImagePreview({ file, isProcessing, progress, onProcess, onCancel }) {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [enhanced, setEnhanced] = useState(false);
  const [autoDetectedType, setAutoDetectedType] = useState(null);
  const previewUrl = URL.createObjectURL(file);

  // Auto-detect document type based on visual characteristics
  useEffect(() => {
    // Simulated auto-detection - in reality, this would use AI/ML
    setTimeout(() => {
      setAutoDetectedType('receipt'); // Example: auto-detected type
    }, 500);
  }, [file]);

  const handleProcess = () => {
    onProcess(file.name);
  };

  const rotateImage = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };
  
  const enhanceImage = () => {
    setEnhanced(true);
  };

  return (
    <div className="overflow-hidden">
      <div className="relative aspect-[4/3] bg-gray-900">
        <div 
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
        >
          <img
            src={previewUrl}
            alt="Preview"
            className={`object-contain transition-transform duration-150 ${
              enhanced ? 'contrast-[1.1] brightness-105 saturate-[1.05]' : ''
            }`}
            style={{ 
              transform: `rotate(${rotation}deg) scale(${zoom})`,
              maxHeight: '100%',
              maxWidth: '100%'
            }}
          />
        </div>
        
        {/* Floating controls */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="bg-white/20 hover:bg-white/30 text-white"
            onClick={zoomIn}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="bg-white/20 hover:bg-white/30 text-white"
            onClick={zoomOut}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="bg-white/20 hover:bg-white/30 text-white"
            onClick={rotateImage}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className={`bg-white/20 hover:bg-white/30 text-white ${
              enhanced ? 'text-purple-400' : ''
            }`}
            onClick={enhanceImage}
            title="Enhance Image Quality"
          >
            <Wand2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Auto-detected info */}
        {autoDetectedType && !isProcessing && (
          <div className="mb-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
            <p className="text-sm text-blue-300">
              We detected this as a <strong>{autoDetectedType}</strong>. 
              Processing will be optimized accordingly.
            </p>
          </div>
        )}

        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Processing document...</span>
              <span className="text-gray-300">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={isProcessing}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          
          <Button
            onClick={handleProcess}
            disabled={isProcessing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </>
            ) : (
              <>
                Process Document
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}