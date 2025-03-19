
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Add missing Input import
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  HelpCircle, 
  Search, 
  FileText, 
  Image as ImageIcon, 
  FileAudio2, 
  FileVideo, 
  Lock, 
  CreditCard, 
  User,
  Mail
} from "lucide-react";

export default function FaqPage() {
  const faqCategories = [
    {
      title: "General",
      icon: HelpCircle,
      questions: [
        {
          question: "What is MagicFile.ai?",
          answer: "MagicFile.ai is a powerful online platform that allows you to convert files between different formats, compress files, perform OCR (Optical Character Recognition), and enhance images using AI technology - all without installing any software."
        },
        {
          question: "Do I need to create an account to use MagicFile.ai?",
          answer: "No, you don't need to create an account to use our basic services. However, creating a free account allows you to access additional features like saved conversion history, higher file size limits, and personalized settings."
        },
        {
          question: "What file size limits apply?",
          answer: "For free users, the maximum file size is 100MB per file. Premium users can upload files up to 2GB (Business plan) or 10GB (Enterprise plan), depending on their subscription tier."
        },
        {
          question: "How long are my files stored on your servers?",
          answer: "For free users, files are automatically deleted after processing or within 2 hours, whichever comes first. Premium users have extended storage periods: Pro (7 days), Business (30 days), and Enterprise (custom retention policies)."
        }
      ]
    },
    {
      title: "Conversion",
      icon: FileText,
      questions: [
        {
          question: "What file formats are supported?",
          answer: "We support a wide range of formats including documents (PDF, DOCX, XLSX, PPT), images (JPG, PNG, WEBP, SVG, GIF), audio files (MP3, WAV, FLAC), and videos (MP4, AVI, MOV). You can see all supported formats on each conversion tool page."
        },
        {
          question: "How good is the conversion quality?",
          answer: "We use advanced conversion algorithms to ensure the highest quality possible. For premium users, we provide enhanced quality options with additional processing to maintain formatting, image quality, and metadata."
        },
        {
          question: "Can I convert multiple files at once?",
          answer: "Yes, batch conversion is available for all premium users. Free users can convert one file at a time."
        },
        {
          question: "My converted file doesn't look right. What can I do?",
          answer: "Some complex files may not convert perfectly. Try our premium conversion options for better results, or contact our support team with details about the issue you're experiencing."
        }
      ]
    },
    {
      title: "Payment & Premium",
      icon: CreditCard,
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and in some regions, Google Pay and Apple Pay."
        },
        {
          question: "Can I cancel my premium subscription anytime?",
          answer: "Yes, you can cancel your subscription at any time from your account settings. Your premium features will remain active until the end of your billing period."
        },
        {
          question: "Do you offer refunds?",
          answer: "We offer a 14-day money-back guarantee if you're not satisfied with our premium services. Please contact our support team to request a refund."
        },
        {
          question: "Is there a discount for annual subscriptions?",
          answer: "Yes, we offer a 17% discount when you choose annual billing compared to monthly billing for the same plan."
        }
      ]
    },
    {
      title: "Security & Privacy",
      icon: Lock,
      questions: [
        {
          question: "Are my files secure during conversion?",
          answer: "Yes, we take security very seriously. All file transfers use secure HTTPS/TLS encryption, and our servers use enterprise-grade security measures to protect your data."
        },
        {
          question: "Do you keep copies of my files?",
          answer: "No, we don't keep permanent copies of your files. Files are automatically deleted after processing (for free users) or after the storage period ends (for premium users)."
        },
        {
          question: "Is my personal information safe?",
          answer: "Yes, we have strict privacy policies in place. We never sell your personal data to third parties and only collect minimal information necessary to provide our services."
        },
        {
          question: "Do you analyze the content of my files?",
          answer: "We only process your files for the purpose of conversion or applying the features you select. We do not analyze content for any other purposes unless you specifically use our AI analysis features."
        }
      ]
    }
  ];

  return (
    <div className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Frequently Asked Questions</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about MagicFile.ai's services, features, and policies.
          </p>
        </div>

        <div className="relative mb-12 max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            className="pl-10 py-6 text-base"
            placeholder="Search for answers..."
            type="text"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {faqCategories.map((category, index) => (
            <Card key={index} className="dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <category.icon className="mr-3 h-5 w-5 text-blue-500" />
                  {category.title} Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`${index}-${faqIndex}`}>
                      <AccordionTrigger className="text-left font-medium">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 dark:text-gray-300">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Still have questions?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            If you couldn't find the answer you were looking for, our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to={createPageUrl("Contact")}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Mail className="mr-2 h-5 w-5" />
                Contact Support
              </Button>
            </Link>
            <Link to={createPageUrl("Guides")}>
              <Button variant="outline">
                <FileText className="mr-2 h-5 w-5" />
                Browse Guides
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
