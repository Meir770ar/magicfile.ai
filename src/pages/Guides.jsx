import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  FileText,
  FileImage,
  FileAudio2,
  FileVideo,
  BookOpen,
  Lightbulb,
  ArrowRight,
  Star,
  Info,
  List,
  Play,
  ArrowUpRight
} from "lucide-react";

export default function GuidesPage() {
  const categories = [
    { id: "all", label: "All Guides" },
    { id: "document", label: "Document", icon: FileText },
    { id: "image", label: "Image", icon: FileImage },
    { id: "audio", label: "Audio", icon: FileAudio2 },
    { id: "video", label: "Video", icon: FileVideo },
  ];

  const guides = [
    {
      id: 1,
      title: "Converting PDF to Word Documents",
      description: "Learn how to convert PDF files to editable Word documents while preserving formatting.",
      category: "document",
      image: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=500&auto=format&fit=crop",
      readTime: "5 min read",
      featured: true,
      popular: true
    },
    {
      id: 2,
      title: "Enhancing Image Quality with AI",
      description: "Discover our AI-powered tools for improving image resolution and clarity.",
      category: "image",
      image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=500&auto=format&fit=crop",
      readTime: "7 min read",
      featured: true
    },
    {
      id: 3,
      title: "Creating High-Quality MP3 Files",
      description: "Best practices for audio conversion to preserve sound quality.",
      category: "audio",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=500&auto=format&fit=crop",
      readTime: "6 min read",
      popular: true
    },
    {
      id: 4,
      title: "Batch Converting Image Files",
      description: "How to efficiently convert multiple images at once between formats.",
      category: "image",
      image: "https://images.unsplash.com/photo-1605106702734-205df224ecce?q=80&w=500&auto=format&fit=crop",
      readTime: "4 min read"
    },
    {
      id: 5,
      title: "Compressing PDF Files Without Losing Quality",
      description: "Advanced techniques for reducing PDF file size while maintaining readability.",
      category: "document",
      image: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?q=80&w=500&auto=format&fit=crop",
      readTime: "8 min read",
      popular: true
    },
    {
      id: 6,
      title: "Converting Videos for Social Media",
      description: "Optimize your videos for different social platforms with the right formats.",
      category: "video",
      image: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?q=80&w=500&auto=format&fit=crop",
      readTime: "10 min read"
    },
    {
      id: 7,
      title: "Using OCR to Extract Text from Images",
      description: "How to accurately convert scanned documents to editable text using OCR.",
      category: "document",
      image: "https://images.unsplash.com/photo-1586380951230-e6703d9f6833?q=80&w=500&auto=format&fit=crop",
      readTime: "6 min read",
      featured: true
    },
    {
      id: 8,
      title: "Editing Audio Files Before Conversion",
      description: "Tips for trimming and enhancing audio before converting to your target format.",
      category: "audio",
      image: "https://images.unsplash.com/photo-1576224230582-9718d6d57d58?q=80&w=500&auto=format&fit=crop",
      readTime: "7 min read"
    }
  ];

  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Guides & Tutorials</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our comprehensive guides to get the most out of MagicFile.ai's conversion tools.
          </p>
        </div>

        {/* Featured Guides */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-900 dark:text-white">
            <Star className="mr-2 h-5 w-5 text-amber-500" />
            Featured Guides
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guides
              .filter(guide => guide.featured)
              .map(guide => (
                <Card key={guide.id} className="overflow-hidden group dark:border-gray-700">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={guide.image}
                      alt={guide.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {categories.find(c => c.id === guide.category)?.label}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {guide.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {guide.description}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center pt-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {guide.readTime}
                    </span>
                    <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">
                      Read Guide
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>

        {/* All Guides with Tabs */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center text-gray-900 dark:text-white">
              <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
              Browse All Guides
            </h2>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6 flex flex-wrap">
              {categories.map(category => (
                <TabsTrigger key={category.id} value={category.id} className="px-4 py-2">
                  {category.icon && <category.icon className="mr-2 h-4 w-4" />}
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* All Guides Tab */}
            <TabsContent value="all" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map(guide => (
                  <Card key={guide.id} className="flex flex-col h-full dark:border-gray-700">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {categories.find(c => c.id === guide.category)?.label}
                        </Badge>
                        {guide.popular && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {guide.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {guide.description}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center pt-0 mt-auto">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {guide.readTime}
                      </span>
                      <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">
                        Read Guide
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Category Tabs */}
            {categories.filter(cat => cat.id !== "all").map(category => (
              <TabsContent key={category.id} value={category.id} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {guides
                    .filter(guide => guide.category === category.id)
                    .map(guide => (
                      <Card key={guide.id} className="flex flex-col h-full dark:border-gray-700">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start mb-2">
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {categories.find(c => c.id === guide.category)?.label}
                            </Badge>
                            {guide.popular && (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                                Popular
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {guide.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            {guide.description}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center pt-0 mt-auto">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {guide.readTime}
                          </span>
                          <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">
                            Read Guide
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Video Tutorials */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-900 dark:text-white">
            <Play className="mr-2 h-5 w-5 text-red-500" />
            Video Tutorials
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="dark:border-gray-700">
              <div className="relative h-64 bg-gray-100 dark:bg-gray-800 rounded-t-lg flex items-center justify-center">
                <Play className="h-16 w-16 text-blue-500 opacity-80" />
                <div className="absolute inset-0 bg-black/10 rounded-t-lg"></div>
              </div>
              <CardHeader>
                <CardTitle>Getting Started with MagicFile.ai</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  A comprehensive guide to using all the features of MagicFile.ai for beginners.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Watch Tutorial
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="dark:border-gray-700">
              <div className="relative h-64 bg-gray-100 dark:bg-gray-800 rounded-t-lg flex items-center justify-center">
                <Play className="h-16 w-16 text-blue-500 opacity-80" />
                <div className="absolute inset-0 bg-black/10 rounded-t-lg"></div>
              </div>
              <CardHeader>
                <CardTitle>Advanced PDF Editing Techniques</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Learn how to use our advanced PDF tools for complex document manipulation.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Watch Tutorial
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}