import React from 'react';
import PricingDisplay from '../components/premium/PricingDisplay';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Zap,
  FileText,
  Brain,
  Image as ImageIcon,
  FileAudio2,
  FileVideo,
  CloudUpload,
  Clock,
  ShieldCheck,
  Users,
  Crown
} from "lucide-react";

export default function PremiumPage() {
  const premiumFeatures = [
    {
      title: "Document Conversion",
      icon: FileText,
      color: "blue",
      features: [
        "Convert PDF to editable Word, Excel, PPT formats",
        "OCR technology for scanned documents",
        "Preserve original layout and formatting",
        "Password protection and encryption options"
      ]
    },
    {
      title: "AI Document Analysis",
      icon: Brain,
      color: "purple",
      features: [
        "Smart document summarization",
        "Extract key data and insights",
        "Question answering from document content",
        "Sentiment analysis and content recommendations"
      ]
    },
    {
      title: "Image Processing",
      icon: ImageIcon,
      color: "emerald",
      features: [
        "Convert between over 20 image formats",
        "Batch processing for multiple images",
        "AI-powered image enhancement",
        "Background removal and smart resize"
      ]
    },
    {
      title: "Media Conversion",
      icon: FileVideo,
      color: "rose",
      features: [
        "High-quality audio and video conversion",
        "Extract audio from video files",
        "Compress media files without quality loss",
        "Custom encoding and resolution options"
      ]
    }
  ];
  
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechGrowth",
      text: "MagicFile.ai has transformed how we handle document processing. The AI analysis feature saves us hours of work every week.",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
    },
    {
      name: "David Chen",
      role: "Product Manager",
      company: "InnovateCorp",
      text: "The batch processing and OCR capabilities are outstanding. It's become an essential tool for our team's workflow.",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop"
    },
    {
      name: "Maria Garcia",
      role: "Digital Content Creator",
      company: "CreativeStudio",
      text: "Amazing image and video conversion tools. The quality is exceptional, and the process is incredibly fast.",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    }
  ];
  
  const stats = [
    {
      label: "Active Users",
      value: "100K+",
      icon: Users,
      color: "blue"
    },
    {
      label: "Files Processed",
      value: "5M+",
      icon: FileText,
      color: "green"
    },
    {
      label: "Conversion Types",
      value: "50+",
      icon: Zap,
      color: "amber"
    },
    {
      label: "Customer Rating",
      value: "4.9/5",
      icon: CheckCircle,
      color: "purple"
    }
  ];
  
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Upgrade to Premium
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get access to advanced features, higher limits, and priority processing
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-4 mt-6"
          >
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
              <CloudUpload className="mr-1 h-4 w-4" />
              Larger File Sizes
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              <Zap className="mr-1 h-4 w-4" />
              Priority Processing
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
              <Brain className="mr-1 h-4 w-4" />
              AI Features
            </Badge>
          </motion.div>
        </div>
        
        {/* Pricing Plans */}
        <div className="mb-16">
          <PricingDisplay />
        </div>
        
        {/* Premium Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
            Premium Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {premiumFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className={`bg-${feature.color}-100 dark:bg-${feature.color}-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4`}>
                      <feature.icon className={`h-6 w-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <ul className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Stats */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-${stat.color}-50 dark:bg-${stat.color}-900/20 rounded-xl p-6 text-center`}
              >
                <div className={`bg-${stat.color}-100 dark:bg-${stat.color}-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <div className={`text-3xl font-bold mb-2 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
            What Our Users Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={testimonial.photo}
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full mr-4"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.role} at {testimonial.company}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 italic">
                      "{testimonial.text}"
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="billing">Billing</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        What's included in the premium plans?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Premium plans include higher file size limits, priority processing, advanced AI features, 
                        batch processing capabilities, and extended file retention periods. Each tier offers 
                        progressively more features and higher limits.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        Can I upgrade or downgrade my plan?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at 
                        the start of your next billing cycle. Upgrades give you immediate access to new features.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        What happens to my files after conversion?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        File retention periods vary by plan. Free users' files are deleted after 24 hours, 
                        while premium users enjoy extended retention periods of 7-30 days depending on their plan.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="billing">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        How does billing work?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        We offer both monthly and annual billing options. Annual plans come with a significant 
                        discount. You can pay using all major credit cards, PayPal, and in some regions, 
                        Google Pay and Apple Pay.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        Is there a refund policy?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Yes, we offer a 14-day money-back guarantee if you're not satisfied with our premium 
                        services. Contact our support team to request a refund within this period.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        Can I try premium features before subscribing?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        While we don't offer a free trial, our free plan allows you to test basic functionality. 
                        Combined with our money-back guarantee, you can safely try our premium features.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}