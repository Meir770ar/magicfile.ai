import React from 'react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Image as ImageIcon,
  Clock,
  ChevronRight,
  ArrowRight,
  Search,
  BookOpen,
  FileUp,
  FileDown
} from "lucide-react";

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "How to Convert PDF to Word While Preserving Formatting",
      description: "Learn the best techniques for perfect PDF to Word conversion without losing layouts, fonts, or images.",
      category: "PDF Conversion",
      icon: FileText,
      color: "blue",
      readTime: "5 min read",
      date: "Jan 15, 2023",
      slug: "convert-pdf-to-word-preserve-formatting"
    },
    {
      id: 2,
      title: "Ultimate Guide to Image Compression for Web",
      description: "Optimize your website's performance by learning how to effectively compress images without quality loss.",
      category: "Image Optimization",
      icon: ImageIcon,
      color: "emerald",
      readTime: "8 min read",
      date: "Feb 2, 2023",
      slug: "image-compression-web-guide"
    },
    {
      id: 3,
      title: "Converting Audio Files: Formats, Quality, and Best Practices",
      description: "Everything you need to know about audio file formats and how to convert between them while maintaining quality.",
      category: "Audio Conversion",
      icon: FileUp,
      color: "amber",
      readTime: "7 min read",
      date: "Mar 10, 2023",
      slug: "audio-conversion-best-practices"
    },
    {
      id: 4,
      title: "OCR Technology: Extract Text from Images and PDFs",
      description: "Understand how Optical Character Recognition works and how to get the best results when extracting text.",
      category: "OCR",
      icon: FileText,
      color: "indigo",
      readTime: "6 min read",
      date: "Apr 5, 2023",
      slug: "ocr-technology-explained"
    },
    {
      id: 5,
      title: "Best File Formats for Video: When to Use MP4, MOV, or WebM",
      description: "A comprehensive comparison of video formats to help you choose the right one for your specific needs.",
      category: "Video Formats",
      icon: FileDown,
      color: "rose",
      readTime: "9 min read",
      date: "May 18, 2023",
      slug: "video-format-comparison"
    },
    {
      id: 6,
      title: "How to Reduce PDF File Size Without Losing Quality",
      description: "Learn effective techniques to compress PDFs while maintaining document integrity and readability.",
      category: "File Compression",
      icon: FileDown,
      color: "purple",
      readTime: "4 min read",
      date: "Jun 22, 2023",
      slug: "compress-pdf-preserve-quality"
    }
  ];

  const categories = [
    { name: "All Guides", slug: "all" },
    { name: "PDF Conversion", slug: "pdf-conversion" },
    { name: "Image Optimization", slug: "image-optimization" },
    { name: "Audio Conversion", slug: "audio-conversion" },
    { name: "Video Formats", slug: "video-formats" },
    { name: "File Compression", slug: "file-compression" },
    { name: "OCR", slug: "ocr" }
  ];

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            File Conversion Guides & Resources
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Expert tips, tutorials and insights to help you get the most out of your file conversions
          </p>
        </div>

        {/* Search and Categories */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-auto flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search guides..."
                className="pl-10 pr-4 py-2 rounded-full w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex overflow-x-auto pb-2 w-full md:w-auto gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.slug}
                  variant={category.slug === "all" ? "default" : "outline"}
                  className={`
                    cursor-pointer py-1.5 px-3 whitespace-nowrap
                    ${category.slug === "all" 
                      ? "bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" 
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"}
                  `}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {blogPosts.map((post) => (
            <Card key={post.id} className="h-full hover:shadow-md transition-all overflow-hidden flex flex-col dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className={`p-2 rounded-full bg-${post.color}-100 text-${post.color}-600 dark:bg-${post.color}-900/20 dark:text-${post.color}-400`}>
                    <post.icon className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {post.category}
                  </Badge>
                </div>
                <CardTitle className="mt-3 text-xl">
                  <Link to={createPageUrl("FileConversionGuide")} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-xs mt-2">
                  <Clock className="h-3 w-3" />
                  {post.readTime} • {post.date}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4 flex-1">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {post.description}
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Link to={createPageUrl("FileConversionGuide")} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 text-sm font-medium flex items-center">
                  Read more
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="md:flex-1">
                <BookOpen className="h-10 w-10 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Subscribe to our newsletter</h3>
                <p className="text-blue-100 mb-4">
                  Get the latest conversion tips, tutorials and resources delivered directly to your inbox.
                </p>
              </div>
              <div className="w-full md:w-auto md:flex-1">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 rounded-md px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                  />
                  <Button className="bg-white text-blue-600 hover:bg-blue-50">
                    Subscribe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-blue-100 mt-2">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}