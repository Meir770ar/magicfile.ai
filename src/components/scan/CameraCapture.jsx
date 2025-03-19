import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, X, FlipHorizontal, ZoomIn, ZoomOut } from "lucide-react";

export default function CameraCapture({ onCapture, onCancel }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isMobile] = useState(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  const [facingMode, setFacingMode] = useState(isMobile ? 'environment' : 'user');

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  const startCamera = async () => {
    try {
      if (streamRef.current) {
        stopCamera();
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraReady(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraReady(false);
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const capturePhoto = () => {
    if (!videoRef.current || !isCameraReady) return;

    const canvas = document.createElement('canvas');
    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;
    
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

    // Apply some image processing for document enhancement
    try {
      // Increase contrast slightly
      ctx.filter = 'contrast(115%) brightness(105%)';
      ctx.drawImage(canvas, 0, 0);
      ctx.filter = 'none';
    } catch (e) {
      console.log("Canvas filtering not supported in this browser");
    }

    canvas.toBlob((blob) => {
      const file = new File([blob], `scan-${Date.now()}.jpg`, { type: 'image/jpeg' });
      onCapture(file);
    }, 'image/jpeg', 0.9); // Higher quality
  };

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-auto max-h-[80vh] object-cover"
        />
        
        {!isCameraReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
              מפעיל מצלמה...
            </div>
          </div>
        )}

        {/* Document outline guide */}
        {isCameraReady && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-[90%] h-[80%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-white/70 rounded-md">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white"></div>
            </div>
          </div>
        )}

        <div className="absolute bottom-0 inset-x-0 p-4 flex justify-center gap-4 bg-gradient-to-t from-black/70 to-transparent">
          <Button
            variant="outline"
            size="icon"
            onClick={onCancel}
            className="rounded-full bg-white/10 border-white/20 hover:bg-white/20"
          >
            <X className="h-6 w-6 text-white" />
          </Button>
          
          <Button
            size="icon"
            onClick={capturePhoto}
            disabled={!isCameraReady}
            className="rounded-full bg-white hover:bg-white/90"
          >
            <Camera className="h-6 w-6 text-black" />
          </Button>
          
          {isMobile && (
            <Button
              variant="outline"
              size="icon"
              onClick={toggleCamera}
              className="rounded-full bg-white/10 border-white/20 hover:bg-white/20"
            >
              <FlipHorizontal className="h-6 w-6 text-white" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}