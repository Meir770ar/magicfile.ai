import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UploadFile } from '@/api/integrations';
import { Document } from '@/api/entities';
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  FileUp,
  SplitSquareHorizontal,
  Scissors,
  Merge,
  Check,
  Trash2,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Plus,
  ArrowRight,
  X,
  Loader2,
  FileText,
  FilePlus
} from "lucide-react";

export default function PdfSplitMerge() {
  const [files, setFiles] = useState([]);
  const [mode, setMode] = useState('split'); // 'split' or 'merge'
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [splitRange, setSplitRange] = useState([1]);
  const [outputFilename, setOutputFilename] = useState('combined_document');
  const [previewFile, setPreviewFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pageRanges, setPageRanges] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  
  // Handle file selection
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;
    
    // Filter for PDF files
    const pdfFiles = selectedFiles.filter(file => 
      file.type === 'application/pdf'
    );
    
    if (pdfFiles.length === 0) {
      toast({
        title: "Invalid file type",
        description: "Please select PDF files only",
        variant: "destructive"
      });
      return;
    }
    
    // Add selected files
    const newFiles = pdfFiles.map(file => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      name: file.name,
      size: file.size,
      pages: Math.floor(Math.random() * 15) + 1, // Simulated page count
      selected: true
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // If this is the first file and in split mode, set it for preview
    if (mode === 'split' && files.length === 0 && newFiles.length > 0) {
      setPreviewFile(newFiles[0]);
      // For demo purposes, set a random page count
      const randomPages = Math.floor(Math.random() * 20) + 5;
      setTotalPages(randomPages);
      
      // Initialize with all pages selected
      const initialRanges = [];
      initialRanges.push({
        id: `range-${Date.now()}`,
        start: 1,
        end: randomPages,
        filename: `split_${newFiles[0].name}`
      });
      setPageRanges(initialRanges);
    }
    
    e.target.value = '';
  };
  
  // Handle drag and drop
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
    
    const items = e.dataTransfer.items;
    const files = [];
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file.type === 'application/pdf') {
          files.push(file);
        }
      }
    }
    
    if (files.length === 0) {
      toast({
        title: "Invalid files",
        description: "Please drop PDF files only",
        variant: "destructive"
      });
      return;
    }
    
    // Add dropped files
    const newFiles = files.map(file => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      name: file.name,
      size: file.size,
      pages: Math.floor(Math.random() * 15) + 1, // Simulated page count
      selected: true
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // If this is the first file and in split mode, set it for preview
    if (mode === 'split' && files.length === 0 && newFiles.length > 0) {
      setPreviewFile(newFiles[0]);
      // For demo purposes, set a random page count
      const randomPages = Math.floor(Math.random() * 20) + 5;
      setTotalPages(randomPages);
      
      // Initialize with all pages selected
      const initialRanges = [];
      initialRanges.push({
        id: `range-${Date.now()}`,
        start: 1,
        end: randomPages,
        filename: `split_${newFiles[0].name}`
      });
      setPageRanges(initialRanges);
    }
  };
  
  // Remove a file
  const removeFile = (id) => {
    setFiles(files.filter(file => file.id !== id));
    
    // If we're removing the preview file, reset preview
    if (previewFile && previewFile.id === id) {
      setPreviewFile(null);
      setTotalPages(0);
      setPageRanges([]);
    }
  };
  
  // Add a new page range for splitting
  const addPageRange = () => {
    if (totalPages === 0) return;
    
    // Find a gap in existing ranges
    let start = 1;
    const sortedRanges = [...pageRanges].sort((a, b) => a.start - b.start);
    
    for (const range of sortedRanges) {
      if (range.start > start) {
        // Found a gap
        break;
      }
      // Move start to after this range
      start = range.end + 1;
    }
    
    // If start is beyond totalPages, there are no gaps
    if (start > totalPages) {
      toast({
        title: "Cannot add range",
        description: "All pages are already allocated to ranges",
        variant: "destructive"
      });
      return;
    }
    
    const end = Math.min(start + 1, totalPages);
    
    setPageRanges([
      ...pageRanges,
      {
        id: `range-${Date.now()}`,
        start,
        end,
        filename: `split_${pageRanges.length + 1}.pdf`
      }
    ]);
  };
  
  // Remove a page range
  const removePageRange = (id) => {
    setPageRanges(pageRanges.filter(range => range.id !== id));
  };
  
  // Update a page range
  const updatePageRange = (id, field, value) => {
    setPageRanges(pageRanges.map(range => {
      if (range.id === id) {
        const updatedRange = { ...range, [field]: value };
        
        // Ensure start <= end
        if (field === 'start' && value > range.end) {
          updatedRange.end = value;
        } else if (field === 'end' && value < range.start) {
          updatedRange.start = value;
        }
        
        return updatedRange;
      }
      return range;
    }));
  };
  
  // Process the PDF operation
  const processPdf = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one PDF file",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      // Upload files
      const uploadedFiles = [];
      for (let i = 0; i < files.length; i++) {
        setProgress(Math.floor((i / files.length) * 40));
        
        // Only upload files that are selected
        if (files[i].selected) {
          const { file_url } = await UploadFile({ file: files[i].file });
          uploadedFiles.push({
            ...files[i],
            url: file_url
          });
        }
      }
      
      setProgress(50);
      
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProgress(75);
      
      // Simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a document record for demonstration
      let documentName = '';
      if (mode === 'merge') {
        documentName = `${outputFilename || 'combined_document'}.pdf`;
      } else {
        documentName = `split_${previewFile?.name || 'document'}.pdf`;
      }
      
      const document = await Document.create({
        title: documentName,
        type: 'other',
        status: 'completed',
        original_file: uploadedFiles[0].url,
        enhanced_file: uploadedFiles[0].url,
        folder: '/'
      });
      
      setProgress(100);
      
      toast({
        title: "Processing completed",
        description: mode === 'merge' 
          ? "PDFs merged successfully" 
          : "PDF split successfully",
      });
      
      // Navigate to documents page after a short delay
      setTimeout(() => {
        navigate(createPageUrl("Documents"));
      }, 1500);
      
    } catch (error) {
      console.error('Error processing PDF:', error);
      
      toast({
        title: "Processing error",
        description: "An error occurred during processing. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Move a file up in the merge list
  const moveFileUp = (index) => {
    if (index === 0) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
    setFiles(newFiles);
  };
  
  // Move a file down in the merge list
  const moveFileDown = (index) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
    setFiles(newFiles);
  };
  
  // Toggle a file's selection
  const toggleFileSelected = (id) => {
    setFiles(files.map(file => 
      file.id === id 
        ? { ...file, selected: !file.selected } 
        : file
    ));
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <Button
            variant={mode === 'split' ? "default" : "outline"}
            className={mode === 'split' ? "bg-blue-600" : ""}
            onClick={() => setMode('split')}
          >
            <Scissors className="h-4 w-4 mr-2" />
            Split PDF
          </Button>
          <Button
            variant={mode === 'merge' ? "default" : "outline"}
            className={mode === 'merge' ? "bg-blue-600" : ""}
            onClick={() => setMode('merge')}
          >
            <Merge className="h-4 w-4 mr-2" />
            Merge PDFs
          </Button>
        </div>
        
        <Card className="bg-gray-800/60 border-gray-700">
          <CardHeader>
            <CardTitle>
              {mode === 'split' ? 'Split PDF into Multiple Files' : 'Merge Multiple PDFs into One'}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {mode === 'split'
                ? 'Upload a PDF and split it into multiple files by page ranges'
                : 'Upload multiple PDFs and combine them into a single document'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* File Upload Area */}
            <div 
              className={`
                border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                ${isDragging ? 'border-blue-500 bg-blue-900/10' : 'border-gray-700 hover:border-gray-600'}
              `}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileUp className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Drop PDF {mode === 'merge' ? 'files' : 'file'} here or click to browse
              </h3>
              <p className="text-gray-400 mb-4">
                {mode === 'split'
                  ? 'Select a single PDF file you want to split'
                  : 'Select multiple PDF files you want to combine'
                }
              </p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                multiple={mode === 'merge'}
                accept="application/pdf"
              />
              <Button variant="outline" className="border-gray-600">
                <Plus className="h-4 w-4 mr-2" />
                Select {mode === 'split' ? 'PDF' : 'PDFs'}
              </Button>
            </div>
            
            {/* File List */}
            {files.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white font-medium">
                    {mode === 'split' ? 'Selected File' : 'Files to Merge'}
                  </h3>
                  {mode === 'merge' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-400"
                      onClick={() => setFiles([])}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  )}
                </div>
                
                {mode === 'split' ? (
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {files.slice(0, 1).map((file) => (
                      <div key={file.id} className="flex items-center bg-gray-700/30 rounded-lg p-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-700 mr-3 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-gray-300" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm truncate">{file.name}</p>
                          <p className="text-gray-400 text-xs">
                            {(file.size / 1024).toFixed(1)} KB • {file.pages} pages
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
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {files.map((file, index) => (
                      <div 
                        key={file.id} 
                        className={`flex items-center ${
                          file.selected 
                            ? 'bg-gray-700/30' 
                            : 'bg-gray-800/30 opacity-60'
                        } rounded-lg p-3`}
                      >
                        <div className="flex-shrink-0 mr-3">
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveFileUp(index)}
                              disabled={index === 0}
                              className="h-6 w-6 text-gray-500"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveFileDown(index)}
                              disabled={index === files.length - 1}
                              className="h-6 w-6 text-gray-500"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div 
                          className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-700 mr-3 flex items-center justify-center cursor-pointer"
                          onClick={() => toggleFileSelected(file.id)}
                        >
                          {file.selected ? (
                            <Check className="h-5 w-5 text-green-400" />
                          ) : (
                            <FileText className="h-5 w-5 text-gray-300" />
                          )}
                        </div>
                        
                        <div 
                          className="flex-1 min-w-0 cursor-pointer" 
                          onClick={() => toggleFileSelected(file.id)}
                        >
                          <p className={`text-sm truncate ${file.selected ? 'text-white' : 'text-gray-400'}`}>
                            {file.name}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {(file.size / 1024).toFixed(1)} KB • {file.pages} pages
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
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Split Options */}
            {mode === 'split' && files.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <div>
                  <h3 className="text-white font-medium mb-3">Define Split Ranges</h3>
                  <div className="space-y-4">
                    {pageRanges.map((range) => (
                      <div key={range.id} className="flex items-end gap-3 flex-wrap">
                        <div>
                          <Label className="text-gray-400 mb-1 block">Start Page</Label>
                          <Input
                            type="number"
                            min={1}
                            max={totalPages}
                            value={range.start}
                            onChange={(e) => updatePageRange(range.id, 'start', parseInt(e.target.value))}
                            className="w-28 bg-gray-800 border-gray-700"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-gray-400 mb-1 block">End Page</Label>
                          <Input
                            type="number"
                            min={1}
                            max={totalPages}
                            value={range.end}
                            onChange={(e) => updatePageRange(range.id, 'end', parseInt(e.target.value))}
                            className="w-28 bg-gray-800 border-gray-700"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <Label className="text-gray-400 mb-1 block">Output Filename</Label>
                          <Input
                            value={range.filename}
                            onChange={(e) => updatePageRange(range.id, 'filename', e.target.value)}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removePageRange(range.id)}
                          className="text-red-400 hover:text-red-300 mb-0.5"
                          disabled={pageRanges.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addPageRange}
                    className="mt-3"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Range
                  </Button>
                </div>
              </div>
            )}
            
            {/* Merge Options */}
            {mode === 'merge' && files.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <div>
                  <Label htmlFor="output-filename" className="text-gray-400 mb-1 block">
                    Output Filename
                  </Label>
                  <Input
                    id="output-filename"
                    value={outputFilename}
                    onChange={(e) => setOutputFilename(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="combined_document"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The output will be saved as {outputFilename || 'combined_document'}.pdf
                  </p>
                </div>
              </div>
            )}
            
            {/* Progress */}
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>
                    {mode === 'split' ? 'Splitting PDF...' : 'Merging PDFs...'}
                  </span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            <Button
              onClick={processPdf}
              disabled={isProcessing || files.length === 0}
              className="bg-blue-600 hover:bg-blue-700 w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {mode === 'split' ? (
                    <>
                      <Scissors className="mr-2 h-4 w-4" />
                      Split PDF
                    </>
                  ) : (
                    <>
                      <Merge className="mr-2 h-4 w-4" />
                      Merge PDFs
                    </>
                  )}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gray-800/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Scissors className="h-4 w-4 text-blue-400" />
              PDF Splitting Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• Split large documents into smaller sections for easier sharing</li>
              <li>• Extract specific pages like table of contents, appendices, or individual chapters</li>
              <li>• Create multiple ranges to save different sections as separate files</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Merge className="h-4 w-4 text-green-400" />
              PDF Merging Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• Combine reports, presentations, or documents into a single PDF</li>
              <li>• Use drag & drop to change file order in the merged document</li>
              <li>• Toggle files on/off to exclude them from the final document</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}