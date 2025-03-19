import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { UploadFile } from '@/api/integrations';
import {
  Upload,
  FileUp,
  FileText,
  FileImage,
  FileAudio,
  FileVideo,
  Loader2,
  File,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function FileUploader({ 
  onFileUpload, 
  maxSizeMB = 50, 
  acceptedFormats = "",
  conversionType = "document",
  autoProcessing = true,
  defaultTargetFormat = null,
  showAdvancedOptions = true
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fileInputRef = useRef(null);

  // Get icon based on conversion type
  const getConversionIcon = () => {
    switch (conversionType) {
      case 'document':
        return <FileText className="h-10 w-10 text-blue-500" />;
      case 'image':
        return <FileImage className="h-10 w-10 text-emerald-500" />;
      case 'audio':
        return <FileAudio className="h-10 w-10 text-amber-500" />;
      case 'video':
        return <FileVideo className="h-10 w-10 text-rose-500" />;
      case 'compress':
        return <File className="h-10 w-10 text-purple-500" />;
      case 'ocr':
        return <FileText className="h-10 w-10 text-indigo-500" />;
      default:
        return <FileUp className="h-10 w-10 text-blue-500" />;
    }
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (!file) return;
    
    await processFile(file);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    await processFile(file);
    // Reset the input value to allow selecting the same file again
    e.target.value = "";
  };

  const processFile = async (file) => {
    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSizeMB}MB`,
        variant: "destructive"
      });
      return;
    }
    
    // Validate file format if acceptedFormats is provided
    if (acceptedFormats) {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const acceptedFormatsList = acceptedFormats.toLowerCase().split(',');
      
      if (!acceptedFormatsList.includes(fileExtension)) {
        toast({
          title: "Unsupported file format",
          description: `Please upload a file in one of these formats: ${acceptedFormats}`,
          variant: "destructive"
        });
        return;
      }
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Progress simulation
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 100);
    
    try {
      // Upload file to server
      const { file_url } = await UploadFile({ file });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Construct file object to return
      const fileObj = {
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        url: file_url
      };
      
      setTimeout(() => {
        setIsUploading(false);
        onFileUpload(fileObj);
        
        // Auto-start processing if enabled
        if (autoProcessing && defaultTargetFormat) {
          // Here we could trigger automatic processing
          // This would require the parent component to listen for this event
        }
      }, 500);
      
    } catch (error) {
      clearInterval(progressInterval);
      setIsUploading(false);
      console.error('File upload error:', error);
      
      toast({
        title: "Upload Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`
          border-2 border-dashed rounded-xl transition-all duration-200 overflow-hidden
          ${isDragging ? 
            'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 
            'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
          }
          ${isUploading ? 'bg-gray-50 dark:bg-gray-800/50' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        {isUploading ? (
          <div className="p-8 text-center">
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-700 dark:text-gray-300 mb-2">Uploading file...</p>
              <div className="w-full max-w-md mb-2">
                <Progress value={uploadProgress} className="h-2" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{uploadProgress}%</p>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center cursor-pointer">
            <div className="mb-4 flex justify-center">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                {getConversionIcon()}
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Drop your file here or click to browse
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {acceptedFormats ? `Supports ${acceptedFormats} files` : 'Upload your file'} up to {maxSizeMB}MB
            </p>
            <Button 
              variant="outline" 
              className="bg-white dark:bg-gray-800"
            >
              <Upload className="mr-2 h-4 w-4" />
              Select File
            </Button>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept={acceptedFormats ? `.${acceptedFormats.replace(/,/g, ',.').toLowerCase()}` : undefined}
          disabled={isUploading}
        />
      </div>
      
      {showAdvancedOptions && (
        <div className="mt-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-sm text-gray-500 dark:text-gray-400 px-0"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 
              <ChevronUp className="h-4 w-4 mr-1" /> : 
              <ChevronDown className="h-4 w-4 mr-1" />
            }
            {showAdvanced ? 'Hide advanced options' : 'Show advanced options'}
          </Button>
          
          {showAdvanced && (
            <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg text-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* These would be actual advanced options implemented in a real app */}
                <p className="text-gray-500 dark:text-gray-400">Advanced upload settings would appear here</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}