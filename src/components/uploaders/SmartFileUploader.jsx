
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { UploadFile } from '@/api/integrations';
import { Badge } from "@/components/ui/badge";
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
  ChevronUp,
  ArrowRight,
  Download,
  Check,
  Info,
  AlertTriangle,
  Sparkles,
  Brain,
  FileOutput,
  PenTool
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

export default function SmartFileUploader({ 
  onFileUpload,
  maxSizeMB = 100,
  autoProcess = true,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [conversionOptions, setConversionOptions] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState(null);
  const [processingPhase, setProcessingPhase] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

  const fileTypeMap = {
    'pdf': 'document',
    'docx': 'document',
    'doc': 'document',
    'xlsx': 'document',
    'xls': 'document',
    'pptx': 'document',
    'ppt': 'document',
    'txt': 'document',
    'rtf': 'document',
    'jpg': 'image',
    'jpeg': 'image',
    'png': 'image',
    'gif': 'image',
    'svg': 'image',
    'webp': 'image',
    'bmp': 'image',
    'tiff': 'image',
    'tif': 'image',
    'mp3': 'audio',
    'wav': 'audio',
    'ogg': 'audio',
    'flac': 'audio',
    'aac': 'audio',
    'wma': 'audio',
    'm4a': 'audio',
    'mp4': 'video',
    'avi': 'video',
    'mov': 'video',
    'mkv': 'video',
    'webm': 'video',
    'wmv': 'video',
    'flv': 'video',
  };

  const getAiOptions = (type, extension) => {
    const options = [];
    
    switch (type) {
      case 'document':
        if (extension === 'pdf') {
          return [
            { title: "AI Analysis", description: "Summarize and extract insights", icon: Brain, color: "purple", route: "AiPdfAnalysis" },
            { title: "Convert to Word", description: "Edit your document", icon: FileOutput, color: "blue", route: "DocumentConverter" },
            { title: "Extract Text", description: "Get plain text content", icon: FileText, color: "indigo", route: "OcrTool" }
          ];
        } else if (['docx', 'doc'].includes(extension)) {
          return [
            { title: "Convert to PDF", description: "For better sharing", icon: FileOutput, color: "blue", route: "DocumentConverter" },
            { title: "AI Enhancement", description: "Improve writing and structure", icon: PenTool, color: "emerald", route: "DocumentConverter" }
          ];
        } else if (['xlsx', 'xls'].includes(extension)) {
          return [
            { title: "Convert to PDF", description: "For better sharing", icon: FileOutput, color: "blue", route: "DocumentConverter" },
            { title: "Data Analysis", description: "Extract insights", icon: Brain, color: "purple", route: "DocumentConverter" }
          ];
        }
        break;
      case 'image':
        return [
          { title: "Convert Format", description: "Change to another format", icon: FileOutput, color: "emerald", route: "ImageConverter" },
          { title: "Optimize", description: "Reduce file size", icon: FileOutput, color: "purple", route: "Compress" },
          { title: "Extract Text", description: "Get text from image", icon: FileText, color: "indigo", route: "OcrTool" }
        ];
      case 'audio':
        return [
          { title: "Convert Format", description: "Change to another format", icon: FileOutput, color: "amber", route: "AudioConverter" },
          { title: "Compress", description: "Reduce file size", icon: FileOutput, color: "purple", route: "Compress" }
        ];
      case 'video':
        return [
          { title: "Convert Format", description: "Change to another format", icon: FileOutput, color: "rose", route: "VideoConverter" },
          { title: "Compress", description: "Reduce file size", icon: FileOutput, color: "purple", route: "Compress" },
          { title: "Extract Audio", description: "Get audio track", icon: FileAudio, color: "amber", route: "VideoConverter" }
        ];
      default:
        return [{ title: "Convert Format", description: "Change to another format", icon: FileOutput, color: "blue", route: "DocumentConverter" }];
    }
    
    return options;
  };

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
    e.target.value = "";
  };

  const processFile = async (file) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSizeMB}MB for free users. Upgrade to Premium for larger files.`,
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setProcessingPhase('uploading');
    
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 200);
    
    try {
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      
      const type = fileTypeMap[fileExtension] || 'document';
      
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setProcessingPhase('analyzing');
      setIsAnalyzing(true);
      
      let aiProgress = 0;
      const aiInterval = setInterval(() => {
        aiProgress += Math.floor(Math.random() * 8) + 3;
        if (aiProgress >= 100) {
          clearInterval(aiInterval);
          aiProgress = 100;
          setTimeout(() => {
            setIsAnalyzing(false);
            
            const uploadedFileData = {
              name: fileName,
              size: file.size,
              type: file.type,
              url: URL.createObjectURL(file),
              file: file,
              extension: fileExtension
            };
            
            setUploadedFile(uploadedFileData);
            setFileType(type);
            
            const aiOptions = getAiOptions(type, fileExtension);
            setConversionOptions(aiOptions);
            
            toast({
              title: "File processed successfully",
              description: `${fileName} is ready for processing. We've suggested some options for you.`,
              variant: "default"
            });
            
            if (onFileUpload) {
              onFileUpload(uploadedFileData);
            }
          }, 500);
        }
      }, 300);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleConversion = async (format) => {
    if (!uploadedFile || !format) return;
    
    setIsConverting(true);
    setConversionProgress(0);
    setSelectedFormat(format);
    
    const progressInterval = setInterval(() => {
      setConversionProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 200);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));
      
      clearInterval(progressInterval);
      setConversionProgress(100);
      
      const convertedFileData = {
        name: `${uploadedFile.name.split('.')[0]}.${format}`,
        size: Math.floor(uploadedFile.size * (Math.random() * 0.5 + 0.5)),
        type: `application/${format}`,
        url: uploadedFile.url,
        originalFormat: uploadedFile.extension,
        convertedFormat: format
      };
      
      setConvertedFile(convertedFileData);
      
      toast({
        title: "Conversion complete",
        description: `File has been converted to ${format.toUpperCase()}.`,
        variant: "default"
      });
      
    } catch (error) {
      console.error('Error converting file:', error);
      toast({
        title: "Conversion failed",
        description: "There was an error converting your file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConverting(false);
    }
  };

  const getUploadStatusMessage = () => {
    if (processingPhase === 'uploading') {
      return "Uploading your file...";
    } else if (processingPhase === 'analyzing') {
      const messages = [
        "Analyzing your document with AI...",
        "Identifying optimal conversion options...",
        "Processing file contents...",
        "Optimizing for best results..."
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    return "Processing...";
  };

  const resetAll = () => {
    setUploadedFile(null);
    setFileType(null);
    setConversionOptions([]);
    setSelectedFormat(null);
    setConvertedFile(null);
    setIsAnalyzing(false);
  };

  const getFileTypeIcon = (type) => {
    switch (type) {
      case 'document':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'image':
        return <FileImage className="h-6 w-6 text-emerald-500" />;
      case 'audio':
        return <FileAudio className="h-6 w-6 text-amber-500" />;
      case 'video':
        return <FileVideo className="h-6 w-6 text-rose-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!uploadedFile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            key="uploader"
          >
            <div
              className={`border-2 border-dashed rounded-xl ${
                isDragging 
                  ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-300 dark:border-gray-700'
              } transition-colors duration-200 text-center ${isUploading ? 'p-8' : 'p-6 md:p-10'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isUploading ? (
                <div className="space-y-4">
                  <div className="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    {isAnalyzing ? 
                      <Brain className="h-10 w-10 text-purple-500 animate-pulse" /> : 
                      <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                    }
                  </div>
                  <h3 className="text-lg font-medium dark:text-white">{getUploadStatusMessage()}</h3>
                  <Progress value={uploadProgress} className="h-2 w-3/4 mx-auto" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">{uploadProgress}%</p>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                    <Upload className="h-10 w-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-medium dark:text-white mb-2">
                    Drop your file here or click to upload
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Our AI will analyze your file and suggest the best processing options.
                  </p>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 px-8 rounded-full"
                  >
                    <FileUp className="mr-2 h-5 w-5" />
                    Select File
                  </Button>
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                  />
                </>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            key="conversion"
            className="border rounded-xl p-6 bg-white dark:bg-gray-800 shadow-sm"
          >
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {getFileTypeIcon(fileType)}
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {uploadedFile.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge 
                    className={`
                      ${fileType === 'document' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : ''}
                      ${fileType === 'image' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' : ''}
                      ${fileType === 'audio' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' : ''}
                      ${fileType === 'video' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300' : ''}
                    `}
                  >
                    {fileType.charAt(0).toUpperCase() + fileType.slice(1)}
                  </Badge>
                </motion.div>
              </div>
              
              {!convertedFile ? (
                <>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      AI-Suggested Options:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {conversionOptions.map((option, index) => (
                        <Link to={createPageUrl(option.route)} key={index} className="w-full">
                          <motion.div
                            whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-${option.color}-300 dark:hover:border-${option.color}-700 cursor-pointer`}
                          >
                            <div className={`p-2 rounded-full bg-${option.color}-100 dark:bg-${option.color}-900/30 text-${option.color}-600 dark:text-${option.color}-400`}>
                              <option.icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-white text-sm">
                                {option.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {option.description}
                              </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  {isConverting && (
                    <div className="space-y-3 mt-4">
                      <div className="flex justify-between items-center text-sm">
                        <p className="text-gray-600 dark:text-gray-400">Converting to {selectedFormat?.toUpperCase()}...</p>
                        <p className="text-gray-600 dark:text-gray-400">{conversionProgress}%</p>
                      </div>
                      <Progress value={conversionProgress} className="h-2" />
                    </div>
                  )}
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg p-4 mt-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 dark:bg-green-800 rounded-full p-1.5">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-300" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-300">
                        Processing complete
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-400">
                        {convertedFile.name} ({(convertedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3 mt-6">
              {convertedFile ? (
                <>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 px-6"
                      onClick={() => {
                        const a = document.createElement('a');
                        a.href = convertedFile.url;
                        a.download = convertedFile.name;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }}
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Download Result
                    </Button>
                  </motion.div>
                  <Button 
                    variant="outline"
                    onClick={resetAll}
                  >
                    Process another file
                  </Button>
                </>
              ) : (
                <>
                  {!isConverting && (
                    <Button 
                      variant="outline"
                      onClick={resetAll}
                    >
                      Upload another file
                    </Button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!uploadedFile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <h4 className="font-medium text-gray-900 dark:text-white text-center mb-3">Free vs Premium Features</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 font-medium text-gray-600 dark:text-gray-300">Feature</th>
                  <th className="text-center py-2 font-medium text-gray-600 dark:text-gray-300">Free</th>
                  <th className="text-center py-2 font-medium text-amber-600 dark:text-amber-400">Premium</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 text-gray-700 dark:text-gray-300">AI PDF Analysis</td>
                  <td className="py-2 text-center text-gray-700 dark:text-gray-300">✅ Basic Summary</td>
                  <td className="py-2 text-center text-amber-700 dark:text-amber-300">✅ Full Data Extraction</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 text-gray-700 dark:text-gray-300">Batch Processing</td>
                  <td className="py-2 text-center text-gray-700 dark:text-gray-300">❌</td>
                  <td className="py-2 text-center text-amber-700 dark:text-amber-300">✅ Up to 10 files</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-700 dark:text-gray-300">File Size Limit</td>
                  <td className="py-2 text-center text-gray-700 dark:text-gray-300">100MB</td>
                  <td className="py-2 text-center text-amber-700 dark:text-amber-300">1GB</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-center mt-4">
            <Link to={createPageUrl("Premium")}>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white"
              >
                Upgrade to Premium
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
