import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Eye, 
  MousePointer, 
  Keyboard, 
  FileText, 
  Megaphone, 
  Headphones, 
  CheckSquare, 
  Goal, 
  Mail 
} from "lucide-react";

export default function AccessibilityPage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Accessibility</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We are committed to ensuring digital accessibility for people with disabilities. 
            We are continually improving the user experience for everyone and applying the relevant 
            accessibility standards.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Our Approach to Accessibility</h2>
          
          <Card className="dark:border-gray-700">
            <CardContent className="pt-6">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                MagicFile.ai strives to ensure that its services are accessible to people with disabilities. 
                We have invested a significant amount of resources to help ensure that our website and applications:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mt-1">
                    <CheckSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">WCAG 2.1 Compliance</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      We work to meet or exceed the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mt-1">
                    <CheckSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Screen Reader Compatible</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Our site works with screen readers such as JAWS, NVDA, VoiceOver, and TalkBack.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mt-1">
                    <CheckSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Keyboard Navigation</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      All features and content are accessible using keyboard navigation.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mt-1">
                    <CheckSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Color Contrast</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      We ensure sufficient color contrast between foreground and background elements.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Accessibility Features</h2>
          
          <Tabs defaultValue="visual">
            <TabsList className="mb-6">
              <TabsTrigger value="visual" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Visual
              </TabsTrigger>
              <TabsTrigger value="navigation" className="flex items-center gap-2">
                <MousePointer className="h-4 w-4" />
                Navigation
              </TabsTrigger>
              <TabsTrigger value="keyboard" className="flex items-center gap-2">
                <Keyboard className="h-4 w-4" />
                Keyboard
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Content
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="visual" className="space-y-6">
              <Card className="dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Visual Accessibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="font-semibold text-gray-900 dark:text-white w-40 flex-shrink-0">
                        Dark Mode:
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        Toggle between light and dark themes to reduce eye strain and improve visibility.
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="font-semibold text-gray-900 dark:text-white w-40 flex-shrink-0">
                        Color Contrast:
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        All text content meets or exceeds WCAG 2.1 AA standards for color contrast.
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="font-semibold text-gray-900 dark:text-white w-40 flex-shrink-0">
                        Focus Indicators:
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        Visible focus indicators are provided for all interactive elements when navigating with a keyboard.
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="font-semibold text-gray-900 dark:text-white w-40 flex-shrink-0">
                        Font Sizing:
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        Text can be resized up to 200% without loss of content or functionality using standard browser zoom functions.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="navigation" className="space-y-6">
              <Card className="dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MousePointer className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Navigation Accessibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="font-semibold text-gray-900 dark:text-white w-40 flex-shrink-0">
                        Consistent Layout:
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        Consistent navigation and structure across all pages to help users navigate effectively.
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="font-semibold text-gray-900 dark:text-white w-40 flex-shrink-0">
                        Skip Links:
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        "Skip to main content" links allow keyboard users to bypass repetitive navigation elements.
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="font-semibold text-gray-900 dark:text-white w-40 flex-shrink-0">
                        Breadcrumbs:
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        Breadcrumb navigation helps users understand their current location and navigate backward.
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="font-semibold text-gray-900 dark:text-white w-40 flex-shrink-0">
                        Descriptive Links:
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        All links have descriptive text that makes sense when read out of context by screen readers.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="keyboard" className="space-y-6">
              <Card className="dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Keyboard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Keyboard Accessibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="font-semibold text-gray-900 dark:text-white w-40 flex-shrink-0">
                        Full Keyboard Access:
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        All functionality is operable through a keyboard interface without requiring specific timing for individual keystrokes.
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="font-semibold text-gray-900 dark:text-white w-40 flex-shrink-0">
                        Logical Tab Order:
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        Tab navigation follows a logical order that matches the visual flow of the page.
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="font-semibold text-gray-900 dark:text-white w-40 flex-shrink-0">
                        No Keyboard Traps:
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        Users can navigate away from all components using the keyboard alone.
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="font-semibold text-gray-900 dark:text-white w-40 flex-shrink-0">
                        Keyboard Shortcuts:
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        Common keyboard shortcuts are supported for essential actions.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-6">
              <Card className="dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Content Accessibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="font-semibold text-gray-900 dark:text-white w-40 flex-shrink-0">
                        Alt Text:
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        All images have appropriate alternative text descriptions.
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="font-semibold text-gray-900 dark:text-white w-40 flex-shrink-0">
                        ARIA Labels:
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        ARIA roles and labels are used to enhance screen reader compatibility for complex interface elements.
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="font-semibold text-gray-900 dark:text-white w-40 flex-shrink-0">
                        Headings:
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        Proper heading structure (H1-H6) is used to organize content in a logical hierarchy.
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="font-semibold text-gray-900 dark:text-white w-40 flex-shrink-0">
                        Form Labels:
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        All form fields have proper labels and error messages are clearly associated with the relevant fields.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Compliance Standards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Goal className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                  WCAG 2.1 Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Our website aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards, 
                  which specify how to make web content more accessible to people with a wide range of disabilities.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                  <li>Perceivable - Information and user interface components must be presentable to users in ways they can perceive.</li>
                  <li>Operable - User interface components and navigation must be operable.</li>
                  <li>Understandable - Information and the operation of user interface must be understandable.</li>
                  <li>Robust - Content must be robust enough to be interpreted reliably by a wide variety of user agents.</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Megaphone className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Ongoing Commitments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We are committed to ongoing accessibility improvements through:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                  <li>Regular accessibility audits and testing with assistive technologies</li>
                  <li>Incorporating accessibility feedback from users</li>
                  <li>Training our development team on accessibility best practices</li>
                  <li>Maintaining an accessibility roadmap for continuous improvement</li>
                  <li>Staying current with evolving accessibility standards and technologies</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-8 border border-blue-100 dark:border-blue-900/20">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Headphones className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Feedback and Support</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We welcome your feedback on the accessibility of MagicFile.ai. If you encounter accessibility barriers 
                or have suggestions for improvement, please contact our accessibility team.
              </p>
              <Link to={createPageUrl("Contact")}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Accessibility Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}