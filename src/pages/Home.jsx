
import React, { useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast"; // Change from react-toastify to shadcn/ui toast
import {
  FileText,
  Image as ImageIcon,
  FileAudio2,
  FileVideo,
  FileDown,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  DownloadCloud,
  Sparkles,
  Languages,
  Columns,
  Upload,
  Check,
  ChevronRight,
  Crown,
  Brain
} from "lucide-react";
import { motion } from "framer-motion";
import SmartFileUploader from "../components/uploaders/SmartFileUploader";

export default function HomePage() {
  const location = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('from') === 'scan') {
      toast({
        title: "Welcome to our updated home page!",
        description: "We've redesigned our interface for a better experience.",
      });
    }
  }, [location]);

  const conversionTypes = [
    {
      id: 'document',
      title: 'Document Conversion',
      description: 'PDF, Word, Excel, PowerPoint and more',
      icon: FileText,
      color: 'blue',
      route: 'DocumentConverter',
      formats: ['PDF', 'DOCX', 'XLSX', 'PPTX', 'TXT']
    },
    {
      id: 'image',
      title: 'Image Conversion',
      description: 'JPG, PNG, SVG, WebP and more',
      icon: ImageIcon,
      color: 'emerald',
      route: 'ImageConverter',
      formats: ['JPG', 'PNG', 'WEBP', 'SVG', 'GIF']
    },
    {
      id: 'audio',
      title: 'Audio Conversion',
      description: 'MP3, WAV, AAC, FLAC and more',
      icon: FileAudio2,
      color: 'amber',
      route: 'AudioConverter',
      formats: ['MP3', 'WAV', 'AAC', 'FLAC', 'OGG']
    },
    {
      id: 'video',
      title: 'Video Conversion',
      description: 'MP4, AVI, MOV, MKV and more',
      icon: FileVideo,
      color: 'rose',
      route: 'VideoConverter',
      formats: ['MP4', 'AVI', 'MOV', 'MKV', 'WEBM']
    },
    {
      id: 'compress',
      title: 'File Compression',
      description: 'Reduce PDF, image or video size',
      icon: FileDown,
      color: 'purple',
      route: 'Compress',
      formats: ['PDF', 'JPG', 'PNG', 'MP4']
    },
    {
      id: 'ocr',
      title: 'Text Recognition (OCR)',
      description: 'Extract text from images or PDFs',
      icon: FileText,
      color: 'indigo',
      route: 'OcrTool',
      formats: ['JPG', 'PNG', 'PDF', 'BMP', 'TIFF']
    }
  ];
  
  const features = [
    {
      icon: Zap,
      title: 'Fast Conversion',
      description: 'Quick and efficient processing on powerful servers'
    },
    {
      icon: Shield,
      title: 'Complete Security',
      description: 'End-to-end encryption and automatic file deletion'
    },
    {
      icon: Sparkles,
      title: 'AI Enhancement',
      description: 'Improve images and text with artificial intelligence'
    },
    {
      icon: Languages,
      title: 'Multilingual OCR Support',
      description: 'Text recognition in multiple languages'
    }
  ];
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
            AI-Powered File Conversion and Analysis
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            Transform and analyze your files with advanced AI technology - upload and let our AI do the magic!
          </p>
          
          <div className="mt-3 inline-flex items-center text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-1 mb-6">
            <Check className="h-4 w-4 text-green-500 mr-1" />
            <span>No registration or software installation required</span>
          </div>
          
          <div className="flex justify-center mb-6">
            <Link to={createPageUrl("Premium")}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white rounded-full px-8 shadow-lg"
                >
                  <Crown className="mr-2 h-5 w-5" />
                  Upgrade to Premium
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl overflow-hidden shadow-lg">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <Badge className="bg-white/20 text-white hover:bg-white/30 mb-3 w-fit text-sm">NEW</Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  AI PDF Analysis
                </h2>
                <p className="text-purple-100 mb-4 text-base">
                  Our advanced AI analyzes your PDF documents to extract insights, summarize content, and answer your specific questions.
                </p>
                <ul className="space-y-2 mb-4">
                  {[
                    "Extract key insights and summaries",
                    "Answer questions about document content",
                    "Identify tables, statistics and important data",
                    "Deep analysis of document structure"
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start text-purple-100 text-sm">
                      <Sparkles className="h-4 w-4 text-purple-200 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to={createPageUrl("AiPdfAnalysis")}>
                    <Button 
                      size="default" 
                      className="bg-white text-indigo-700 hover:bg-purple-50 w-full md:w-auto"
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      Analyze Your PDF Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
              
              <div className="hidden md:block relative h-48 md:h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/50 to-transparent z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="AI Document Analysis" 
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="bg-indigo-900/80 backdrop-blur-sm p-3 rounded-lg text-white text-center">
                    <Brain className="h-8 w-8 mx-auto mb-1 text-purple-300" />
                    <p className="text-sm font-medium">Powered by AI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="mb-12 px-4 sm:px-0">
          <SmartFileUploader />
        </div>
        
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            All Conversion Tools
          </h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item}>
              <Link to={createPageUrl("AiPdfAnalysis")}>
                <Card className="hover:shadow-md transition-all h-full overflow-hidden group dark:bg-gray-800 dark:border-gray-700 dark:hover:border-purple-700 border-2 border-purple-200 dark:border-purple-900/40">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                        <Brain className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 mb-2 transition-colors">
                          AI PDF Analysis
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                          Extract insights, summaries and answers from PDFs
                        </p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/30 dark:hover:text-purple-300">
                            Summarize
                          </Badge>
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/30 dark:hover:text-purple-300">
                            Q&A
                          </Badge>
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/30 dark:hover:text-purple-300">
                            Extract Data
                          </Badge>
                        </div>
                      </div>
                      <div className="text-gray-400 group-hover:text-purple-500 transition-colors">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
            
            {conversionTypes.map(type => (
              <motion.div key={type.id} variants={item}>
                <Link to={createPageUrl(type.route)}>
                  <Card className="hover:shadow-md transition-all h-full overflow-hidden group dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-700">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full bg-${type.color}-100 text-${type.color}-600 dark:bg-${type.color}-900/20 dark:text-${type.color}-400`}>
                          <type.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-gray-900 dark:text-white group-hover:text-${type.color}-600 dark:group-hover:text-${type.color}-400 mb-2 transition-colors`}>
                            {type.title}
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                            {type.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {type.formats.map(format => (
                              <Badge key={format} variant="secondary" className={`bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-${type.color}-100 hover:text-${type.color}-700 dark:hover:bg-${type.color}-900/30 dark:hover:text-${type.color}-300`}>
                                {format}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className={`text-gray-400 group-hover:text-${type.color}-500 transition-colors`}>
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Why Choose MagicFile.ai?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our platform offers the fastest and most reliable file conversion with advanced features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + (index * 0.1) }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to convert your first file?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Start using our easy and powerful conversion tools right now. No registration required!
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 rounded-full px-8"
            >
              <DownloadCloud className="mr-2 h-5 w-5" />
              Get Started
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
