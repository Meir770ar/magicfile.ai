import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  DownloadCloud, 
  AlertTriangle,
  RefreshCw,
  Copy,
  Mail,
  Share2,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConversionProgress({ 
  status, 
  progress, 
  result, 
  error, 
  onRetry, 
  conversionType,
  fileUrl,
  fileName
}) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showAdditionalActions, setShowAdditionalActions] = useState(false);
  
  useEffect(() => {
    let interval;
    
    if (status === 'processing' && progress < 100) {
      const estimatedTimeSeconds = Math.ceil((100 - progress) / 5); // Rough estimate: 5% per second
      setTimeLeft(estimatedTimeSeconds);
      
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, progress]);
  
  useEffect(() => {
    if (status === 'completed') {
      setShowAdditionalActions(true);
    }
  }, [status]);
  
  const copyToClipboard = () => {
    if (result?.url) {
      navigator.clipboard.writeText(result.url);
      setCopied(true);
      setTimeout(() => setCopied(false),2000);
    }
  };
  
  const formatTimeLeft = (seconds) => {
    if (seconds <= 60) {
      return `${seconds} seconds`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes} minutes and ${remainingSeconds} seconds`;
    }
  };
  
  // Determine the appropriate color based on conversion type
  const getConversionColor = () => {
    switch(conversionType) {
      case 'document': return 'blue';
      case 'image': return 'emerald';
      case 'audio': return 'amber';
      case 'video': return 'rose';
      case 'compress': return 'purple';
      case 'ocr': return 'indigo';
      default: return 'blue';
    }
  };
  
  const color = getConversionColor();

  const getStatusContent = () => {
    switch (status) {
      case 'processing':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-6">
              <div className={`relative w-20 h-20 mx-auto`}>
                <div className={`absolute inset-0 rounded-full bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center`}>
                  <Loader2 className={`h-10 w-10 text-${color}-500 animate-spin`} />
                </div>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    className={`text-${color}-100 dark:text-${color}-900/20`} 
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                  />
                  <circle 
                    className={`text-${color}-500`} 
                    strokeWidth="4"
                    strokeDasharray={282.7433388230814}
                    strokeDashoffset={282.7433388230814 - (282.7433388230814 * progress) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                  />
                </svg>
              </div>
            </div>
            
            <h3 className="font-medium text-xl text-gray-900 dark:text-white mb-2">
              Processing your file...
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {conversionType === 'document' && 'Converting and processing your document...'}
              {conversionType === 'image' && 'Processing your image...'}
              {conversionType === 'audio' && 'Processing your audio file...'}
              {conversionType === 'video' && 'Processing your video file...'}
              {conversionType === 'compress' && 'Compressing your file...'}
              {conversionType === 'ocr' && 'Extracting text from your file...'}
            </p>
            
            <div className="mb-4">
              <Progress value={progress} className={`h-2 bg-gray-100 dark:bg-gray-700`} 
                indicatorClassName={`bg-${color}-500`} />
              <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{progress}% complete</span>
                {timeLeft > 0 && (
                  <span>Estimated time: {formatTimeLeft(timeLeft)}</span>
                )}
              </div>
            </div>
            
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Please don't close your browser. Your file will be ready soon.
            </p>
          </motion.div>
        );
        
      case 'completed':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-6">
              <div className={`w-20 h-20 rounded-full bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center mx-auto`}>
                <CheckCircle2 className={`h-10 w-10 text-${color}-500`} />
              </div>
            </div>
            
            <h3 className="font-medium text-xl text-gray-900 dark:text-white mb-2">
              Conversion completed successfully!
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your file is ready for download.
            </p>
            
            <div className="flex flex-col items-center space-y-3">
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1.05 }}
                transition={{ 
                  repeat: 3,
                  repeatType: "reverse",
                  duration: 0.5
                }}
              >
                <Button 
                  className={`w-64 bg-${color}-600 hover:bg-${color}-700 text-white`}
                  onClick={() => {
                    if (result?.url) {
                      const a = document.createElement('a');
                      a.href = result.url;
                      a.download = fileName || 'converted-file';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }
                  }}
                >
                  <DownloadCloud className="mr-2 h-5 w-5" />
                  Download File
                </Button>
              </motion.div>
              
              <AnimatePresence>
                {showAdditionalActions && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 w-full"
                  >
                    <Button 
                      variant="outline" 
                      className="w-64"
                      onClick={copyToClipboard}
                    >
                      <Copy className="mr-2 h-5 w-5" />
                      {copied ? 'Link copied!' : 'Copy download link'}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-64"
                      onClick={() => {}}
                    >
                      <Mail className="mr-2 h-5 w-5" />
                      Email to me
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-64"
                      onClick={() => {}}
                    >
                      <Share2 className="mr-2 h-5 w-5" />
                      Share file
                    </Button>
                    
                    {result?.url && (
                      <Button 
                        variant="outline" 
                        className="w-64"
                        onClick={() => window.open(result.url, '_blank')}
                      >
                        <ExternalLink className="mr-2 h-5 w-5" />
                        Open in new tab
                      </Button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
        
      case 'failed':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-6">
              <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
                <XCircle className="h-10 w-10 text-red-500" />
              </div>
            </div>
            
            <h3 className="font-medium text-xl text-gray-900 dark:text-white mb-2">
              Conversion failed
            </h3>
            
            <Alert variant="destructive" className="mb-6 max-w-md mx-auto">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error || 'An error occurred during file conversion. Please try again.'}
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={onRetry}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 border ${
      darkMode ? 'border-gray-700' : 'border-gray-200'
    } rounded-lg p-8 max-w-lg mx-auto shadow-sm`}>
      {getStatusContent()}
    </div>
  );
}