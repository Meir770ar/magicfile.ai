import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText, AlertTriangle, Shield, Scale, Clock } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900 dark:text-white">Terms of Use</h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Last updated: November 15, 2023</p>
        
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <Scale className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Agreement to Terms</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              These Terms of Use constitute a legally binding agreement made between you and MagicFile.ai concerning your access to and use of our website and file conversion services.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              By accessing our website or using our services, you agree to be bound by these Terms of Use. If you disagree with any part of the terms, you may not access the website or use our services.
            </p>
          </CardContent>
        </Card>
        
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full mt-1">
                <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Services Description</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  MagicFile.ai provides file conversion services for various file formats, including but not limited to documents, images, audio, and video files. Our services include:
                </p>
                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Document conversion (PDF to Word, Word to PDF, etc.)</li>
                  <li>Image conversion (JPG to PNG, PNG to SVG, etc.)</li>
                  <li>Audio conversion (MP3 to WAV, WAV to MP3, etc.)</li>
                  <li>Video conversion (MP4 to AVI, AVI to MP4, etc.)</li>
                  <li>OCR (Optical Character Recognition)</li>
                  <li>File compression</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full mt-1">
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Limitations and Restrictions</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  By using our services, you agree not to:
                </p>
                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Upload, transmit, or distribute content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable</li>
                  <li>Use our services for any illegal purpose or in violation of any local, state, national, or international law</li>
                  <li>Attempt to bypass any measures we use to restrict access to or use of the services</li>
                  <li>Upload files that contain viruses, Trojan horses, worms, or any other similar software that may damage our systems</li>
                  <li>Engage in any activity that interferes with or disrupts the services</li>
                  <li>Harvest, collect, or gather user data without permission</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mt-1">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Intellectual Property</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  The Service and all content, features, and functionality, including but not limited to all information, software, text, graphics, logos, images, and the design, selection, and arrangement thereof, are owned by MagicFile.ai, its licensors, or other providers and are protected by copyright, trademark, and other intellectual property laws.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  You retain all rights to the content you upload to our service. By uploading files to our service, you grant us a limited license to use, process, and store your files solely for the purpose of providing the conversion services to you.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mt-1">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Subscription Terms</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  MagicFile.ai offers both free and premium subscription plans. By purchasing a premium subscription, you agree to the following:
                </p>
                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Subscriptions are billed in advance on a monthly or annual basis</li>
                  <li>Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period</li>
                  <li>You can cancel your subscription at any time through your account settings</li>
                  <li>No refunds will be issued for partial subscription periods</li>
                  <li>We reserve the right to change subscription prices upon notice</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Changes to Terms</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-3">
            We reserve the right to modify these Terms of Use at any time. If we make material changes to the Terms, we will notify you by email or by posting a notice on our website prior to the changes becoming effective.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Your continued use of the Service after any such changes constitutes your acceptance of the new Terms of Use.
          </p>
        </div>
      </div>
    </div>
  );
}