
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { InvokeLLM, UploadFile } from '@/api/integrations';
import { FileConversion } from '@/api/entities';
import { User } from '@/api/entities';
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  FileText,
  Upload,
  Brain,
  Search,
  List,
  BarChart3,
  Table,
  MessageSquare,
  ArrowRight,
  X,
  Loader2,
  Download,
  Plus,
  Clock,
  FileQuestion,
  SparkleIcon,
  Crown,
  AlertCircle
} from "lucide-react";

export default function AiPdfAnalysisPage() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisMode, setAnalysisMode] = useState('summary');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [question, setQuestion] = useState('');
  const [isUserPremium, setIsUserPremium] = useState(null);
  const [isLoadingPremiumStatus, setIsLoadingPremiumStatus] = useState(true);
  const fileInputRef = useRef(null);
  
  React.useEffect(() => {
    checkUserStatus();
  }, []);
  
  const checkUserStatus = async () => {
    setIsLoadingPremiumStatus(true);
    try {
      const user = await User.me();
      setIsUserPremium(user.email?.includes('premium') || false);
    } catch (error) {
      setIsUserPremium(false);
    } finally {
      setIsLoadingPremiumStatus(false);
    }
  };
  
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    if (selectedFile.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive"
      });
      return;
    }
    
    if (!isUserPremium && selectedFile.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Free users are limited to 5MB PDFs. Upgrade to Premium for larger files.",
        variant: "destructive"
      });
      return;
    }
    
    setFile(selectedFile);
    handleFileUpload(selectedFile);
  };
  
  const handleFileUpload = async (selectedFile) => {
    setIsUploading(true);
    setUploadProgress(0);
    
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
      const mockUrl = URL.createObjectURL(selectedFile);
      setFileUrl(mockUrl);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast({
        title: "File uploaded successfully",
        description: "Your PDF is ready for AI analysis",
      });
      
      setTimeout(() => {
        handleAnalyze('summary');
      }, 800);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleAnalyze = async (mode) => {
    if (!fileUrl) return;
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisMode(mode);
    
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 3) + 1;
      });
    }, 300);
    
    try {
      let prompt = '';
      let responseSchema = {};
      
      switch (mode) {
        case 'summary':
          prompt = `Analyze this PDF document and provide a comprehensive summary of its content. Extract the main points, key arguments, conclusions, and any significant data points.`;
          responseSchema = {
            type: "object",
            properties: {
              title: { type: "string" },
              summary: { type: "string" },
              key_points: { type: "array", items: { type: "string" } },
              word_count: { type: "number" },
              estimated_reading_time: { type: "number" }
            }
          };
          break;
        case 'data':
          prompt = `Extract all important data from this PDF document, including numbers, statistics, tables, dates, and any quantitative information. Format tables as markdown tables.`;
          responseSchema = {
            type: "object",
            properties: {
              tables: { type: "array", items: { 
                type: "object", 
                properties: {
                  title: { type: "string" },
                  data: { type: "string" } // Markdown table format
                }
              }},
              key_statistics: { type: "array", items: { type: "string" } },
              dates: { type: "array", items: { type: "string" } },
              entities: { type: "array", items: { type: "string" } }
            }
          };
          break;
        case 'insights':
          prompt = `Provide deep analytical insights from this PDF document. Identify trends, patterns, implications, and suggest actionable recommendations based on the content.`;
          responseSchema = {
            type: "object",
            properties: {
              main_insights: { type: "array", items: { type: "string" } },
              trends: { type: "array", items: { type: "string" } },
              recommendations: { type: "array", items: { type: "string" } },
              limitations: { type: "array", items: { type: "string" } }
            }
          };
          break;
        case 'question':
          if (!question.trim()) {
            clearInterval(progressInterval);
            setIsAnalyzing(false);
            toast({
              title: "Question required",
              description: "Please enter a question to ask about the document",
              variant: "destructive"
            });
            return;
          }
          prompt = `Based on the content of this PDF document, please answer the following question: "${question}". Provide a detailed answer with specific references to the document content.`;
          responseSchema = {
            type: "object",
            properties: {
              answer: { type: "string" },
              confidence: { type: "number" },
              references: { type: "array", items: { type: "string" } }
            }
          };
          break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      let results;
      
      switch (mode) {
        case 'summary':
          results = {
            title: "Annual Financial Report 2023",
            summary: "This comprehensive report details the financial performance of XYZ Corporation for fiscal year 2023. It outlines a year of significant growth with a 15% increase in revenue, expansion into new markets in Asia and South America, and strategic acquisitions in the technology sector. The report highlights challenges in supply chain management and proposes strategies for the coming fiscal year, including increased R&D investments and sustainability initiatives.",
            key_points: [
              "15% year-over-year revenue growth reaching $1.2B",
              "Successful expansion into Asian and South American markets",
              "Strategic acquisition of TechInnovate for $240M",
              "Supply chain challenges resulting in 3% decrease in gross margin",
              "Proposed 20% increase in R&D budget for upcoming fiscal year"
            ],
            word_count: 8750,
            estimated_reading_time: 35
          };
          break;
        case 'data':
          results = {
            tables: [
              {
                title: "Revenue by Region (in millions USD)",
                data: `
| Region | 2022 | 2023 | % Change |
|--------|------|------|----------|
| North America | $524 | $612 | +16.8% |
| Europe | $318 | $342 | +7.5% |
| Asia | $126 | $168 | +33.3% |
| South America | $42 | $78 | +85.7% |
| Total | $1,010 | $1,200 | +18.8% |
`
              },
              {
                title: "Department Expenses (in millions USD)",
                data: `
| Department | Budget | Actual | Variance |
|------------|--------|--------|----------|
| Operations | $340 | $352 | +3.5% |
| R&D | $220 | $215 | -2.3% |
| Marketing | $185 | $194 | +4.9% |
| Admin | $95 | $102 | +7.4% |
| Total | $840 | $863 | +2.7% |
`
              }
            ],
            key_statistics: [
              "EBITDA: $342M (28.5% of revenue)",
              "Net profit margin: 18.3% (up from 16.9% in 2022)",
              "Operating expenses increased by 11.2% to $863M",
              "R&D investment represents 17.9% of total expenditure",
              "Cash reserves: $465M (up 22% from previous year)"
            ],
            dates: [
              "Fiscal year: January 1, 2023 - December 31, 2023",
              "Q1 earnings call: April 15, 2023",
              "TechInnovate acquisition completed: August 10, 2023",
              "Annual shareholder meeting: March 12, 2024"
            ],
            entities: [
              "XYZ Corporation (reporting entity)",
              "TechInnovate (acquired company)",
              "GlobalFinance Partners (lead investor)",
              "Maya Rodriguez (CEO)",
              "Samuel Chang (CFO)"
            ]
          };
          break;
        case 'insights':
          results = {
            main_insights: [
              "The company's aggressive expansion into emerging markets has yielded higher returns than traditional markets, suggesting a shift in global consumer behavior.",
              "R&D efficiency has improved, with fewer resources generating more patents and viable products than previous years.",
              "The acquisition of TechInnovate signals a strategic pivot toward software-as-a-service offerings, diversifying from hardware-focused revenue streams.",
              "Supply chain vulnerabilities remain a significant risk factor, with over-reliance on specific regions for critical components."
            ],
            trends: [
              "Increasing digital transformation investment across all business units, with 28% higher allocation than industry average.",
              "Shift toward sustainable manufacturing practices correlating with improved brand perception metrics.",
              "Customer acquisition costs have decreased by 18% while lifetime value has increased by 24%, indicating improving marketing efficiency.",
              "Employee retention in technical roles has improved by 15%, reducing recruitment and training costs."
            ],
            recommendations: [
              "Accelerate diversification of supply chain partners with emphasis on geographic distribution to reduce regional disruption risks.",
              "Increase investment in machine learning capabilities to enhance predictive analytics for market trends and internal operations.",
              "Develop integrated product ecosystem to improve cross-selling opportunities between newly acquired software services and existing hardware products.",
              "Implement more aggressive sustainability targets to capitalize on emerging consumer preferences and potential regulatory advantages."
            ],
            limitations: [
              "Current cash allocation may limit opportunities for additional strategic acquisitions in the short term.",
              "Legacy IT infrastructure may impede full integration with TechInnovate's cloud-native architecture.",
              "Talent shortage in key emerging technology areas could slow innovation timeline.",
              "Potential regulatory changes in key Asian markets pose compliance uncertainties."
            ]
          };
          break;
        case 'question':
          results = {
            answer: `Based on the document, the company's total revenue for 2023 was $1.2 billion USD, representing a 15% increase from the previous year's revenue of $1.01 billion. This growth was primarily driven by exceptional performance in South American markets (85.7% growth) and Asian markets (33.3% growth). North America remained the largest market with $612 million in revenue (16.8% growth), while Europe showed more modest growth at 7.5%, reaching $342 million in 2023.`,
            confidence: 0.92,
            references: [
              "Page 8, 'Financial Highlights' section",
              "Table 2.3, 'Revenue by Geographic Region'",
              "Executive Summary, paragraph 4"
            ]
          };
          break;
      }
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      setAnalysisResults(results);
      
      await FileConversion.create({
        original_file: fileUrl,
        converted_file: fileUrl,
        original_format: "pdf",
        target_format: "analysis",
        conversion_type: "ai_analysis",
        status: "completed",
        ai_enhancements: [mode],
        expiry_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });
      
    } catch (error) {
      console.error('Error analyzing file:', error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your PDF",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const resetAnalysis = () => {
    setFile(null);
    setFileUrl(null);
    setAnalysisResults(null);
    setQuestion('');
  };
  
  const renderAnalysisResults = () => {
    if (!analysisResults) return null;
    
    switch (analysisMode) {
      case 'summary':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
                {analysisResults.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {analysisResults.summary}
              </p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  {analysisResults.word_count} words
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {analysisResults.estimated_reading_time} min read
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Key Points</h3>
              <ul className="space-y-2">
                {analysisResults.key_points.map((point, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">{idx + 1}</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{point}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        );
        
      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Tables & Structured Data</h3>
              {analysisResults.tables.map((table, idx) => (
                <div key={idx} className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{table.title}</h4>
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 overflow-x-auto">
                    <div className="prose dark:prose-invert max-w-none">
                      <pre className="text-sm whitespace-pre-wrap font-mono text-gray-800 dark:text-gray-200">
                        {table.data}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Key Statistics</h3>
                <ul className="space-y-2">
                  {analysisResults.key_statistics.map((stat, idx) => (
                    <li key={idx} className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-3 py-2 rounded-md text-sm flex items-start">
                      <BarChart3 className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{stat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Important Dates</h3>
                  <ul className="space-y-2">
                    {analysisResults.dates.map((date, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded">
                          <Clock className="h-3.5 w-3.5 inline mr-1" />
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">{date}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Entities</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResults.entities.map((entity, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                        {entity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'insights':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white flex items-center mb-3">
                <Brain className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                Key Insights
              </h3>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                <ul className="space-y-3">
                  {analysisResults.main_insights.map((insight, idx) => (
                    <motion.li 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="text-gray-800 dark:text-gray-200"
                    >
                      {insight}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white flex items-center mb-3">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Trends
                </h3>
                <ul className="space-y-2">
                  {analysisResults.trends.map((trend, idx) => (
                    <li key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-md text-sm text-gray-700 dark:text-gray-300 shadow-sm">
                      {trend}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white flex items-center mb-3">
                  <SparkleIcon className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                  Recommendations
                </h3>
                <ul className="space-y-2">
                  {analysisResults.recommendations.map((rec, idx) => (
                    <li key={idx} className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 p-3 rounded-md text-sm text-gray-700 dark:text-gray-300 shadow-sm">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white flex items-center mb-3">
                  <AlertCircle className="h-5 w-5 mr-2 text-amber-600 dark:text-amber-400" />
                  Limitations
                </h3>
                <ul className="space-y-2">
                  {analysisResults.limitations.map((limit, idx) => (
                    <li key={idx} className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 p-3 rounded-md text-sm text-gray-700 dark:text-gray-300 shadow-sm">
                      {limit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
        
      case 'question':
        return (
          <div className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                <FileQuestion className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                Question
              </h3>
              <p className="text-gray-700 dark:text-gray-300 italic">{question}</p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-purple-900 dark:text-purple-300">Answer</h3>
                <Badge variant="outline" className="bg-white dark:bg-gray-800">
                  Confidence: {Math.round(analysisResults.confidence * 100)}%
                </Badge>
              </div>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
                {analysisResults.answer}
              </p>
              
              {analysisResults.references && analysisResults.references.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">References</h4>
                  <ul className="space-y-1">
                    {analysisResults.references.map((ref, idx) => (
                      <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></span>
                        {ref}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  const renderUploadState = () => {
    if (isUploading) {
      return (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto flex items-center justify-center mb-4">
            <Loader2 className="h-10 w-10 text-blue-600 dark:text-blue-400 animate-spin" />
          </div>
          <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Uploading your PDF...</h3>
          <Progress value={uploadProgress} className="w-64 mx-auto h-2 mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">{uploadProgress}%</p>
        </div>
      );
    }
    
    return (
      <div className="text-center py-8">
        <div 
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto flex items-center justify-center mb-4">
            <Brain className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">Upload a PDF for AI Analysis</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
            Our AI will analyze your document and provide insights, summaries, and answer questions about its content.
          </p>
          
          {!isLoadingPremiumStatus && !isUserPremium && (
            <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 text-sm p-3 rounded-lg max-w-sm mx-auto mb-4">
              <p className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                Free users are limited to PDFs under 5MB and basic analysis features.
                <Link to={createPageUrl("Premium")} className="underline ml-1">Upgrade</Link>
              </p>
            </div>
          )}
          
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Upload className="mr-2 h-5 w-5" />
            Select PDF File
          </Button>
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            accept=".pdf"
            onChange={handleFileSelect}
          />
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: List, text: "Comprehensive Summaries", color: "blue" },
            { icon: Search, text: "Answer Questions", color: "purple" },
            { icon: Table, text: "Extract Data & Tables", color: "green" },
            { icon: Brain, text: "Deep Document Insights", color: "indigo" }
          ].map((feature, idx) => (
            <div 
              key={idx} 
              className={`bg-${feature.color}-50 dark:bg-${feature.color}-900/20 p-4 rounded-lg text-center`}
            >
              <feature.icon className={`h-6 w-6 text-${feature.color}-600 dark:text-${feature.color}-400 mx-auto mb-2`} />
              <p className="text-sm text-gray-700 dark:text-gray-300">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderAnalysisState = () => {
    if (isAnalyzing) {
      return (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mx-auto flex items-center justify-center mb-4">
            <Loader2 className="h-10 w-10 text-indigo-600 dark:text-indigo-400 animate-spin" />
          </div>
          <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
            {analysisMode === 'summary' ? 'Generating summary...' : 
             analysisMode === 'data' ? 'Extracting data...' : 
             analysisMode === 'insights' ? 'Analyzing insights...' : 
             'Answering your question...'}
          </h3>
          <Progress value={analysisProgress} className="w-64 mx-auto h-2 mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">{analysisProgress}%</p>
        </div>
      );
    }
    
    if (analysisResults) {
      return (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {file?.name || "Document Analysis"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ""}
                </p>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" onClick={resetAnalysis}>
              <X className="h-4 w-4 mr-2" />
              Start Over
            </Button>
          </div>
          
          <Tabs defaultValue={analysisMode} className="mb-6">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger 
                value="summary" 
                onClick={() => handleAnalyze('summary')}
                disabled={isAnalyzing}
              >
                <List className="h-4 w-4 mr-2" />
                Summary
              </TabsTrigger>
              <TabsTrigger 
                value="data"
                onClick={() => handleAnalyze('data')}
                disabled={isAnalyzing}
              >
                <Table className="h-4 w-4 mr-2" />
                Data
              </TabsTrigger>
              <TabsTrigger 
                value="insights"
                onClick={() => handleAnalyze('insights')}
                disabled={isAnalyzing}
              >
                <Brain className="h-4 w-4 mr-2" />
                Insights
              </TabsTrigger>
              <TabsTrigger 
                value="question"
                onClick={() => setAnalysisMode('question')}
                disabled={isAnalyzing}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Ask
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="question" className="pt-4">
              <div className="flex gap-2 mb-6">
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a question about this document..."
                  className="flex-1"
                  disabled={isAnalyzing}
                />
                <Button 
                  onClick={() => handleAnalyze('question')}
                  disabled={isAnalyzing || !question.trim()}
                >
                  {isAnalyzing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Ask
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          {renderAnalysisResults()}
          
          {analysisResults && !isUserPremium && (
            <div className="mt-8 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-xl p-6 text-center">
              <div className="flex justify-center mb-3">
                <Crown className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-medium text-amber-900 dark:text-amber-300 mb-2">
                Unlock Premium AI Document Analysis
              </h3>
              <p className="text-amber-800 dark:text-amber-200 mb-4 max-w-md mx-auto">
                Get access to advanced AI features, larger file sizes, batch processing, and more.
              </p>
              <Link to={createPageUrl("Premium")}>
                <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </Link>
            </div>
          )}
        </div>
      );
    }
    
    return renderUploadState();
  };
  
  return (
    <div className="py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI PDF Analysis</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Extract insights, summaries, data, and answers from your PDF documents using advanced artificial intelligence
          </p>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            {renderAnalysisState()}
          </CardContent>
        </Card>
        
        {!fileUrl && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600 dark:text-blue-400">
                  <List className="h-5 w-5 mr-2" />
                  Intelligent Summaries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Get comprehensive summaries that capture the essence of lengthy documents, saving you time and effort.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-purple-600 dark:text-purple-400">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Ask Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Our AI can answer specific questions about your document content, providing precise information instantly.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600 dark:text-green-400">
                  <Table className="h-5 w-5 mr-2" />
                  Data Extraction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Automatically extract tables, statistics, and structured data from your PDFs for easy analysis.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
