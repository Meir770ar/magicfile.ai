import React, { useState, useEffect } from 'react';
import { Document } from '@/api/entities';
import { DocumentAnalysis } from '@/api/entities';
import { User } from '@/api/entities';
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InvokeLLM } from '@/api/integrations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  MoreVertical,
  FileText,
  Download,
  Trash2,
  Receipt,
  FileImage,
  FolderOpen,
  AlertCircle,
  Sparkles,
  FilePlus,
  Eye,
  Check,
  CalendarDays,
  Clock,
  FileType,
  File
} from "lucide-react";
import { format, parseISO } from "date-fns";
import DocumentViewer from "../components/documents/DocumentViewer";
import EmptyState from "../components/documents/EmptyState";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const typeIcons = {
  receipt: Receipt,
  invoice: Receipt,
  id: FileImage,
  contract: FileType,
  other: FileText
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    loadData();
    
    // Check if we have a view parameter in the URL
    const params = new URLSearchParams(location.search);
    const viewDocId = params.get('view');
    if (viewDocId) {
      // We'll load the document in the next effect when documents are loaded
      console.log("Should view document:", viewDocId);
    }
  }, [location]);

  // Effect to open document viewer if view param exists
  useEffect(() => {
    if (documents.length > 0) {
      const params = new URLSearchParams(location.search);
      const viewDocId = params.get('view');
      if (viewDocId) {
        const docToView = documents.find(d => d.id === viewDocId);
        if (docToView) {
          setSelectedDocument(docToView);
        }
      }
    }
  }, [documents, location]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [docsData, userData] = await Promise.all([
        Document.list("-created_date"),
        User.me()
      ]);
      setDocuments(docsData);
      setUser(userData);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Error loading data. Please refresh the page and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = (doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         doc.extracted_text?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = currentFilter === "all" || doc.type === currentFilter;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (docId) => {
    try {
      await Document.delete(docId);
      setDocuments(docs => docs.filter(d => d.id !== docId));
    } catch (error) {
      console.error("Error deleting document:", error);
      setError("Error deleting document. Please try again.");
    }
  };

  const isFreeTierLimited = user?.subscription_tier === "free" && 
                           (user?.monthly_scans || 0) >= 10;

  const handleBulkAnalysis = async () => {
    if (documents.length === 0) return;
    
    try {
      const docsToAnalyze = documents.filter(doc => doc.extracted_text && doc.extracted_text.trim() !== "");
      
      if (docsToAnalyze.length === 0) {
        setError("No documents with extracted text available for analysis.");
        return;
      }

      for (const doc of docsToAnalyze) {
        const analysis = await DocumentAnalysis.create({
          document_id: doc.id,
          status: "processing"
        });

        InvokeLLM({
          prompt: `
          Analyze the following document content:
          ${doc.extracted_text}
          
          Please provide a comprehensive analysis with the following:
          1. A brief summary (3-5 sentences)
          2. Key terms/phrases (up to 10)
          3. Entities: Extract dates, monetary amounts, people's names, and organizations
          4. Overall sentiment (positive, neutral, or negative)
          5. Suggested tags for categorization (up to 5)
          6. Detected language
          7. Suggestions for document improvements if applicable (up to 3)
          `,
          response_json_schema: {
            type: "object",
            properties: {
              summary: { type: "string" },
              key_terms: { type: "array", items: { type: "string" } },
              entities: {
                type: "object",
                properties: {
                  dates: { type: "array", items: { type: "string" } },
                  amounts: { type: "array", items: { type: "string" } },
                  names: { type: "array", items: { type: "string" } },
                  organizations: { type: "array", items: { type: "string" } }
                }
              },
              sentiment: { type: "string", enum: ["positive", "neutral", "negative"] },
              suggested_tags: { type: "array", items: { type: "string" } },
              language: { type: "string" },
              improvement_suggestions: { type: "array", items: { type: "string" } }
            }
          }
        }).then(async result => {
          await DocumentAnalysis.update(analysis.id, {
            ...result,
            status: "completed"
          });
          
          if (result.suggested_tags && result.suggested_tags.length > 0) {
            await Document.update(doc.id, {
              tags: result.suggested_tags
            });
          }
        }).catch(err => {
          console.error(`Analysis failed for document ${doc.id}:`, err);
        });
      }
      
      alert(`AI analysis started for ${docsToAnalyze.length} documents. Results will be available soon.`);
      
    } catch (error) {
      console.error("Error starting bulk analysis:", error);
      setError("Failed to start document analysis. Please try again.");
    }
  };

  const getRecentDocuments = () => {
    // Last 5 documents
    return documents.slice(0, 5);
  };

  const getDocumentsByType = () => {
    const typeCounts = {};
    documents.forEach(doc => {
      const type = doc.type || 'other';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    return typeCounts;
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Documents</h1>
            <p className="mt-1 text-gray-500">
              {documents.length} documents
            </p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            {documents.length > 0 && (
              <Button 
                variant="outline"
                className="gap-2 flex-1 md:flex-none"
                onClick={handleBulkAnalysis}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze All
              </Button>
            )}
            <Link to={createPageUrl("Scan")} className="flex-1 md:flex-none">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isFreeTierLimited}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Scan
              </Button>
            </Link>
          </div>
        </div>

        {isFreeTierLimited && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">Free Account Limit Reached</h3>
                <p className="text-amber-700 text-sm mt-1">
                  You've reached the monthly limit of 10 scans. 
                  Upgrade to Premium for unlimited scans and advanced features.
                </p>
                <Button 
                  variant="outline"
                  className="mt-3 border-amber-200 text-amber-700 hover:bg-amber-100"
                  onClick={() => window.location.href = createPageUrl("Settings")}
                >
                  View Plans
                </Button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard summary for larger screens */}
        {documents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 hidden md:grid">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <CalendarDays className="h-4 w-4" />
                  Recent Scans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {documents.length > 0 ? format(parseISO(documents[0].created_date), "MM/dd/yyyy") : "No data"}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {documents.length > 0 && `Total ${documents.length} documents`}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Clock className="h-4 w-4" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold">
                    {((documents.filter(d => d.tags && d.tags.length > 0).length / documents.length) * 100).toFixed(0)}%
                  </div>
                  <div className="ml-2">
                    <Badge variant="outline" className="bg-blue-50">
                      Analyzed Documents
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <File className="h-4 w-4" />
                  Document Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(getDocumentsByType()).map(([type, count]) => (
                    <Badge key={type} variant="outline" className="bg-gray-50">
                      {type === 'invoice' ? 'Invoice' : 
                       type === 'receipt' ? 'Receipt' : 
                       type === 'contract' ? 'Contract' : 
                       type === 'id' ? 'ID Document' : 'Other'}: {count}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs defaultValue="all" value={currentFilter} onValueChange={setCurrentFilter}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="receipt">Receipts</TabsTrigger>
                <TabsTrigger value="invoice">Invoices</TabsTrigger>
                <TabsTrigger value="contract">Contracts</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => {
                    const Icon = typeIcons[doc.type] || FileText;
                    return (
                      <TableRow key={doc.id} className="cursor-pointer group">
                        <TableCell
                          className="font-medium"
                          onClick={() => setSelectedDocument(doc)}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-gray-400" />
                            <span className="group-hover:text-blue-600 transition-colors">
                              {doc.title}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {doc.type === 'invoice' ? 'Invoice' : 
                             doc.type === 'receipt' ? 'Receipt' : 
                             doc.type === 'contract' ? 'Contract' : 
                             doc.type === 'id' ? 'ID Document' : 'Other'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {format(new Date(doc.created_date), "MM/dd/yyyy")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              doc.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : doc.status === "failed"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }
                          >
                            {doc.status === "completed" ? (
                              <Check className="w-3 h-3 mr-1" />
                            ) : null}
                            {doc.status === "completed" ? "Completed" : 
                             doc.status === "failed" ? "Failed" : "Processing"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setSelectedDocument(doc)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => window.open(doc.original_file, '_blank')}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(doc.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {selectedDocument && (
          <DocumentViewer
            document={selectedDocument}
            onClose={() => setSelectedDocument(null)}
          />
        )}
      </div>
    </div>
  );
}