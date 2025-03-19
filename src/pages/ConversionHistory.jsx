import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { FileConversion } from '@/api/entities';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { FileText, FileImage, FileAudio, FileVideo, Download, Trash2, Search, Filter, SlidersHorizontal, Calendar, ArrowUpDown, FileDown } from "lucide-react";
import GoogleSignIn from "../components/auth/GoogleSignIn";

export default function ConversionHistoryPage() {
  const [user, setUser] = useState(null);
  const [conversions, setConversions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({
    type: "all",
    status: "all",
    search: ""
  });

  useEffect(() => {
    loadUserAndConversions();
  }, []);

  const loadUserAndConversions = async () => {
    setIsLoading(true);
    try {
      // Try to get current user
      const userData = await User.me();
      setUser(userData);
      
      // Load conversions
      await loadConversions();
    } catch (error) {
      console.error("Error loading data:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loadConversions = async () => {
    try {
      const conversionsData = await FileConversion.list('-created_date');
      setConversions(conversionsData);
    } catch (error) {
      console.error("Error loading conversions:", error);
      toast({
        title: "Error loading conversions",
        description: "There was a problem loading your conversion history.",
        variant: "destructive"
      });
    }
  };

  const getFileTypeIcon = (conversionType) => {
    switch (conversionType) {
      case 'document':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'image':
        return <FileImage className="h-5 w-5 text-emerald-500" />;
      case 'audio':
        return <FileAudio className="h-5 w-5 text-amber-500" />;
      case 'video':
        return <FileVideo className="h-5 w-5 text-rose-500" />;
      case 'compression':
        return <FileDown className="h-5 w-5 text-purple-500" />;
      case 'ocr':
        return <FileText className="h-5 w-5 text-indigo-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredConversions = conversions.filter(conversion => {
    // Filter by conversion type
    if (filter.type !== "all" && conversion.conversion_type !== filter.type) {
      return false;
    }
    
    // Filter by status
    if (filter.status !== "all" && conversion.status !== filter.status) {
      return false;
    }
    
    // Filter by search term
    if (filter.search && !conversion.original_file.toLowerCase().includes(filter.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  if (!user && !isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to view your conversion history
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-10">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-6">
              Sign in with your Google account to access your conversion history and manage your files.
            </p>
            <GoogleSignIn 
              buttonText="Sign in to Continue" 
              onLoginSuccess={() => {
                loadUserAndConversions();
                toast({
                  title: "Welcome!",
                  description: "You've successfully signed in to your account."
                });
              }}
              className="w-full md:w-auto"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Conversion History</h1>
          <p className="text-gray-500 dark:text-gray-400">
            View and manage your file conversion history
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Your Conversions</CardTitle>
                <CardDescription>
                  {filteredConversions.length} conversion{filteredConversions.length !== 1 ? 's' : ''} found
                </CardDescription>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Search files..."
                    className="pl-9"
                    value={filter.search}
                    onChange={(e) => setFilter({...filter, search: e.target.value})}
                  />
                </div>
                
                <Select 
                  value={filter.type} 
                  onValueChange={(value) => setFilter({...filter, type: value})}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="File Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="document">Documents</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="compression">Compression</SelectItem>
                    <SelectItem value="ocr">OCR</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select 
                  value={filter.status} 
                  onValueChange={(value) => setFilter({...filter, status: value})}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                <p className="mt-2 text-gray-500">Loading your conversions...</p>
              </div>
            ) : filteredConversions.length === 0 ? (
              <div className="text-center py-10">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-gray-700 dark:text-gray-300 font-medium">No conversions found</h3>
                <p className="text-gray-500 mt-1">
                  {filter.search || filter.type !== "all" || filter.status !== "all" 
                    ? "Try adjusting your filters to see more results" 
                    : "Start by converting your first file"}
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File</TableHead>
                        <TableHead>Conversion</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredConversions.map((conversion) => (
                        <TableRow key={conversion.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                                {getFileTypeIcon(conversion.conversion_type)}
                              </div>
                              <span className="truncate max-w-[200px]">
                                {conversion.original_file.split('/').pop()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm">
                              {conversion.original_format} → {conversion.target_format}
                            </span>
                          </TableCell>
                          <TableCell>
                            {format(new Date(conversion.created_date), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(conversion.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" disabled={conversion.status !== 'completed'}>
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}