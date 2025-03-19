import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileConversion } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import {
  FileDown,
  ArrowRight,
  BarChart4,
  DownloadCloud,
  Zap,
  Scale,
  File
} from "lucide-react";

import FileUploader from '../components/uploaders/FileUploader';
import ConversionProgress from '../components/converters/ConversionProgress';

export default function CompressPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState(70); // 0-100, where 100 is maximum compression
  const [conversionStatus, setConversionStatus] = useState(null); // null, 'processing', 'completed', 'failed'
  const [conversionProgress, setConversionProgress] = useState(0);
  const [conversionResult, setConversionResult] = useState(null);
  const [conversionError, setConversionError] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [expectedSizeReduction, setExpectedSizeReduction] = useState(0);
  
  const fileTypes = [
    { label: 'PDF', extensions: ['.pdf'], icon: File },
    { label: 'Images', extensions: ['.jpg', '.jpeg', '.png', '.webp'], icon: File },
    { label: 'Video', extensions: ['.mp4', '.mov', '.avi'], icon: File }
  ];
  
  const handleFileUploaded = (fileObj) => {
    setSelectedFile(fileObj);
    
    // For image or PDF, show preview
    if (fileObj.type.includes('image') || fileObj.type.includes('pdf')) {
      setFilePreviewUrl(URL.createObjectURL(fileObj.file));
    }
    
    // Calculate expected size reduction based on file type and compression level
    calculateExpectedSizeReduction(fileObj, compressionLevel);
    
    toast({
      title: "File uploaded successfully",
      description: `${fileObj.name} has been uploaded. Adjust compression settings and continue.`,
    });
  };
  
  const calculateExpectedSizeReduction = (fileObj, level) => {
    // This is a simulated calculation, in a real app this would be more precise
    let baseReduction = 0;
    
    if (fileObj.type.includes('image/jpeg') || fileObj.type.includes('image/jpg')) {
      baseReduction = 0.6; // JPEGs can be compressed quite well
    } else if (fileObj.type.includes('image/png')) {
      baseReduction = 0.4; // PNGs have less compression potential
    } else if (fileObj.type.includes('application/pdf')) {
      baseReduction = 0.5; // PDFs can be compressed moderately
    } else if (fileObj.type.includes('video')) {
      baseReduction = 0.7; // Videos often have high compression potential
    } else {
      baseReduction = 0.3; // Default for other file types
    }
    
    // Level adjustment (0-100)
    const adjustedReduction = baseReduction * (level / 100);
    
    // Expected size after compression
    const expectedSize = fileObj.size * (1 - adjustedReduction);
    const reductionPercentage = Math.round(adjustedReduction * 100);
    
    setExpectedSizeReduction(reductionPercentage);
  };
  
  const handleCompressionLevelChange = (newLevel) => {
    setCompressionLevel(newLevel[0]);
    if (selectedFile) {
      calculateExpectedSizeReduction(selectedFile, newLevel[0]);
    }
  };
  
  const startCompression = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a file to compress",
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
      }, 400);
      
      // For demo purposes, just simulate compression
      await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
      
      // Calculate simulated compressed size
      const compressedSize = Math.round(selectedFile.size * (1 - (expectedSizeReduction / 100)));
      
      // Simulate a successful compression
      const result = {
        url: selectedFile.url, // In a real app, this would be the compressed file URL
        fileName: `compressed-${selectedFile.name}`,
        originalSize: selectedFile.size,
        compressedSize: compressedSize,
        reduction: expectedSizeReduction
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
        target_format: selectedFile.type, // Same format but compressed
        file_size: selectedFile.size,
        conversion_type: 'compression',
        status: 'completed',
        expiry_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
      });
      
    } catch (error) {
      console.error('Compression error:', error);
      setConversionStatus('failed');
      setConversionError('An error occurred during compression. Please try again.');
    }
  };
  
  const handleRetry = () => {
    setConversionStatus(null);
    setConversionProgress(0);
    setConversionResult(null);
    setConversionError(null);
  };
  
  // Format size in KB, MB
  const formatSize = (bytes) => {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
  };
  
  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">File Compression</h1>
          <p className="text-gray-500 mt-2">Reduce file size while maintaining quality for PDFs, images, and videos</p>
        </div>
        
        {!conversionStatus ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileDown className="mr-2 h-5 w-5 text-blue-500" />
                    Upload File
                  </CardTitle>
                  <CardDescription>
                    Upload a PDF, image, or video file to compress. We'll maintain the best possible quality.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="upload" className="mb-6">
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="upload">Upload File</TabsTrigger>
                      <TabsTrigger value="formats">Supported Formats</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="pt-4">
                      <FileUploader 
                        onFileUpload={handleFileUploaded}
                        maxSizeMB={2000}
                        acceptedFormats="PDF,JPG,JPEG,PNG,GIF,WEBP,MP4,MOV,AVI"
                        conversionType="compress"
                      />
                    </TabsContent>
                    <TabsContent value="formats" className="pt-4">
                      <div className="space-y-4">
                        {fileTypes.map(type => (
                          <div key={type.label} className="border border-gray-200 rounded-lg p-4">
                            <h3 className="font-medium text-gray-900 flex items-center mb-2">
                              <type.icon className="mr-2 h-4 w-4 text-blue-500" />
                              {type.label}
                            </h3>
                            <p className="text-sm text-gray-600 ml-6">
                              Supported extensions: {type.extensions.join(', ')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  {filePreviewUrl && selectedFile?.type.includes('image') && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h3 className="font-medium text-gray-900 mb-3">File Preview:</h3>
                      <div className="bg-gray-50 rounded-lg p-4 flex justify-center">
                        <img 
                          src={filePreviewUrl}
                          alt="File preview"
                          className="max-h-64 max-w-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                  
                  {selectedFile && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h3 className="font-medium text-gray-900 mb-2">File to compress:</h3>
                      <div className="flex items-center">
                        <File className="h-5 w-5 text-blue-500 mr-2" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatSize(selectedFile.size)}
                          </p>
                        </div>
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
                    <BarChart4 className="mr-2 h-5 w-5 text-blue-500" />
                    Compression Settings
                  </CardTitle>
                  <CardDescription>
                    Adjust compression level to balance size and quality
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedFile ? (
                    <>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="compression-level">Compression Level: {compressionLevel}%</Label>
                            <span className="text-sm text-blue-600 font-medium">
                              {expectedSizeReduction}% Reduction
                            </span>
                          </div>
                          <Slider 
                            id="compression-level"
                            min={10} 
                            max={100} 
                            step={5}
                            defaultValue={[compressionLevel]}
                            onValueChange={handleCompressionLevelChange}
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Higher Quality</span>
                            <span>Smaller Size</span>
                          </div>
                        </div>
                        
                        {expectedSizeReduction > 0 && (
                          <div className="bg-blue-50 p-4 rounded-lg text-sm">
                            <h4 className="font-medium text-blue-700 mb-1">Expected Results:</h4>
                            <div className="text-blue-600">
                              <p>Original size: {formatSize(selectedFile.size)}</p>
                              <p>Expected size: ~{formatSize(selectedFile.size * (1 - expectedSizeReduction/100))}</p>
                              <p>You save: ~{formatSize(selectedFile.size * (expectedSizeReduction/100))}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-6 flex justify-center">
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700 px-8"
                          onClick={startCompression}
                        >
                          Compress File
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileDown className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Please upload a file to show compression options</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <ConversionProgress 
            status={conversionStatus}
            progress={conversionProgress}
            result={conversionResult}
            error={conversionError}
            onRetry={handleRetry}
            conversionType="compress"
            fileUrl={conversionResult?.url}
            fileName={conversionResult?.fileName}
            originalSize={conversionResult?.originalSize}
            compressedSize={conversionResult?.compressedSize}
            reductionPercent={conversionResult?.reduction}
          />
        )}
        
        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="p-3 bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Zap className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Compression</h3>
            <p className="text-gray-600 text-sm">
              Our intelligent algorithms analyze your files to apply the perfect compression technique for each file type.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="p-3 bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Scale className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quality Balance</h3>
            <p className="text-gray-600 text-sm">
              Balance between quality and size - our platform ensures you get the smallest file sizes without visible quality loss.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="p-3 bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <DownloadCloud className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Batch Compression</h3>
            <p className="text-gray-600 text-sm">
              Premium users can compress multiple files at once, perfect for optimizing large collections of documents or photos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}