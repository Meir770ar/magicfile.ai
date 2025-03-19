
import React, { useState, useEffect } from 'react';
import { Document } from '@/api/entities';
import { DocumentAnalysis } from '@/api/entities';
import { Comment } from '@/api/entities';
import { Collaboration } from '@/api/entities';
import { Version } from '@/api/entities';
import { User } from '@/api/entities';
import { InvokeLLM } from '@/api/integrations';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from "recharts";
import {
  Sparkles,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  RefreshCw,
  Calendar,
  Clock,
  ArrowRight,
  Folder,
  UserIcon,
  AlertTriangle
} from "lucide-react";
import { format, subDays, subMonths, isThisWeek, isThisMonth, startOfMonth, endOfMonth } from "date-fns";
import DocumentTypeBreakdown from "../components/insights/DocumentTypeBreakdown";
import ActivityTimeline from "../components/insights/ActivityTimeline";
import ImprovementSuggestions from "../components/insights/ImprovementSuggestions";

export default function InsightsPage() {
  const [documents, setDocuments] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [comments, setComments] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [versions, setVersions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState("last30");
  const [insights, setInsights] = useState(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setErrors({});
    
    try {
      const [docsData, analysesData] = await Promise.all([
        Document.list().catch(err => {
          console.error("Error loading documents:", err);
          setErrors(prev => ({ ...prev, documents: err.message || "Failed to load documents" }));
          return [];
        }),
        DocumentAnalysis.list().catch(err => {
          console.error("Error loading analyses:", err);
          setErrors(prev => ({ ...prev, analyses: err.message || "Failed to load analyses" }));
          return [];
        })
      ]);
      
      setDocuments(docsData);
      setAnalyses(analysesData);
      
      try {
        const commentsData = await Comment.list();
        setComments(commentsData);
      } catch (err) {
        console.error("Error loading comments:", err);
        setErrors(prev => ({ ...prev, comments: err.message || "Failed to load comments" }));
        setComments([]);
      }
      
      try {
        const collabsData = await Collaboration.list();
        setCollaborations(collabsData);
      } catch (err) {
        console.error("Error loading collaborations:", err);
        setErrors(prev => ({ ...prev, collaborations: err.message || "Failed to load collaborations" }));
        setCollaborations([]);
      }
      
      try {
        const versionsData = await Version.list();
        setVersions(versionsData);
      } catch (err) {
        console.error("Error loading versions:", err);
        setErrors(prev => ({ ...prev, versions: err.message || "Failed to load versions" }));
        setVersions([]);
      }
      
      if (docsData.length > 0) {
        generateInsights(docsData, analysesData, comments, collaborations, versions);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setErrors(prev => ({ ...prev, general: error.message || "Failed to load data" }));
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredData = (period) => {
    let cutoffDate;
    switch (period) {
      case "last7":
        cutoffDate = subDays(new Date(), 7);
        break;
      case "last30":
        cutoffDate = subDays(new Date(), 30);
        break;
      case "last90":
        cutoffDate = subDays(new Date(), 90);
        break;
      case "thisMonth":
        cutoffDate = startOfMonth(new Date());
        break;
      default:
        cutoffDate = subDays(new Date(), 30);
    }
    
    const filteredDocs = documents.filter(doc => 
      new Date(doc.created_date) >= cutoffDate
    );
    
    return filteredDocs;
  };

  const generateInsights = async (docs, analyses, comments, collabs, versions) => {
    setIsGeneratingInsights(true);
    
    try {
      const docTypes = {};
      docs.forEach(doc => {
        docTypes[doc.type] = (docTypes[doc.type] || 0) + 1;
      });
      
      const recentDocs = docs
        .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
        .slice(0, 10);
      
      const docTimeline = docs.map(doc => ({ 
        date: format(new Date(doc.created_date), "yyyy-MM-dd"),
        type: doc.type
      }));
      
      const mostActiveCollabs = (collabs && collabs.length) 
        ? collabs
            .sort((a, b) => (b.collaborators?.length || 0) - (a.collaborators?.length || 0))
            .slice(0, 5)
        : [];
      
      const mostCommentedDocs = docs.map(doc => {
        const docComments = comments ? comments.filter(c => c.document_id === doc.id) : [];
        return {
          id: doc.id,
          title: doc.title,
          commentCount: docComments.length
        };
      }).sort((a, b) => b.commentCount - a.commentCount).slice(0, 5);
      
      const allSuggestions = [];
      analyses.forEach(analysis => {
        if (analysis.improvement_suggestions && analysis.improvement_suggestions.length > 0) {
          const doc = docs.find(d => d.id === analysis.document_id);
          if (doc) {
            allSuggestions.push({
              documentId: doc.id,
              documentTitle: doc.title,
              suggestions: analysis.improvement_suggestions
            });
          }
        }
      });
      
      const prompt = `
      You are an AI data analyst specialized in document management systems. Analyze the following document data and provide valuable insights:
      
      Document type breakdown: ${JSON.stringify(docTypes)}
      
      Recent documents: ${JSON.stringify(recentDocs.map(d => ({
        title: d.title,
        type: d.type,
        date: format(new Date(d.created_date), "yyyy-MM-dd")
      })))}
      
      Document timeline: ${JSON.stringify(docTimeline)}
      
      Most active collaborations: ${JSON.stringify(mostActiveCollabs.map(c => ({
        documentId: c.document_id,
        collaboratorCount: c.collaborators?.length || 0
      })))}
      
      Most commented documents: ${JSON.stringify(mostCommentedDocs)}
      
      Existing improvement suggestions: ${JSON.stringify(allSuggestions)}
      
      Documents with analysis: ${analyses.length} out of ${docs.length} total documents
      
      Based on this data, provide:
      1. Top insights about document usage patterns
      2. Potential areas for improvement in the document collection
      3. Document management recommendations
      4. Suggested next actions for the user
      `;
      
      const response = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            usage_insights: {
              type: "array",
              items: { type: "string" }
            },
            improvement_areas: {
              type: "array",
              items: { type: "string" }
            },
            management_recommendations: {
              type: "array",
              items: { type: "string" }
            },
            suggested_actions: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });
      
      setInsights(response);
    } catch (error) {
      console.error("Error generating insights:", error);
      setErrors(prev => ({ ...prev, insights: error.message || "Failed to generate insights" }));
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const refreshInsights = () => {
    generateInsights(documents, analyses, comments, collaborations, versions);
  };
  
  const getActivityOverTime = () => {
    const timeData = {};
    
    let dateFormat = "MMM d";
    let interval = 1;
    
    if (timePeriod === "last90") {
      dateFormat = "MMM";
      interval = 7;
    }
    
    documents.forEach(doc => {
      const date = new Date(doc.created_date);
      const formattedDate = format(date, dateFormat);
      
      if (!timeData[formattedDate]) {
        timeData[formattedDate] = { date: formattedDate, count: 0 };
      }
      timeData[formattedDate].count++;
    });
    
    return Object.values(timeData).sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
  };

  const getDocumentTypeBreakdown = () => {
    const typeData = {};
    
    documents.forEach(doc => {
      const type = doc.type || 'unknown';
      if (!typeData[type]) {
        typeData[type] = { name: formatDocType(type), value: 0 };
      }
      typeData[type].value++;
    });
    
    return Object.values(typeData);
  };
  
  const formatDocType = (type) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getEngagementMetrics = () => {
    const docCommentCounts = {};
    if (comments && comments.length) {
      comments.forEach(comment => {
        if (!docCommentCounts[comment.document_id]) {
          docCommentCounts[comment.document_id] = 0;
        }
        docCommentCounts[comment.document_id]++;
      });
    }
    
    const commentCountsArray = Object.values(docCommentCounts);
    const avgComments = commentCountsArray.length > 0 
      ? commentCountsArray.reduce((sum, count) => sum + count, 0) / commentCountsArray.length
      : 0;
    
    const collabsSet = new Set((collaborations || []).map(c => c.document_id));
    const collaboratedDocCount = collabsSet.size;
    const collaborationRate = documents.length > 0 ? (collaboratedDocCount / documents.length) * 100 : 0;
    
    const docVersionCounts = {};
    if (versions && versions.length) {
      versions.forEach(version => {
        if (!docVersionCounts[version.document_id]) {
          docVersionCounts[version.document_id] = 0;
        }
        docVersionCounts[version.document_id]++;
      });
    }
    
    const versionCountsArray = Object.values(docVersionCounts);
    const avgVersions = versionCountsArray.length > 0
      ? versionCountsArray.reduce((sum, count) => sum + count, 0) / versionCountsArray.length
      : 0;
      
    return {
      avgComments: avgComments.toFixed(1),
      collaborationRate: collaborationRate.toFixed(1),
      avgVersions: avgVersions.toFixed(1),
      analyzedDocuments: analyses.length,
      analyzedPercentage: documents.length > 0 ? (analyses.length / documents.length * 100).toFixed(1) : 0
    };
  };
  
  const getDocumentsNeedingAttention = () => {
    const docsWithSuggestions = [];
    
    analyses.forEach(analysis => {
      if (analysis.improvement_suggestions && analysis.improvement_suggestions.length > 0) {
        const doc = documents.find(d => d.id === analysis.document_id);
        if (doc) {
          docsWithSuggestions.push({
            id: doc.id,
            title: doc.title,
            type: doc.type,
            suggestions: analysis.improvement_suggestions,
            created_date: doc.created_date
          });
        }
      }
    });
    
    return docsWithSuggestions.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  const documentTypeColors = {
    'receipt': '#4CAF50',
    'invoice': '#2196F3',
    'contract': '#9C27B0',
    'id': '#FF9800',
    'letter': '#F44336',
    'other': '#607D8B'
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Document Insights</h1>
            <p className="mt-1 text-gray-600">
              AI-powered analytics and recommendations for your document collection
            </p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <Select
              value={timePeriod}
              onValueChange={setTimePeriod}
            >
              <SelectTrigger className="w-[180px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7">Last 7 days</SelectItem>
                <SelectItem value="last30">Last 30 days</SelectItem>
                <SelectItem value="last90">Last 90 days</SelectItem>
                <SelectItem value="thisMonth">This month</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              onClick={refreshInsights}
              variant="outline"
              disabled={isGeneratingInsights || documents.length === 0}
            >
              {isGeneratingInsights ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </div>

        {Object.keys(errors).length > 0 && (
          <Alert className="mb-6 bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertTitle>Some data couldn't be loaded</AlertTitle>
            <AlertDescription>
              <p>Some analytics features may be limited. The application will continue to function with available data.</p>
              {errors.collaborations && (
                <p className="text-xs mt-1 text-amber-600">Collaboration data unavailable: Using partial data for insights.</p>
              )}
            </AlertDescription>
          </Alert>
        )}

        {documents.length === 0 && !isLoading ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <Folder className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No documents yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Upload some documents to see insights and analytics about your document usage.
            </p>
            <Button
              onClick={() => navigate(createPageUrl("Scan"))}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Upload Documents
            </Button>
          </div>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="trends">Usage Trends</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Total Documents</CardDescription>
                      <CardTitle className="text-3xl">
                        {isLoading ? <Skeleton className="h-9 w-16" /> : documents.length}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {isLoading ? (
                          <Skeleton className="h-4 w-28" />
                        ) : (
                          <>Last added: {documents.length > 0 ? format(new Date(documents.sort((a, b) => new Date(b.created_date) - new Date(a.created_date))[0].created_date), "MMM d, yyyy") : "N/A"}</>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Analysis Coverage</CardDescription>
                      <CardTitle className="text-3xl">
                        {isLoading ? (
                          <Skeleton className="h-9 w-16" />
                        ) : (
                          `${getEngagementMetrics().analyzedPercentage}%`
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Sparkles className="mr-1 h-4 w-4" />
                        {isLoading ? (
                          <Skeleton className="h-4 w-28" />
                        ) : (
                          `${getEngagementMetrics().analyzedDocuments} analyzed documents`
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Avg. Comments</CardDescription>
                      <CardTitle className="text-3xl">
                        {isLoading ? (
                          <Skeleton className="h-9 w-16" />
                        ) : (
                          getEngagementMetrics().avgComments
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-500 flex items-center">
                        <UserIcon className="mr-1 h-4 w-4" />
                        {isLoading ? (
                          <Skeleton className="h-4 w-28" />
                        ) : (
                          `${comments ? comments.length : 0} total comments`
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Collaboration Rate</CardDescription>
                      <CardTitle className="text-3xl">
                        {isLoading ? (
                          <Skeleton className="h-9 w-16" />
                        ) : (
                          `${getEngagementMetrics().collaborationRate}%`
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-500 flex items-center">
                        <UserIcon className="mr-1 h-4 w-4" />
                        {isLoading ? (
                          <Skeleton className="h-4 w-28" />
                        ) : (
                          `${collaborations ? collaborations.length : 0} collaborative documents`
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-1">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Document Types</CardTitle>
                        <PieChartIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="h-64 flex items-center justify-center">
                          <Skeleton className="h-48 w-48 rounded-full" />
                        </div>
                      ) : (
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={getDocumentTypeBreakdown()}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                              >
                                {getDocumentTypeBreakdown().map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={documentTypeColors[entry.name.toLowerCase().replace(' ', '_')] || COLORS[index % COLORS.length]} 
                                  />
                                ))}
                              </Pie>
                              <Legend layout="vertical" verticalAlign="bottom" align="center" />
                              <Tooltip formatter={(value) => [`${value} documents`, 'Count']} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>AI Insights</CardTitle>
                        <Sparkles className="h-4 w-4 text-blue-500" />
                      </div>
                      <CardDescription>
                        Actionable observations about your document management
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading || isGeneratingInsights ? (
                        <div className="space-y-4">
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-5 w-5/6" />
                          <Skeleton className="h-5 w-4/6" />
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-5 w-5/6" />
                        </div>
                      ) : insights && insights.usage_insights ? (
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium text-sm mb-2 text-blue-700">Key Observations</h3>
                            <ul className="space-y-1.5">
                              {insights.usage_insights.map((insight, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <span className="bg-blue-100 text-blue-700 h-5 w-5 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">
                                    {i + 1}
                                  </span>
                                  <span>{insight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {insights.suggested_actions && insights.suggested_actions.length > 0 && (
                            <div>
                              <h3 className="font-medium text-sm mb-2 text-emerald-700">Recommended Actions</h3>
                              <ul className="space-y-1.5">
                                {insights.suggested_actions.map((action, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm">
                                    <span className="bg-emerald-100 text-emerald-700 h-5 w-5 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">
                                      {i + 1}
                                    </span>
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="py-8 text-center">
                          <p className="text-gray-500 mb-4">
                            No insights available yet. Generate insights for your documents.
                          </p>
                          <Button onClick={refreshInsights}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Insights
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="trends" className="mt-0">
                <div className="grid grid-cols-1 gap-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Document Activity Over Time</CardTitle>
                        <BarChart3 className="h-4 w-4 text-gray-400" />
                      </div>
                      <CardDescription>
                        Number of new documents by date
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        {isLoading ? (
                          <div className="h-full w-full flex items-center justify-center">
                            <Skeleton className="h-64 w-full" />
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={getActivityOverTime()}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="count" name="Documents" fill="#4f46e5" />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <ActivityTimeline 
                    documents={documents}
                    comments={comments || []}
                    collaborations={collaborations || []}
                    isLoading={isLoading}
                  />
                  <DocumentTypeBreakdown
                    documents={documents}
                    timePeriod={timePeriod}
                    isLoading={isLoading}
                  />
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="mt-0">
                <div className="grid grid-cols-1 gap-6">
                  <ImprovementSuggestions 
                    documents={documents}
                    analyses={analyses}
                    isLoading={isLoading}
                  />
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
                        Document Management Recommendations
                      </CardTitle>
                      <CardDescription>
                        AI-generated advice for improving your document workflow
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading || isGeneratingInsights ? (
                        <div className="space-y-4">
                          <Skeleton className="h-24 w-full rounded-md" />
                          <Skeleton className="h-24 w-full rounded-md" />
                        </div>
                      ) : insights && insights.improvement_areas ? (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-base font-medium mb-3">Improving Your Document Collection</h3>
                            <div className="space-y-3">
                              {insights.improvement_areas.map((area, index) => (
                                <Alert key={index} className="bg-blue-50 border-blue-200">
                                  <AlertCircle className="h-4 w-4 text-blue-500" />
                                  <AlertDescription className="text-blue-700">
                                    {area}
                                  </AlertDescription>
                                </Alert>
                              ))}
                            </div>
                          </div>
                          {insights.management_recommendations && insights.management_recommendations.length > 0 && (
                            <div>
                              <h3 className="text-base font-medium mb-3">Management Best Practices</h3>
                              <div className="space-y-3">
                                {insights.management_recommendations.map((rec, index) => (
                                  <div key={index} className="p-3 bg-gray-50 border rounded-md">
                                    <div className="flex gap-3">
                                      <span className="h-6 w-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm">
                                        {index + 1}
                                      </span>
                                      <p>{rec}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="py-8 text-center">
                          <p className="text-gray-500 mb-4">
                            Generate insights to see management recommendations
                          </p>
                          <Button onClick={refreshInsights}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Recommendations
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                        Your Action Plan
                      </CardTitle>
                      <CardDescription>
                        Prioritized next steps to optimize your document system
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading || isGeneratingInsights ? (
                        <div className="space-y-4">
                          <Skeleton className="h-20 w-full rounded-md" />
                          <Skeleton className="h-20 w-full rounded-md" />
                        </div>
                      ) : insights && insights.suggested_actions ? (
                        <div className="space-y-4">
                          {insights.suggested_actions.map((action, index) => (
                            <div key={index} className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="bg-green-100 text-green-800 h-8 w-8 rounded-full flex items-center justify-center text-sm shrink-0">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium">{action}</p>
                                <Button 
                                  variant="link" 
                                  className="p-0 h-auto text-blue-600 mt-2"
                                  onClick={() => {
                                    if (action.toLowerCase().includes('upload') || action.toLowerCase().includes('scan')) {
                                      navigate(createPageUrl("Scan"));
                                    } else if (action.toLowerCase().includes('template')) {
                                      navigate(createPageUrl("Templates"));
                                    } else {
                                      navigate(createPageUrl("Documents"));
                                    }
                                  }}
                                >
                                  Take action <ArrowRight className="ml-1 h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center">
                          <p className="text-gray-500 mb-4">
                            Generate insights to see your personalized action plan
                          </p>
                          <Button onClick={refreshInsights}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Action Plan
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
