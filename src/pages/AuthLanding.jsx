import React from 'react';
import GoogleSignUp from '../components/auth/GoogleSignUp';
import { motion } from "framer-motion";
import { 
  FileText, 
  Shield, 
  Globe, 
  Zap,
  Users
} from "lucide-react";

export default function AuthLandingPage() {
  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Features */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              פתרון מושלם להמרת קבצים
            </h1>
            
            <div className="space-y-6">
              {[
                {
                  icon: Zap,
                  title: "המרה מהירה",
                  description: "המר קבצים בשניות, ללא המתנה מיותרת"
                },
                {
                  icon: Shield,
                  title: "אבטחה מלאה",
                  description: "הקבצים שלך מאובטחים ומוצפנים מקצה לקצה"
                },
                {
                  icon: Globe,
                  title: "נגישות מכל מקום",
                  description: "גש לקבצים שלך מכל מכשיר, בכל זמן"
                },
                {
                  icon: Users,
                  title: "שיתוף פעולה",
                  description: "שתף קבצים בקלות עם אחרים"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                    <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - Sign Up Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GoogleSignUp />
          </motion.div>
        </div>
      </div>
    </div>
  );
}