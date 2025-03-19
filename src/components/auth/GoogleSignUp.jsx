import React from 'react';
import { Button } from "@/components/ui/button";
import { User } from '@/api/entities';
import { toast } from "@/components/ui/use-toast";
import { 
  LogIn, 
  Mail, 
  Shield,
  CheckCircle 
} from 'lucide-react';
import { motion } from "framer-motion";

export default function GoogleSignUp() {
  const handleSignUp = async () => {
    try {
      await User.login(); // This will redirect to Google login
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect with Google. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          הצטרף ל-MagicFile.ai
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          המר קבצים, סרוק מסמכים ועוד - בחינם
        </p>
      </motion.div>

      <div className="space-y-6 w-full">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            היתרונות שלך:
          </h3>
          <ul className="space-y-2">
            {[
              'שמירת היסטוריית המרות',
              'סנכרון בין מכשירים',
              'גיבוי אוטומטי',
              'הגדרות מותאמות אישית'
            ].map((benefit, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center text-gray-700 dark:text-gray-300"
              >
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                {benefit}
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            onClick={handleSignUp}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl flex items-center justify-center gap-3"
          >
            <Mail className="w-5 h-5" />
            התחבר עם Google
          </Button>
        </motion.div>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
          על ידי הרשמה אתה מסכים ל
          <a href="/terms" className="text-blue-600 hover:underline mx-1">תנאי השימוש</a>
          ול
          <a href="/privacy" className="text-blue-600 hover:underline mx-1">מדיניות הפרטיות</a>
          שלנו
        </p>
      </div>
    </div>
  );
}