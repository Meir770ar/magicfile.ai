import React from 'react';
import { format, parseISO, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, MessageSquare, Users, Clock } from "lucide-react";

export default function ActivityTimeline({ documents, comments, collaborations, isLoading }) {
  const getActivityItems = () => {
    // Handle potentially missing data (if API calls failed)
    const safeComments = comments || [];
    const safeCollaborations = collaborations || [];
    
    // Combine different activity types
    const activities = [];
    
    // Document creations
    documents.forEach(doc => {
      activities.push({
        type: 'document_created',
        date: doc.created_date,
        document: doc,
        id: `doc_${doc.id}`
      });
    });
    
    // Comments
    safeComments.forEach(comment => {
      if (!comment.parent_id) { // Only include top-level comments
        activities.push({
          type: 'comment_added',
          date: comment.created_date,
          comment,
          document: documents.find(d => d.id === comment.document_id),
          id: `comment_${comment.id}`
        });
      }
    });
    
    // Collaborations
    safeCollaborations.forEach(collab => {
      activities.push({
        type: 'collaboration_started',
        date: collab.last_activity,
        collaboration: collab,
        document: documents.find(d => d.id === collab.document_id),
        id: `collab_${collab.id}`
      });
    });
    
    // Sort by most recent first
    return activities
      .filter(a => a.document) // Only include activities with valid document reference
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10); // Limit to most recent 10
  };
  
  const formatRelativeTime = (dateStr) => {
    try {
      const date = parseISO(dateStr);
      
      if (isToday(date)) {
        return `Today, ${format(date, 'h:mm a')}`;
      } else if (isYesterday(date)) {
        return `Yesterday, ${format(date, 'h:mm a')}`;
      } else if (isThisWeek(date)) {
        return format(date, 'EEEE, h:mm a');
      } else if (isThisMonth(date)) {
        return format(date, 'MMMM d');
      } else {
        return format(date, 'MMM d, yyyy');
      }
    } catch (error) {
      // Fallback for invalid dates
      return "Unknown date";
    }
  };
  
  const getActivityIcon = (type) => {
    switch (type) {
      case 'document_created':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'comment_added':
        return <MessageSquare className="h-6 w-6 text-green-500" />;
      case 'collaboration_started':
        return <Users className="h-6 w-6 text-purple-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };
  
  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'document_created':
        return `Added document "${activity.document.title}"`;
      case 'comment_added':
        return `Added comment to "${activity.document.title}"`;
      case 'collaboration_started':
        return `Started collaboration on "${activity.document.title}"`;
      default:
        return `Activity on "${activity.document.title}"`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Calendar className="h-4 w-4 text-gray-400" />
        </div>
        <CardDescription>
          Timeline of document activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-6">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : getActivityItems().length > 0 ? (
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-5 border-l-2 border-gray-100 ml-0.5" />
            <ul className="space-y-8">
              {getActivityItems().map(activity => (
                <li key={activity.id} className="relative pl-11">
                  <div className="absolute left-0 h-11 w-11 rounded-full bg-gray-50 flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="font-medium">{getActivityText(activity)}</p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatRelativeTime(activity.date)}
                      
                      {activity.document && activity.document.type && (
                        <Badge variant="secondary" className="ml-2 capitalize">
                          {activity.document.type.replace(/_/g, ' ')}
                        </Badge>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No recent activity to display
          </div>
        )}
      </CardContent>
    </Card>
  );
}