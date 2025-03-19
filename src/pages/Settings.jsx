
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
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
import { Crown, CheckCircle, Sun, Moon } from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const handleSettingChange = async (setting, value) => {
    try {
      setIsSaving(true);
      await User.updateMyUserData({
        settings: {
          ...(user?.settings || {}),
          [setting]: value
        }
      });
      loadUser();
    } catch (error) {
      console.error("Error updating settings:", error);
    }
    setIsSaving(false);
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

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
                value={user?.settings?.default_language || "en"}
                onValueChange={(value) => handleSettingChange("default_language", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="he">Hebrew</SelectItem>
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
                checked={user?.settings?.auto_enhance}
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
                value={user?.settings?.theme || "light"}
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
                    user?.subscription_tier === plan.name.toLowerCase()
                      ? "border-blue-200 bg-blue-50"
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
                    {user?.subscription_tier === plan.name.toLowerCase() && (
                      <Badge className="bg-blue-100 text-blue-800">
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
                      user?.subscription_tier === plan.name.toLowerCase()
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    disabled={user?.subscription_tier === plan.name.toLowerCase()}
                  >
                    {user?.subscription_tier === plan.name.toLowerCase()
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
