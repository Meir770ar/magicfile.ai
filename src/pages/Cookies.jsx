import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Cookie, Info, Shield, Settings, BarChart3, Crosshair, Fingerprint } from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Cookie Policy</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Learn about how MagicFile.ai uses cookies and similar technologies to enhance your experience.
          </p>
        </div>

        <Card className="mb-8 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>What Are Cookies?</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              MagicFile.ai uses cookies and similar technologies (like local storage) to enhance your experience, analyze site usage, and assist in our marketing efforts. Some cookies are essential for the website to function properly, while others are optional and can be disabled.
            </p>
          </CardContent>
        </Card>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Types of Cookies We Use</h2>
          
          <Accordion type="multiple" defaultValue={["essential"]}>
            <AccordionItem value="essential" className="border dark:border-gray-700 rounded-t-lg mb-2 bg-white dark:bg-gray-800">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">Essential Cookies</span>
                  <span className="text-xs font-normal py-1 px-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded">Always Active</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  These cookies are necessary for the website to function properly. They enable basic functions like page navigation, secure areas access, and remembering your preferences. The website cannot function properly without these cookies.
                </p>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 dark:text-gray-400">
                        <th className="pb-2">Cookie Name</th>
                        <th className="pb-2">Purpose</th>
                        <th className="pb-2">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 dark:text-gray-300">
                      <tr>
                        <td className="py-2 pr-4">session_id</td>
                        <td className="py-2 pr-4">Maintains your session state</td>
                        <td className="py-2">Session</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">csrf_token</td>
                        <td className="py-2 pr-4">Protects against cross-site request forgery</td>
                        <td className="py-2">Session</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">auth_cookie</td>
                        <td className="py-2 pr-4">Remembers your login status</td>
                        <td className="py-2">30 days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="analytics" className="border dark:border-gray-700 rounded-lg mb-2 bg-white dark:bg-gray-800">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                    <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">Analytics Cookies</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>
                  <div className="flex items-center space-x-2">
                    <Switch id="analytics" />
                    <Label htmlFor="analytics">Enable</Label>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 dark:text-gray-400">
                        <th className="pb-2">Cookie Name</th>
                        <th className="pb-2">Purpose</th>
                        <th className="pb-2">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 dark:text-gray-300">
                      <tr>
                        <td className="py-2 pr-4">_ga</td>
                        <td className="py-2 pr-4">Google Analytics - Distinguishes users</td>
                        <td className="py-2">2 years</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">_gid</td>
                        <td className="py-2 pr-4">Google Analytics - Identifies user session</td>
                        <td className="py-2">24 hours</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">_gat</td>
                        <td className="py-2 pr-4">Google Analytics - Throttles request rate</td>
                        <td className="py-2">1 minute</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="marketing" className="border dark:border-gray-700 rounded-lg mb-2 bg-white dark:bg-gray-800">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                    <Crosshair className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">Marketing Cookies</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad.
                  </p>
                  <div className="flex items-center space-x-2">
                    <Switch id="marketing" />
                    <Label htmlFor="marketing">Enable</Label>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 dark:text-gray-400">
                        <th className="pb-2">Cookie Name</th>
                        <th className="pb-2">Purpose</th>
                        <th className="pb-2">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 dark:text-gray-300">
                      <tr>
                        <td className="py-2 pr-4">_fbp</td>
                        <td className="py-2 pr-4">Facebook pixel tracking</td>
                        <td className="py-2">3 months</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">ads_prefs</td>
                        <td className="py-2 pr-4">Stores ad preferences</td>
                        <td className="py-2">1 year</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">_gcl_au</td>
                        <td className="py-2 pr-4">Google AdSense experiments</td>
                        <td className="py-2">3 months</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="preferences" className="border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                    <Settings className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">Preference Cookies</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    These cookies enable the website to remember choices you make (such as your preferred language or the region you are in) and provide enhanced, more personal features.
                  </p>
                  <div className="flex items-center space-x-2">
                    <Switch id="preferences" />
                    <Label htmlFor="preferences">Enable</Label>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 dark:text-gray-400">
                        <th className="pb-2">Cookie Name</th>
                        <th className="pb-2">Purpose</th>
                        <th className="pb-2">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 dark:text-gray-300">
                      <tr>
                        <td className="py-2 pr-4">language</td>
                        <td className="py-2 pr-4">Remembers your preferred language</td>
                        <td className="py-2">1 year</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">theme</td>
                        <td className="py-2 pr-4">Stores your preferred theme (light/dark)</td>
                        <td className="py-2">1 year</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">recent_conversions</td>
                        <td className="py-2 pr-4">Stores your recent file conversions</td>
                        <td className="py-2">30 days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Managing Your Cookie Preferences</h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse cookies, 
              or to alert you when cookies are being sent. The methods for doing so vary from browser to browser, but 
              they can usually be found in the Settings, Preferences, or Privacy menu of your browser.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">
                    <Fingerprint className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">All Cookies</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Control all non-essential cookies</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="all-cookies" />
                  <Label htmlFor="all-cookies">Enable</Label>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 justify-center md:justify-start">
                <Button variant="outline">Accept All</Button>
                <Button variant="outline">Reject All</Button>
                <Button className="bg-blue-600 hover:bg-blue-700">Save Preferences</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mt-1">
              <Cookie className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Cookie Policy Updates</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                This Cookie Policy may be updated from time to time to reflect changes in our practices or for legal reasons. 
                We will notify you of any significant changes by placing a prominent notice on our website.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                This policy was last updated on November 15, 2023.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}