
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Camera,
  X,
  Check,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Crop,
  Maximize2,
  Loader2,
  CameraOff,
  ScanLine,
  ImagePlus,
  Wand2,
  Sliders,
  Move,
  Expand,
  ArrowLeftRight,
  ArrowUpDown,
  ChevronsUpDown,
  FlipHorizontal,
  Lightbulb,
  RefreshCw,
  FileDigit,
  Sun,
  Contrast,
  Focus,
  Brush,
  Pencil,
  Download,
  Undo,
  MousePointer,
  Crosshair,
  Scissors,
  MoveHorizontal,
  MoveVertical,
  Save
} from "lucide-react";
import { UploadFile, InvokeLLM } from '@/api/integrations';
import { Document } from '@/api/entities';

export default function DocumentScanner({ onComplete, onCancel }) {
  const [activeStep, setActiveStep] = useState('capture'); 
  const [captureMethod, setCaptureMethod] = useState(null); 
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(''); 
  const [processingProgress, setProcessingProgress] = useState(0);
  const [enhanceMode, setEnhanceMode] = useState('auto');

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [activeCamera, setActiveCamera] = useState(null);
  const [flashActive, setFlashActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [documentType, setDocumentType] = useState('auto');

  const [corners, setCorners] = useState(null);
  const [isEditingCorners, setIsEditingCorners] = useState(false);
  const [draggedCorner, setDraggedCorner] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [previewScale, setPreviewScale] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [displayRatio, setDisplayRatio] = useState(1);
  const [imageRect, setImageRect] = useState(null);
  const [cropRect, setCropRect] = useState(null);
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [cropHandleIndex, setCropHandleIndex] = useState(null);
  const [autoDetectDocument, setAutoDetectDocument] = useState(true);
  const [highlightDocument, setHighlightDocument] = useState(true);
  const [detectedCorners, setDetectedCorners] = useState(null);
  
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [sharpness, setSharpness] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [denoise, setDenoise] = useState(false);
  const [perspective, setPerspective] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [enhanceText, setEnhanceText] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [resetFiltersFlag, setResetFiltersFlag] = useState(false);
  const [undoHistory, setUndoHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [fileUploadedSuccessfully, setFileUploadedSuccessfully] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cropCanvasRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);
  const cornerPointsRef = useRef(null);
  const cropRectRef = useRef(null);
  const previewRatio = useRef(1);

  const [simulatedDetection, setSimulatedDetection] = useState(false);

  useEffect(() => {
    if (captureMethod === 'camera' && !cameraActive) {
      startCamera();
    } else if (captureMethod !== 'camera' && cameraActive) {
      stopCamera();
    }

    return () => {
      if (cameraActive) {
        stopCamera();
      }
    };
  }, [captureMethod]);

  useEffect(() => {
    if (activeStep === 'crop' && imageRef.current && !cropRect) {
      const img = imageRef.current;
      if (img.complete) {
        initCropRect();
      } else {
        img.onload = initCropRect;
      }
    }
  }, [activeStep, imageRef.current, cropRect]);

  useEffect(() => {
    applyImageFilters();
  }, [brightness, contrast, sharpness, saturation, denoise, perspective, removeBackground, enhanceText]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('נא להעלות קובץ תמונה בלבד');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setCapturedImage(img);
        setImageDataUrl(e.target.result);
        setUploadedFile(file);
        setCaptureMethod('upload');
        setActiveStep('crop');
        setSimulatedDetection(true);
        
        setTimeout(() => {
          simulateDocumentDetection(img);
        }, 1000);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      setCameraPermission('requesting');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        setCameraPermission('granted');
      }
      
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        setAvailableCameras(cameras);
        
        if (cameras.length > 0) {
          setActiveCamera(cameras[0].deviceId);
        }
      } catch (err) {
        console.error('Failed to enumerate devices:', err);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraPermission('denied');
      setError('לא ניתן לגשת למצלמה. בדוק את הרשאות המצלמה ונסה שוב.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setCameraActive(false);
  };

  const captureImage = () => {
    if (!videoRef.current || !cameraActive) return;
    
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setCapturedImage(img);
        setImageDataUrl(dataUrl);
        setActiveStep('crop');
        setSimulatedDetection(true);
        
        setTimeout(() => {
          simulateDocumentDetection(img);
        }, 1000);
      };
      img.src = dataUrl;
      
      stopCamera();
      
    } catch (error) {
      console.error('Error capturing image:', error);
      setError('שגיאה בצילום התמונה. נסה שוב.');
    }
  };

  const initCropRect = () => {
    const img = imageRef.current;
    if (!img) return;
    
    const imgRect = img.getBoundingClientRect();
    setImageRect(imgRect);
    
    const padding = 0.05; 
    setCropRect({
      left: imgRect.width * padding,
      top: imgRect.height * padding,
      width: imgRect.width * (1 - 2 * padding),
      height: imgRect.height * (1 - 2 * padding)
    });
  };

  const simulateDocumentDetection = (img) => {
    if (!autoDetectDocument) return;
    
    const width = img.width;
    const height = img.height;
    
    let detectedRect;
    const randomFactor = Math.random();
    
    if (randomFactor < 0.7) {
      const padding = { 
        left: width * 0.1 + Math.random() * width * 0.05,
        top: height * 0.1 + Math.random() * height * 0.05,
        right: width * 0.1 + Math.random() * width * 0.05,
        bottom: height * 0.1 + Math.random() * height * 0.05
      };
      
      detectedRect = {
        left: padding.left,
        top: padding.top,
        width: width - padding.left - padding.right,
        height: height - padding.top - padding.bottom
      };
    } else {
      const centerX = width / 2;
      const centerY = height / 2;
      const docWidth = width * 0.7;
      const docHeight = height * 0.7;
      
      const skewX = width * 0.04 * (Math.random() - 0.5);
      const skewY = height * 0.04 * (Math.random() - 0.5);
      
      detectedRect = {
        left: centerX - docWidth / 2 + skewX,
        top: centerY - docHeight / 2 + skewY,
        width: docWidth,
        height: docHeight
      };
    }
    
    if (imageRef.current) {
      const imgRect = imageRef.current.getBoundingClientRect();
      
      const scaleX = imgRect.width / width;
      const scaleY = imgRect.height / height;
      
      const scaledRect = {
        left: detectedRect.left * scaleX,
        top: detectedRect.top * scaleY,
        width: detectedRect.width * scaleX,
        height: detectedRect.height * scaleY
      };
      
      setCropRect(scaledRect);
      setDetectedCorners({
        topLeft: { x: scaledRect.left, y: scaledRect.top },
        topRight: { x: scaledRect.left + scaledRect.width, y: scaledRect.top },
        bottomLeft: { x: scaledRect.left, y: scaledRect.top + scaledRect.height },
        bottomRight: { x: scaledRect.left + scaledRect.width, y: scaledRect.top + scaledRect.height }
      });
    }
    
    setSimulatedDetection(false);
  };

  const handleCropDragStart = (e, handle = null) => {
    if (!cropRect) return;
    
    e.preventDefault();
    setIsDraggingCrop(true);
    setCropHandleIndex(handle);
    
    const startX = e.clientX;
    const startY = e.clientY;
    cropRectRef.current = {
      rect: { ...cropRect },
      startX,
      startY
    };
  };

  const handleCropDragMove = (e) => {
    if (!isDraggingCrop || !cropRectRef.current || !imageRect) return;
    
    const { rect, startX, startY } = cropRectRef.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    
    let newRect = { ...rect };
    
    if (cropHandleIndex === null) {
      newRect.left = Math.max(0, Math.min(imageRect.width - rect.width, rect.left + dx));
      newRect.top = Math.max(0, Math.min(imageRect.height - rect.height, rect.top + dy));
    } else {
      switch (cropHandleIndex) {
        case 'topLeft':
          newRect.left = Math.min(rect.left + rect.width - 50, rect.left + dx);
          newRect.top = Math.min(rect.top + rect.height - 50, rect.top + dy);
          newRect.width = rect.width - (newRect.left - rect.left);
          newRect.height = rect.height - (newRect.top - rect.top);
          break;
        case 'topRight':
          newRect.top = Math.min(rect.top + rect.height - 50, rect.top + dy);
          newRect.width = Math.max(50, rect.width + dx);
          newRect.height = rect.height - (newRect.top - rect.top);
          break;
        case 'bottomLeft':
          newRect.left = Math.min(rect.left + rect.width - 50, rect.left + dx);
          newRect.width = rect.width - (newRect.left - rect.left);
          newRect.height = Math.max(50, rect.height + dy);
          break;
        case 'bottomRight':
          newRect.width = Math.max(50, rect.width + dx);
          newRect.height = Math.max(50, rect.height + dy);
          break;
      }
      
      if (newRect.left < 0) {
        newRect.width += newRect.left;
        newRect.left = 0;
      }
      if (newRect.top < 0) {
        newRect.height += newRect.top;
        newRect.top = 0;
      }
      if (newRect.left + newRect.width > imageRect.width) {
        newRect.width = imageRect.width - newRect.left;
      }
      if (newRect.top + newRect.height > imageRect.height) {
        newRect.height = imageRect.height - newRect.top;
      }
    }
    
    setCropRect(newRect);
  };

  const handleCropDragEnd = () => {
    setIsDraggingCrop(false);
    setCropHandleIndex(null);
    cropRectRef.current = null;
  };

  const applyCrop = () => {
    if (!cropRect || !capturedImage) return;
    
    try {
      const canvas = document.createElement('canvas');
      const img = capturedImage;
      
      const scaleX = img.width / imageRect.width;
      const scaleY = img.height / imageRect.height;
      
      const sourceX = cropRect.left * scaleX;
      const sourceY = cropRect.top * scaleY;
      const sourceWidth = cropRect.width * scaleX;
      const sourceHeight = cropRect.height * scaleY;
      
      canvas.width = sourceWidth;
      canvas.height = sourceHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
      
      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      
      const croppedImg = new Image();
      croppedImg.onload = () => {
        setCapturedImage(croppedImg);
        setImageDataUrl(croppedDataUrl);
        setActiveStep('enhance');
      };
      croppedImg.src = croppedDataUrl;
      
    } catch (error) {
      console.error('Error applying crop:', error);
      setError('שגיאה בחיתוך התמונה. נסה שוב.');
    }
  };

  const applyImageFilters = () => {
    if (!capturedImage || !imageRef.current) return;
    
    try {
      const filterString = `
        brightness(${brightness}%) 
        contrast(${contrast}%) 
        saturate(${saturation}%)
        ${denoise ? 'blur(0.5px)' : ''}
      `;
      
      if (imageRef.current) {
        imageRef.current.style.filter = filterString;
      }
      
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  const resetEnhancements = () => {
    setBrightness(100);
    setContrast(100);
    setSharpness(100);
    setSaturation(100);
    setDenoise(false);
    setPerspective(0);
    setRemoveBackground(false);
    setEnhanceText(true);
    setResetFiltersFlag(true);
  };

  const rotateImage = (direction) => {
    if (!capturedImage) return;
    
    try {
      const canvas = document.createElement('canvas');
      const img = capturedImage;
      
      canvas.width = img.height;
      canvas.height = img.width;
      
      const ctx = canvas.getContext('2d');
      
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(direction === 'left' ? -Math.PI / 2 : Math.PI / 2);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      
      const rotatedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      
      const rotatedImg = new Image();
      rotatedImg.onload = () => {
        setCapturedImage(rotatedImg);
        setImageDataUrl(rotatedDataUrl);
        
        if (activeStep === 'crop') {
          setCropRect(null);
          setTimeout(() => {
            initCropRect();
          }, 100);
        }
      };
      rotatedImg.src = rotatedDataUrl;
      
    } catch (error) {
      console.error('Error rotating image:', error);
      setError('שגיאה בסיבוב התמונה. נסה שוב.');
    }
  };

  const processImage = async () => {
    if (!capturedImage || !imageDataUrl) {
      setError('אין תמונה לעיבוד');
      return;
    }
    
    setProcessing(true);
    setProcessingStep('uploading');
    setProcessingProgress(0);
    
    try {
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 300);
      
      const fetchResponse = await fetch(imageDataUrl);
      const blob = await fetchResponse.blob();
      
      const file = new File([blob], uploadedFile ? uploadedFile.name : `scan_${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      setProcessingStep('uploading');
      const { file_url } = await UploadFile({ file });
      setFileUploadedSuccessfully(true);
      
      if (removeBackground || enhanceText) {
        setProcessingStep('enhancing');
        
        let enhancementPrompt = "Enhance this document image with the following instructions:";
        
        if (removeBackground) {
          enhancementPrompt += "\n- Remove the background completely, making it pure white";
          enhancementPrompt += "\n- Preserve all text and document content with high fidelity";
        }
        
        if (enhanceText) {
          enhancementPrompt += "\n- Enhance text clarity and legibility";
          enhancementPrompt += "\n- Increase contrast between text and background";
          enhancementPrompt += "\n- Fix any skewed or distorted text";
        }
        
        enhancementPrompt += "\n\nReturn a high-resolution, cleaned document image suitable for OCR processing.";
        
        try {
          const enhancementResult = await InvokeLLM({
            prompt: enhancementPrompt,
            file_urls: [file_url]
          });
          
          if (enhancementResult?.url) {
            setProcessedImageUrl(enhancementResult.url);
            
            setProcessedImage({
              url: enhancementResult.url,
              type: documentType || 'document',
              enhanced: true
            });
          } else {
            setProcessedImage({
              url: file_url,
              type: documentType || 'document',
              enhanced: false
            });
          }
        } catch (enhanceError) {
          console.error('Error enhancing image:', enhanceError);
          setProcessedImage({
            url: file_url,
            type: documentType || 'document',
            enhanced: false
          });
        }
      } else {
        setProcessedImage({
          url: file_url,
          type: documentType || 'document',
          enhanced: false
        });
      }
      
      setProcessingStep('finalizing');
      
      try {
        setProcessingStep('saving');
        
        const documentData = {
          title: uploadedFile ? uploadedFile.name.replace(/\.[^/.]+$/, "") : `מסמך_${Date.now()}`,
          type: documentType === 'auto' ? 'other' : documentType,
          status: 'completed',
          original_file: file_url,
          enhanced_file: processedImageUrl || file_url
        };
        
        const savedDocument = await Document.create(documentData);
        
        clearInterval(progressInterval);
        setProcessingProgress(100);
        
        setActiveStep('result');
        
        onComplete && onComplete(savedDocument);
      } catch (dbError) {
        console.error('Error saving document:', dbError);
        setError('שגיאה בשמירת המסמך. נסה שוב.');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setError('שגיאה בעיבוד התמונה. נסה שוב.');
    } finally {
      setProcessing(false);
    }
  };

  const renderCaptureMethodSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Button
        className="h-auto py-6 bg-gray-900/50 hover:bg-gray-800 border border-gray-700 flex flex-col items-center"
        onClick={() => setCaptureMethod('camera')}
      >
        <Camera className="h-12 w-12 mb-4 text-blue-400" />
        <span className="text-lg font-medium">צלם מסמך</span>
        <span className="text-sm text-gray-400 mt-2">
          השתמש במצלמת המכשיר לצילום מסמך
        </span>
      </Button>
      
      <Button
        className="h-auto py-6 bg-gray-900/50 hover:bg-gray-800 border border-gray-700 flex flex-col items-center"
        onClick={() => fileInputRef.current?.click()}
      >
        <ImagePlus className="h-12 w-12 mb-4 text-purple-400" />
        <span className="text-lg font-medium">העלה תמונה</span>
        <span className="text-sm text-gray-400 mt-2">
          בחר קובץ תמונה מהמכשיר שלך
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
      </Button>
    </div>
  );

  const renderCamera = () => (
    <div className="relative overflow-hidden bg-black rounded-lg">
      {cameraPermission === 'denied' ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CameraOff className="w-16 h-16 text-red-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">אין גישה למצלמה</h3>
          <p className="text-gray-400 max-w-md mb-4">
            נדרשת הרשאת גישה למצלמה כדי להשתמש בתכונה זו. אנא אפשר גישה דרך הגדרות הדפדפן.
          </p>
          <Button 
            variant="outline" 
            onClick={() => setCaptureMethod(null)}
          >
            חזרה לבחירת שיטת סריקה
          </Button>
        </div>
      ) : (
        <>
          <div className="aspect-[4/3] bg-gray-900 relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] border-2 border-dashed border-white/40 rounded-md"></div>
              <div className="absolute top-[7.5%] left-[7.5%] w-10 h-10 border-t-2 border-l-2 border-white/60"></div>
              <div className="absolute top-[7.5%] right-[7.5%] w-10 h-10 border-t-2 border-r-2 border-white/60"></div>
              <div className="absolute bottom-[7.5%] left-[7.5%] w-10 h-10 border-b-2 border-l-2 border-white/60"></div>
              <div className="absolute bottom-[7.5%] right-[7.5%] w-10 h-10 border-b-2 border-r-2 border-white/60"></div>
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 p-4 flex justify-center items-center gap-4 bg-gradient-to-t from-black/80 to-transparent">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full bg-white/10 border-white/20 hover:bg-white/20"
              onClick={() => setCaptureMethod(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            <Button
              size="icon"
              className="h-16 w-16 rounded-full bg-white hover:bg-white/90"
              onClick={captureImage}
            >
              <Camera className="h-8 w-8 text-black" />
            </Button>
            {availableCameras.length > 1 && (
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full bg-white/10 border-white/20 hover:bg-white/20"
                onClick={() => {
                  // Switch camera logic
                }}
              >
                <FlipHorizontal className="h-6 w-6" />
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );

  const renderCrop = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">התאמת מסמך</h3>
          <p className="text-sm text-gray-400">
            התאם את גבולות המסמך והסר שוליים מיותרים
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => rotateImage('left')}
            className="border-gray-700 text-gray-300 hover:bg-gray-700"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => rotateImage('right')}
            className="border-gray-700 text-gray-300 hover:bg-gray-700"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="relative bg-gray-900 rounded-lg overflow-hidden">
        <div className="aspect-[4/3] relative">
          <img
            ref={imageRef}
            src={imageDataUrl}
            alt="תמונה לחיתוך"
            className="w-full h-full object-contain"
          />
          
          {cropRect && (
            <>
              <div className="absolute inset-0 bg-black/50" />
              <div
                className="absolute"
                style={{
                  left: `${cropRect.left}px`,
                  top: `${cropRect.top}px`,
                  width: `${cropRect.width}px`,
                  height: `${cropRect.height}px`,
                  cursor: isDraggingCrop ? 'grabbing' : 'grab'
                }}
                onMouseDown={(e) => handleCropDragStart(e)}
              >
                <div className="absolute inset-0 bg-transparent" />
                <div className="absolute inset-0 border-2 border-white" />
                {['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].map((corner) => (
                  <div
                    key={corner}
                    className="absolute w-4 h-4 bg-white rounded-full cursor-nw-resize"
                    style={{
                      top: corner.includes('top') ? '-8px' : 'auto',
                      bottom: corner.includes('bottom') ? '-8px' : 'auto',
                      left: corner.includes('Left') ? '-8px' : 'auto',
                      right: corner.includes('Right') ? '-8px' : 'auto',
                      cursor: `${corner.toLowerCase()}-resize`
                    }}
                    onMouseDown={(e) => handleCropDragStart(e, corner)}
                  />
                ))}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                  {[...Array(4)].map((_, i) => (
                    <React.Fragment key={i}>
                      <div className="border-r border-white/30" />
                      <div className="border-b border-white/30" />
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={autoDetectDocument}
              onCheckedChange={setAutoDetectDocument}
            />
            <Label>זיהוי אוטומטי</Label>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              checked={highlightDocument}
              onCheckedChange={setHighlightDocument}
            />
            <Label>הדגשת מסמך</Label>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setActiveStep('capture')}
          >
            חזרה
          </Button>
          <Button
            onClick={applyCrop}
            className="bg-blue-600 hover:bg-blue-700"
          >
            המשך
          </Button>
        </div>
      </div>
    </div>
  );

  const renderEnhance = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">שיפור תמונה</h3>
        <p className="text-sm text-gray-400">
          התאם את הגדרות התמונה לקבלת התוצאה הטובה ביותר
        </p>
      </div>
      
      <Tabs defaultValue="auto" className="w-full">
        <TabsList>
          <TabsTrigger value="auto">שיפור אוטומטי</TabsTrigger>
          <TabsTrigger value="manual">התאמה ידנית</TabsTrigger>
        </TabsList>
        
        <TabsContent value="auto" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="font-medium">הסרת רקע</Label>
                <Switch
                  checked={removeBackground}
                  onCheckedChange={setRemoveBackground}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-medium">שיפור טקסט</Label>
                <Switch
                  checked={enhanceText}
                  onCheckedChange={setEnhanceText}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <Label className="font-medium">סוג מסמך</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג מסמך" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">זיהוי אוטומטי</SelectItem>
                  <SelectItem value="receipt">קבלה</SelectItem>
                  <SelectItem value="invoice">חשבונית</SelectItem>
                  <SelectItem value="id">תעודה מזהה</SelectItem>
                  <SelectItem value="contract">חוזה</SelectItem>
                  <SelectItem value="other">אחר</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="manual" className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>בהירות</Label>
                <span className="text-sm text-gray-400">{brightness}%</span>
              </div>
              <Slider
                value={[brightness]}
                onValueChange={([value]) => setBrightness(value)}
                max={200}
                step={1}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>ניגודיות</Label>
                <span className="text-sm text-gray-400">{contrast}%</span>
              </div>
              <Slider
                value={[contrast]}
                onValueChange={([value]) => setContrast(value)}
                max={200}
                step={1}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>חדות</Label>
                <span className="text-sm text-gray-400">{sharpness}%</span>
              </div>
              <Slider
                value={[sharpness]}
                onValueChange={([value]) => setSharpness(value)}
                max={200}
                step={1}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>רוויה</Label>
                <span className="text-sm text-gray-400">{saturation}%</span>
              </div>
              <Slider
                value={[saturation]}
                onValueChange={([value]) => setSaturation(value)}
                max={200}
                step={1}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label>הפחתת רעש</Label>
              <Switch
                checked={denoise}
                onCheckedChange={setDenoise}
              />
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={resetEnhancements}
            className="w-full"
          >
            אפס הגדרות
          </Button>
        </TabsContent>
      </Tabs>
      
      <div className="relative aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden">
        <img
          ref={imageRef}
          src={imageDataUrl}
          alt="תצוגה מקדימה"
          className="w-full h-full object-contain transition-all duration-200"
        />
      </div>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setActiveStep('crop')}
        >
          חזרה
        </Button>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              resetEnhancements();
              setActiveStep('crop');
            }}
          >
            התחל מחדש
          </Button>
          <Button
            onClick={processImage}
            disabled={processing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {processing ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                מעבד...
              </>
            ) : (
              <>
                <Check className="ml-2 h-4 w-4" />
                סיים
              </>
            )}
          </Button>
        </div>
      </div>
      
      {processing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>מעבד מסמך...</CardTitle>
              <CardDescription>
                אנא המתן בזמן שאנו מעבדים את המסמך שלך
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{processingStep === 'uploading' ? 'מעלה קובץ' :
                         processingStep === 'enhancing' ? 'משפר תמונה' :
                         processingStep === 'saving' ? 'שומר מסמך' :
                         'מסיים עיבוד'}</span>
                  <span>{processingProgress}%</span>
                </div>
                <Progress value={processingProgress} className="h-2" />
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const renderResult = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">המסמך נשמר בהצלחה</h3>
          <p className="text-sm text-gray-400">
            המסמך עובד ונשמר במערכת
          </p>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open(processedImage?.url, '_blank')}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="relative aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden">
        <img
          src={processedImage?.url}
          alt="מסמך מעובד"
          className="w-full h-full object-contain"
        />
      </div>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            setCapturedImage(null);
            setImageDataUrl(null);
            setProcessedImage(null);
            setActiveStep('capture');
            setCaptureMethod(null);
          }}
        >
          סרוק מסמך נוסף
        </Button>
        
        <Button
          onClick={onComplete}
          className="bg-blue-600 hover:bg-blue-700"
        >
          סיים
        </Button>
      </div>
    </div>
  );

  useEffect(() => {
    if (isDraggingCrop) {
      const handleMouseMove = (e) => handleCropDragMove(e);
      const handleMouseUp = () => handleCropDragEnd();
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingCrop]);

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle>סריקת מסמך</CardTitle>
        <CardDescription>
          סרוק או העלה מסמך לעיבוד
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {activeStep === 'capture' && !captureMethod && renderCaptureMethodSelection()}
        {activeStep === 'capture' && captureMethod === 'camera' && renderCamera()}
        {activeStep === 'crop' && renderCrop()}
        {activeStep === 'enhance' && renderEnhance()}
        {activeStep === 'result' && renderResult()}
      </CardContent>
    </Card>
  );
}
