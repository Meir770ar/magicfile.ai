import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Lightbulb, ArrowRight, FileText } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

export default function ImprovementSuggestions({ documents, analyses, isLoading }) {
  const getDocumentsWithSuggestions = () => {
    const results = [];
    
    analyses.forEach(analysis => {
      if (analysis.improvement_suggestions && analysis.improvement_suggestions.length > 0) {
        const document = documents.find(d => d.id === analysis.document_id);
        if (document) {
          results.push({
            document,
            suggestions: analysis.improvement_suggestions
          });
        }
      }
    });
    
    // Sort by most recent documents first
    return results.sort((a, b) => 
      new Date(b.document.created_date) - new Date(a.document.created_date)
    );
  };

  const documentTypeColors = {
    receipt: 'bg-green-100 text-green-800',
    invoice: 'bg-blue-100 text-blue-800',
    contract: 'bg-purple-100 text-purple-800',
    id: 'bg-orange-100 text-orange-800',
    letter: 'bg-red-100 text-red-800',
    other: 'bg-gray-100 text-gray-800'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
          Documents Needing Improvements
        </CardTitle>
        <CardDescription>
          AI-detected issues that should be addressed
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full rounded-md" />
            <Skeleton className="h-28 w-full rounded-md" />
          </div>
        ) : getDocumentsWithSuggestions().length > 0 ? (
          <div className="space-y-6">
            {getDocumentsWithSuggestions().map((item, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FileText className="text-gray-400 h-5 w-5" />
                    <div>
                      <h3 className="font-medium">{item.document.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={documentTypeColors[item.document.type] || documentTypeColors.other}>
                          {item.document.type?.replace(/_/g, ' ')}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {format(parseISO(item.document.created_date), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="flex items-center text-sm font-medium text-amber-700 mb-2">
                    <Lightbulb className="h-4 w-4 mr-1 text-amber-500" />
                    Suggested Improvements
                  </h4>
                  <ul className="space-y-2 pl-6 text-sm text-gray-700 list-disc">
                    {item.suggestions.map((suggestion, i) => (
                      <li key={i}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
                <div className="px-4 py-3 bg-gray-50 border-t text-right">
                  <Link to={`${createPageUrl("Documents")}?view=${item.document.id}`}>
                    <Button variant="link" className="h-auto p-0">
                      View Document <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Lightbulb className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">
              No documents need improvements at this time
            </p>
            <p className="text-sm text-gray-400">
              When AI analysis detects potential issues, they'll appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}