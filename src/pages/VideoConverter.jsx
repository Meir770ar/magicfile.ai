import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileConversion } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import {
  FileVideo,
  ArrowRight,
  Tv,
  Smartphone,
  Wand2,
  Video,
  Scissors,
  Volume2
} from "lucide-react";

import FileUploader from '../components/uploaders/FileUploader';
import ConversionOptions from '../components/converters/ConversionOptions';
import ConversionProgress from '../components/converters/ConversionProgress';

export default function VideoConverterPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversionOptions, setConversionOptions] = useState({
    targetFormat: 'mp4',
    quality: 'high',
    resolution: '720p',
    aiEnhance: false,
    selectedAiEnhancements: []
  });
  const [conversionStatus, setConversionStatus] = useState(null); // null, 'processing', 'completed', 'failed'
  const [conversionProgress, setConversionProgress] = useState(0);
  const [conversionResult, setConversionResult] = useState(null);
  const [conversionError, setConversionError] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  
  const videoFormats = [
    { format: 'mp4', label: 'MP4', description: 'Universal format, best for most uses' },
    { format: 'avi', label: 'AVI', description: 'Legacy format, high quality but large size' },
    { format: 'mov', label: 'MOV', description: 'Apple QuickTime format' },
    { format: 'mkv', label: 'MKV', description: 'Matroska, supports multiple tracks' },
    { format: 'webm', label: 'WebM', description: 'Web-optimized open format' },
    { format: 'gif', label: 'GIF', description: 'Animated GIF from video' }
  ];
  
  const devicePresets = [
    { name: 'Desktop', icon: Tv, formats: ['mp4', 'avi', 'mkv'] },
    { name: 'Mobile', icon: Smartphone, formats: ['mp4', 'mov'] },
    { name: 'Web', icon: Video, formats: ['mp4', 'webm'] }
  ];
  
  const handleFileUploaded = (fileObj) => {
    setSelectedFile(fileObj);
    setVideoPreviewUrl(URL.createObjectURL(fileObj.file));
    
    toast({
      title: "Video file uploaded successfully",
      description: `${fileObj.name} has been uploaded. Choose your conversion options and continue.`,
    });
  };
  
  const handleOptionChange = (options) => {
    setConversionOptions(options);
  };
  
  const startConversion = async () => {
    if (!selectedFile) {
      toast({
        title: "No video file selected",
        description: "Please upload a video file to convert",
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
          return prev + Math.floor(Math.random() * 3) + 1;
        });
      }, 500);
      
      // For demo purposes, just simulate a conversion
      await new Promise(resolve => setTimeout(resolve, 4000 + Math.random() * 2000));
      
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
        conversion_type: 'video',
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
          <h1 className="text-3xl font-bold text-gray-900">Video Conversion</h1>
          <p className="text-gray-500 mt-2">Convert videos between MP4, AVI, MOV, MKV and other formats</p>
        </div>
        
        {!conversionStatus ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileVideo className="mr-2 h-5 w-5 text-blue-500" />
                    Upload Video
                  </CardTitle>
                  <CardDescription>
                    Upload a video file to convert. We support MP4, AVI, MOV, MKV, WebM and more
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="upload" className="mb-6">
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="upload">Upload File</TabsTrigger>
                      <TabsTrigger value="presets">Device Presets</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="pt-4">
                      <FileUploader 
                        onFileUpload={handleFileUploaded}
                        maxSizeMB={2000}
                        acceptedFormats="MP4,AVI,MOV,MKV,WEBM,FLV,WMV,M4V"
                        conversionType="video"
                      />
                    </TabsContent>
                    <TabsContent value="presets" className="pt-4">
                      <div className="grid grid-cols-3 gap-4">
                        {devicePresets.map(preset => (
                          <div key={preset.name} className="border border-gray-200 rounded-lg p-4 text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <preset.icon className="h-6 w-6 text-blue-600" />
                            </div>
                            <h4 className="font-medium text-gray-900 mb-2">{preset.name}</h4>
                            <p className="text-xs text-gray-500">
                              Recommended: {preset.formats.join(', ')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  {videoPreviewUrl && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h3 className="font-medium text-gray-900 mb-3">Video Preview:</h3>
                      <div className="bg-black rounded-lg overflow-hidden">
                        <video 
                          controls 
                          className="w-full max-h-64"
                          src={videoPreviewUrl}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Note: Preview quality may be lower than the actual file.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="mr-2 h-5 w-5 text-blue-500" />
                    Conversion Options
                  </CardTitle>
                  <CardDescription>
                    Choose your target format and adjust video settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedFile ? (
                    <>
                      <ConversionOptions 
                        conversionType="video"
                        sourceFormat={selectedFile.type}
                        availableTargetFormats={['mp4', 'avi', 'mov', 'mkv', 'webm', 'gif']}
                        onOptionsChange={handleOptionChange}
                        supportedAiEnhancements={['video_enhance', 'color_correction', 'stabilization']}
                        resolutionOptions={['original', '1080p', '720p', '480p', '360p']}
                      />
                      
                      <div className="mt-6 flex justify-center">
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700 px-8"
                          onClick={startConversion}
                        >
                          Convert Video
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileVideo className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Please upload a video file to show conversion options</p>
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
            conversionType="video"
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
            <h3 className="font-semibold text-gray-900 mb-2">AI Video Enhancement</h3>
            <p className="text-gray-600 text-sm">
              Our AI technology can improve video quality, enhance colors, and stabilize shaky footage during conversion.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="p-3 bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Scissors className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Optimized for Any Device</h3>
            <p className="text-gray-600 text-sm">
              Convert videos to formats optimized for any device or platform - mobile, desktop, or social media.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="p-3 bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Volume2 className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Audio Processing</h3>
            <p className="text-gray-600 text-sm">
              Enhance audio tracks in your videos with noise reduction and volume normalization for better sound quality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}