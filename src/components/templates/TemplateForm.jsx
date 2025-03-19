import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function TemplateForm({ template, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(() => {
    // Initialize with default values from template fields
    const initialData = { title: template.title };
    template.fields?.forEach(field => {
      initialData[field.name] = field.default || '';
    });
    return initialData;
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(template.id, formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    
    setIsSubmitting(false);
  };
  
  const requiredFieldsMissing = template.fields?.some(
    field => field.required && !formData[field.name]
  );
  
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="border-b bg-gray-50">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>{template.title}</CardTitle>
        </div>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            <div>
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter document title"
                required
              />
            </div>
            
            {template.fields?.map((field) => (
              <div key={field.name}>
                <Label htmlFor={field.name}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                
                {field.type === 'text' && (
                  <Input
                    id={field.name}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    required={field.required}
                  />
                )}
                
                {field.type === 'number' && (
                  <Input
                    id={field.name}
                    type="number"
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    required={field.required}
                  />
                )}
                
                {field.type === 'date' && (
                  <Input
                    id={field.name}
                    type="date"
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    required={field.required}
                  />
                )}
                
                {field.type === 'select' && (
                  <Select
                    value={formData[field.name] || ''}
                    onValueChange={(value) => handleChange(field.name, value)}
                    required={field.required}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {field.type === 'checkbox' && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                      id={field.name}
                      checked={Boolean(formData[field.name])}
                      onCheckedChange={(checked) => 
                        handleChange(field.name, checked)
                      }
                    />
                    <label
                      htmlFor={field.name}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {field.label}
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="border-t bg-gray-50 justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting || requiredFieldsMissing}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                Generating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Generate Document
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}