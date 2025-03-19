import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { UploadFile } from '@/api/integrations';
import { Document } from '@/api/entities';
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  FileUp,
  FileSignature,
  Check,
  Trash2,
  Download,
  Eye,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Save,
  Pen,
  Eraser,
  Undo,
  Redo,
  X,
  Loader2,
  ArrowRight,
  Plus,
  FileText
} from "lucide-react";

export default function PdfEditSign() {
  const [file, setFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("text");
  const [signatures, setSignatures] = useState([]);
  const [currentSignature, setCurrentSignature] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [canvasItems, setCanvasItems] = useState([]);
  const fileInputRef = useRef(null);
  const signatureCanvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const navigate = useNavigate();
  
  // Handle file selection
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    // Check file type
    if (selectedFile.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file",
        variant: "destructive"
      });
      return;
    }
    
    setFile({
      id: `file-${Date.now()}`,
      file: selectedFile,
      name: selectedFile.name,
      size: selectedFile.size,
      preview: URL.createObjectURL(selectedFile)
    });
    
    // Set random page count for demo
    setTotalPages(Math.floor(Math.random() * 10) + 2);
    setCurrentPage(1);
    setCanvasItems([]);
    
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
    
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;
    
    // Check file type
    if (droppedFile.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please drop a PDF file",
        variant: "destructive"
      });
      return;
    }
    
    setFile({
      id: `file-${Date.now()}`,
      file: droppedFile,
      name: droppedFile.name,
      size: droppedFile.size,
      preview: URL.createObjectURL(droppedFile)
    });
    
    // Set random page count for demo
    setTotalPages(Math.floor(Math.random() * 10) + 2);
    setCurrentPage(1);
    setCanvasItems([]);
  };
  
  // Add text to canvas
  const addText = () => {
    const newText = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: 'Enter text here',
      x: 100,
      y: 100,
      color: '#000000',
      fontSize: 16,
      fontFamily: 'Arial',
      page: currentPage
    };
    
    setCanvasItems([...canvasItems, newText]);
  };
  
  // Add signature
  const addSignature = () => {
    if (!currentSignature) {
      toast({
        title: "No signature selected",
        description: "Please create or select a signature first",
        variant: "destructive"
      });
      return;
    }
    
    const newSignature = {
      id: `signature-${Date.now()}`,
      type: 'signature',
      imageUrl: currentSignature.url,
      x: 100,
      y: 100,
      width: 200,
      height: 100,
      page: currentPage
    };
    
    setCanvasItems([...canvasItems, newSignature]);
  };
  
  // Save canvas items to PDF
  const saveDocument = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      // Upload original file
      setProgress(20);
      const { file_url } = await UploadFile({ file: file.file });
      
      // Simulate processing
      setProgress(50);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create document record
      setProgress(80);
      const document = await Document.create({
        title: file.name,
        type: 'other',
        status: 'completed',
        original_file: file_url,
        enhanced_file: file_url,
        folder: '/'
      });
      
      setProgress(100);
      
      toast({
        title: "Document saved",
        description: "Your signed document has been saved successfully",
      });
      
      // Navigate to documents page after a short delay
      setTimeout(() => {
        navigate(createPageUrl("Documents"));
      }, 1500);
      
    } catch (error) {
      console.error('Error saving document:', error);
      
      toast({
        title: "Save error",
        description: "An error occurred while saving the document",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Card className="bg-gray-800/60 border-gray-700">
          <CardHeader>
            <CardTitle>Edit & Sign PDF</CardTitle>
            <CardDescription className="text-gray-400">
              Add text, signatures, and annotations to your PDF document
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* File Upload Area */}
            {!file && (
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
                  Drop PDF file here or click to browse
                </h3>
                <p className="text-gray-400 mb-4">
                  Select a PDF file you want to edit or sign
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept="application/pdf"
                />
                <Button variant="outline" className="border-gray-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Select PDF
                </Button>
              </div>
            )}
            
            {/* Document Editor */}
            {file && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-white font-medium">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentPage > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => prev - 1)}
                      >
                        Previous Page
                      </Button>
                    )}
                    <span className="text-gray-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    {currentPage < totalPages && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => prev + 1)}
                      >
                        Next Page
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Editor Tools */}
                <div className="flex gap-4 mb-4">
                  <Tabs defaultValue="text" className="flex-1">
                    <TabsList className="grid grid-cols-3">
                      <TabsTrigger value="text" onClick={() => setActiveTab("text")}>
                        <Type className="h-4 w-4 mr-2" />
                        Text
                      </TabsTrigger>
                      <TabsTrigger value="signature" onClick={() => setActiveTab("signature")}>
                        <FileSignature className="h-4 w-4 mr-2" />
                        Signature
                      </TabsTrigger>
                      <TabsTrigger value="shapes" onClick={() => setActiveTab("shapes")}>
                        <Square className="h-4 w-4 mr-2" />
                        Shapes
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="text" className="mt-4">
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <Button onClick={addText}>
                            <Type className="h-4 w-4 mr-2" />
                            Add Text
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="signature" className="mt-4">
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <Button onClick={addSignature}>
                            <FileSignature className="h-4 w-4 mr-2" />
                            Add Signature
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="shapes" className="mt-4">
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <Button>
                            <Square className="h-4 w-4 mr-2" />
                            Add Rectangle
                          </Button>
                          <Button>
                            <Circle className="h-4 w-4 mr-2" />
                            Add Circle
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                {/* PDF Preview */}
                <div 
                  ref={canvasContainerRef}
                  className="relative bg-white rounded-lg aspect-[1/1.4] mb-4"
                >
                  {/* Canvas items would be rendered here */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-400">PDF Preview (Page {currentPage})</p>
                  </div>
                </div>
                
                {/* Progress */}
                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Saving document...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
              </div>
            )}
          </CardContent>
          
          {file && (
            <CardFooter>
              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setFile(null);
                    setCurrentPage(1);
                    setTotalPages(0);
                    setCanvasItems([]);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={saveDocument}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Document
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
      
      {/* Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Type className="h-4 w-4 text-blue-400" />
              Text Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              Add text boxes, adjust font styles, and format text elements anywhere on your PDF
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileSignature className="h-4 w-4 text-green-400" />
              Signature Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              Draw or upload your signature, resize and position it on the document
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Square className="h-4 w-4 text-purple-400" />
              Shape Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              Add rectangles, circles, and other shapes to highlight or annotate your PDF
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}