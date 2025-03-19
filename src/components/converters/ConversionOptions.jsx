import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Settings,
  Sliders,
  Wand2,
  Languages,
  Lock,
  FileText,
  Settings2
} from "lucide-react";

export default function ConversionOptions({ 
  conversionType, 
  sourceFormat, 
  availableTargetFormats, 
  onOptionsChange,
  supportedLanguages = [],
  supportedAiEnhancements = []
}) {
  const [targetFormat, setTargetFormat] = useState(availableTargetFormats[0] || '');
  const [quality, setQuality] = useState(90);
  const [aiEnhance, setAiEnhance] = useState(false);
  const [ocrLanguage, setOcrLanguage] = useState('auto');
  const [compressionLevel, setCompressionLevel] = useState('medium');
  const [preserveLayout, setPreserveLayout] = useState(true);
  const [enableEditing, setEnableEditing] = useState(true);
  const [password, setPassword] = useState('');
  const [enablePassword, setEnablePassword] = useState(false);
  const [selectedAiEnhancements, setSelectedAiEnhancements] = useState([]);
  const [activeTab, setActiveTab] = useState("basic");
  
  const handleTargetFormatChange = (value) => {
    setTargetFormat(value);
    onOptionsChange({
      targetFormat: value,
      quality,
      aiEnhance,
      ocrLanguage,
      compressionLevel,
      preserveLayout,
      enableEditing,
      password: enablePassword ? password : '',
      selectedAiEnhancements
    });
  };
  
  const handleQualityChange = (value) => {
    setQuality(value[0]);
    onOptionsChange({
      targetFormat,
      quality: value[0],
      aiEnhance,
      ocrLanguage,
      compressionLevel,
      preserveLayout,
      enableEditing,
      password: enablePassword ? password : '',
      selectedAiEnhancements
    });
  };
  
  const updateOptions = () => {
    onOptionsChange({
      targetFormat,
      quality,
      aiEnhance,
      ocrLanguage,
      compressionLevel,
      preserveLayout,
      enableEditing,
      password: enablePassword ? password : '',
      selectedAiEnhancements
    });
  };
  
  const toggleAiEnhancement = (enhancement) => {
    const newEnhancements = selectedAiEnhancements.includes(enhancement)
      ? selectedAiEnhancements.filter(e => e !== enhancement)
      : [...selectedAiEnhancements, enhancement];
    
    setSelectedAiEnhancements(newEnhancements);
    
    onOptionsChange({
      targetFormat,
      quality,
      aiEnhance,
      ocrLanguage,
      compressionLevel,
      preserveLayout,
      enableEditing,
      password: enablePassword ? password : '',
      selectedAiEnhancements: newEnhancements
    });
  };
  
  // Determine which options to show based on conversion type
  const showQualityOption = ['image', 'video'].includes(conversionType);
  const showOcrOptions = conversionType === 'ocr' || (conversionType === 'document' && sourceFormat !== 'txt');
  const showCompressionOptions = conversionType === 'compression';
  const showDocumentOptions = conversionType === 'document';
  const showAiOptions = supportedAiEnhancements.length > 0;
  
  return (
    <Card className="border-gray-200">
      <CardContent className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <Settings2 className="mr-2 h-5 w-5 text-blue-500" />
            אפשרויות המרה
          </h3>
          
          {availableTargetFormats.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">פורמט יעד:</span>
              <Select 
                value={targetFormat} 
                onValueChange={handleTargetFormatChange}
              >
                <SelectTrigger className="w-32 h-9">
                  <SelectValue placeholder="בחר פורמט" />
                </SelectTrigger>
                <SelectContent>
                  {availableTargetFormats.map(format => (
                    <SelectItem key={format} value={format} className="text-sm">
                      {format.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">
              הגדרות בסיסיות
            </TabsTrigger>
            {showAiOptions && (
              <TabsTrigger value="ai">
                שיפור AI
              </TabsTrigger>
            )}
            <TabsTrigger value="advanced">
              הגדרות מתקדמות
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="mt-2 space-y-4">
            {/* Quality setting for images and videos */}
            {showQualityOption && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-gray-700">איכות</Label>
                  <span className="text-sm font-medium text-blue-600">{quality}%</span>
                </div>
                <Slider
                  value={[quality]}
                  min={10}
                  max={100}
                  step={5}
                  onValueChange={handleQualityChange}
                />
                <p className="text-xs text-gray-500 mt-1">
                  איכות גבוהה יותר = קובץ גדול יותר
                </p>
              </div>
            )}
            
            {/* OCR options */}
            {showOcrOptions && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ocr-enable" className="text-sm text-gray-700">
                    הפעל זיהוי טקסט (OCR)
                  </Label>
                  <Switch 
                    id="ocr-enable" 
                    checked={aiEnhance}
                    onCheckedChange={(checked) => {
                      setAiEnhance(checked);
                      updateOptions();
                    }}
                  />
                </div>
                
                {aiEnhance && (
                  <div className="mt-2">
                    <Label className="text-sm text-gray-700 mb-1 block">שפת המסמך</Label>
                    <Select 
                      value={ocrLanguage} 
                      onValueChange={(value) => {
                        setOcrLanguage(value);
                        updateOptions();
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="בחר שפה" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">זיהוי אוטומטי</SelectItem>
                        <SelectItem value="en">אנגלית</SelectItem>
                        <SelectItem value="he">עברית</SelectItem>
                        <SelectItem value="ar">ערבית</SelectItem>
                        <SelectItem value="fr">צרפתית</SelectItem>
                        <SelectItem value="de">גרמנית</SelectItem>
                        <SelectItem value="es">ספרדית</SelectItem>
                        <SelectItem value="ru">רוסית</SelectItem>
                        {supportedLanguages.map(lang => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}
            
            {/* Compression options */}
            {showCompressionOptions && (
              <div className="space-y-3">
                <Label className="text-sm text-gray-700 mb-1 block">רמת דחיסה</Label>
                <RadioGroup 
                  value={compressionLevel}
                  onValueChange={(value) => {
                    setCompressionLevel(value);
                    updateOptions();
                  }}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2 ml-2">
                    <RadioGroupItem value="low" id="compression-low" />
                    <Label htmlFor="compression-low" className="text-sm">נמוכה</Label>
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    <RadioGroupItem value="medium" id="compression-medium" />
                    <Label htmlFor="compression-medium" className="text-sm">בינונית</Label>
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    <RadioGroupItem value="high" id="compression-high" />
                    <Label htmlFor="compression-high" className="text-sm">גבוהה</Label>
                  </div>
                </RadioGroup>
                <p className="text-xs text-gray-500 mt-1">
                  דחיסה גבוהה = קובץ קטן יותר, אך תיתכן פגיעה באיכות
                </p>
              </div>
            )}
            
            {/* Document specific options */}
            {showDocumentOptions && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="preserve-layout" className="text-sm text-gray-700">
                    שמירה על פריסת המסמך
                  </Label>
                  <Switch 
                    id="preserve-layout" 
                    checked={preserveLayout}
                    onCheckedChange={(checked) => {
                      setPreserveLayout(checked);
                      updateOptions();
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-editing" className="text-sm text-gray-700">
                    אפשר עריכה
                  </Label>
                  <Switch 
                    id="enable-editing" 
                    checked={enableEditing}
                    onCheckedChange={(checked) => {
                      setEnableEditing(checked);
                      updateOptions();
                    }}
                  />
                </div>
              </div>
            )}
          </TabsContent>
          
          {showAiOptions && (
            <TabsContent value="ai" className="mt-2 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ai-enhance" className="text-sm text-gray-700 flex items-center">
                    <Wand2 className="mr-2 h-4 w-4 text-purple-500" />
                    שיפור אוטומטי עם AI
                  </Label>
                  <Switch 
                    id="ai-enhance" 
                    checked={aiEnhance}
                    onCheckedChange={(checked) => {
                      setAiEnhance(checked);
                      updateOptions();
                    }}
                  />
                </div>
                
                {aiEnhance && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    {['image_enhance', 'text_clarity', 'color_correction', 'noise_reduction'].map(enhancement => (
                      <div 
                        key={enhancement}
                        className={`
                          border rounded-lg p-3 cursor-pointer transition-colors
                          ${selectedAiEnhancements.includes(enhancement) 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-200'}
                        `}
                        onClick={() => toggleAiEnhancement(enhancement)}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-2 ${
                            selectedAiEnhancements.includes(enhancement) 
                              ? 'bg-blue-500' 
                              : 'bg-gray-200'
                          }`}>
                            {selectedAiEnhancements.includes(enhancement) && (
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {enhancement === 'image_enhance' && 'שיפור תמונה'}
                            {enhancement === 'text_clarity' && 'שיפור בהירות טקסט'}
                            {enhancement === 'color_correction' && 'תיקון צבע'}
                            {enhancement === 'noise_reduction' && 'הפחתת רעש'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          )}
          
          <TabsContent value="advanced" className="mt-2 space-y-4">
            {/* File Security */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="password-protect" className="text-sm text-gray-700 flex items-center">
                  <Lock className="mr-2 h-4 w-4 text-gray-600" />
                  הגנת סיסמה
                </Label>
                <Switch 
                  id="password-protect" 
                  checked={enablePassword}
                  onCheckedChange={(checked) => {
                    setEnablePassword(checked);
                    updateOptions();
                  }}
                />
              </div>
              
              {enablePassword && (
                <div className="mt-2">
                  <Input
                    type="password"
                    placeholder="הכנס סיסמה להגנה על הקובץ"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      updateOptions();
                    }}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    הסיסמה לא ניתנת לשחזור - אנא שמור אותה במקום בטוח
                  </p>
                </div>
              )}
            </div>
            
            {/* Additional settings based on conversion type */}
            {conversionType === 'document' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="optimize-scan" className="text-sm text-gray-700">
                    אופטימיזציה למסמך סרוק
                  </Label>
                  <Switch 
                    id="optimize-scan" 
                    checked={selectedAiEnhancements.includes('scan_optimization')}
                    onCheckedChange={(checked) => {
                      toggleAiEnhancement('scan_optimization');
                    }}
                  />
                </div>
              </div>
            )}
            
            {['audio', 'video'].includes(conversionType) && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="optimize-media" className="text-sm text-gray-700">
                    שיפור איכות מדיה
                  </Label>
                  <Switch 
                    id="optimize-media" 
                    checked={selectedAiEnhancements.includes('media_enhancement')}
                    onCheckedChange={(checked) => {
                      toggleAiEnhancement('media_enhancement');
                    }}
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}