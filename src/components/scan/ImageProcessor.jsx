import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Crop,
  Save,
  ImagePlus,
  Loader2,
  ArrowRight,
  Check,
  X
} from "lucide-react";

export default function ImageProcessor({ imageUrl, onComplete, onCancel }) {
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("enhance");
  const [settings, setSettings] = useState({
    brightness: 0,
    contrast: 0,
    sharpness: 0,
    autoEnhance: true,
    removeBackground: false,
    cropMode: false,
    rotation: 0
  });
  
  // Demo purpose only - simulate the processing without relying on integrations
  const processImage = async () => {
    try {
      setIsProcessing(true);
      setProgress(0);
      
      // Simulate image processing with delays
      await new Promise(resolve => setTimeout(resolve, 800)); // Start processing
      setProgress(20);
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Enhancement
      setProgress(40);
      
      await new Promise(resolve => setTimeout(resolve, 1200)); // Processing adjustments
      setProgress(70);
      
      await new Promise(resolve => setTimeout(resolve, 800)); // Finishing up
      setProgress(95);
      
      await new Promise(resolve => setTimeout(resolve, 500)); // Complete
      setProgress(100);
      
      // Simulated output: just return the same URL for demo
      // In a real app, you would return the processed image URL
      setTimeout(() => {
        onComplete(imageUrl, 'image/jpeg');
        setIsProcessing(false);
      }, 500);
    } catch (error) {
      console.error("Simulated processing error:", error);
      setIsProcessing(false);
      toast({
        title: "Processing Error",
        description: "An error occurred during image processing. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  useEffect(() => {
    // Display a toast when first mounted
    toast({
      title: "Image Ready for Processing",
      description: "Adjust settings or use auto-enhance for best results",
    });
  }, []);
  
  const updateSetting = (key, value) => {
    setSettings({
      ...settings,
      [key]: value
    });
  };
  
  const resetSettings = () => {
    setSettings({
      brightness: 0,
      contrast: 0,
      sharpness: 0,
      autoEnhance: true,
      removeBackground: false,
      cropMode: false,
      rotation: 0
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/60 border-gray-700">
        <CardHeader>
          <CardTitle>Image Processing</CardTitle>
          <CardDescription className="text-gray-400">
            Enhance your document with AI-powered tools
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex justify-center mb-4">
            <div className="relative w-full max-w-md rounded-lg overflow-hidden bg-black">
              {/* Image Preview */}
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  className="w-full h-auto"
                  style={{
                    filter: `brightness(${100 + settings.brightness}%) contrast(${100 + settings.contrast}%)`,
                    transform: `rotate(${settings.rotation}deg)`
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/800x600?text=Preview+Not+Available";
                  }}
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center">
                  <ImagePlus className="h-16 w-16 text-gray-700" />
                </div>
              )}
              
              {/* Processing Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-400 mb-4" />
                  <p className="text-white text-sm mb-2">Processing Image...</p>
                  <div className="w-48">
                    <Progress value={progress} className="h-1" />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <Tabs defaultValue="enhance" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="enhance">Enhance</TabsTrigger>
              <TabsTrigger value="adjust">Adjust</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
            </TabsList>
            
            <TabsContent value="enhance" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-enhance" className="text-gray-300">Auto Enhance</Label>
                <Switch 
                  id="auto-enhance" 
                  checked={settings.autoEnhance}
                  onCheckedChange={(checked) => updateSetting('autoEnhance', checked)}
                />
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-gray-400">Sharpness</Label>
                    <span className="text-gray-400 text-sm">{settings.sharpness}%</span>
                  </div>
                  <Slider 
                    value={[settings.sharpness]} 
                    min={-50} 
                    max={50} 
                    step={1}
                    onValueChange={(values) => updateSetting('sharpness', values[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-gray-400">Remove Background</Label>
                    <Switch 
                      checked={settings.removeBackground}
                      onCheckedChange={(checked) => updateSetting('removeBackground', checked)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-xs text-gray-500">
                  Auto Enhance uses AI to automatically adjust brightness, contrast, and sharpness for optimal clarity.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="adjust" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-gray-400">Brightness</Label>
                    <span className="text-gray-400 text-sm">{settings.brightness}%</span>
                  </div>
                  <Slider 
                    value={[settings.brightness]} 
                    min={-50} 
                    max={50} 
                    step={1}
                    onValueChange={(values) => updateSetting('brightness', values[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-gray-400">Contrast</Label>
                    <span className="text-gray-400 text-sm">{settings.contrast}%</span>
                  </div>
                  <Slider 
                    value={[settings.contrast]} 
                    min={-50} 
                    max={50} 
                    step={1}
                    onValueChange={(values) => updateSetting('contrast', values[0])}
                  />
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetSettings}
                className="mt-2"
              >
                Reset Adjustments
              </Button>
            </TabsContent>
            
            <TabsContent value="tools" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => updateSetting('rotation', (settings.rotation + 90) % 360)}>
                  <RotateCw className="h-4 w-4 mr-2" />
                  Rotate 90°
                </Button>
                
                <Button variant="outline" onClick={() => updateSetting('cropMode', !settings.cropMode)}>
                  <Crop className="h-4 w-4 mr-2" />
                  {settings.cropMode ? 'Exit Crop' : 'Crop'}
                </Button>
                
                <Button variant="outline">
                  <ZoomIn className="h-4 w-4 mr-2" />
                  Zoom In
                </Button>
                
                <Button variant="outline">
                  <ZoomOut className="h-4 w-4 mr-2" />
                  Zoom Out
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          
          <Button
            onClick={processImage}
            disabled={isProcessing}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}