import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Building, Users, Globe, Award, ChevronRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">About MagicFile.ai</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
            At MagicFile.ai, we're dedicated to making file conversion and management simple, secure, and accessible for everyone. 
            Our platform is built with cutting-edge technology to provide a seamless experience for all your file conversion needs.
          </p>
          
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            Whether you're a student, professional, or business owner, our tools are designed to save you time and effort by 
            simplifying complex file operations into a few simple clicks - all while keeping your data secure and private.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Our Story</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Founded in 2022, MagicFile.ai began with a simple idea: file conversion should be easy and accessible to everyone. 
                    What started as a small project has grown into a comprehensive platform serving users worldwide.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full">
                  <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Our Team</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We're a diverse team of engineers, designers, and product specialists passionate about creating 
                    technology that makes life easier. Based across three continents, we bring global perspective to our work.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Our Core Values</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Simplicity</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We believe in making complex technologies accessible through intuitive design and straightforward user experiences.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Globe className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Accessibility</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our tools are designed to be available to everyone, regardless of technical skill or resources.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Quality</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We're committed to providing top-tier conversion quality and reliable performance in every aspect of our service.
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-semibold mb-4">Looking Forward</h2>
          <p className="mb-6 text-blue-50">
            We're constantly improving our platform with new features, more conversion options, and enhanced AI capabilities. 
            Our vision is to become the world's most trusted file management platform, helping users work smarter with their digital content.
          </p>
          <p className="text-blue-50">
            Thank you for choosing MagicFile.ai. We're excited to be part of your digital workflow.
          </p>
        </div>
      </div>
    </div>
  );
}