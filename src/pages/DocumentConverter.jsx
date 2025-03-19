import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { FileConversion } from '@/api/entities';
import { UploadFile, InvokeLLM } from '@/api/integrations';
import {
  FileText,
  FileSpreadsheet,
  FileImage,
  ArrowRight,
  FileType,
  FileCode,
  Sparkles,
  FileSignature,
  Languages
} from "lucide-react";

import FileUploader from '../components/uploaders/FileUploader';
import ConversionOptions from '../components/converters/ConversionOptions';
import ConversionProgress from '../components/converters/ConversionProgress';

export default function DocumentConverterPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversionOptions, setConversionOptions] = useState({
    targetFormat: 'pdf',
    quality: 90,
    aiEnhance: false,
    ocrLanguage: 'auto',
    preserveLayout: true,
    enableEditing: true,
    password: '',
    selectedAiEnhancements: []
  });
  const [conversionStatus, setConversionStatus] = useState(null); // null, 'processing', 'completed', 'failed'
  const [conversionProgress, setConversionProgress] = useState(0);
  const [conversionResult, setConversionResult] = useState(null);
  const [conversionError, setConversionError] = useState(null);
  
  const documentTypes = [
    { format: 'pdf', icon: FileText, label: 'PDF', color: 'bg-red-100 text-red-700' },
    { format: 'docx', icon: FileText, label: 'Word', color: 'bg-blue-100 text-blue-700' },
    { format: 'xlsx', icon: FileSpreadsheet, label: 'Excel', color: 'bg-green-100 text-green-700' },
    { format: 'pptx', icon: FileType, label: 'PowerPoint', color: 'bg-orange-100 text-orange-700' },
    { format: 'txt', icon: FileCode, label: 'Text', color: 'bg-gray-100 text-gray-700' },
    { format: 'img', icon: FileImage, label: 'Image to PDF', color: 'bg-purple-100 text-purple-700' },
    { format: 'html', icon: FileCode, label: 'HTML', color: 'bg-indigo-100 text-indigo-700' },
    { format: 'rtf', icon: FileText, label: 'RTF', color: 'bg-teal-100 text-teal-700' }
  ];
  
  // Format mapping for conversion
  const formatMappings = {
    'pdf': ['docx', 'xlsx', 'pptx', 'txt', 'jpg', 'png'],
    'docx': ['pdf', 'txt', 'rtf', 'html'],
    'xlsx': ['pdf', 'csv', 'txt'],
    'pptx': ['pdf', 'jpg'],
    'txt': ['pdf', 'docx', 'html'],
    'img': ['pdf', 'docx'],
    'html': ['pdf', 'txt', 'docx'],
    'rtf': ['pdf', 'docx', 'txt']
  };
  
  const handleFileUploaded = (fileObj) => {
    setSelectedFile(fileObj);
    
    // Determine source format from file type
    let sourceFormat = 'pdf'; // default
    if (fileObj.type.includes('pdf')) {
      sourceFormat = 'pdf';
    } else if (fileObj.type.includes('word') || fileObj.type.includes('docx') || fileObj.type.includes('doc')) {
      sourceFormat = 'docx';
    } else if (fileObj.type.includes('sheet') || fileObj.type.includes('excel') || fileObj.type.includes('xls')) {
      sourceFormat = 'xlsx';
    } else if (fileObj.type.includes('presentation') || fileObj.type.includes('powerpoint') || fileObj.type.includes('ppt')) {
      sourceFormat = 'pptx';
    } else if (fileObj.type.includes('text/plain')) {
      sourceFormat = 'txt';
    } else if (fileObj.type.includes('image/')) {
      sourceFormat = 'img';
    } else if (fileObj.type.includes('text/html')) {
      sourceFormat = 'html';
    } else if (fileObj.type.includes('application/rtf')) {
      sourceFormat = 'rtf';
    }
    
    // Set default target format based on source
    if (formatMappings[sourceFormat] && formatMappings[sourceFormat].length > 0) {
      setConversionOptions(prev => ({
        ...prev,
        targetFormat: formatMappings[sourceFormat][0]
      }));
    }
    
    toast({
      title: "File successfully uploaded",
      description: `${fileObj.name} has been uploaded. Choose conversion options and continue.`,
    });
  };
  
  const handleOptionChange = (options) => {
    setConversionOptions(options);
  };
  
  const startConversion = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a file to convert",
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
      }, 500);
      
      // In a real implementation, you would call your conversion service here
      
      // For demo purposes, just simulate a conversion
      await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
      
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
        conversion_type: 'document',
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
          <h1 className="text-3xl font-bold text-gray-900">Document Conversion</h1>
          <p className="text-gray-500 mt-2">Convert PDF, Word, Excel, PowerPoint and text files easily</p>
        </div>
        
        {!conversionStatus ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-blue-500" />
                    Upload File
                  </CardTitle>
                  <CardDescription>
                    Upload a document file for conversion. We support a wide range of formats
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
                        maxSizeMB={100}
                        acceptedFormats="PDF,DOCX,DOC,XLSX,XLS,PPTX,PPT,TXT,JPG,PNG,HTML,RTF"
                        conversionType="document"
                      />
                    </TabsContent>
                    <TabsContent value="formats" className="pt-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {documentTypes.map(docType => (
                          <div key={docType.format} className="flex flex-col items-center p-3 border border-gray-200 rounded-lg">
                            <div className={`p-2 rounded-full ${docType.color} mb-2`}>
                              <docType.icon className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium">{docType.label}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 border-t border-gray-100 pt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Special Capabilities:</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center">
                            <Languages className="mr-1 h-3 w-3" />
                            Multilingual OCR
                          </Badge>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center">
                            <Sparkles className="mr-1 h-3 w-3" />
                            AI Enhancement
                          </Badge>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center">
                            <FileSignature className="mr-1 h-3 w-3" />
                            Digital Signature
                          </Badge>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  {selectedFile && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h3 className="font-medium text-gray-900 mb-2">File ready for conversion:</h3>
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 mr-2" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
                          <p className="text-xs text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
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
                    <FileType className="mr-2 h-5 w-5 text-blue-500" />
                    Conversion Options
                  </CardTitle>
                  <CardDescription>
                    Choose target format and set additional options
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedFile ? (
                    <>
                      <ConversionOptions 
                        conversionType="document"
                        sourceFormat={selectedFile.type}
                        availableTargetFormats={['pdf', 'docx', 'xlsx', 'txt', 'jpg']}
                        onOptionsChange={handleOptionChange}
                        supportedLanguages={[
                          { code: 'en', name: 'English' },
                          { code: 'he', name: 'Hebrew' },
                          { code: 'ar', name: 'Arabic' },
                          { code: 'fr', name: 'French' }
                        ]}
                        supportedAiEnhancements={['text_clarity', 'image_enhance']}
                      />
                      
                      <div className="mt-6 flex justify-center">
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700 px-8"
                          onClick={startConversion}
                        >
                          Start Conversion
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Please upload a file to show conversion options</p>
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
            conversionType="document"
            fileUrl={conversionResult?.url}
            fileName={conversionResult?.fileName}
          />
        )}
        
        {/* Features and Benefits */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="p-3 bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Perfect Quality Preservation</h3>
            <p className="text-gray-600 text-sm">
              Our technology ensures perfect preservation of design, fonts and images in all converted documents.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="p-3 bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Languages className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Advanced OCR</h3>
            <p className="text-gray-600 text-sm">
              Automatic text recognition in different languages including English, Hebrew, and Arabic. Our algorithm also identifies text in images and scanned PDFs.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="p-3 bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <FileSignature className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Editing and Signing</h3>
            <p className="text-gray-600 text-sm">
              Convert documents to editable format, add digital signatures, and protect your documents with passwords.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}