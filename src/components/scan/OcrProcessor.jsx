import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
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
  FileText,
  Languages,
  CheckCircle,
  Loader2,
  Save,
  Eye,
  X,
  Text
} from "lucide-react";

export default function OcrProcessor({ imageUrl, onComplete, onCancel }) {
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState("auto");
  const [textRecognition, setTextRecognition] = useState({
    enableHandwriting: true,
    enableLayout: true,
    enableTables: true,
    highAccuracyMode: false
  });
  const [extractedText, setExtractedText] = useState("");
  
  // Demo purpose only - simulate OCR processing without relying on integrations
  const processOcr = async () => {
    try {
      setIsProcessing(true);
      setProgress(0);
      
      // Simulate OCR processing with delays
      await new Promise(resolve => setTimeout(resolve, 800)); // Initialize
      setProgress(20);
      
      await new Promise(resolve => setTimeout(resolve, 1200)); // Language detection
      setProgress(40);
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Text recognition
      setProgress(70);
      
      // Generate simulated extracted text
      const simulatedText = `EXTRACTED TEXT FROM DOCUMENT

This is simulated OCR output that would be extracted from the document image.

Date: ${new Date().toLocaleDateString()}
Reference: REF-${Math.floor(Math.random() * 10000)}

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Section 1: Introduction
The purpose of this document is to demonstrate OCR capabilities.

Section 2: Content
2.1 Main Points
  • Point 1: Important information that was extracted
  • Point 2: Key details from the document
  • Point 3: Additional context from the scan

2.2 Secondary Information
References to external sources and related materials.

Section 3: Conclusion
This document demonstrates the text extraction capabilities of our OCR system.

Contact:
example@email.com
Phone: (123) 456-7890`;

      setExtractedText(simulatedText);
      
      await new Promise(resolve => setTimeout(resolve, 800)); // Finalize
      setProgress(100);
      
      // Complete process
      setTimeout(() => {
        onComplete(simulatedText);
        setIsProcessing(false);
      }, 500);
    } catch (error) {
      console.error("Simulated OCR error:", error);
      setIsProcessing(false);
      toast({
        title: "OCR Processing Error",
        description: "An error occurred during text recognition. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  useEffect(() => {
    // Display a toast when first mounted
    toast({
      title: "Image Ready for OCR",
      description: "Adjust OCR settings or proceed with default settings",
    });
  }, []);
  
  const updateSetting = (key, value) => {
    setTextRecognition({
      ...textRecognition,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/60 border-gray-700">
        <CardHeader>
          <CardTitle>Text Recognition (OCR)</CardTitle>
          <CardDescription className="text-gray-400">
            Extract text from your document using advanced OCR
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Image Preview */}
            <div className="relative rounded-lg overflow-hidden bg-black">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="Document Preview" 
                  className="w-full h-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/800x600?text=Preview+Not+Available";
                  }}
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center bg-gray-900">
                  <FileText className="h-16 w-16 text-gray-700" />
                </div>
              )}
              
              {/* Processing Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-400 mb-4" />
                  <p className="text-white text-sm mb-2">Extracting Text...</p>
                  <div className="w-48">
                    <Progress value={progress} className="h-1" />
                  </div>
                </div>
              )}
            </div>
            
            {/* OCR Settings */}
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Recognition Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto Detect</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                      <SelectItem value="ru">Russian</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="ko">Korean</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                      <SelectItem value="he">Hebrew</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="handwriting" className="text-gray-300">Handwriting Recognition</Label>
                    <Switch 
                      id="handwriting" 
                      checked={textRecognition.enableHandwriting}
                      onCheckedChange={(checked) => updateSetting('enableHandwriting', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="layout" className="text-gray-300">Preserve Layout</Label>
                    <Switch 
                      id="layout" 
                      checked={textRecognition.enableLayout}
                      onCheckedChange={(checked) => updateSetting('enableLayout', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="tables" className="text-gray-300">Detect Tables</Label>
                    <Switch 
                      id="tables" 
                      checked={textRecognition.enableTables}
                      onCheckedChange={(checked) => updateSetting('enableTables', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="high-accuracy" className="text-gray-300">High Accuracy Mode</Label>
                    <Switch 
                      id="high-accuracy" 
                      checked={textRecognition.highAccuracyMode}
                      onCheckedChange={(checked) => updateSetting('highAccuracyMode', checked)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-xs text-gray-500">
                  High Accuracy Mode performs multiple OCR passes to improve accuracy but takes longer to process.
                </p>
              </div>
            </div>
          </div>
          
          {/* Extracted Text Preview */}
          {extractedText && !isProcessing && (
            <div className="mt-6">
              <h3 className="text-white font-medium mb-2 flex items-center">
                <Text className="h-4 w-4 mr-2 text-green-400" />
                Extracted Text Preview
              </h3>
              <div className="bg-gray-900/50 rounded-lg p-4 max-h-60 overflow-y-auto">
                <pre className="text-gray-300 whitespace-pre-wrap text-sm font-mono">{extractedText}</pre>
              </div>
            </div>
          )}
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
            onClick={processOcr}
            disabled={isProcessing}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : extractedText ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Text
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Extract Text
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}