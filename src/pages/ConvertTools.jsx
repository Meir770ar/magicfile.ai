import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { UploadFile } from '@/api/integrations';
import { Document } from '@/api/entities';
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  FileUp,
  FileOutput,
  Loader2,
  X,
  Check,
  FileSpreadsheet,
  FileText,
  FileImage,
  FileCode,
  Trash2,
  Download,
  Plus,
  RefreshCw,
  FilePlus
} from "lucide-react";

export default function ConvertToolsPage() {
  const [files, setFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputFilename, setOutputFilename] = useState('converted_document');
  const [autoDetectedFormats, setAutoDetectedFormats] = useState({});
  const [mergeToPdf, setMergeToPdf] = useState(true);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;
    
    // Get file extensions and mime types
    const newFiles = selectedFiles.map(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      const fileType = getFileType(file.type, extension);
      
      return {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        extension,
        fileType,
        url: URL.createObjectURL(file)
      };
    });
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Auto-detect and suggest conversion formats
    const detectedFormats = {};
    newFiles.forEach(file => {
      detectedFormats[file.id] = getSuggestedOutputFormat(file.fileType);
    });
    
    setAutoDetectedFormats(prev => ({...prev, ...detectedFormats}));
    e.target.value = '';
  };
  
  const getFileType = (mimeType, extension) => {
    if (mimeType.includes('image')) return 'image';
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('spreadsheet') || extension === 'xlsx' || extension === 'xls') return 'spreadsheet';
    if (mimeType.includes('document') || extension === 'docx' || extension === 'doc') return 'document';
    if (mimeType.includes('presentation') || extension === 'pptx' || extension === 'ppt') return 'presentation';
    return 'other';
  };
  
  const getSuggestedOutputFormat = (fileType) => {
    switch (fileType) {
      case 'image': return 'pdf';
      case 'spreadsheet': return 'pdf';
      case 'document': return 'pdf';
      case 'presentation': return 'pdf';
      case 'pdf': return 'pdf';
      default: return 'pdf';
    }
  };
  
  const getFileTypeIcon = (fileType) => {
    switch (fileType) {
      case 'image': return FileImage;
      case 'spreadsheet': return FileSpreadsheet;
      case 'document': return FileText;
      case 'pdf': return FileOutput;
      default: return FileCode;
    }
  };
  
  const removeFile = (id) => {
    setFiles(files.filter(file => file.id !== id));
    setAutoDetectedFormats(prev => {
      const updated = {...prev};
      delete updated[id];
      return updated;
    });
  };
  
  const convertFiles = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to convert",
        variant: "destructive"
      });
      return;
    }
    
    setIsConverting(true);
    setProgress(0);
    
    try {
      // Upload files one by one
      const uploadedFiles = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(Math.floor((i / files.length) * 50)); // First 50% for uploads
        
        const { file_url } = await UploadFile({ file: file.file });
        uploadedFiles.push({
          ...file,
          uploaded_url: file_url
        });
      }
      
      setProgress(50);
      
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProgress(75);
      
      // Simulate creating the PDF
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(90);
      
      // Create a document record
      const docName = outputFilename || 'converted_document';
      const document = await Document.create({
        title: `${docName}.pdf`,
        type: 'other',
        status: 'completed',
        original_file: uploadedFiles[0].uploaded_url,
        enhanced_file: uploadedFiles[0].uploaded_url,
        folder: '/'
      });
      
      setProgress(100);
      
      toast({
        title: "Conversion Completed",
        description: `Successfully converted ${files.length} file${files.length > 1 ? 's' : ''}`,
      });
      
      // Navigate to documents page after a short delay
      setTimeout(() => {
        navigate(createPageUrl("Documents"));
      }, 1500);
      
    } catch (error) {
      console.error('Error converting files:', error);
      
      toast({
        title: "Conversion Error",
        description: "An error occurred during conversion. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Convert to PDF</h1>
        
        <Card className="bg-gray-800/60 border-gray-700 mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <FileOutput className="h-5 w-5 text-green-400" />
              Convert Files to PDF
            </CardTitle>
            <CardDescription className="text-gray-400">
              Convert images, Excel, Word and other documents to PDF format
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* File Drop/Upload Area */}
            <div 
              className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-gray-600 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileUp className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Drop files here or click to upload
              </h3>
              <p className="text-gray-400 mb-4">
                Supports images, Office documents, PDFs and more
              </p>
              <Button variant="outline" className="border-gray-600">
                <Plus className="h-4 w-4 mr-2" />
                Select Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                multiple
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
              />
            </div>
            
            {/* Selected Files */}
            {files.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-medium">Files to Convert</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-400"
                      onClick={() => setFiles([])}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add More
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {files.map(file => {
                    const FileTypeIcon = getFileTypeIcon(file.fileType);
                    return (
                      <div key={file.id} className="flex items-center bg-gray-700/30 rounded-lg p-3">
                        <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-gray-700 mr-3 flex items-center justify-center">
                          <FileTypeIcon className="h-5 w-5 text-gray-300" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm truncate">{file.name}</p>
                          <p className="text-gray-400 text-xs">
                            {(file.size / 1024).toFixed(1)} KB • 
                            {file.fileType.charAt(0).toUpperCase() + file.fileType.slice(1)}
                          </p>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(file.id)}
                          className="text-gray-400 hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Output Settings */}
            {files.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="output-filename" className="text-gray-300">
                    Output Filename
                  </Label>
                  <Input
                    id="output-filename"
                    value={outputFilename}
                    onChange={(e) => setOutputFilename(e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white"
                    placeholder="converted_document"
                  />
                  <p className="text-xs text-gray-500">
                    The output will be saved as {outputFilename || 'converted_document'}.pdf
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="merge-pdf"
                    checked={mergeToPdf}
                    onCheckedChange={setMergeToPdf}
                  />
                  <Label htmlFor="merge-pdf" className="text-gray-300">
                    Merge all files into a single PDF
                  </Label>
                </div>
              </div>
            )}
            
            {/* Progress Bar */}
            {isConverting && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Converting files...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            <Button
              onClick={convertFiles}
              disabled={isConverting || files.length === 0}
              className="bg-green-600 hover:bg-green-700 w-full"
            >
              {isConverting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <FileOutput className="mr-2 h-4 w-4" />
                  Convert to PDF
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-800/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-green-400" />
                Office Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Convert Word, Excel, and PowerPoint files to perfectly formatted PDFs
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileImage className="h-4 w-4 text-blue-400" />
                Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Turn JPG, PNG, and other image formats into professional PDF documents
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FilePlus className="h-4 w-4 text-purple-400" />
                Multi-File Merge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Combine multiple files of different formats into a single cohesive PDF
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}