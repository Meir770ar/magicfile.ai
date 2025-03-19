import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UploadFile, InvokeLLM } from '@/api/integrations';
import { Document } from '@/api/entities';
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  FileUp,
  Mic,
  Loader2,
  FileText,
  X,
  Languages,
  Wand2,
  FilePlus,
  MessageSquare,
  FileAudio,
  FileSpreadsheet,
  FileCheck,
  ListStart
} from "lucide-react";

export default function AudioToolsPage() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [language, setLanguage] = useState("english");
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [transcriptionResult, setTranscriptionResult] = useState(null);
  const [options, setOptions] = useState({
    speakerDetection: true,
    timestamps: true,
    autoTranslate: false,
    formatText: true
  });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    // Check file type and size
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/m4a', 'audio/ogg'];
    if (!validTypes.includes(selectedFile.type)) {
      toast({
        title: "Unsupported file format",
        description: "Please upload an audio file (MP3, WAV, M4A, OGG)",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedFile.size > 100 * 1024 * 1024) { // 100MB limit
      toast({
        title: "File too large",
        description: "Maximum file size is 100MB",
        variant: "destructive"
      });
      return;
    }
    
    setFile(selectedFile);
    setUploadedFileName(selectedFile.name);
    
    // Upload the file
    setIsProcessing(true);
    setProgress(20);
    
    try {
      const { file_url } = await UploadFile({ file: selectedFile });
      setUploadedFileUrl(file_url);
      setProgress(40);
      
      toast({
        title: "File uploaded",
        description: "Ready to transcribe audio",
      });
      
      setProgress(100);
      setIsProcessing(false);
      
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  const transcribeAudio = async () => {
    if (!uploadedFileUrl) {
      toast({
        title: "No audio file",
        description: "Please upload an audio file first",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      setProgress(20);
      
      const transcriptionPrompt = `
        Transcribe this audio file with the following requirements:
        - Target language: ${language}
        ${options.speakerDetection ? '- Detect and label different speakers\n' : ''}
        ${options.timestamps ? '- Include timestamps for each segment\n' : ''}
        ${options.formatText ? '- Format text into proper paragraphs\n' : ''}
        - Maintain high accuracy and proper punctuation
      `;
      
      const result = await InvokeLLM({
        prompt: transcriptionPrompt,
        file_urls: [uploadedFileUrl],
        response_json_schema: {
          type: "object",
          properties: {
            transcription: { type: "string" },
            speakers: { 
              type: "array", 
              items: { type: "string" }
            },
            segments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  speaker: { type: "string" },
                  text: { type: "string" },
                  timestamp: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      setProgress(80);
      
      // Save transcription to database
      const doc = await Document.create({
        title: uploadedFileName.replace(/\.[^/.]+$/, '') + '_transcript',
        type: 'other',
        status: 'completed',
        original_file: uploadedFileUrl,
        extracted_text: result.transcription
      });
      
      setProgress(100);
      setTranscriptionResult(result);
      
      toast({
        title: "Transcription Complete",
        description: "Audio has been transcribed successfully",
      });
      
    } catch (error) {
      console.error("Error transcribing audio:", error);
      toast({
        title: "Transcription Error",
        description: "Failed to transcribe audio. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Audio Transcription</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800/60 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-rose-400" />
                  Upload Audio
                </CardTitle>
                <CardDescription>
                  Upload an audio file to transcribe
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div 
                  className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-gray-600 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept="audio/*"
                  />
                  <FileAudio className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    MP3, WAV, M4A or OGG up to 100MB
                  </p>
                </div>
                
                {uploadedFileName && (
                  <div className="bg-gray-700/30 rounded p-3 text-sm">
                    <p className="text-gray-300 truncate">{uploadedFileName}</p>
                    {isProcessing && (
                      <Progress value={progress} className="h-1 mt-2" />
                    )}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-400">Target Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="italian">Italian</SelectItem>
                        <SelectItem value="portuguese">Portuguese</SelectItem>
                        <SelectItem value="russian">Russian</SelectItem>
                        <SelectItem value="japanese">Japanese</SelectItem>
                        <SelectItem value="korean">Korean</SelectItem>
                        <SelectItem value="chinese">Chinese</SelectItem>
                        <SelectItem value="arabic">Arabic</SelectItem>
                        <SelectItem value="hebrew">Hebrew</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="speaker-detection" className="text-gray-400">
                        Speaker Detection
                      </Label>
                      <Switch
                        id="speaker-detection"
                        checked={options.speakerDetection}
                        onCheckedChange={(checked) => 
                          setOptions(prev => ({...prev, speakerDetection: checked}))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="timestamps" className="text-gray-400">
                        Include Timestamps
                      </Label>
                      <Switch
                        id="timestamps"
                        checked={options.timestamps}
                        onCheckedChange={(checked) => 
                          setOptions(prev => ({...prev, timestamps: checked}))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="format-text" className="text-gray-400">
                        Format Text
                      </Label>
                      <Switch
                        id="format-text"
                        checked={options.formatText}
                        onCheckedChange={(checked) => 
                          setOptions(prev => ({...prev, formatText: checked}))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-translate" className="text-gray-400">
                        Auto-Translate
                      </Label>
                      <Switch
                        id="auto-translate"
                        checked={options.autoTranslate}
                        onCheckedChange={(checked) => 
                          setOptions(prev => ({...prev, autoTranslate: checked}))
                        }
                      />
                    </div>
                  </div>
                </div>
                
                <Button
                  className="w-full bg-rose-600 hover:bg-rose-700"
                  onClick={transcribeAudio}
                  disabled={isProcessing || !uploadedFileUrl}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Transcribing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Transcribe Audio
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Output Section */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/60 border-gray-700 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-rose-400" />
                  Transcription
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {isProcessing ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-rose-400 mx-auto mb-4" />
                      <p className="text-gray-400">Transcribing audio...</p>
                      <Progress value={progress} className="h-1 mt-4 w-48 mx-auto" />
                    </div>
                  </div>
                ) : transcriptionResult ? (
                  <ScrollArea className="h-[600px] pr-4">
                    {options.speakerDetection && transcriptionResult.speakers?.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Speakers Detected</h3>
                        <div className="flex flex-wrap gap-2">
                          {transcriptionResult.speakers.map((speaker, i) => (
                            <span key={i} className="px-2 py-1 rounded-full bg-rose-900/30 text-rose-300 text-sm">
                              {speaker}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      {options.speakerDetection && transcriptionResult.segments ? (
                        transcriptionResult.segments.map((segment, i) => (
                          <div key={i} className="bg-gray-900/50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-rose-400">
                                {segment.speaker}
                              </span>
                              {options.timestamps && (
                                <span className="text-xs text-gray-500">
                                  {segment.timestamp}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-300">{segment.text}</p>
                          </div>
                        ))
                      ) : (
                        <div className="bg-gray-900/50 rounded-lg p-4">
                          <p className="text-gray-300 whitespace-pre-wrap">
                            {transcriptionResult.transcription}
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="h-64 flex items-center justify-center text-center">
                    <div>
                      <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500">
                        Upload an audio file and click transcribe to get started
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-gray-800/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Languages className="h-4 w-4 text-rose-400" />
                Multi-Language Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Transcribe audio in multiple languages with high accuracy
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-400" />
                Speaker Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Automatically identify and label different speakers in conversations
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-green-400" />
                Export Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Export transcriptions to various formats including TXT and SRT
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}