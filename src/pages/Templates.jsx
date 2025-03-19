
import React, { useState, useEffect } from 'react';
import { Template } from '@/api/entities';
import { User } from '@/api/entities';
import { Document } from '@/api/entities';
import { GenerateImage, UploadFile } from '@/api/integrations';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Search,
  FilePlus,
  FileText,
  ArrowRight,
  Crown,
  Receipt,
  FileType,
  Inbox,
  AlertCircle
} from "lucide-react";
import TemplateForm from "../components/templates/TemplateForm";

const typeIcons = {
  invoice: FileText,
  receipt: Receipt,
  contract: FileType,  
  letter: Inbox,
  other: FileText
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [templatesData, userData] = await Promise.all([
        Template.list(),
        User.me()
      ]);
      setTemplates(templatesData);
      setUser(userData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = currentFilter === "all" || template.type === currentFilter;
    return matchesSearch && matchesFilter;
  });

  const handleTemplateSelect = (template) => {
    if (template.is_premium && user?.subscription_tier === "free") {
      return;
    }
    setSelectedTemplate(template);
  };

  const handleFormSubmit = async (templateId, formData) => {
    try {
      const selectedTemplate = templates.find(t => t.id === templateId);
      
      const { url } = await GenerateImage({
        prompt: `Create a professional ${selectedTemplate.type} document with the following details: 
          ${Object.entries(formData).map(([key, value]) => `${key}: ${value}`).join(', ')}. 
          Make it look like a real scanned document.`
      });

      const file = await fetch(url).then(res => res.blob());
      const fileObj = new File([file], `${selectedTemplate.title.toLowerCase().replace(/\s+/g, '_')}.png`, { type: 'image/png' });
      const { file_url } = await UploadFile({ file: fileObj });

      await Document.create({
        title: formData.title || selectedTemplate.title,
        type: selectedTemplate.type,
        original_file: file_url,
        enhanced_file: file_url,
        status: "completed",
        tags: [selectedTemplate.type, "template-generated"]
      });

      navigate(createPageUrl("Documents"));
    } catch (error) {
      console.error("Error creating document from template:", error);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Document Templates</h1>
          <p className="mt-2 text-gray-600">
            Generate professional documents from pre-designed templates
          </p>
        </div>

        {user?.subscription_tier === "free" && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">Premium Templates Available</h3>
                <p className="text-amber-700 text-sm mt-1">
                  Upgrade to Premium or Business for access to all document templates and unlimited generation.
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

        {selectedTemplate ? (
          <TemplateForm 
            template={selectedTemplate} 
            onSubmit={handleFormSubmit}
            onCancel={() => setSelectedTemplate(null)}
          />
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Tabs defaultValue="all" value={currentFilter} onValueChange={setCurrentFilter}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="invoice">Invoices</TabsTrigger>
                  <TabsTrigger value="receipt">Receipts</TabsTrigger>
                  <TabsTrigger value="contract">Contracts</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="h-64 animate-pulse bg-gray-100" />
                ))
              ) : filteredTemplates.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <FilePlus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No templates found
                  </h3>
                  <p className="text-gray-500">
                    Try changing your search criteria
                  </p>
                </div>
              ) : (
                filteredTemplates.map((template) => {
                  const Icon = typeIcons[template.type] || FileText;
                  return (
                    <Card 
                      key={template.id} 
                      className={`overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
                        template.is_premium && user?.subscription_tier === "free" 
                          ? "opacity-70" 
                          : ""
                      }`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div className="aspect-[4/3] relative bg-gray-50">
                        {template.thumbnail ? (
                          <img 
                            src={template.thumbnail} 
                            alt={template.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Icon className="w-12 h-12 text-gray-300" />
                          </div>
                        )}
                        
                        {template.is_premium && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-amber-100 text-amber-800 border border-amber-200">
                              <Crown className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {template.title}
                          <Badge variant="secondary" className="capitalize">
                            {template.type}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="text-sm text-gray-500">
                        {template.description?.length > 75
                          ? `${template.description.substring(0, 75)}...`
                          : template.description}
                      </CardContent>
                      
                      <CardFooter className="pt-0">
                        <Button 
                          variant="ghost" 
                          className="text-blue-600 p-0 hover:bg-transparent hover:text-blue-700"
                        >
                          Use template
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
