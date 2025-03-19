import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, UserPlus } from "lucide-react";

export default function CollaboratorsList({ 
  collaborators, 
  isOwner, 
  onAddCollaborator,
  onRemoveCollaborator 
}) {
  return (
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
                  onAddCollaborator(email, role);
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
        {collaborators.map((collab) => (
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
                onClick={() => onRemoveCollaborator(collab.email)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}