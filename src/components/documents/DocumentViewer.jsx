
import React, { useState, useEffect } from 'react';
import { Document } from '@/api/entities';
import { DocumentAnalysis } from '@/api/entities';
import { Collaboration } from '@/api/entities';
import { Comment } from '@/api/entities';
import { Version } from '@/api/entities';
import { User } from '@/api/entities';
import { InvokeLLM } from '@/api/integrations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  Download,
  X,
  Users,
  MessageSquare,
  History,
  Edit,
  Check,
  Plus,
  Send,
  CornerUpLeft,
  UserPlus,
  Trash2,
  Sparkles,
  Tag,
  Calendar,
  Hash,
  Bookmark,
  Languages,
  AlertTriangle,
  Lightbulb,
  DollarSign,
  Building,
  User as UserIcon,
  Smile as SmileIcon,
  Frown,
  Meh
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import CollaboratorsList from "../collaboration/CollaboratorsList";
import CommentSection from "../collaboration/CommentSection";
import VersionHistory from "../collaboration/VersionHistory";

export default function DocumentViewer({ document, onClose }) {
  const [activeTab, setActiveTab] = useState("document");
  const [isEditing, setIsEditing] = useState(false);
  const [comments, setComments] = useState([]);
  const [versions, setVersions] = useState([]);
  const [collaboration, setCollaboration] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dragPosition, setDragPosition] = useState({ x: null, y: null });
  const [newCommentText, setNewCommentText] = useState("");
  const [selectedComment, setSelectedComment] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    loadData();
  }, [document]);

  const loadData = async () => {
    try {
      setLoading(true);
      const currentUser = await User.me();
      setUser(currentUser);

      const [commentsData, versionsData, collaborationData, analysisData] = await Promise.all([
        Comment.filter({ document_id: document.id }),
        Version.filter({ document_id: document.id }, "-version_number"),
        Collaboration.filter({ document_id: document.id }),
        DocumentAnalysis.filter({ document_id: document.id })
      ]);

      setComments(commentsData);
      setVersions(versionsData);
      setAnalysis(analysisData.length > 0 ? analysisData[0] : null);
      
      if (collaborationData.length > 0) {
        setCollaboration(collaborationData[0]);
        
        const isUserOwner = collaborationData[0].collaborators.some(
          c => c.email === currentUser.email && c.role === "owner"
        );
        setIsOwner(isUserOwner || document.created_by === currentUser.email);
      } else {
        if (document.created_by === currentUser.email) {
          const newCollaboration = await Collaboration.create({
            document_id: document.id,
            collaborators: [{
              email: currentUser.email,
              role: "owner",
              added_date: new Date().toISOString()
            }],
            status: "active",
            last_activity: new Date().toISOString()
          });
          setCollaboration(newCollaboration);
          setIsOwner(true);
        }
      }
    } catch (error) {
      console.error("Error loading document data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (e) => {
    if (activeTab === "comments" && !isEditing) {
      const rect = e.target.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      setDragPosition({ x, y });
      setIsEditing(true);
    }
  };

  const handleAddComment = async () => {
    if (!newCommentText.trim() || dragPosition.x === null) return;
    
    try {
      const newComment = await Comment.create({
        document_id: document.id,
        content: newCommentText,
        position_x: dragPosition.x,
        position_y: dragPosition.y,
        resolved: false
      });
      
      setComments([...comments, newComment]);
      setNewCommentText("");
      setDragPosition({ x: null, y: null });
      setIsEditing(false);

      if (collaboration) {
        await Collaboration.update(collaboration.id, {
          last_activity: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleAddReply = async (parentId) => {
    if (!replyText.trim()) return;
    
    try {
      const parentComment = comments.find(c => c.id === parentId);
      
      const newReply = await Comment.create({
        document_id: document.id,
        content: replyText,
        position_x: parentComment.position_x,
        position_y: parentComment.position_y,
        parent_id: parentId,
        resolved: false
      });
      
      setComments([...comments, newReply]);
      setReplyText("");
      setSelectedComment(null);

      if (collaboration) {
        await Collaboration.update(collaboration.id, {
          last_activity: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const toggleResolveComment = async (commentId) => {
    try {
      const comment = comments.find(c => c.id === commentId);
      await Comment.update(commentId, { resolved: !comment.resolved });
      
      setComments(comments.map(c => 
        c.id === commentId ? { ...c, resolved: !c.resolved } : c
      ));

      if (collaboration) {
        await Collaboration.update(collaboration.id, {
          last_activity: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error toggling comment resolution:", error);
    }
  };

  const addCollaborator = async (email, role) => {
    if (!collaboration) return;
    
    try {
      const existingCollaborator = collaboration.collaborators.find(c => c.email === email);
      
      if (existingCollaborator) {
        const updatedCollaborators = collaboration.collaborators.map(c => 
          c.email === email ? { ...c, role } : c
        );
        
        await Collaboration.update(collaboration.id, {
          collaborators: updatedCollaborators,
          last_activity: new Date().toISOString()
        });
      } else {
        const updatedCollaborators = [
          ...collaboration.collaborators,
          {
            email,
            role,
            added_date: new Date().toISOString()
          }
        ];
        
        await Collaboration.update(collaboration.id, {
          collaborators: updatedCollaborators,
          last_activity: new Date().toISOString()
        });
      }
      
      loadData();
    } catch (error) {
      console.error("Error adding collaborator:", error);
    }
  };

  const removeCollaborator = async (email) => {
    if (!collaboration || !isOwner) return;
    
    try {
      const isCollaboratorOwner = collaboration.collaborators.find(
        c => c.email === email && c.role === "owner"
      );
      
      if (isCollaboratorOwner) return;
      
      const updatedCollaborators = collaboration.collaborators.filter(c => c.email !== email);
      
      await Collaboration.update(collaboration.id, {
        collaborators: updatedCollaborators,
        last_activity: new Date().toISOString()
      });
      
      loadData();
    } catch (error) {
      console.error("Error removing collaborator:", error);
    }
  };

  const runAIAnalysis = async () => {
    if (!document.extracted_text && !document.original_file) return;
    
    setIsAnalysisLoading(true);
    
    try {
      const initialAnalysis = await DocumentAnalysis.create({
        document_id: document.id,
        status: "processing"
      });
      
      const prompt = `
      Analyze the following document content:
      ${document.extracted_text}
      
      Please provide a comprehensive analysis with the following:
      1. A brief summary (3-5 sentences)
      2. Key terms/phrases (up to 10)
      3. Entities: Extract dates, monetary amounts, people's names, and organizations
      4. Overall sentiment (positive, neutral, or negative)
      5. Suggested tags for categorization (up to 5)
      6. Detected language
      7. Suggestions for document improvements if applicable (up to 3)
      `;
      
      const analysisResult = await InvokeLLM({
        prompt: prompt,
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
      });
      
      const updatedAnalysis = await DocumentAnalysis.update(initialAnalysis.id, {
        ...analysisResult,
        status: "completed"
      });
      
      setAnalysis(updatedAnalysis);
      
      if (analysisResult.suggested_tags && analysisResult.suggested_tags.length > 0) {
        await Document.update(document.id, {
          tags: analysisResult.suggested_tags
        });
      }
    } catch (error) {
      console.error("AI analysis failed:", error);
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span>{document.title}</span>
              <Badge variant="secondary" className="capitalize">
                {document.type}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {collaboration && collaboration.collaborators && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setActiveTab("collaborate")}
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Collaborators ({collaboration.collaborators.length})</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(document.original_file, '_blank')}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="mx-auto mb-4">
            <TabsTrigger value="document">Document</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="comments">
              Comments ({comments.filter(c => !c.parent_id).length})
            </TabsTrigger>
            <TabsTrigger value="history">
              History ({versions.length})
            </TabsTrigger>
            <TabsTrigger value="collaborate">
              Collaborate
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden flex flex-col">
            <TabsContent value="document" className="flex-1 relative m-0">
              <div className="absolute inset-0 rounded-lg overflow-hidden bg-gray-100 border">
                <img
                  src={document.enhanced_file || document.original_file}
                  alt={document.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </TabsContent>

            {/* AI Analysis Tab */}
            <TabsContent value="analysis" className="m-0 overflow-auto">
              <div className="space-y-6 p-2">
                {!analysis && !isAnalysisLoading ? (
                  <div className="text-center py-8">
                    <Sparkles className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No AI Analysis Available</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Run AI analysis to automatically extract key information, generate a summary,
                      identify important entities, and get document improvement suggestions.
                    </p>
                    <Button 
                      onClick={runAIAnalysis}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Analyze Document
                    </Button>
                  </div>
                ) : isAnalysisLoading ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Document Analysis</h3>
                      <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Summary</h4>
                        <Skeleton className="h-20 w-full rounded-md" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Key Terms</h4>
                        <div className="flex flex-wrap gap-2">
                          {Array(5).fill(0).map((_, i) => (
                            <Skeleton key={i} className="h-8 w-20 rounded-full" />
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Entities</h4>
                        <Skeleton className="h-32 w-full rounded-md" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Suggested Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {Array(3).fill(0).map((_, i) => (
                            <Skeleton key={i} className="h-8 w-16 rounded-full" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Document Analysis</h3>
                      <Badge className={`${analysis.status === "completed" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                        {analysis.status === "completed" ? "Completed" : "Processing"}
                      </Badge>
                    </div>
                    
                    {analysis.summary && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <h4 className="flex items-center text-sm font-medium text-blue-700 mb-2">
                          <Sparkles className="h-4 w-4 mr-1 text-blue-500" />
                          Summary
                        </h4>
                        <p className="text-blue-800">{analysis.summary}</p>
                      </div>
                    )}
                    
                    {/* Key Terms */}
                    {analysis.key_terms && analysis.key_terms.length > 0 && (
                      <div>
                        <h4 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <Hash className="h-4 w-4 mr-1 text-gray-500" />
                          Key Terms
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.key_terms.map((term, index) => (
                            <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800">
                              {term}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Entities */}
                    {analysis.entities && (
                      <div>
                        <h4 className="flex items-center text-sm font-medium text-gray-700 mb-3">
                          <Bookmark className="h-4 w-4 mr-1 text-gray-500" />
                          Entities
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {analysis.entities.dates && analysis.entities.dates.length > 0 && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <h5 className="flex items-center text-xs font-medium text-gray-500 mb-2">
                                <Calendar className="h-3 w-3 mr-1" />
                                Dates
                              </h5>
                              <div className="space-y-1">
                                {analysis.entities.dates.map((date, index) => (
                                  <div key={index} className="text-sm">{date}</div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {analysis.entities.amounts && analysis.entities.amounts.length > 0 && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <h5 className="flex items-center text-xs font-medium text-gray-500 mb-2">
                                <DollarSign className="h-3 w-3 mr-1" />
                                Amounts
                              </h5>
                              <div className="space-y-1">
                                {analysis.entities.amounts.map((amount, index) => (
                                  <div key={index} className="text-sm">{amount}</div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {analysis.entities.names && analysis.entities.names.length > 0 && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <h5 className="flex items-center text-xs font-medium text-gray-500 mb-2">
                                <UserIcon className="h-3 w-3 mr-1" />
                                People
                              </h5>
                              <div className="space-y-1">
                                {analysis.entities.names.map((name, index) => (
                                  <div key={index} className="text-sm">{name}</div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {analysis.entities.organizations && analysis.entities.organizations.length > 0 && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <h5 className="flex items-center text-xs font-medium text-gray-500 mb-2">
                                <Building className="h-3 w-3 mr-1" />
                                Organizations
                              </h5>
                              <div className="space-y-1">
                                {analysis.entities.organizations.map((org, index) => (
                                  <div key={index} className="text-sm">{org}</div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Sentiment */}
                    {analysis.sentiment && (
                      <div>
                        <h4 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <SentimentIcon sentiment={analysis.sentiment} />
                          Sentiment
                        </h4>
                        <Badge className={getSentimentBadgeClass(analysis.sentiment)}>
                          {analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)}
                        </Badge>
                      </div>
                    )}
                    
                    {/* Suggested Tags */}
                    {analysis.suggested_tags && analysis.suggested_tags.length > 0 && (
                      <div>
                        <h4 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <Tag className="h-4 w-4 mr-1 text-gray-500" />
                          Suggested Tags
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.suggested_tags.map((tag, index) => (
                            <Badge key={index} className="bg-purple-100 text-purple-800">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Language */}
                    {analysis.language && (
                      <div>
                        <h4 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <Languages className="h-4 w-4 mr-1 text-gray-500" />
                          Detected Language
                        </h4>
                        <p>{analysis.language}</p>
                      </div>
                    )}
                    
                    {/* Improvement Suggestions */}
                    {analysis.improvement_suggestions && analysis.improvement_suggestions.length > 0 && (
                      <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                        <h4 className="flex items-center text-sm font-medium text-amber-700 mb-2">
                          <Lightbulb className="h-4 w-4 mr-1 text-amber-500" />
                          Improvement Suggestions
                        </h4>
                        <ul className="space-y-2 text-amber-800">
                          {analysis.improvement_suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-amber-500 mt-0.5">•</span>
                              <p>{suggestion}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="comments" className="flex-1 relative m-0">
              <div className="absolute inset-0 rounded-lg overflow-hidden bg-gray-100 border">
                <div className="relative w-full h-full">
                  <img
                    src={document.enhanced_file || document.original_file}
                    alt={document.title}
                    className="w-full h-full object-contain"
                    onClick={handleImageClick}
                  />
                  
                  {/* Comment Markers */}
                  {comments
                    .filter(comment => !comment.parent_id && !comment.resolved)
                    .map(comment => (
                      <div 
                        key={comment.id}
                        className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                        style={{ 
                          left: `${comment.position_x}%`, 
                          top: `${comment.position_y}%`
                        }}
                        onClick={() => setSelectedComment(comment)}
                      >
                        <div className="w-full h-full bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                          {comments.filter(c => c.parent_id === comment.id).length + 1}
                        </div>
                      </div>
                    ))}
                  
                  {/* New Comment Input */}
                  {isEditing && dragPosition.x !== null && (
                    <div 
                      className="absolute w-72 bg-white shadow-lg rounded-lg p-3 z-10"
                      style={{ 
                        left: `${dragPosition.x}%`, 
                        top: `${dragPosition.y}%`,
                        transform: 'translate(-50%, -100%)',
                        marginTop: '-10px'
                      }}
                    >
                      <div className="flex items-start space-x-2">
                        <div className="flex-1">
                          <Input
                            placeholder="Add a comment..."
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            autoFocus
                          />
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={handleAddComment}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => {
                            setIsEditing(false);
                            setDragPosition({ x: null, y: null });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Click Post to add your comment
                      </div>
                    </div>
                  )}

                  {/* Selected Comment Thread */}
                  {selectedComment && (
                    <div 
                      className="absolute w-80 bg-white shadow-lg rounded-lg p-3 z-10"
                      style={{ 
                        left: `${selectedComment.position_x}%`, 
                        top: `${selectedComment.position_y}%`,
                        transform: 'translate(-50%, -100%)',
                        marginTop: '-10px'
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-sm">
                          {selectedComment.created_by || 'Anonymous'}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => toggleResolveComment(selectedComment.id)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => setSelectedComment(null)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mb-3 text-sm">
                        {selectedComment.content}
                      </div>
                      
                      <ScrollArea className="max-h-32 mb-3">
                        {comments
                          .filter(c => c.parent_id === selectedComment.id)
                          .map(reply => (
                            <div key={reply.id} className="mb-2 pl-3 border-l-2 border-gray-200">
                              <div className="text-xs font-medium">{reply.created_by || 'Anonymous'}</div>
                              <div className="text-sm">{reply.content}</div>
                            </div>
                          ))}
                      </ScrollArea>
                      
                      <div className="flex gap-2">
                        <Input
                          placeholder="Reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          size="sm"
                          className="text-sm"
                        />
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleAddReply(selectedComment.id)}
                        >
                          <CornerUpLeft className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {!isEditing && (
                <Button
                  className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsEditing(true)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Comment
                </Button>
              )}
            </TabsContent>

            <TabsContent value="history" className="m-0 space-y-4">
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-medium mb-4">Version History</h3>
                
                {versions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No previous versions available
                  </div>
                ) : (
                  <div className="space-y-3">
                    {versions.map((version) => (
                      <div 
                        key={version.id} 
                        className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-medium">
                            v{version.version_number}
                          </div>
                          <div>
                            <div className="font-medium">{version.created_by_email}</div>
                            <div className="text-sm text-gray-500">
                              {format(new Date(version.created_date), "PPP 'at' p")}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(version.file_url, '_blank')}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="collaborate" className="m-0 space-y-4">
              {collaboration && (
                <div className="bg-white rounded-lg border p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Collaborators</h3>
                    {isOwner && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const email = prompt("Enter collaborator email:");
                          if (email) {
                            const role = prompt("Enter role (viewer, editor):", "viewer");
                            if (role === "viewer" || role === "editor") {
                              addCollaborator(email, role);
                            }
                          }
                        }}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {collaboration.collaborators.map((collab) => (
                      <div 
                        key={collab.email} 
                        className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            {collab.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div>{collab.email}</div>
                            <div className="text-sm capitalize text-gray-500">
                              {collab.role}
                            </div>
                          </div>
                        </div>
                        
                        {isOwner && collab.role !== "owner" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCollaborator(collab.email)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-medium mb-4">Activity</h3>
                
                <div className="space-y-2 text-sm text-gray-500">
                  {/* Show recent activity */}
                  <div className="flex gap-2">
                    <History className="h-4 w-4 text-blue-500" />
                    <span>Last modified: {format(new Date(document.updated_date), "PPP 'at' p")}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <MessageSquare className="h-4 w-4 text-green-500" />
                    <span>Comments: {comments.length}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span>Collaborators: {collaboration?.collaborators?.length || 1}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Helper components
const SentimentIcon = ({ sentiment }) => {
  if (sentiment === "positive") {
    return <SmileIcon className="h-4 w-4 mr-1 text-green-500" />;
  } else if (sentiment === "negative") {
    return <Frown className="h-4 w-4 mr-1 text-red-500" />;
  } else {
    return <Meh className="h-4 w-4 mr-1 text-gray-500" />;
  }
};

const getSentimentBadgeClass = (sentiment) => {
  if (sentiment === "positive") {
    return "bg-green-100 text-green-800";
  } else if (sentiment === "negative") {
    return "bg-red-100 text-red-800";
  } else {
    return "bg-gray-100 text-gray-800";
  }
};
