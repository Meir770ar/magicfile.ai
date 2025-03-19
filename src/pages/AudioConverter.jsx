
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { FileConversion } from '@/api/entities';
import {
  FileAudio2,
  ArrowRight,
  Music2,
  Waves,  
  Volume2,
  FileEdit,
  Sparkles,
  Download
} from "lucide-react";

import FileUploader from '../components/uploaders/FileUploader';
import ConversionOptions from '../components/converters/ConversionOptions';
import ConversionProgress from '../components/converters/ConversionProgress';

export default function AudioConverterPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversionOptions, setConversionOptions] = useState({
    targetFormat: 'mp3',
    quality: 320,
    sampleRate: 44100,
    bitDepth: 16,
    aiEnhance: false,
    normalizeAudio: true,
    selectedAiEnhancements: []
  });
  const [conversionStatus, setConversionStatus] = useState(null); // null, 'processing', 'completed', 'failed'
  const [conversionProgress, setConversionProgress] = useState(0);
  const [conversionResult, setConversionResult] = useState(null);
  const [conversionError, setConversionError] = useState(null);
  
  const audioFormats = [
    { format: 'mp3', label: 'MP3', description: 'Universal compatibility, good compression' },
    { format: 'wav', label: 'WAV', description: 'Lossless quality, larger files' },
    { format: 'aac', label: 'AAC', description: 'Better quality than MP3 at same bitrate' },
    { format: 'flac', label: 'FLAC', description: 'Lossless compression, smaller than WAV' },
    { format: 'ogg', label: 'OGG', description: 'Free, open container format' },
    { format: 'm4a', label: 'M4A', description: 'Apple format, good quality' },
    { format: 'wma', label: 'WMA', description: 'Windows media audio format' }
  ];
  
  const handleFileUploaded = (fileObj) => {
    setSelectedFile(fileObj);
    
    toast({
      title: "Audio file uploaded successfully",
      description: `${fileObj.name} has been uploaded. Choose your conversion options and continue.`,
    });
  };
  
  const handleOptionChange = (options) => {
    setConversionOptions(options);
  };
  
  const startConversion = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please upload an audio file to convert",
        variant: "destructive"
      });
      return;
    }
    
    setConversionStatus('processing');
    setConversionProgress(0);
    setConversionError(null);
    
    try {
      const progressInterval = setInterval(() => {
        setConversionProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.floor(Math.random() * 5) + 1;
        });
      }, 500);
      
      await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
      
      const result = {
        url: selectedFile.url,
        fileName: `converted-${selectedFile.name.split('.')[0]}.${conversionOptions.targetFormat}`
      };
      
      clearInterval(progressInterval);
      setConversionProgress(100);
      setConversionResult(result);
      setConversionStatus('completed');
      
      await FileConversion.create({
        original_file: selectedFile.url,
        converted_file: result.url,
        original_format: selectedFile.type,
        target_format: conversionOptions.targetFormat,
        file_size: selectedFile.size,
        conversion_type: 'audio',
        status: 'completed',
        ai_enhancements: conversionOptions.selectedAiEnhancements,
        expiry_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Audio Conversion</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Convert audio files between MP3, WAV, AAC, FLAC and other formats</p>
        </div>
        
        {!conversionStatus ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileAudio2 className="mr-2 h-5 w-5 text-blue-500" />
                    Upload Audio File
                  </CardTitle>
                  <CardDescription>
                    Upload an audio file for conversion. We support a wide range of formats including MP3, WAV, AAC, FLAC and more
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUploader 
                    onFileUpload={handleFileUploaded}
                    maxSizeMB={100}
                    acceptedFormats="MP3,WAV,AAC,FLAC,OGG,M4A,WMA"
                    conversionType="audio"
                  />
                  
                  {selectedFile && (
                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-3">Audio preview:</h3>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <audio 
                          controls 
                          className="w-full" 
                          src={selectedFile.url}
                        >
                          Your browser does not support the audio element.
                        </audio>
                        <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Music2 className="h-4 w-4 mr-1" />
                          <span className="font-medium">{selectedFile.name}</span>
                          <span className="mx-2">•</span>
                          <span>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Waves className="mr-2 h-5 w-5 text-blue-500" />
                    Audio Settings
                  </CardTitle>
                  <CardDescription>
                    Choose output format and configure audio settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedFile ? (
                    <>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label>Output Format</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {audioFormats.slice(0, 6).map(format => (
                              <Button
                                key={format.format}
                                type="button"
                                variant={conversionOptions.targetFormat === format.format ? "default" : "outline"}
                                className={conversionOptions.targetFormat === format.format ? "bg-blue-600" : ""}
                                onClick={() => setConversionOptions({...conversionOptions, targetFormat: format.format})}
                              >
                                {format.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Quality (kbps): {conversionOptions.quality}</Label>
                          </div>
                          <Slider
                            value={[conversionOptions.quality]}
                            min={96}
                            max={320}
                            step={32}
                            onValueChange={(value) => setConversionOptions({...conversionOptions, quality: value[0]})}
                          />
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>Lower</span>
                            <span>Higher</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-base" htmlFor="normalize-audio">
                              <div className="flex items-center">
                                <Volume2 className="h-4 w-4 mr-2 text-blue-500" />
                                Normalize Audio
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1">
                                Balance volume levels across the audio
                              </span>
                            </Label>
                            <Switch
                              id="normalize-audio"
                              checked={conversionOptions.normalizeAudio}
                              onCheckedChange={(checked) => setConversionOptions({...conversionOptions, normalizeAudio: checked})}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label className="text-base" htmlFor="ai-enhance">
                              <div className="flex items-center">
                                <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                                AI Enhancement
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1">
                                Improve audio quality using AI
                              </span>
                            </Label>
                            <Switch
                              id="ai-enhance"
                              checked={conversionOptions.aiEnhance}
                              onCheckedChange={(checked) => setConversionOptions({...conversionOptions, aiEnhance: checked})}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={startConversion}
                        >
                          Convert Audio
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <FileAudio2 className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                      <p>Please upload an audio file to show conversion options</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {!selectedFile && (
                <Card className="mt-6 dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <FileEdit className="mr-2 h-4 w-4 text-blue-500" />
                      Format Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      {audioFormats.slice(0, 4).map(format => (
                        <div key={format.format} className="flex">
                          <div className="font-semibold text-gray-900 dark:text-white w-16">
                            {format.label}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
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
            conversionType="audio"
            fileUrl={conversionResult?.url}
            fileName={conversionResult?.fileName}
          />
        )}
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI Audio Enhancement</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Advanced AI algorithms to improve audio quality, reduce noise, and enhance clarity.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Music2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Lossless Conversion</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Maintain audio quality with our advanced conversion algorithms and format-specific optimizations.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Batch Processing</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Convert multiple audio files at once with our premium batch processing feature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
