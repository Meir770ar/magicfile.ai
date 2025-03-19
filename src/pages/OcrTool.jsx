import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { FileConversion } from '@/api/entities';
import { UploadFile, InvokeLLM } from '@/api/integrations';
import {
  FileText,
  ArrowRight,
  Languages,
  Type,
  FileSearch,
  Sparkles,
  Search,
  Eye,
  Copy
} from "lucide-react";

import FileUploader from '../components/uploaders/FileUploader';
import ConversionOptions from '../components/converters/ConversionOptions';
import ConversionProgress from '../components/converters/ConversionProgress';

export default function OcrToolPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversionOptions, setConversionOptions] = useState({
    targetFormat: 'txt',
    ocrLanguage: 'auto',
    preserveLayout: true,
    aiEnhance: true,
    selectedAiEnhancements: ['text_clarity']
  });
  const [conversionStatus, setConversionStatus] = useState(null); // null, 'processing', 'completed', 'failed'
  const [conversionProgress, setConversionProgress] = useState(0);
  const [conversionResult, setConversionResult] = useState(null);
  const [conversionError, setConversionError] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const supportedLanguages = [
    { code: 'auto', name: 'Auto-detect' },
    { code: 'en', name: 'English' },
    { code: 'he', name: 'Hebrew' },
    { code: 'ar', name: 'Arabic' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'es', name: 'Spanish' },
    { code: 'ru', name: 'Russian' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh', name: 'Chinese' }
  ];
  
  const handleFileUploaded = (fileObj) => {
    setSelectedFile(fileObj);
    setPreviewUrl(URL.createObjectURL(fileObj.file));
    
    toast({
      title: "File uploaded successfully",
      description: `${fileObj.name} has been uploaded. Choose OCR options and continue.`,
    });
  };
  
  const handleOptionChange = (options) => {
    setConversionOptions(options);
  };
  
  const startOcr = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please upload an image or PDF document",
        variant: "destructive"
      });
      return;
    }
    
    setConversionStatus('processing');
    setConversionProgress(0);
    setConversionError(null);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setConversionProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.floor(Math.random() * 5) + 1;
        });
      }, 600);
      
      // Generate simulated OCR text
      const simulatedText = `This is simulated OCR text extracted from ${selectedFile.name}

SAMPLE EXTRACTED TEXT DOCUMENT
=============================

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
This document demonstrates the text extraction capabilities.

Contact:
example@email.com
Phone: (123) 456-7890`;
      
      setExtractedText(simulatedText);
      
      // For demo purposes, just simulate a conversion
      await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
      
      // Simulate a successful conversion
      const result = {
        url: selectedFile.url, // In a real app, this would be the file URL with text
        fileName: `ocr-${selectedFile.name.split('.')[0]}.${conversionOptions.targetFormat}`,
        extractedText: simulatedText
      };
      
      clearInterval(progressInterval);
      setConversionProgress(100);
      setConversionResult(result);
      setConversionStatus('completed');
      
      // Record the conversion
      await FileConversion.create({
        original_file: selectedFile.url,
        converted_file: result.url,
        original_format: selectedFile.type,
        target_format: conversionOptions.targetFormat,
        file_size: selectedFile.size,
        conversion_type: 'ocr',
        status: 'completed',
        ocr_language: conversionOptions.ocrLanguage,
        ai_enhancements: conversionOptions.selectedAiEnhancements,
        expiry_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
      });
      
    } catch (error) {
      console.error('OCR error:', error);
      setConversionStatus('failed');
      setConversionError('An error occurred during text recognition. Please try again.');
    }
  };
  
  const handleRetry = () => {
    setConversionStatus(null);
    setConversionProgress(0);
    setConversionResult(null);
    setConversionError(null);
  };
  
  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Text Recognition (OCR)</h1>
          <p className="text-gray-500 mt-2">Extract text from images and scanned documents in multiple languages</p>
        </div>
        
        {!conversionStatus ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileSearch className="mr-2 h-5 w-5 text-blue-500" />
                    Upload File
                  </CardTitle>
                  <CardDescription>
                    Upload an image or PDF document for text recognition
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="upload" className="mb-6">
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="upload">Upload File</TabsTrigger>
                      <TabsTrigger value="features">Special Features</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="pt-4">
                      <FileUploader 
                        onFileUpload={handleFileUploaded}
                        maxSizeMB={50}
                        acceptedFormats="JPG,JPEG,PNG,PDF,TIFF,BMP"
                        conversionType="ocr"
                      />
                    </TabsContent>
                    <TabsContent value="features" className="pt-4">
                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <h3 className="font-medium text-blue-800 flex items-center mb-2">
                          <Languages className="mr-2 h-4 w-4" />
                          Support for 12 Languages
                        </h3>
                        <p className="text-blue-700 text-sm">
                          Text recognition in English, Hebrew, Arabic and more languages - including automatic language detection
                        </p>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-4 mb-4">
                        <h3 className="font-medium text-purple-800 flex items-center mb-2">
                          <Type className="mr-2 h-4 w-4" />
                          Handwriting Recognition
                        </h3>
                        <p className="text-purple-700 text-sm">
                          Our OCR engine can also detect handwritten text with high accuracy
                        </p>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-4">
                        <h3 className="font-medium text-green-800 flex items-center mb-2">
                          <Sparkles className="mr-2 h-4 w-4" />
                          Automatic Image Enhancement
                        </h3>
                        <p className="text-green-700 text-sm">
                          Automatic image improvement before OCR processing for more accurate results
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  {previewUrl && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h3 className="font-medium text-gray-900 mb-2">File ready for text recognition:</h3>
                      <div className="bg-gray-50 rounded-lg p-4 flex justify-center">
                        {selectedFile.type.includes('image') ? (
                          <img 
                            src={previewUrl}
                            alt="Image preview"
                            className="max-h-64 max-w-full object-contain"
                          />
                        ) : (
                          <div className="flex items-center text-gray-500">
                            <FileText className="h-10 w-10 mr-3 text-blue-400" />
                            <div>
                              <p className="font-medium">{selectedFile.name}</p>
                              <p className="text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Languages className="mr-2 h-5 w-5 text-blue-500" />
                    OCR Settings
                  </CardTitle>
                  <CardDescription>
                    Choose language and text recognition options
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedFile ? (
                    <>
                      <ConversionOptions 
                        conversionType="ocr"
                        sourceFormat={selectedFile.type}
                        availableTargetFormats={['txt', 'docx', 'pdf']}
                        onOptionsChange={handleOptionChange}
                        supportedLanguages={supportedLanguages}
                        supportedAiEnhancements={['text_clarity', 'image_enhance']}
                      />
                      
                      <div className="mt-6 flex justify-center">
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700 px-8"
                          onClick={startOcr}
                        >
                          Recognize Text
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Please upload a file to show OCR options</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <>
            <ConversionProgress 
              status={conversionStatus}
              progress={conversionProgress}
              result={conversionResult}
              error={conversionError}
              onRetry={handleRetry}
              conversionType="ocr"
              fileUrl={conversionResult?.url}
              fileName={conversionResult?.fileName}
            />
            
            {conversionStatus === 'completed' && extractedText && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-blue-500" />
                    Extracted Text
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-80 overflow-y-auto bg-gray-50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
                    {extractedText}
                  </div>
                  
                  <div className="flex justify-end mt-4 gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(extractedText)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Text
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        const blob = new Blob([extractedText], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `extracted-text-${new Date().getTime()}.txt`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Download as Text File
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}