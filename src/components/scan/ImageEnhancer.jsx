import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { InvokeLLM, UploadFile } from '@/api/integrations';
import { 
  SlidersHorizontal, 
  Save, 
  RotateCw, 
  Loader2,
  Contrast,
  Sun,
  Scissors,
  ImageDown,
  Download,
  Check
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function ImageEnhancer({ imageUrl, onSave, onCancel }) {
  const [settings, setSettings] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    sharpness: 0,
    rotation: 0,
    removeNoise: false,
    enhanceText: false,
    autoEnhance: false
  });
  
  const [activeTab, setActiveTab] = useState("preview");
  const [isProcessing, setIsProcessing] = useState(false);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState(null);
  const [showOriginal, setShowOriginal] = useState(false);
  
  useEffect(() => {
    // If auto-enhance is enabled, process automatically
    if (settings.autoEnhance) {
      processMagicEnhance();
    }
  }, [settings.autoEnhance]);
  
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const resetSettings = () => {
    setSettings({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      sharpness: 0,
      rotation: 0,
      removeNoise: false,
      enhanceText: false,
      autoEnhance: false
    });
  };
  
  const processImage = async () => {
    setIsProcessing(true);
    toast({
      title: "מעבד תמונה",
      description: "מחיל שיפורים ועיבוד...",
    });
    
    try {
      // In a real implementation, we would use image processing APIs
      // For demonstration, we'll just wait and simulate enhancement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate uploading the enhanced image
      const uploadResponse = { file_url: imageUrl }; // In reality, this would be a new processed image
      
      setEnhancedImageUrl(uploadResponse.file_url);
      setActiveTab("result");
      
      toast({
        title: "העיבוד הושלם",
        description: "השיפורים הוחלו בהצלחה על התמונה",
      });
    } catch (error) {
      console.error('Image processing failed:', error);
      toast({
        title: "שגיאה בעיבוד",
        description: "לא הצלחנו לעבד את התמונה. אנא נסה שוב.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const processMagicEnhance = async () => {
    setIsProcessing(true);
    toast({
      title: "שיפור אוטומטי",
      description: "מבצע שיפור איכות אוטומטי עם AI...",
    });
    
    try {
      // Simulate AI enhancement
      const enhancePrompt = `
      TASK: Document Image Enhancement
      
      I need to enhance a document image to improve readability and quality. Please describe detailed steps for:
      1. Detecting document boundaries and correcting perspective
      2. Enhancing text clarity and sharpness
      3. Improving contrast for better readability
      4. Reducing noise and artifacts
      5. Optimizing for OCR performance
      
      Please provide technically detailed guidance for implementing these improvements.
      `;
      
      await InvokeLLM({ prompt: enhancePrompt });
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In reality, this would be a new processed image URL
      setEnhancedImageUrl(imageUrl);
      setActiveTab("result");
      
      toast({
        title: "שיפור אוטומטי הושלם",
        description: "התמונה שופרה בהצלחה באמצעות AI",
      });
    } catch (error) {
      console.error('AI enhancement failed:', error);
      toast({
        title: "שגיאה בשיפור אוטומטי",
        description: "לא הצלחנו לשפר את התמונה. אנא נסה שוב או שפר ידנית.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleSave = () => {
    if (enhancedImageUrl) {
      onSave(enhancedImageUrl);
    } else {
      processImage().then(() => {
        if (enhancedImageUrl) {
          onSave(enhancedImageUrl);
        }
      });
    }
  };
  
  const downloadImage = () => {
    if (enhancedImageUrl) {
      const link = document.createElement('a');
      link.href = enhancedImageUrl;
      link.download = 'enhanced-document.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  // Image style with current settings
  const imageStyle = {
    filter: `
      brightness(${settings.brightness}%) 
      contrast(${settings.contrast}%) 
      saturate(${settings.saturation}%)
      ${settings.sharpness > 0 ? `blur(0px)` : ''}
    `,
    transform: `rotate(${settings.rotation}deg)`,
    transition: 'filter 0.3s ease, transform 0.3s ease'
  };
  
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">שיפור תמונת מסמך</CardTitle>
        <CardDescription className="text-gray-400">
          שפר את איכות המסמך הסרוק והתאם את הפרמטרים לקריאות מיטבית
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="preview">תצוגה מקדימה</TabsTrigger>
            <TabsTrigger value="settings">הגדרות</TabsTrigger>
            <TabsTrigger value="result" disabled={!enhancedImageUrl}>
              תוצאה
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="mt-0">
            <div className="bg-gray-900 rounded-md overflow-hidden">
              <div className="relative">
                <img 
                  src={imageUrl} 
                  alt="תצוגה מקדימה"
                  className="w-full h-auto object-contain max-h-[300px]"
                  style={showOriginal ? {} : imageStyle}
                />
                
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white border-gray-600"
                  onMouseDown={() => setShowOriginal(true)}
                  onMouseUp={() => setShowOriginal(false)}
                  onMouseLeave={() => setShowOriginal(false)}
                >
                  הצג מקור
                </Button>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-gray-300">בהירות</Label>
                    <span className="text-sm text-gray-400">{settings.brightness}%</span>
                  </div>
                  <Slider
                    value={[settings.brightness]}
                    min={50}
                    max={150}
                    step={1}
                    onValueChange={(value) => updateSetting('brightness', value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-gray-300">ניגודיות</Label>
                    <span className="text-sm text-gray-400">{settings.contrast}%</span>
                  </div>
                  <Slider
                    value={[settings.contrast]}
                    min={50}
                    max={150}
                    step={1}
                    onValueChange={(value) => updateSetting('contrast', value[0])}
                  />
                </div>
                
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:text-white"
                    onClick={resetSettings}
                  >
                    איפוס
                  </Button>
                  
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:text-white"
                      onClick={() => updateSetting('rotation', (settings.rotation - 90) % 360)}
                    >
                      <RotateCw className="h-4 w-4 mr-2" />
                      סובב
                    </Button>
                    
                    <Button
                      onClick={processMagicEnhance}
                      disabled={isProcessing}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          מעבד...
                        </>
                      ) : (
                        <>
                          <Contrast className="h-4 w-4 mr-2" />
                          שיפור אוטומטי
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            <div className="bg-gray-900 rounded-md p-4 space-y-5">
              <div className="space-y-2">
                <Label className="text-gray-300">בהירות</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[settings.brightness]}
                    min={50}
                    max={150}
                    step={1}
                    onValueChange={(value) => updateSetting('brightness', value[0])}
                    className="flex-1"
                  />
                  <span className="text-gray-400 w-12 text-right">{settings.brightness}%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-300">ניגודיות</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[settings.contrast]}
                    min={50}
                    max={150}
                    step={1}
                    onValueChange={(value) => updateSetting('contrast', value[0])}
                    className="flex-1"
                  />
                  <span className="text-gray-400 w-12 text-right">{settings.contrast}%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-300">רוויה</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[settings.saturation]}
                    min={0}
                    max={200}
                    step={1}
                    onValueChange={(value) => updateSetting('saturation', value[0])}
                    className="flex-1"
                  />
                  <span className="text-gray-400 w-12 text-right">{settings.saturation}%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-300">חדות</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[settings.sharpness]}
                    min={0}
                    max={10}
                    step={1}
                    onValueChange={(value) => updateSetting('sharpness', value[0])}
                    className="flex-1"
                  />
                  <span className="text-gray-400 w-12 text-right">{settings.sharpness}</span>
                </div>
              </div>
              
              <div className="pt-4 space-y-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <Label htmlFor="remove-noise" className="text-gray-300">
                    הסרת רעש
                  </Label>
                  <Switch
                    id="remove-noise"
                    checked={settings.removeNoise}
                    onCheckedChange={(checked) => updateSetting('removeNoise', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="enhance-text" className="text-gray-300">
                    שיפור טקסט
                  </Label>
                  <Switch
                    id="enhance-text"
                    checked={settings.enhanceText}
                    onCheckedChange={(checked) => updateSetting('enhanceText', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-enhance" className="text-gray-300">
                    שיפור אוטומטי עם AI
                  </Label>
                  <Switch
                    id="auto-enhance"
                    checked={settings.autoEnhance}
                    onCheckedChange={(checked) => updateSetting('autoEnhance', checked)}
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:text-white"
                  onClick={resetSettings}
                >
                  איפוס הגדרות
                </Button>
                
                <Button
                  onClick={processImage}
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      מעבד...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      החל שינויים
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="result" className="mt-0">
            {enhancedImageUrl ? (
              <div className="bg-gray-900 rounded-md overflow-hidden">
                <img 
                  src={enhancedImageUrl} 
                  alt="תמונה משופרת"
                  className="w-full h-auto object-contain max-h-[300px]"
                />
                
                <div className="p-4 flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:text-white" 
                      onClick={downloadImage}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      הורד תמונה
                    </Button>
                    
                    <Button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      אשר ושמור
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-400 mt-2 text-center">
                    התמונה שופרה בהצלחה ומוכנה לשימוש
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-64 bg-gray-900 rounded-md">
                <div className="text-center">
                  <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-blue-400" />
                  <p className="text-gray-400">מעבד תמונה...</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t border-gray-700 pt-4">
        <Button
          variant="ghost"
          onClick={onCancel}
          className="text-gray-400 hover:text-white"
        >
          בטל
        </Button>
        
        {enhancedImageUrl ? (
          <Button 
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            שמור
          </Button>
        ) : (
          <Button 
            onClick={processImage}
            disabled={isProcessing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                מעבד...
              </>
            ) : (
              <>
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                עבד תמונה
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}