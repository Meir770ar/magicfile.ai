

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Image as ImageIcon,
  FileAudio2,
  FileVideo,
  FileDown,
  Menu,
  X,
  BarChart3,
  Globe,
  HeartHandshake,
  BookOpen,
  Settings,
  ChevronRight,
  Info,
  Github,
  Twitter,
  Laptop,
  UserCircle,
  Wand2,
  MoonStar,
  SunMedium,
  Crown,
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import UserMenu from "@/components/auth/UserMenu";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const mainCategories = [
    { name: "Documents", href: createPageUrl("DocumentConverter"), icon: FileText, color: "blue" },
    { name: "Images", href: createPageUrl("ImageConverter"), icon: ImageIcon, color: "emerald" },
    { name: "Audio", href: createPageUrl("AudioConverter"), icon: FileAudio2, color: "amber" },
    { name: "Video", href: createPageUrl("VideoConverter"), icon: FileVideo, color: "rose" },
    { name: "Compress", href: createPageUrl("Compress"), icon: FileDown, color: "purple" },
    { name: "OCR", href: createPageUrl("OcrTool"), icon: FileText, color: "indigo" },
    { name: "AI PDF Analysis", href: createPageUrl("AiPdfAnalysis"), icon: Brain, color: "violet" }
  ];
  
  const additionalLinks = [
    { name: "Developer API", href: createPageUrl("Api"), icon: Laptop },
    { name: "Guides", href: createPageUrl("Guides"), icon: BookOpen },
    { name: "Stats", href: createPageUrl("Stats"), icon: BarChart3 },
    { name: "Settings", href: createPageUrl("Settings"), icon: Settings }
  ];
  
  const getIsActive = (path) => {
    if (path === createPageUrl("Home") && location.pathname === "/") {
      return true;
    }
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 
      'bg-gray-900 text-white' : 
      'bg-gradient-to-br from-blue-50 to-white text-gray-900'}`}>
      <header className={`sticky top-0 z-40 backdrop-blur-sm border-b ${
        darkMode ? 'bg-gray-900/90 border-gray-700' : 'bg-white/90 border-gray-100 shadow-sm'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to={createPageUrl("Home")} className={`flex items-center gap-2 font-bold text-xl ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                <Wand2 className="h-6 w-6" />
                <span>MagicFile.ai</span>
              </Link>
              
              <Button
                variant="ghost"
                size="icon"
                className={`ml-4 md:hidden ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
            
            <nav className="hidden md:flex items-center space-x-1">
              {mainCategories.map((item) => {
                const isActive = getIsActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive 
                        ? `bg-${item.color}-100 text-${item.color}-700 dark:bg-${item.color}-900/30 dark:text-${item.color}-400` 
                        : `text-gray-600 hover:bg-gray-50 hover:text-${item.color}-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-${item.color}-400`
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </nav>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className={darkMode ? 'text-yellow-300' : 'text-gray-500'}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={darkMode ? 'text-gray-300' : 'text-gray-600'}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    English
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                  <DropdownMenuItem className={darkMode ? 'text-white focus:bg-gray-700' : ''}>English</DropdownMenuItem>
                  <DropdownMenuItem className={darkMode ? 'text-white focus:bg-gray-700' : ''}>Español</DropdownMenuItem>
                  <DropdownMenuItem className={darkMode ? 'text-white focus:bg-gray-700' : ''}>Français</DropdownMenuItem>
                  <DropdownMenuItem className={darkMode ? 'text-white focus:bg-gray-700' : ''}>Deutsch</DropdownMenuItem>
                  <DropdownMenuItem className={darkMode ? 'text-white focus:bg-gray-700' : ''}>العربية</DropdownMenuItem>
                  <DropdownMenuItem className={darkMode ? 'text-white focus:bg-gray-700' : ''}>中文</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <UserMenu />
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to={createPageUrl("Premium")}>
                  <Button 
                    variant="default" 
                    size="sm"
                    className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white px-4"
                  >
                    <Crown className="h-4 w-4 mr-1" />
                    Premium
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className={`md:hidden ${
          darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
        } border-b`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {mainCategories.map((item) => {
              const isActive = getIsActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                    isActive 
                      ? `bg-${item.color}-100 text-${item.color}-700 dark:bg-${item.color}-900/30 dark:text-${item.color}-400` 
                      : `text-gray-600 hover:bg-gray-50 hover:text-${item.color}-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-${item.color}-400`
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <main className="flex-1">
        {children}
      </main>
      
      <footer className={`${
        darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-100 text-gray-600'
      } border-t py-8`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>MagicFile.ai</h3>
              <p className="text-sm">
                Fast and reliable file conversion platform. Convert files for free, no registration required.
              </p>
              <div className="flex space-x-4 mt-4">
                <Link to="#" className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}>
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link to="#" className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}>
                  <Github className="h-5 w-5" />
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Tools</h3>
              <ul className="space-y-2">
                {mainCategories.map(category => (
                  <li key={category.name}>
                    <Link 
                      to={category.href}
                      className={`${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} text-sm flex items-center`}
                    >
                      <ChevronRight className="h-3 w-3 mr-1" />
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to={createPageUrl("About")} className={`${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} text-sm flex items-center`}>
                    <ChevronRight className="h-3 w-3 mr-1" />
                    About
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("Privacy")} className={`${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} text-sm flex items-center`}>
                    <ChevronRight className="h-3 w-3 mr-1" />
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("Terms")} className={`${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} text-sm flex items-center`}>
                    <ChevronRight className="h-3 w-3 mr-1" />
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("Contact")} className={`${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} text-sm flex items-center`}>
                    <ChevronRight className="h-3 w-3 mr-1" />
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Help & Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link to={createPageUrl("Faq")} className={`${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} text-sm flex items-center`}>
                    <ChevronRight className="h-3 w-3 mr-1" />
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("Guides")} className={`${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} text-sm flex items-center`}>
                    <ChevronRight className="h-3 w-3 mr-1" />
                    Guides
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("Api")} className={`${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} text-sm flex items-center`}>
                    <ChevronRight className="h-3 w-3 mr-1" />
                    Developer API
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} mt-8 pt-6 flex flex-col md:flex-row md:items-center justify-between`}>
            <p className="text-sm">
              © {new Date().getFullYear()} MagicFile.ai. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link to={createPageUrl("Security")} className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} text-sm`}>
                Security
              </Link>
              <Link to={createPageUrl("Cookies")} className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} text-sm`}>
                Cookie Policy
              </Link>
              <Link to={createPageUrl("Accessibility")} className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} text-sm`}>
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        :root {
          --background: 0 0% 100%;
          --foreground: 222.2 84% 4.9%;
          --card: 0 0% 100%;
          --card-foreground: 222.2 84% 4.9%;
          --popover: 0 0% 100%;
          --popover-foreground: 222.2 84% 4.9%;
          --primary: 221.2 83.2% 53.3%;
          --primary-foreground: 210 40% 98%;
          --secondary: 210 40% 96.1%;
          --secondary-foreground: 222.2 47.4% 11.2%;
          --muted: 210 40% 96.1%;
          --muted-foreground: 215.4 16.3% 46.9%;
          --accent: 210 40% 96.1%;
          --accent-foreground: 222.2 47.4% 11.2%;
          --destructive: 0 84.2% 60.2%;
          --destructive-foreground: 210 40% 98%;
          --border: 214.3 31.8% 91.4%;
          --input: 214.3 31.8% 91.4%;
          --ring: 221.2 83.2% 53.3%;
        }
        
        .dark {
          --background: 222.2 84% 4.9%;
          --foreground: 210 40% 98%;
          --card: 222.2 84% 4.9%;
          --card-foreground: 210 40% 98%;
          --popover: 222.2 84% 4.9%;
          --popover-foreground: 210 40% 98%;
          --primary: 217.2 91.2% 59.8%;
          --primary-foreground: 222.2 47.4% 11.2%;
          --secondary: 217.2 32.6% 17.5%;
          --secondary-foreground: 210 40% 98%;
          --muted: 217.2 32.6% 17.5%;
          --muted-foreground: 215 20.2% 65.1%;
          --accent: 217.2 32.6% 17.5%;
          --accent-foreground: 210 40% 98%;
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 210 40% 98%;
          --border: 217.2 32.6% 17.5%;
          --input: 217.2 32.6% 17.5%;
          --ring: 224.3 76.3% 48%;
        }
      `}</style>
    </div>
  );
}

