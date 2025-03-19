import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Eye, Clock, Check } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900 dark:text-white">Privacy Policy</h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Last updated: November 15, 2023</p>
        
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Introduction</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              At MagicFile.ai, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our file conversion services.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.
            </p>
          </CardContent>
        </Card>
        
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full">
                <Eye className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Information We Collect</h2>
            </div>
            
            <div className="space-y-4 pl-14">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Personal Data</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. This may include:
                </p>
                <ul className="list-disc pl-5 mt-2 text-gray-600 dark:text-gray-300">
                  <li>Email address (for premium subscriptions and notifications)</li>
                  <li>First and last name (for premium subscriptions)</li>
                  <li>Payment information (for premium subscriptions)</li>
                  <li>Usage data and preferences</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">File Data</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  In order to provide our file conversion services, we temporarily process the files you upload. These may include:
                </p>
                <ul className="list-disc pl-5 mt-2 text-gray-600 dark:text-gray-300">
                  <li>Documents (PDF, Word, Excel, etc.)</li>
                  <li>Images (JPG, PNG, SVG, etc.)</li>
                  <li>Audio files (MP3, WAV, etc.)</li>
                  <li>Video files (MP4, AVI, etc.)</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                <Lock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">How We Protect Your Data</h2>
            </div>
            
            <div className="space-y-3 pl-14">
              <p className="text-gray-600 dark:text-gray-300">
                The security of your data is important to us. We implement industry-standard measures to protect your personal information and files:
              </p>
              <ul className="space-y-2 mt-3">
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>All file transfers are secured with HTTPS/TLS encryption</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Files are stored in secure, encrypted cloud storage</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Automatic deletion of files after processing (free tier) or after the storage period (premium tiers)</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Regular security audits and updates</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Data Retention</h2>
            </div>
            
            <div className="pl-14">
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                We follow strict data retention policies to ensure your files are not stored longer than necessary:
              </p>
              <ul className="space-y-3">
                <li className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Free tier:</span> Files are automatically deleted immediately after conversion or within 2 hours, whichever comes first.
                </li>
                <li className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Pro tier:</span> Files are stored for up to 7 days to allow for multiple conversions and downloads.
                </li>
                <li className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Business tier:</span> Files are stored for up to 30 days.
                </li>
                <li className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Enterprise tier:</span> Custom retention policies available.
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-3">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul className="text-gray-600 dark:text-gray-300">
            <li>By email: privacy@magicfile.ai</li>
            <li>By visiting the contact page on our website</li>
          </ul>
        </div>
      </div>
    </div>
  );
}