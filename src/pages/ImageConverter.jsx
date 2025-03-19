import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { FileConversion } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import {
  FileImage,
  ArrowRight,
  ImagePlus,
  Image as ImageIcon,
  Crop,
  Search,
  Wand2
} from "lucide-react";

import FileUploader from '../components/uploaders/FileUploader';
import ConversionOptions from '../components/converters/ConversionOptions';
import ConversionProgress from '../components/converters/ConversionProgress';

export default function ImageConverterPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversionOptions, setConversionOptions] = useState({
    targetFormat: 'png',
    quality: 90,
    aiEnhance: false,
    selectedAiEnhancements: []
  });
  const [conversionStatus, setConversionStatus] = useState(null); // null, 'processing', 'completed', 'failed'
  const [conversionProgress, setConversionProgress] = useState(0);
  const [conversionResult, setConversionResult] = useState(null);
  const [conversionError, setConversionError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const imageFormats = [
    { format: 'jpg', label: 'JPG', description: 'Common format with good compression' },
    { format: 'png', label: 'PNG', description: 'Supports transparency, high quality' },
    { format: 'webp', label: 'WebP', description: 'New format with excellent compression' },
    { format: 'gif', label: 'GIF', description: 'Suitable for simple animations' },
    { format: 'svg', label: 'SVG', description: 'Precise vector graphics' },
    { format: 'bmp', label: 'BMP', description: 'Uncompressed format at full quality' },
    { format: 'tiff', label: 'TIFF', description: 'Format for professional preservation' },
    { format: 'ico', label: 'ICO', description: 'Icons for websites and systems' }
  ];
  
  const handleFileUploaded = (fileObj) => {
    setSelectedFile(fileObj);
    setPreviewUrl(URL.createObjectURL(fileObj.file));
    
    toast({
      title: "Image uploaded successfully",
      description: `${fileObj.name} has been uploaded. Choose the target format and continue.`,
    });
  };
  
  const handleOptionChange = (options) => {
    setConversionOptions(options);
  };
  
  const startConversion = async () => {
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please upload an image to convert",
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
          return prev + Math.floor(Math.random() * 8) + 2;
        });
      }, 300);
      
      // In a real implementation, you would call your conversion service here
      
      // For demo purposes, just simulate a conversion
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
      
      // Simulate a successful conversion
      const result = {
        url: selectedFile.url, // In a real app, this would be the converted file URL
        fileName: `converted-${selectedFile.name.split('.')[0]}.${conversionOptions.targetFormat}`
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
        conversion_type: 'image',
        status: 'completed',
        ai_enhancements: conversionOptions.selectedAiEnhancements,
        expiry_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
      });
      
    } catch (error) {
      console.error('Conversion error:', error);
      setConversionStatus('failed');
      setConversionError('An error occurred during conversion. Please try again.');
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
          <h1 className="text-3xl font-bold text-gray-900">Image Conversion</h1>
          <p className="text-gray-500 mt-2">Convert images between formats including JPG, PNG, WEBP, SVG and more</p>
        </div>
        
        {!conversionStatus ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ImageIcon className="mr-2 h-5 w-5 text-blue-500" />
                    Upload Image
                  </CardTitle>
                  <CardDescription>
                    Upload an image to convert. We support a wide range of formats including JPG, PNG, WEBP, SVG and more
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUploader 
                    onFileUpload={handleFileUploaded}
                    maxSizeMB={50}
                    acceptedFormats="JPG,JPEG,PNG,WEBP,GIF,SVG,BMP,TIFF,ICO"
                    conversionType="image"
                  />
                  
                  {previewUrl && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h3 className="font-medium text-gray-900 mb-3">Preview:</h3>
                      <div className="bg-gray-50 rounded-lg p-4 flex justify-center">
                        <img 
                          src={previewUrl}
                          alt="Image preview"
                          className="max-h-64 max-w-full object-contain"
                        />
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
                    <ImagePlus className="mr-2 h-5 w-5 text-blue-500" />
                    Conversion Settings
                  </CardTitle>
                  <CardDescription>
                    Choose your desired format and set additional options
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedFile ? (
                    <>
                      <ConversionOptions 
                        conversionType="image"
                        sourceFormat={selectedFile.type}
                        availableTargetFormats={['jpg', 'png', 'webp', 'gif', 'svg', 'bmp', 'tiff', 'ico']}
                        onOptionsChange={handleOptionChange}
                        supportedAiEnhancements={['image_enhance', 'color_correction', 'noise_reduction']}
                      />
                      
                      <div className="mt-6 flex justify-center">
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700 px-8"
                          onClick={startConversion}
                        >
                          Convert Image
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <ImageIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Please upload an image to show conversion options</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Format Comparison */}
              {!selectedFile && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <FileImage className="mr-2 h-4 w-4 text-blue-500" />
                      Format Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      {imageFormats.slice(0, 4).map(format => (
                        <div key={format.format} className="flex">
                          <div className="font-semibold text-gray-900 w-16">
                            {format.label}
                          </div>
                          <div className="text-gray-600">
                            {format.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <ConversionProgress 
            status={conversionStatus}
            progress={conversionProgress}
            result={conversionResult}
            error={conversionError}
            onRetry={handleRetry}
            conversionType="image"
            fileUrl={conversionResult?.url}
            fileName={conversionResult?.fileName}
          />
        )}
        
        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="p-3 bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Wand2 className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Automatic Image Enhancement</h3>
            <p className="text-gray-600 text-sm">
              Advanced AI technology to automatically improve brightness, contrast and sharpness of your images.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="p-3 bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Crop className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quality-Preserving Conversion</h3>
            <p className="text-gray-600 text-sm">
              Advanced conversion technology that preserves the original image quality even during format changes.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="p-3 bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Search className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Optimization</h3>
            <p className="text-gray-600 text-sm">
              Smart optimization that balances image quality and file size, perfect for websites and mobile use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}