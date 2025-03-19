import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Shield, CheckSquare, Server, FileDigit, Clock, Users, Database, Fingerprint, ShieldCheck, Zap, Wifi } from "lucide-react";

export default function SecurityPage() {
  const securityFeatures = [
    {
      title: "End-to-End Encryption",
      description: "All files are encrypted during upload, processing, and storage using AES-256 encryption.",
      icon: Lock,
      color: "blue"
    },
    {
      title: "Secure Data Processing",
      description: "Files are processed in isolated, secure environments that are destroyed after each conversion.",
      icon: Server,
      color: "indigo"
    },
    {
      title: "Automatic File Deletion",
      description: "Files are automatically deleted after processing (free tier) or after the storage period expires (premium tiers).",
      icon: Clock,
      color: "purple"
    },
    {
      title: "HTTPS/TLS Encryption",
      description: "All data transfers use secure HTTPS/TLS 1.3 encryption to protect against interception.",
      icon: ShieldCheck,
      color: "green"
    },
    {
      title: "SOC 2 Compliance",
      description: "Our servers and infrastructure adhere to SOC 2 compliance standards for security and privacy.",
      icon: CheckSquare,
      color: "amber"
    },
    {
      title: "Regular Security Audits",
      description: "We conduct regular security audits and penetration testing to identify and address vulnerabilities.",
      icon: Shield,
      color: "red"
    }
  ];

  const additionalMeasures = [
    {
      title: "Authentication & Access Control",
      description: "Robust user authentication and granular access controls protect accounts and permissions.",
      icon: Users
    },
    {
      title: "Secure Infrastructure",
      description: "Our cloud infrastructure includes firewall protection, intrusion detection, and 24/7 monitoring.",
      icon: Database
    },
    {
      title: "Data Isolation",
      description: "All user data is logically isolated to prevent cross-contamination or unauthorized access.",
      icon: FileDigit
    },
    {
      title: "Vulnerability Management",
      description: "Continuous scanning and patching to protect against known vulnerabilities.",
      icon: Fingerprint
    }
  ];

  return (
    <div className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Security & Privacy</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            At MagicFile.ai, we take the security and privacy of your files seriously. 
            Learn about our comprehensive security measures designed to protect your data.
          </p>
        </div>

        {/* Main Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {securityFeatures.map((feature, index) => (
            <Card key={index} className="dark:border-gray-700">
              <CardHeader>
                <div className={`flex items-center mb-2 text-${feature.color}-600 dark:text-${feature.color}-400`}>
                  <div className={`p-2 rounded-full bg-${feature.color}-100 dark:bg-${feature.color}-900/30 mr-3`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-gray-900 dark:text-white">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Process */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">How We Protect Your Files</h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-12 h-12 flex items-center justify-center">
                  <Wifi className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Upload</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Files are transferred via secure HTTPS</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>TLS 1.3 encryption protects data in transit</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>File integrity validation</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-12 h-12 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Processing</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Files processed in isolated containers</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Memory cleared after each conversion</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>No human access to file contents</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-12 h-12 flex items-center justify-center">
                  <Database className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Storage & Deletion</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>AES-256 encrypted storage</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Automatic file deletion</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Secure file shredding practices</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Security Measures */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Additional Security Measures</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {additionalMeasures.map((measure, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <measure.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{measure.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{measure.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance & Certifications */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Compliance & Certifications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <CheckSquare className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">SOC 2 Type II</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Our platform has completed SOC 2 Type II audits, verifying our security controls.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <CheckSquare className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">GDPR Compliant</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                We adhere to all GDPR requirements for European users' data protection.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <CheckSquare className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">CCPA Compliant</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                We meet California Consumer Privacy Act requirements for California residents.
              </p>
            </div>
          </div>
        </div>

        {/* Report Security Issues */}
        <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-6 border border-red-100 dark:border-red-800/20">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 mt-1">
              <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Report Security Vulnerabilities</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We value the work of security researchers. If you discover a security vulnerability in our services, 
                please report it to us immediately at <span className="font-medium">security@magicfile.ai</span>.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                We have a responsible disclosure policy and will work with you to address any valid security concerns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}