'use client';

import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="bg-cream-50 border-t border-cream-200 mt-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Heart Icon with Animation */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            className="flex items-center space-x-2 text-pink-400"
          >
            <Heart className="w-5 h-5" />
            <span className="text-sm text-gray-600">用心记录每一个情绪</span>
          </motion.div>

          {/* Quote */}
          <div className="text-center">
            <p className="text-gray-500 text-sm italic">
              "每一个情绪都是内心的信使，值得被温柔对待"
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-gray-400 text-xs">
              © 2024 心情小屋. 用爱打造的情绪空间
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;