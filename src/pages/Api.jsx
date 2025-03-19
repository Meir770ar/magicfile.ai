import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Code, CheckCircle, ExternalLink, Terminal, FileText, FileImage, FileAudio2, FileVideo, Settings, Key, Lock, Globe, Laptop, Webhook, Users, Database } from "lucide-react";
import { motion } from "framer-motion";

export default function ApiPage() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const codeExamples = [
    {
      language: "curl",
      label: "cURL",
      icon: Terminal,
      code: `curl -X POST 'https://api.magicfile.ai/v1/convert' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -F 'file=@document.pdf' \\
  -F 'output_format=docx' \\
  -F 'options={ "quality": "high", "maintain_structure": true }'`
    },
    {
      language: "javascript",
      label: "JavaScript",
      icon: Code,
      code: `const form = new FormData();
form.append('file', fileInput.files[0]);
form.append('output_format', 'docx');
form.append('options', JSON.stringify({ 
  quality: 'high', 
  maintain_structure: true 
}));

fetch('https://api.magicfile.ai/v1/convert', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: form
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`
    },
    {
      language: "python",
      label: "Python",
      icon: Code,
      code: `import requests
import json

url = 'https://api.magicfile.ai/v1/convert'
headers = {
    'Authorization': 'Bearer YOUR_API_KEY'
}
options = {
    'quality': 'high',
    'maintain_structure': True
}

files = {
    'file': open('document.pdf', 'rb'),
    'output_format': (None, 'docx'),
    'options': (None, json.dumps(options))
}

response = requests.post(url, headers=headers, files=files)
print(response.json())`
    }
  ];
  
  const endpoints = [
    {
      name: "convert",
      method: "POST",
      url: "/v1/convert",
      description: "Convert a file from one format to another",
      parameters: [
        { name: "file", type: "file", required: true, description: "The file to convert" },
        { name: "output_format", type: "string", required: true, description: "Target format (pdf, docx, jpg, etc.)" },
        { name: "options", type: "object", required: false, description: "Conversion options like quality and layout settings" }
      ]
    },
    {
      name: "compress",
      method: "POST",
      url: "/v1/compress",
      description: "Compress a file to reduce its size",
      parameters: [
        { name: "file", type: "file", required: true, description: "The file to compress" },
        { name: "quality", type: "string", required: false, description: "Compression quality (low, medium, high)" },
        { name: "target_size", type: "integer", required: false, description: "Target file size in KB (optional)" }
      ]
    },
    {
      name: "ocr",
      method: "POST",
      url: "/v1/ocr",
      description: "Extract text from images or PDFs",
      parameters: [
        { name: "file", type: "file", required: true, description: "The image or PDF file" },
        { name: "language", type: "string", required: false, description: "OCR language code (default: 'en')" },
        { name: "output_format", type: "string", required: false, description: "Output format (txt, docx, json)" }
      ]
    },
    {
      name: "enhance",
      method: "POST",
      url: "/v1/enhance",
      description: "Enhance images using AI",
      parameters: [
        { name: "file", type: "file", required: true, description: "The image file to enhance" },
        { name: "type", type: "string", required: true, description: "Enhancement type (upscale, denoise, colorize)" },
        { name: "strength", type: "number", required: false, description: "Enhancement strength from 0.1 to 1.0" }
      ]
    }
  ];
  
  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Developer API</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Integrate MagicFile.ai's powerful conversion capabilities directly into your applications with our easy-to-use REST API.
          </p>
          <div className="flex justify-center mt-6">
            <Badge className="bg-green-100 text-green-800 text-sm px-3 py-1 dark:bg-green-900/30 dark:text-green-400">
              Available on Business & Enterprise plans
            </Badge>
          </div>
        </div>

        {/* API Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <Card className="dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center text-blue-600 dark:text-blue-400 mb-2">
                <Globe className="h-5 w-5 mr-2" />
                <CardTitle>RESTful API</CardTitle>
              </div>
              <CardDescription>
                Simple HTTP-based API that works with any programming language
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Consistent response format</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Detailed error messages</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>HTTPS encrypted</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center text-purple-600 dark:text-purple-400 mb-2">
                <Key className="h-5 w-5 mr-2" />
                <CardTitle>Authentication</CardTitle>
              </div>
              <CardDescription>
                Secure token-based API authentication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>API key authentication</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Per-application keys</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Configurable permissions</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center text-amber-600 dark:text-amber-400 mb-2">
                <Settings className="h-5 w-5 mr-2" />
                <CardTitle>Capabilities</CardTitle>
              </div>
              <CardDescription>
                Access to all conversion features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>File conversion, compression, OCR</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Batch processing support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Webhook callbacks</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Quick Start */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Quick Start</h2>
          
          <Card className="dark:border-gray-700">
            <CardHeader>
              <CardTitle>Basic File Conversion</CardTitle>
              <CardDescription>
                Convert a PDF document to a Word document using our API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Tabs defaultValue={codeExamples[0].language} onValueChange={(value) => {
                  setActiveTabIndex(codeExamples.findIndex(ex => ex.language === value));
                }}>
                  <TabsList className="mb-4">
                    {codeExamples.map((example, i) => (
                      <TabsTrigger key={i} value={example.language} className="flex items-center">
                        <example.icon className="h-4 w-4 mr-2" />
                        {example.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {codeExamples.map((example, i) => (
                    <TabsContent key={i} value={example.language} className="relative">
                      <pre className="rounded-md bg-gray-900 dark:bg-gray-950 p-4 overflow-x-auto text-sm text-white">
                        <code>{example.code}</code>
                      </pre>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        onClick={() => copyToClipboard(example.code)}
                      >
                        {copied && activeTabIndex === i ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Endpoints */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">API Endpoints</h2>
          
          <div className="space-y-6">
            {endpoints.map((endpoint, i) => (
              <Card key={i} className="dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Badge className="bg-blue-100 text-blue-800 mr-2 dark:bg-blue-900/30 dark:text-blue-400">
                        {endpoint.method}
                      </Badge>
                      <CardTitle className="font-mono text-lg">
                        {endpoint.url}
                      </CardTitle>
                    </div>
                    <Badge variant="outline" className="font-normal">
                      {endpoint.name}
                    </Badge>
                  </div>
                  <CardDescription>{endpoint.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Parameters</h4>
                  <div className="border dark:border-gray-700 rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Parameter
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Type
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Required
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        {endpoint.parameters.map((param, j) => (
                          <tr key={j}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {param.name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              <Badge variant="outline" className="font-mono bg-gray-50 dark:bg-gray-800">
                                {param.type}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {param.required ? (
                                <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                  Required
                                </Badge>
                              ) : (
                                <span className="text-gray-500 dark:text-gray-400">Optional</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                              {param.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Get your API key */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Ready to integrate MagicFile.ai?</h2>
              <p className="text-blue-100 mb-6">
                Create an API key and start building powerful file conversion capabilities into your application.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Get API Key
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  View Documentation
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-end">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-md p-6 rounded-lg w-full max-w-md"
              >
                <div className="flex items-center mb-4">
                  <Key className="h-6 w-6 text-white mr-2" />
                  <h3 className="text-xl font-semibold">Your API Key</h3>
                </div>
                <div className="bg-white/10 rounded-md flex items-center p-3 mb-4">
                  <code className="text-blue-100 text-sm flex-grow font-mono">sk_live_mf_****************EXAMPLE</code>
                  <Button size="icon" variant="ghost" className="text-white">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-blue-100">
                  Business plan includes 10,000 API calls per month. Need more? Contact our sales team for custom Enterprise pricing.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}