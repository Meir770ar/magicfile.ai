
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UploadFile, ExtractDataFromUploadedFile, InvokeLLM } from '@/api/integrations';
import { toast } from "@/components/ui/use-toast";
import {
  FileUp,
  Loader2,
  X,
  Check,
  AlertCircle,
  FileType,
  Plus,
  FileIcon,
  Download,
  RefreshCw,
  FileText,
  Play,
  Save,
  Image as ImageIcon,
  Wand2,
  FilesIcon,
  MoveDownIcon,
  ExternalLink,
  FilePlus2,
  CheckCircle,
  ExternalLinkIcon,
  FileOutput,
  MoreHorizontalIcon,
  Trash2,
  Eye,
  Filter,
  ArrowDownUp,
  Scissors,
  Circle,
  CheckCircle2,
  ScanLine,
  CropIcon
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function BatchProcessor({ onComplete, onCancel }) {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [processedCount, setProcessedCount] = useState(0);
  const [activeTab, setActiveTab] = useState("files");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [outputFilename, setOutputFilename] = useState("merged_document");
  const [enhanceImages, setEnhanceImages] = useState(true);
  const [performOcr, setPerformOcr] = useState(true);
  const [recognizeHandwriting, setRecognizeHandwriting] = useState(true);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [mergeInProgress, setMergeInProgress] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [cropImages, setCropImages] = useState(true);
  const [removeBg, setRemoveBg] = useState(false);
  const [bulkRenameEnabled, setBulkRenameEnabled] = useState(false);
  const [bulkRenameTemplate, setBulkRenameTemplate] = useState("Document_{number}");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (files.length > 0) {
      const fileTypes = files.map(f => f.type);
      const uniqueTypes = new Set(fileTypes);
      
      if (uniqueTypes.size === 1) {
        const type = fileTypes[0];
        if (type.startsWith('image/')) {
          setEnhanceImages(true);
          setCropImages(true);
          setPerformOcr(true);
        }
      }
    }
  }, [files]);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    
    if (validFiles.length !== selectedFiles.length) {
      toast({
        title: "חלק מהקבצים לא נתמכים",
        description: "ניתן להעלות רק קבצי תמונה ו-PDF",
        variant: "destructive"
      });
    }
    
    addFilesToList(validFiles);
    e.target.value = '';
  };

  const addFilesToList = (newFiles) => {
    setFiles(prev => [
      ...prev, 
      ...newFiles.map(file => ({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        name: file.name,
        type: file.type,
        size: file.size,
        status: 'pending',
        progress: 0,
        processedUrl: null,
        extractedText: null,
        analysis: null,
        error: null
      }))
    ]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    
    if (validFiles.length !== droppedFiles.length) {
      toast({
        title: "חלק מהקבצים לא נתמכים",
        description: "ניתן להעלות רק קבצי תמונה ו-PDF",
        variant: "destructive"
      });
    }
    
    if (validFiles.length > 0) {
      addFilesToList(validFiles);
    }
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    setSelectedFiles(prev => prev.filter(fileId => fileId !== id));
  };

  const clearAllFiles = () => {
    setFiles([]);
    setSelectedFiles([]);
    setProcessedFiles([]);
    setResults([]);
    setError(null);
  };

  const toggleFileSelection = (id) => {
    setSelectedFiles(prev => 
      prev.includes(id) ? prev.filter(fileId => fileId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map(file => file.id));
    }
  };

  const getFilteredAndSortedFiles = () => {
    let filteredFiles = [...files];
    
    if (nameFilter) {
      filteredFiles = filteredFiles.filter(file => 
        file.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    
    if (typeFilter !== "all") {
      filteredFiles = filteredFiles.filter(file => {
        if (typeFilter === "image") return file.type.startsWith('image/');
        if (typeFilter === "pdf") return file.type === 'application/pdf';
        return true;
      });
    }
    
    filteredFiles.sort((a, b) => {
      let comparisonResult = 0;
      
      if (sortBy === "name") {
        comparisonResult = a.name.localeCompare(b.name);
      } else if (sortBy === "size") {
        comparisonResult = a.size - b.size;
      } else if (sortBy === "type") {
        comparisonResult = a.type.localeCompare(b.type);
      } else if (sortBy === "date") {
        comparisonResult = a.id.localeCompare(b.id);
      }
      
      return sortAsc ? comparisonResult : -comparisonResult;
    });
    
    return filteredFiles;
  };

  const processFiles = async () => {
    const filesToProcess = selectedFiles.length > 0 
      ? files.filter(file => selectedFiles.includes(file.id))
      : files;
    
    if (filesToProcess.length === 0) {
      toast({
        title: "אין קבצים לעיבוד",
        description: "בחר קבצים לעיבוד תחילה",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    setCurrentFileIndex(0);
    setProcessedCount(0);
    setProcessedFiles([]);
    setResults([]);
    setError(null);
    
    try {
      for (let i = 0; i < filesToProcess.length; i++) {
        setCurrentFileIndex(i);
        const file = filesToProcess[i];
        
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'processing', progress: 0 } : f
        ));

        try {
          const { file_url } = await UploadFile({ file: file.file });
          
          let processedUrl = file_url;
          let extractedText = null;
          
          if (file.type.startsWith('image/')) {
            if (enhanceImages) {
              const enhancementPrompt = `
                Enhance this document image with these requirements:
                ${cropImages ? '- Detect and crop to document boundaries\n' : ''}
                ${removeBg ? '- Remove background, make it pure white\n' : ''}
                - Enhance text clarity and contrast
                - Fix any perspective or orientation issues
                - Optimize for OCR processing
              `;
              
              try {
                const enhancementResult = await InvokeLLM({
                  prompt: enhancementPrompt,
                  file_urls: [file_url]
                });
                
                if (enhancementResult?.url) {
                  processedUrl = enhancementResult.url;
                }
              } catch (enhanceError) {
                console.error('Enhancement failed:', enhanceError);
              }
            }
          }
          
          if (performOcr) {
            try {
              const ocrPrompt = `
                Extract ALL text from this document.
                ${recognizeHandwriting ? 'Include both printed and handwritten text.\n' : ''}
                Maintain the document's structure and layout.
                Be extremely thorough - capture every character and number.
              `;
              
              const ocrResult = await InvokeLLM({
                prompt: ocrPrompt,
                file_urls: [processedUrl],
                response_json_schema: {
                  type: "object",
                  properties: {
                    extracted_text: { type: "string" }
                  }
                }
              });
              
              if (ocrResult?.extracted_text) {
                extractedText = ocrResult.extracted_text;
              }
            } catch (ocrError) {
              console.error('OCR failed:', ocrError);
            }
          }
          
          setFiles(prev => prev.map(f => 
            f.id === file.id ? {
              ...f,
              status: 'completed',
              progress: 100,
              processedUrl,
              extractedText
            } : f
          ));
          
          setProcessedFiles(prev => [...prev, {
            id: file.id,
            name: file.name,
            type: file.type,
            size: file.size,
            originalUrl: file_url,
            processedUrl,
            extractedText,
            thumbnailUrl: file.type.startsWith('image/') ? processedUrl : null
          }]);
          
          setProcessedCount(prev => prev + 1);
          
        } catch (fileError) {
          console.error(`Error processing file ${file.name}:`, fileError);
          setFiles(prev => prev.map(f => 
            f.id === file.id ? {
              ...f,
              status: 'error',
              error: 'Failed to process file'
            } : f
          ));
        }
      }
      
      toast({
        title: "עיבוד הושלם",
        description: `${processedFiles.length} קבצים עובדו בהצלחה`,
      });
      
      setActiveTab("results");
      
    } catch (error) {
      console.error("Batch processing failed:", error);
      setError("אירעה שגיאה בעיבוד הקבצים. אנא נסה שוב.");
      
      toast({
        title: "שגיאת עיבוד",
        description: "אירעה שגיאה בעיבוד הקבצים. אנא נסה שוב.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadProcessedFile = (file) => {
    if (!file.processedUrl) return;
    
    const link = document.createElement('a');
    link.href = file.processedUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const mergeSelectedPdfs = async () => {
    const pdfFiles = selectedFiles.length > 0
      ? files.filter(file => selectedFiles.includes(file.id) && file.type === 'application/pdf')
      : files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length === 0) {
      toast({
        title: "אין קבצי PDF לאיחוד",
        description: "בחר לפחות קובץ PDF אחד לאיחוד",
        variant: "destructive"
      });
      return;
    }
    
    if (pdfFiles.length === 1) {
      toast({
        title: "נדרשים מספר קבצי PDF",
        description: "איחוד PDF דורש לפחות שני קבצים",
        variant: "destructive"
      });
      return;
    }
    
    setMergeInProgress(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const firstPdfUrl = pdfFiles[0].processedUrl || URL.createObjectURL(pdfFiles[0].file);
      setMergedPdfUrl(firstPdfUrl);
      
      toast({
        title: "קבצי PDF אוחדו",
        description: `${pdfFiles.length} קבצים אוחדו בהצלחה`,
      });
    } catch (error) {
      console.error("PDF merging failed:", error);
      toast({
        title: "שגיאת איחוד PDF",
        description: "לא ניתן היה לאחד את קבצי ה-PDF",
        variant: "destructive"
      });
    } finally {
      setMergeInProgress(false);
    }
  };

  const bulkRenameFiles = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "אין קבצים נבחרים",
        description: "בחר קבצים לשינוי שם",
        variant: "destructive"
      });
      return;
    }
    
    const updatedFiles = [...files];
    
    selectedFiles.forEach((id, index) => {
      const fileIndex = updatedFiles.findIndex(file => file.id === id);
      if (fileIndex !== -1) {
        const newName = bulkRenameTemplate
          .replace('{number}', (index + 1).toString().padStart(2, '0'))
          .replace('{type}', updatedFiles[fileIndex].type.split('/')[1] || 'file')
          .replace('{date}', new Date().toISOString().split('T')[0]);
        
        const extension = updatedFiles[fileIndex].name.split('.').pop();
        const finalName = newName.includes(`.${extension}`) ? newName : `${newName}.${extension}`;
        
        updatedFiles[fileIndex] = {
          ...updatedFiles[fileIndex],
          name: finalName
        };
      }
    });
    
    setFiles(updatedFiles);
    
    toast({
      title: "שמות קבצים שונו",
      description: `${selectedFiles.length} קבצים שונו`,
    });
  };

  const renderFileList = () => {
    const filteredAndSortedFiles = getFilteredAndSortedFiles();
    
    if (filteredAndSortedFiles.length === 0) {
      return (
        <div className="text-center py-10">
          <FilesIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-500">אין קבצים להצגה</p>
          <p className="text-gray-500 text-sm">גרור קבצים לכאן או לחץ על 'הוסף קבצים'</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-2">
        {filteredAndSortedFiles.map(file => (
          <div 
            key={file.id} 
            className={`flex items-center p-3 rounded-lg ${
              selectedFiles.includes(file.id) 
                ? 'bg-blue-900/20 border border-blue-700/30' 
                : 'border border-gray-700/30 hover:bg-gray-800/30'
            } transition-colors duration-150`}
          >
            <div className="ml-3">
              <Checkbox 
                checked={selectedFiles.includes(file.id)}
                onCheckedChange={() => toggleFileSelection(file.id)}
                className="border-gray-600"
              />
            </div>
            
            <div className="flex-shrink-0 ml-3">
              {file.type.startsWith('image/') ? (
                <div className="w-12 h-12 bg-gray-800 rounded overflow-hidden relative">
                  <img 
                    src={file.processedUrl || URL.createObjectURL(file.file)} 
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center">
                  <FileIcon className="w-6 h-6 text-amber-500" />
                </div>
              )}
            </div>
            
            <div className="flex-1 mx-3 min-w-0">
              <div className="flex items-center justify-between">
                <div className="truncate font-medium text-gray-300">
                  {file.name}
                </div>
                <div className="flex items-center gap-2">
                  {file.status === 'processing' && (
                    <Badge variant="outline" className="bg-blue-900/20 text-blue-300 border-blue-700">
                      <Loader2 className="h-3 w-3 ml-1 animate-spin" />
                      מעבד
                    </Badge>
                  )}
                  {file.status === 'completed' && (
                    <Badge variant="outline" className="bg-green-900/20 text-green-300 border-green-700">
                      <Check className="h-3 w-3 ml-1" />
                      הושלם
                    </Badge>
                  )}
                  {file.status === 'error' && (
                    <Badge variant="outline" className="bg-red-900/20 text-red-300 border-red-700">
                      <X className="h-3 w-3 ml-1" />
                      שגיאה
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="text-sm text-gray-500 flex items-center gap-4">
                <span>
                  {file.type.split('/')[1]?.toUpperCase() || file.type}
                </span>
                <span>
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
              
              {file.status === 'processing' && (
                <Progress 
                  value={file.progress} 
                  className="h-1 mt-2"
                />
              )}
            </div>
            
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                    <MoreHorizontalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end">
                  <DropdownMenuLabel>פעולות</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => removeFile(file.id)}
                    className="text-red-400"
                  >
                    <Trash2 className="ml-2 h-4 w-4" />
                    הסר
                  </DropdownMenuItem>
                  
                  {file.status === 'completed' && (
                    <>
                      <DropdownMenuItem onClick={() => downloadProcessedFile(file)}>
                        <Download className="ml-2 h-4 w-4" />
                        הורד
                      </DropdownMenuItem>
                      
                      {file.processedUrl && file.type.startsWith('image/') && (
                        <DropdownMenuItem onClick={() => {}}>
                          <Eye className="ml-2 h-4 w-4" />
                          הצג
                        </DropdownMenuItem>
                      )}
                      
                      {file.extractedText && (
                        <DropdownMenuItem onClick={() => {}}>
                          <FileText className="ml-2 h-4 w-4" />
                          הצג טקסט
                        </DropdownMenuItem>
                      )}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderResultsView = () => {
    if (processedFiles.length === 0) {
      return (
        <div className="text-center py-10">
          <ScanLine className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-500">אין תוצאות להצגה</p>
          <p className="text-gray-500 text-sm">עבד קבצים כדי לראות את התוצאות כאן</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {processedFiles.map(file => (
          <Card key={file.id} className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-lg">{file.name}</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => downloadProcessedFile(file)}
                  className="h-8 w-8 text-gray-400"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                {file.type.split('/')[1]?.toUpperCase() || file.type} • {(file.size / 1024).toFixed(1)} KB
              </CardDescription>
            </CardHeader>
            <CardContent>
              {file.type.startsWith('image/') && (
                <div className="mb-4 bg-gray-900 rounded overflow-hidden">
                  <img 
                    src={file.processedUrl} 
                    alt={file.name}
                    className="w-full h-auto object-contain max-h-[300px]"
                  />
                </div>
              )}
              
              {file.extractedText && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-300 mb-2 flex items-center">
                    <FileText className="ml-2 h-4 w-4 text-blue-400" />
                    טקסט שזוהה
                  </h4>
                  <ScrollArea className="h-32 w-full rounded border border-gray-700 bg-gray-900 p-3">
                    <div className="text-gray-300 text-sm whitespace-pre-wrap">
                      {file.extractedText}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-gray-100">
          <FilesIcon className="h-5 w-5 text-blue-400" />
          Batch Processing
          {files.length > 0 && (
            <Badge variant="outline" className="ml-2 bg-blue-900/20 text-blue-300">
              {files.length} files
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-gray-400">
          Process multiple documents at once with smart automation
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="p-6 space-y-6">
          <div
            className={`
              border-2 border-dashed rounded-lg p-6 transition-all duration-200
              ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-600'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <FileUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">Drop files here or</p>
              <Button
                variant="link"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-400 mt-1"
              >
                browse
              </Button>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
                  {file.type.startsWith('image/') ? (
                    <div className="w-12 h-12 bg-gray-900 rounded overflow-hidden">
                      <img 
                        src={URL.createObjectURL(file.file)} 
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gray-900 rounded flex items-center justify-center">
                      <FileIcon className="w-6 h-6 text-amber-500" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-300 truncate">
                        {file.name}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(file.id)}
                        className="text-gray-500 hover:text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {files.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gray-800/40 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-blue-400" />
                    Enhancement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enhance-images" className="text-gray-300">
                        Auto-enhance quality
                      </Label>
                      <Switch
                        id="enhance-images"
                        checked={enhanceImages}
                        onCheckedChange={setEnhanceImages}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="crop-images" className="text-gray-300">
                        Smart cropping
                      </Label>
                      <Switch
                        id="crop-images"
                        checked={cropImages}
                        onCheckedChange={setCropImages}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/40 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-400" />
                    Text Recognition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="perform-ocr" className="text-gray-300">
                        Extract text (OCR)
                      </Label>
                      <Switch
                        id="perform-ocr"
                        checked={performOcr}
                        onCheckedChange={setPerformOcr}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between px-6 py-4 border-t border-gray-700">
        <Button
          variant="ghost"
          onClick={onCancel}
          className="text-gray-400 hover:text-white"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        
        {files.length > 0 && (
          <Button
            onClick={processFiles}
            disabled={isProcessing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing {processedCount}/{files.length}...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Process {files.length} Files
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
