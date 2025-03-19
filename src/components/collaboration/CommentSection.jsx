import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Plus, X, Check, CornerUpLeft } from "lucide-react";

export default function CommentSection({ 
  comments, 
  selectedComment, 
  setSelectedComment,
  replyText,
  setReplyText,
  onAddReply,
  onResolveComment,
}) {
  return (
    <div className="h-full relative">
      {selectedComment ? (
        <div className="p-4 bg-white rounded-lg border h-full flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium">{selectedComment.created_by || 'Anonymous'}</h3>
              <p className="text-sm text-gray-500">
                {new Date(selectedComment.created_date).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onResolveComment(selectedComment.id)}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedComment(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            {selectedComment.content}
          </div>
          
          <h4 className="font-medium text-sm mb-2">Replies</h4>
          
          <ScrollArea className="flex-1 mb-4">
            {comments
              .filter(c => c.parent_id === selectedComment.id)
              .map(reply => (
                <div 
                  key={reply.id} 
                  className="mb-3 p-3 border-l-2 border-gray-200"
                >
                  <div className="flex justify-between">
                    <h5 className="text-sm font-medium">
                      {reply.created_by || 'Anonymous'}
                    </h5>
                    <span className="text-xs text-gray-500">
                      {new Date(reply.created_date).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1">{reply.content}</p>
                </div>
              ))}
          </ScrollArea>
          
          <div className="flex gap-2">
            <Input
              placeholder="Add a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <Button 
              onClick={() => onAddReply(selectedComment.id)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <CornerUpLeft className="h-4 w-4 mr-1" />
              Reply
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-4 text-center h-full flex flex-col items-center justify-center">
          <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Comment Selected</h3>
          <p className="text-gray-500 mb-6">
            Select a comment from the document or add a new one
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add Comment
          </Button>
        </div>
      )}
    </div>
  );
}