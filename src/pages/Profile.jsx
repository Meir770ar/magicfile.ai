
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { FileConversion } from '@/api/entities';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, Download, Crown, FileImage, FileAudio, FileVideo, BarChart3, UserCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import GoogleSignIn from "../components/auth/GoogleSignIn";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [conversions, setConversions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    documentsProcessed: 0,
    imagesProcessed: 0,
    audioProcessed: 0,
    videoProcessed: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      
      const conversionsData = await FileConversion.list('-created_date', 5);
      setConversions(conversionsData);
      
      const allConversions = await FileConversion.list();
      
      const statsData = {
        documentsProcessed: allConversions.filter(c => c.conversion_type === 'document').length,
        imagesProcessed: allConversions.filter(c => c.conversion_type === 'image').length,
        audioProcessed: allConversions.filter(c => c.conversion_type === 'audio').length,
        videoProcessed: allConversions.filter(c => c.conversion_type === 'video').length
      };
      
      setStats(statsData);
    } catch (error) {
      console.error("Error loading profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubscriptionInfo = (tier) => {
    switch (tier) {
      case 'premium':
        return { label: 'Premium', color: 'bg-amber-100 text-amber-800', icon: Crown };
      case 'business':
        return { label: 'Business', color: 'bg-blue-100 text-blue-800', icon: BarChart3 };
      default:
        return { label: 'Free', color: 'bg-gray-100 text-gray-800', icon: null };
    }
  };

  const getFileTypeIcon = (conversionType) => {
    switch (conversionType) {
      case 'document':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'image':
        return <FileImage className="h-5 w-5 text-emerald-500" />;
      case 'audio':
        return <FileAudio className="h-5 w-5 text-amber-500" />;
      case 'video':
        return <FileVideo className="h-5 w-5 text-rose-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <div className="flex flex-col items-center space-y-4 mb-8">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[200px] rounded-xl" />
          <Skeleton className="h-[200px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to view your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-10">
            <UserCircle className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-6">
              Sign in with your Google account to access your profile, recent conversions, and settings.
            </p>
            <GoogleSignIn 
              buttonText="Sign in to Continue" 
              onLoginSuccess={() => {
                loadData();
                toast({
                  title: "Welcome!",
                  description: "You've successfully signed in to your account."
                });
              }}
              className="w-full md:w-auto"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const subscription = getSubscriptionInfo(user.subscription_tier);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar className="h-24 w-24 border-4 border-white shadow-md">
            <AvatarImage src={user.profile_picture} alt={user.full_name} />
            <AvatarFallback className="text-2xl">
              {user.full_name?.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold mb-1">{user.full_name}</h1>
            <p className="text-gray-500 mb-3">{user.email}</p>
            
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <Badge className={subscription.color}>
                {subscription.icon && <subscription.icon className="mr-1 h-3 w-3" />}
                {subscription.label} Plan
              </Badge>
              
              <Badge variant="outline" className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                Member since {format(new Date(user.created_date), 'MMM yyyy')}
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-3">
            {user.subscription_tier === 'free' && (
              <Button className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Premium
              </Button>
            )}
            <Button variant="outline">Edit Profile</Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="conversions">Recent Conversions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Statistics</CardTitle>
                  <CardDescription>Your file processing activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Documents</span>
                        <span className="font-medium">{stats.documentsProcessed}</span>
                      </div>
                      <Progress value={Math.min((stats.documentsProcessed / 10) * 100, 100)} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Images</span>
                        <span className="font-medium">{stats.imagesProcessed}</span>
                      </div>
                      <Progress value={Math.min((stats.imagesProcessed / 15) * 100, 100)} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Audio Files</span>
                        <span className="font-medium">{stats.audioProcessed}</span>
                      </div>
                      <Progress value={Math.min((stats.audioProcessed / 5) * 100, 100)} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Video Files</span>
                        <span className="font-medium">{stats.videoProcessed}</span>
                      </div>
                      <Progress value={Math.min((stats.videoProcessed / 3) * 100, 100)} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Plan Details</CardTitle>
                  <CardDescription>Current subscription and limits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Storage Usage</span>
                        <span className="text-sm text-gray-500">
                          {((user.usage_stats?.total_file_size || 0) / (1024 * 1024)).toFixed(2)} MB / 
                          {user.subscription_tier === 'free' ? ' 1 GB' : ' 10 GB'}
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(
                          ((user.usage_stats?.total_file_size || 0) / (1024 * 1024 * (user.subscription_tier === 'free' ? 1024 : 10240))) * 100, 
                          100
                        )} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-gray-500 text-sm">Monthly Conversions</p>
                        <p className="text-xl font-semibold">
                          {user.usage_stats?.files_processed || 0} / 
                          {user.subscription_tier === 'free' ? ' 20' : ' Unlimited'}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-gray-500 text-sm">AI Analysis Credits</p>
                        <p className="text-xl font-semibold">
                          {user.usage_stats?.ai_analysis_count || 0} / 
                          {user.subscription_tier === 'free' ? ' 5' : ' 50'}
                        </p>
                      </div>
                    </div>
                    
                    {user.subscription_tier === 'free' && (
                      <Button className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600">
                        <Crown className="mr-2 h-4 w-4" />
                        Upgrade to Premium
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="conversions">
            <Card>
              <CardHeader>
                <CardTitle>Recent File Conversions</CardTitle>
                <CardDescription>
                  Your recently processed files
                </CardDescription>
              </CardHeader>
              <CardContent>
                {conversions.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">You haven't converted any files yet</p>
                    <p className="text-sm text-gray-400 mt-1">Upload a file to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {conversions.map((conversion) => (
                      <div key={conversion.id} className="flex items-center p-3 border border-gray-100 dark:border-gray-700 rounded-lg">
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full mr-3">
                          {getFileTypeIcon(conversion.conversion_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{conversion.original_file.split('/').pop()}</p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <span className="truncate">
                              {conversion.original_format} → {conversion.target_format}
                            </span>
                            <span className="mx-2">•</span>
                            <span className="whitespace-nowrap">
                              {format(new Date(conversion.created_date), 'MMM d, yyyy')}
                            </span>
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-4">
                  Visit the settings page to customize your experience, manage notifications,
                  and update your account preferences.
                </p>
                <Button>Go to Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
