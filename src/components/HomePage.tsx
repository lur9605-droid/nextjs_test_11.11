'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, BarChart3, MessageCircle, Info, Bot } from 'lucide-react';
import EmotionInput from './EmotionInput';
import EmotionWall from './EmotionWall';
import EmotionCharts from './EmotionCharts';
import AboutPage from './AboutPage';
import AIHealingAssistant from './AIHealingAssistant';
import { getEmotionEntries } from '@/utils/storage';
import { EmotionEntry } from '@/types/emotion';

const navItems = [
  { key: 'input', label: '情绪输入', icon: Heart },
  { key: 'wall', label: '情绪墙', icon: MessageCircle },
  { key: 'charts', label: '数据分析', icon: BarChart3 },
  { key: 'about', label: '关于', icon: Info },
];

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState('input');
  const [emotionEntries, setEmotionEntries] = useState<EmotionEntry[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(true);

  useEffect(() => {
    // 从localStorage加载数据
    const loadEmotionEntries = () => {
      try {
        const entries = getEmotionEntries();
        setEmotionEntries(entries);
      } catch (error) {
        console.error('加载情绪数据失败:', error);
      }
    };

    loadEmotionEntries();

    // 监听localStorage变化
    const handleStorageChange = () => {
      loadEmotionEntries();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // 自定义事件监听
    const handleCustomStorageChange = () => {
      loadEmotionEntries();
    };
    
    window.addEventListener('emotionEntriesUpdated', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('emotionEntriesUpdated', handleCustomStorageChange);
    };
  }, []);

  const handleEmotionSubmitted = () => {
    // 显示通知
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
    
    // 触发数据更新
    const event = new Event('emotionEntriesUpdated');
    window.dispatchEvent(event);
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'wall':
        return (
          <motion.div
            key="wall"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <EmotionWall entries={emotionEntries} onEntriesUpdate={handleEmotionSubmitted} />
          </motion.div>
        );
      case 'charts':
        return (
          <motion.div
            key="charts"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <EmotionCharts entries={emotionEntries} />
          </motion.div>
        );
      case 'about':
        return (
          <motion.div
            key="about"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <AboutPage />
          </motion.div>
        );
      default:
        return (
          <motion.div
            key="input"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <EmotionInput onEmotionSubmitted={handleEmotionSubmitted} />
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-petal-50 to-lavender-50 relative overflow-hidden">
      {/* 装饰性背景元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-petal-200/30 rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-lavender-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-warm-200/25 rounded-full blur-3xl animate-pulse-gentle" style={{animationDelay: '1s'}}></div>
      </div>

      {/* 通知提示 */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 bg-gradient-to-r from-petal-400 to-petal-500 text-white px-6 py-3 rounded-2xl shadow-float backdrop-blur-sm"
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>情绪记录已保存</span>
          </div>
        </motion.div>
      )}

      {/* 页面内容 */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="pb-20"
          >
            {renderCurrentPage()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-warm-200 shadow-gentle">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          {navItems.map((item) => (
            <motion.button
              key={item.key}
              onClick={() => setCurrentPage(item.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 relative ${
                currentPage === item.key
                  ? 'text-petal-600'
                  : 'text-sky-600 hover:text-petal-600'
              }`}
            >
              <motion.div
                animate={currentPage === item.key ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <item.icon className="w-5 h-5 mb-1" />
                {currentPage === item.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-petal-500 rounded-full"
                  />
                )}
              </motion.div>
              <span className="text-xs font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </nav>

      {/* 重新打开AI助手的按钮 */}
      {!isAIAssistantOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsAIAssistantOpen(true)}
          className="fixed bottom-24 right-4 bg-gradient-to-r from-lavender-500 to-petal-500 text-white p-4 rounded-2xl shadow-float backdrop-blur-sm hover:shadow-warm transition-all duration-300 z-40"
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-petal-400 rounded-full animate-pulse"></div>
          </div>
        </motion.button>
      )}

      {/* AI疗愈助手 */}
      <AIHealingAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        currentEmotion={emotionEntries.length > 0 ? emotionEntries[emotionEntries.length - 1].emotion : 'calm'}
        contextText={emotionEntries.length > 0 ? emotionEntries[emotionEntries.length - 1].text : ''}
      />
    </div>
  );
}