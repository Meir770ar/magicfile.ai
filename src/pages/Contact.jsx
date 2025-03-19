
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageCircle, 
  HelpCircle, 
  AlertCircle,
  FileText, // Added missing FileText import
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiry_type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real implementation, you would send this data to your backend
    // For now, we'll simulate a successful submission after a delay
    setTimeout(() => {
      toast({
        title: "Message sent successfully",
        description: "Thank you for contacting us. We'll get back to you shortly.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiry_type: 'general'
      });
      
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-3 text-gray-900 dark:text-white">Contact Us</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
          Have questions about our services? Need help with a conversion? Our team is here to assist you.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <MessageCircle className="mr-2 h-5 w-5 text-blue-500" />
                  Send us a message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="inquiry_type">Inquiry Type</Label>
                      <Select 
                        value={formData.inquiry_type}
                        onValueChange={(value) => handleSelectChange('inquiry_type', value)}
                      >
                        <SelectTrigger id="inquiry_type">
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="billing">Billing Question</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input 
                        id="subject" 
                        name="subject" 
                        placeholder="Message subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Sending message...</>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-500 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Email</p>
                      <a href="mailto:support@magicfile.ai" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                        support@magicfile.ai
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-blue-500 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Phone</p>
                      <p className="text-gray-600 dark:text-gray-300">
                        +1 (555) 123-4567
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-500 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Location</p>
                      <p className="text-gray-600 dark:text-gray-300">
                        123 Tech Street<br />
                        San Francisco, CA 94105<br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-500" />
                  Quick Help
                </h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    View FAQ
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Documentation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Live Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
