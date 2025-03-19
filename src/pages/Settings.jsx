import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Crown, CheckCircle, Sun, Moon } from "lucide-react";

// Modified Settings page that works without authentication
export default function SettingsPage() {
  const [settings, setSettings] = useState({
    default_language: "en",
    auto_enhance: true,
    theme: "light"
  });
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('user_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to parse saved settings", e);
      }
    }
  }, []);

  // Update settings in local storage whenever they change
  const handleSettingChange = (setting, value) => {
    const newSettings = {
      ...settings,
      [setting]: value
    };
    
    setSettings(newSettings);
    
    // Save to localStorage
    localStorage.setItem('user_settings', JSON.stringify(newSettings));
    
    // Show toast notification
    toast({
      title: "Settings updated",
      description: "Your preferences have been saved.",
    });
    
    // Apply theme change immediately if that's what changed
    if (setting === 'theme') {
      const htmlEl = document.documentElement;
      if (value === 'dark') {
        htmlEl.classList.add('dark');
      } else {
        htmlEl.classList.remove('dark');
      }
    }
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      features: [
        "10 scans per month",
        "Basic OCR",
        "Standard quality",
        "1GB storage"
      ]
    },
    {
      name: "Premium",
      price: "$9.99",
      features: [
        "Unlimited scans",
        "Advanced OCR & handwriting",
        "Enhanced quality",
        "10GB storage",
        "Priority support"
      ]
    },
    {
      name: "Business",
      price: "$24.99",
      features: [
        "Everything in Premium",
        "50GB storage",
        "Team sharing",
        "API access",
        "24/7 support"
      ]
    }
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your preferences as a guest user
          </p>
        </div>

        {/* Guest Mode Notice */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-300">Guest Mode Active</CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-400">
              Your settings will be saved locally in this browser
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700 dark:text-blue-400">
              All file conversion tools are available without an account. 
              Your settings will be remembered on this device but won't sync across devices.
            </p>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Customize your scanning and viewing experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Default Language</Label>
                <p className="text-sm text-gray-500">
                  Select primary language for OCR
                </p>
              </div>
              <Select
                value={settings.default_language}
                onValueChange={(value) => handleSettingChange("default_language", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="he">Hebrew</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Enhancement</Label>
                <p className="text-sm text-gray-500">
                  Automatically enhance scanned documents
                </p>
              </div>
              <Switch
                checked={settings.auto_enhance}
                onCheckedChange={(checked) => handleSettingChange("auto_enhance", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theme</Label>
                <p className="text-sm text-gray-500">
                  Choose your preferred theme
                </p>
              </div>
              <Select
                value={settings.theme}
                onValueChange={(value) => handleSettingChange("theme", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center">
                      <Sun className="w-4 h-4 mr-2" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center">
                      <Moon className="w-4 h-4 mr-2" />
                      Dark
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Plans */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plans</CardTitle>
            <CardDescription>
              Choose the plan that best fits your needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-xl border p-6 ${
                    plan.name === "Free"
                      ? "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {plan.name}
                        {plan.name !== "Free" && (
                          <Crown className="w-4 h-4 text-amber-500" />
                        )}
                      </h3>
                      <p className="text-2xl font-bold mt-2">{plan.price}</p>
                      <p className="text-sm text-gray-500">per month</p>
                    </div>
                    {plan.name === "Free" && (
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        Current Plan
                      </Badge>
                    )}
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full mt-6 ${
                      plan.name === "Free"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500"
                        : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    }`}
                    disabled={plan.name === "Free"}
                  >
                    {plan.name === "Free"
                      ? "Current Plan"
                      : "Upgrade"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
