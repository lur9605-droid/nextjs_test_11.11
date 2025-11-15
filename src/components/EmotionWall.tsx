'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, Filter, Sparkles } from 'lucide-react';
import { EmotionEntry, EmotionType, EMOTION_LABELS, EMOTION_COLORS, EMOTION_EMOJIS } from '@/types/emotion';
import { deleteEmotionEntry } from '@/utils/storage';
import { getComfortMessage } from '@/utils/emotionAnalyzer';

interface EmotionWallProps {
  entries: EmotionEntry[];
  onEntriesUpdate?: () => void;
}

const EmotionWall = ({ entries, onEntriesUpdate }: EmotionWallProps) => {
  const [filter, setFilter] = useState<EmotionType | 'all'>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const emotionTypes: (EmotionType | 'all')[] = ['all', 'happy', 'sad', 'angry', 'anxious', 'calm', 'love', 'excited', 'tired', 'grateful', 'confused'];

  const filteredEntries = filter === 'all' 
    ? entries 
    : entries.filter(entry => entry.emotion === filter);

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这条情绪记录吗？')) {
      deleteEmotionEntry(id);
      onEntriesUpdate?.();
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (entries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-warm p-10 max-w-md mx-auto border border-warm-200">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-20 h-20 bg-gradient-to-br from-petal-200 to-lavender-200 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Heart className="w-10 h-10 text-petal-500 drop-shadow-sm" />
            <div className="absolute inset-0 bg-petal-300/20 rounded-full blur-lg"></div>
          </motion.div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-petal-600 to-lavender-600 bg-clip-text text-transparent mb-3">
            还没有情绪记录
          </h3>
          <p className="text-sky-600 text-lg leading-relaxed">开始记录你的第一个情绪吧，让美好从这里开始！</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 过滤器 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-warm p-6 border border-warm-200"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="relative">
            <Filter className="w-5 h-5 text-sky-600" />
            <div className="absolute inset-0 bg-sky-400/20 rounded-full blur"></div>
          </div>
          <span className="text-base font-semibold text-sky-700">筛选情绪</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {emotionTypes.map((emotion) => (
            <motion.button
              key={emotion}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(emotion)}
              className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                filter === emotion
                  ? 'bg-gradient-to-br from-petal-100 to-petal-200 text-petal-800 ring-2 ring-petal-300 shadow-soft'
                  : 'bg-white/60 text-sky-700 hover:bg-white/80 hover:shadow-soft border border-warm-200'
              }`}
            >
              {emotion === 'all' ? '全部' : EMOTION_LABELS[emotion]}
              {filter === emotion && (
                <motion.div
                  layoutId="selectedFilter"
                  className="absolute inset-0 bg-petal-400/10 rounded-2xl"
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* 情绪气泡墙 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.02, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              onHoverStart={() => setHoveredId(entry.id)}
              onHoverEnd={() => setHoveredId(null)}
              className={`relative bg-white/90 backdrop-blur-lg rounded-3xl shadow-warm border border-warm-200 hover:shadow-gentle transition-all duration-300 cursor-pointer overflow-hidden ${
                hoveredId === entry.id ? 'shadow-gentle scale-105' : ''
              }`}
            >
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="p-6"
              >
                {/* 情绪标签 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-soft ${EMOTION_COLORS[entry.emotion]}`}
                    >
                      {EMOTION_EMOJIS[entry.emotion]}
                    </motion.div>
                    <div>
                      <h3 className="font-bold text-sky-800 text-xl mb-1">
                        {EMOTION_LABELS[entry.emotion]}
                      </h3>
                      <p className="text-sm text-sky-600 font-medium">
                        {formatDate(entry.timestamp)}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(entry.id)}
                    className="p-3 text-warm-400 hover:text-red-500 transition-all duration-300 rounded-full hover:bg-red-50/80 backdrop-blur-sm"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* 情绪文本 */}
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                  className="text-gray-700 mb-4 leading-relaxed text-base bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-warm-100"
                >
                  {entry.text}
                </motion.p>

                {/* 时间戳 */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div />
                  {hoveredId === entry.id && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center space-x-1"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>点击查看安慰</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* 安慰语悬停显示 */}
              {hoveredId === entry.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-2 left-6 right-6 bg-gradient-to-r from-petal-100 to-lavender-100 text-petal-700 text-sm p-4 rounded-2xl shadow-gentle border border-petal-200 z-10 backdrop-blur-sm"
                >
                  <div className="flex items-start space-x-3">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 15 }}
                      className="flex-shrink-0"
                    >
                      <Sparkles className="w-4 h-4 mt-0.5 text-petal-500" />
                    </motion.div>
                    <span className="font-medium">{getComfortMessage(entry.emotion)}</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 统计信息 */}
      {filteredEntries.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft p-4 text-center"
        >
          <p className="text-gray-600">
            共显示了 <span className="font-semibold text-sky-600">{filteredEntries.length}</span> 条情绪记录
            {filter !== 'all' && (
              <span>，筛选条件：<span className="font-semibold text-pink-600">{EMOTION_LABELS[filter]}</span></span>
            )}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default EmotionWall;