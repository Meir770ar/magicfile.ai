import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { User } from '@/api/entities';
import { motion } from "framer-motion";
import {
  Check,
  X,
  Crown,
  Zap,
  CloudUpload,
  ShieldCheck,
  Brain,
  Clock,
  BadgeCheck,
  FileText,
  Server,
  Users
} from "lucide-react";

export default function PricingDisplay() {
  const [billingCycle, setBillingCycle] = React.useState('monthly');
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleUpgrade = (tier) => {
    setIsLoading(true);
    // In a real implementation, this would redirect to a payment gateway
    setTimeout(() => {
      toast({
        title: "Premium Feature",
        description: "This would connect to a payment gateway in a production environment.",
      });
      setIsLoading(false);
    }, 1500);
  };
  
  const plans = [
    {
      name: "Free",
      price: { monthly: 0, yearly: 0 },
      description: "Basic tools for individuals",
      features: [
        { text: "Convert up to 5 files daily", included: true },
        { text: "Max file size: 100MB", included: true },
        { text: "Basic conversion formats", included: true },
        { text: "Standard conversion quality", included: true },
        { text: "Files stored for 24 hours", included: true },
        { text: "Basic AI PDF analysis", included: false },
        { text: "Batch file processing", included: false },
        { text: "Advanced OCR capabilities", included: false },
        { text: "Priority processing", included: false },
        { text: "Advanced security features", included: false },
      ],
      buttonText: "Current Plan",
      disabled: true,
      highlighted: false,
      color: "gray"
    },
    {
      name: "Pro",
      price: { monthly: 9.99, yearly: 99.99 },
      description: "Extended features for power users",
      features: [
        { text: "Unlimited file conversions", included: true },
        { text: "Max file size: 500MB", included: true },
        { text: "All conversion formats", included: true },
        { text: "Enhanced conversion quality", included: true },
        { text: "Files stored for 7 days", included: true },
        { text: "Basic AI PDF analysis", included: true },
        { text: "Batch file processing (10 files)", included: true },
        { text: "Advanced OCR capabilities", included: true },
        { text: "Priority processing", included: false },
        { text: "Advanced security features", included: false },
      ],
      buttonText: "Upgrade to Pro",
      disabled: false,
      highlighted: true,
      color: "blue"
    },
    {
      name: "Business",
      price: { monthly: 29.99, yearly: 299.99 },
      description: "Professional tools for teams",
      features: [
        { text: "Unlimited file conversions", included: true },
        { text: "Max file size: 2GB", included: true },
        { text: "All conversion formats + premium", included: true },
        { text: "Premium conversion quality", included: true },
        { text: "Files stored for 30 days", included: true },
        { text: "Advanced AI PDF analysis", included: true },
        { text: "Unlimited batch processing", included: true },
        { text: "Advanced OCR capabilities", included: true },
        { text: "Priority processing", included: true },
        { text: "Advanced security features", included: true },
      ],
      buttonText: "Upgrade to Business",
      disabled: false,
      highlighted: false,
      color: "purple"
    },
    {
      name: "Enterprise",
      price: { monthly: null, yearly: null },
      description: "Customized solutions for organizations",
      features: [
        { text: "Unlimited file conversions", included: true },
        { text: "Max file size: 10GB", included: true },
        { text: "All formats + custom formats", included: true },
        { text: "Premium conversion quality", included: true },
        { text: "Custom retention policies", included: true },
        { text: "Full AI document suite", included: true },
        { text: "Advanced batch processing", included: true },
        { text: "Premium OCR & data extraction", included: true },
        { text: "Dedicated processing servers", included: true },
        { text: "Custom security & compliance", included: true },
      ],
      buttonText: "Contact Sales",
      disabled: false,
      highlighted: false,
      color: "indigo"
    }
  ];
  
  const featureIcons = {
    "Max file size": CloudUpload,
    "conversion formats": FileText,
    "conversion quality": BadgeCheck,
    "Files stored": Clock,
    "AI PDF analysis": Brain,
    "Batch file processing": Server,
    "OCR capabilities": Zap,
    "Priority processing": Zap,
    "security features": ShieldCheck,
    "retention policies": Clock,
    "AI document suite": Brain,
    "batch processing": Server,
    "OCR & data extraction": Zap,
    "processing servers": Server,
    "security & compliance": ShieldCheck,
    "file conversions": FileText,
  };
  
  const getFeatureIcon = (text) => {
    for (const [key, icon] of Object.entries(featureIcons)) {
      if (text.includes(key)) {
        return icon;
      }
    }
    return Check;
  };
  
  const calculateSavings = (plan) => {
    if (plan.price.yearly === null) return null;
    const monthlyCost = plan.price.monthly * 12;
    const yearlyCost = plan.price.yearly;
    const savings = monthlyCost - yearlyCost;
    const savingsPercentage = Math.round((savings / monthlyCost) * 100);
    return { amount: savings.toFixed(2), percentage: savingsPercentage };
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <Switch
                id="billing-cycle"
                checked={billingCycle === 'yearly'}
                onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
              />
              <Label htmlFor="billing-cycle" className="ml-2 text-sm">
                Annual Billing
              </Label>
            </div>
            
            {billingCycle === 'yearly' && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Save up to 17%
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, index) => {
          const savings = calculateSavings(plan);
          
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={!plan.disabled ? { y: -5 } : {}}
            >
              <Card className={`relative h-full ${
                plan.highlighted 
                  ? `border-${plan.color}-400 dark:border-${plan.color}-500 shadow-md` 
                  : 'border-gray-200 dark:border-gray-700'
              }`}>
                {plan.highlighted && (
                  <div className={`absolute -top-4 left-0 right-0 flex justify-center`}>
                    <Badge className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-3 py-1">
                      <Crown className="mr-1 h-3.5 w-3.5" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className={`pb-2 ${plan.highlighted ? 'pt-6' : ''}`}>
                  <div className={`text-${plan.color}-600 dark:text-${plan.color}-400 text-sm font-medium mb-1`}>
                    {plan.name}
                  </div>
                  <CardTitle className="text-3xl font-bold">
                    {plan.price[billingCycle] === null 
                      ? "Custom" 
                      : plan.price[billingCycle] === 0 
                        ? "Free" 
                        : (
                          <>
                            ${plan.price[billingCycle]}
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                              /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                            </span>
                          </>
                        )
                    }
                  </CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {plan.description}
                  </p>
                </CardHeader>
                
                <CardContent className="pt-4">
                  {billingCycle === 'yearly' && savings && (
                    <div className="mb-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-sm rounded-md p-2">
                      Save ${savings.amount} per year ({savings.percentage}% off)
                    </div>
                  )}
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => {
                      const FeatureIcon = getFeatureIcon(feature.text);
                      
                      return (
                        <li key={idx} className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            {feature.included ? (
                              <div className={`rounded-full p-1 bg-${plan.color}-100 dark:bg-${plan.color}-900/20`}>
                                <Check className={`h-3.5 w-3.5 text-${plan.color}-600 dark:text-${plan.color}-400`} />
                              </div>
                            ) : (
                              <div className="rounded-full p-1 bg-gray-100 dark:bg-gray-800">
                                <X className="h-3.5 w-3.5 text-gray-400 dark:text-gray-600" />
                              </div>
                            )}
                          </div>
                          <span className={`ml-2 text-sm ${
                            feature.included 
                              ? 'text-gray-700 dark:text-gray-300' 
                              : 'text-gray-400 dark:text-gray-600'
                          }`}>
                            {feature.text}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button
                    className={plan.disabled ? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 cursor-default w-full' : `bg-${plan.color}-600 hover:bg-${plan.color}-700 w-full`}
                    onClick={() => handleUpgrade(plan.name)}
                    disabled={plan.disabled || isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      plan.buttonText
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-14 mb-8">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Compare Features
        </h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Feature
                </th>
                {plans.map(plan => (
                  <th key={plan.name} className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">Daily conversions</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">5</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">Unlimited</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">Unlimited</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">Unlimited</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">Max file size</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">100MB</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">500MB</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">2GB</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">10GB</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">AI PDF analysis</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  <X className="h-5 w-5 text-gray-400 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">Batch processing</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  <X className="h-5 w-5 text-gray-400 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">10 files</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">Unlimited</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">Advanced</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">Retention period</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">24 hours</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">7 days</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">30 days</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">Custom</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">Processing speed</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">Standard</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">Priority</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">Priority</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">Dedicated</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">Team members</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">1</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">1</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">5</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">Unlimited</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-2">Need a custom solution?</h3>
          <p className="text-blue-700 dark:text-blue-200 mb-4">
            Contact our sales team to discuss your specific requirements. We offer tailored enterprise solutions.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Users className="mr-2 h-5 w-5" />
            Contact Enterprise Sales
          </Button>
        </div>
      </div>
    </div>
  );
}