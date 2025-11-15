'use client';

import Link from 'next/link';
import { Heart, BarChart3, MessageCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const Navigation = () => {
  const navItems = [
    { href: '/', label: '情绪输入', icon: Heart },
    { href: '/wall', label: '情绪墙', icon: MessageCircle },
    { href: '/stats', label: '数据分析', icon: BarChart3 },
    { href: '/about', label: '关于', icon: Info },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm shadow-soft sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-pink-300 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-800">心情小屋</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 text-gray-600 hover:text-sky-600 transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div className="flex items-center space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="p-2 text-gray-600 hover:text-sky-600 transition-colors duration-200"
                    title={item.label}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;