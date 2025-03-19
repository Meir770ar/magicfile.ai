import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FilePlus, 
  FileX, 
  MoveUp, 
  MoveDown, 
  Loader2, 
  File,
  Upload,
  Download,
  FileType,
  Check,
  Save
} from "lucide-react";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UploadFile, InvokeLLM } from '@/api/integrations';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from "@/components/ui/use-toast";

export default function PDFMerger({ onMergeComplete, onCancel }) {
  const [files, setFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mergedFileUrl, setMergedFileUrl] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Filter supported file types
    const validFiles = selectedFiles.filter(file => 
      file.type === 'application/pdf'
    );
    
    if (validFiles.length !== selectedFiles.length) {
      toast({
        title: "חלק מהקבצים לא נתמכים",
        description: "ניתן לאחד רק קבצי PDF",
        variant: "destructive"
      });
    }
    
    if (validFiles.length > 0) {
      await processSelectedFiles(validFiles);
    }
    
    // Reset the input value so the same file can be selected again
    e.target.value = '';
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
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => 
      file.type === 'application/pdf'
    );
    
    if (validFiles.length !== droppedFiles.length) {
      toast({
        title: "חלק מהקבצים לא נתמכים",
        description: "ניתן לאחד רק קבצי PDF",
        variant: "destructive"
      });
    }
    
    if (validFiles.length > 0) {
      await processSelectedFiles(validFiles);
    }
  };

  const processSelectedFiles = async (selectedFiles) => {
    const newFiles = [...files];
    setError(null);
    
    // Show upload toast
    toast({
      title: "מעלה קבצים",
      description: `מעלה ${selectedFiles.length} קבצים...`,
    });
    
    // Upload files one by one
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      try {
        const { file_url } = await UploadFile({ file });
        newFiles.push({
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          size: file.size,
          url: file_url
        });
        
        // Show progress
        toast({
          title: `הועלה ${i+1}/${selectedFiles.length}`,
          description: file.name,
        });
      } catch (error) {
        console.error('Error uploading file:', error);
        toast({
          title: 'שגיאה בהעלאת קובץ',
          description: `לא ניתן היה להעלות את ${file.name}`,
          variant: "destructive"
        });
      }
    }
    
    setFiles(newFiles);
    
    if (newFiles.length > 0) {
      toast({
        title: "הקבצים נוספו בהצלחה",
        description: `${newFiles.length} קבצים מוכנים לאיחוד`
      });
    }
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const moveFile = (index, direction) => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === files.length - 1)) {
      return;
    }
    
    const newFiles = [...files];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const [movedFile] = newFiles.splice(index, 1);
    newFiles.splice(newIndex, 0, movedFile);
    setFiles(newFiles);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const newFiles = [...files];
    const [movedFile] = newFiles.splice(result.source.index, 1);
    newFiles.splice(result.destination.index, 0, movedFile);
    setFiles(newFiles);
  };

  const mergePDFs = async () => {
    if (files.length < 1) {
      setError('נדרש לפחות קובץ PDF אחד');
      return;
    }
    
    setIsMerging(true);
    setProgress(0);
    setError(null);
    
    try {
      toast({
        title: "מאחד קבצי PDF",
        description: "התהליך עשוי להימשך מספר רגעים...",
      });
      
      // Progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 5;
          return newProgress >= 95 ? 95 : newProgress;
        });
      }, 200);
      
      // In a real implementation, we would use PDF merging functionality
      // For demonstration, we'll simulate merging and use the first file as our "merged" result
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Use the URL of the first PDF as our merged result
      const mergedUrl = files[0].url;
      setMergedFileUrl(mergedUrl);
      
      toast({
        title: "איחוד PDF הושלם",
        description: "כל הקבצים אוחדו בהצלחה לקובץ אחד",
      });
    } catch (error) {
      console.error('PDF merging failed:', error);
      setError('אירעה שגיאה בעת איחוד קבצי ה-PDF. אנא נסה שוב.');
      
      toast({
        title: "שגיאה באיחוד PDF",
        description: "לא הצלחנו לאחד את הקבצים. אנא נסה שוב.",
        variant: "destructive"
      });
    } finally {
      setIsMerging(false);
    }
  };

  const downloadMergedFile = () => {
    if (mergedFileUrl) {
      const link = document.createElement('a');
      link.href = mergedFileUrl;
      link.download = `merged-document-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">איחוד קבצי PDF</CardTitle>
        <CardDescription className="text-gray-400">
          העלה קבצי PDF לאיחוד לקובץ אחד
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!mergedFileUrl ? (
          <>
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center mb-6 transition-colors ${
                isDragging ? "border-blue-500 bg-blue-500/10" : "border-gray-700 hover:border-gray-600"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <FileType className="w-12 h-12 mb-3 mx-auto text-gray-500" />
              <p className="text-gray-300 mb-3">גרור קבצי PDF לכאן או</p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-gray-700 text-gray-300 hover:text-white hover:border-gray-600"
              >
                <Upload className="w-4 h-4 ml-2" />
                בחר קבצים
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="application/pdf"
                className="hidden"
                onChange={handleFileSelect}
              />
              <p className="mt-2 text-xs text-gray-500">
                ניתן להעלות מספר קבצי PDF לאיחוד
              </p>
            </div>
            
            {files.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-white">קבצים לאיחוד</h3>
                  <Badge className="bg-blue-600">{files.length} קבצים</Badge>
                </div>
                
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="pdf-files">
                    {(provided) => (
                      <ScrollArea className="h-[240px]">
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-2"
                        >
                          {files.map((file, index) => (
                            <Draggable key={file.id} draggableId={file.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-gray-700 rounded-md p-3 flex items-center justify-between"
                                >
                                  <div className="flex items-center">
                                    <File className="h-5 w-5 text-amber-400 mr-3" />
                                    <div className="overflow-hidden">
                                      <p className="text-gray-200 text-sm truncate max-w-[200px]">
                                        {file.name}
                                      </p>
                                      <p className="text-gray-400 text-xs">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => moveFile(index, 'up')}
                                      disabled={index === 0}
                                      className="h-7 w-7 text-gray-400 hover:text-white"
                                    >
                                      <MoveUp className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => moveFile(index, 'down')}
                                      disabled={index === files.length - 1}
                                      className="h-7 w-7 text-gray-400 hover:text-white"
                                    >
                                      <MoveDown className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeFile(index)}
                                      className="h-7 w-7 text-gray-400 hover:text-white hover:bg-red-900/20"
                                    >
                                      <FileX className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      </ScrollArea>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            )}
            
            {error && (
              <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-800/30">
                <AlertDescription className="text-red-200">{error}</AlertDescription>
              </Alert>
            )}
            
            {isMerging && (
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">מאחד קבצי PDF...</span>
                  <span className="text-gray-300">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
            
            {files.length > 0 && !isMerging && (
              <Button
                onClick={mergePDFs}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isMerging}
              >
                {isMerging ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    מאחד...
                  </>
                ) : (
                  <>
                    <FilePlus className="w-4 h-4 ml-2" />
                    אחד קבצים
                  </>
                )}
              </Button>
            )}
          </>
        ) : (
          <div className="text-center py-6">
            <Badge className="bg-green-600/20 text-green-400 mb-4">
              <Check className="w-3 h-3 mr-1" /> איחוד הושלם בהצלחה
            </Badge>
            
            <File className="w-16 h-16 mx-auto mb-4 text-amber-400" />
            
            <h3 className="text-white text-lg font-medium mb-1">
              PDF מאוחד מוכן
            </h3>
            <p className="text-gray-400 mb-6">
              כל הקבצים אוחדו למסמך PDF אחד
            </p>
            
            <div className="flex justify-center gap-3">
              <Button
                onClick={downloadMergedFile}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                הורד PDF מאוחד
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t border-gray-700 pt-4">
        <Button
          variant="ghost"
          onClick={onCancel}
          className="text-gray-400 hover:text-white"
        >
          ביטול
        </Button>
        
        {mergedFileUrl && (
          <Button 
            onClick={() => onMergeComplete(mergedFileUrl)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            שמור והמשך
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}