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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* 通知提示 */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
        >
          情绪记录已保存！
        </motion.div>
      )}

      {/* 页面内容 */}
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

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setCurrentPage(item.key)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                currentPage === item.key
                  ? 'text-purple-600'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
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
          className="fixed bottom-24 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-40"
        >
          <Bot className="w-6 h-6" />
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