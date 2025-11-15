'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart } from 'lucide-react';
import { EmotionEntry, EmotionType, EMOTION_LABELS } from '@/types/emotion';
import { saveEmotionEntry } from '@/utils/storage';
import { analyzeEmotion } from '@/utils/emotionAnalyzer';
import { generateAIResponse } from '@/services/kimiService';

interface EmotionInputProps {
  onEmotionSubmitted?: (entry: EmotionEntry) => void;
}

const EmotionInput = ({ onEmotionSubmitted }: EmotionInputProps) => {
  const [text, setText] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>('calm');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const emotionTypes: EmotionType[] = [
    'happy', 'sad', 'angry', 'anxious', 'calm', 'love', 'excited', 'tired', 'grateful', 'confused'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // 分析情绪
      const detectedEmotion = analyzeEmotion(text) || selectedEmotion;
      
      // 生成AI回复
      let aiResponse = '';
      try {
        aiResponse = await generateAIResponse(detectedEmotion, text);
      } catch (error) {
        console.error('AI回复生成失败:', error);
        aiResponse = '';
      }
      
      const entry: EmotionEntry = {
        id: Date.now().toString(),
        text: text.trim(),
        emotion: detectedEmotion,
        timestamp: new Date(),
        color: EMOTION_LABELS[detectedEmotion].split(' ')[1] || 'blue',
        aiResponse: aiResponse || undefined,
      };

      // 保存到localStorage
      saveEmotionEntry(entry);
      
      // 通知父组件
      onEmotionSubmitted?.(entry);

      // 显示感谢动画
      setShowThankYou(true);
      setTimeout(() => {
        setShowThankYou(false);
      }, 3000);

      // 清空输入
      setText('');
    } catch (error) {
      console.error('Error submitting emotion:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-warm p-8 max-w-2xl mx-auto border border-warm-200"
    >
      <div className="text-center mb-8">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center space-x-3 mb-4"
        >
          <div className="relative">
            <Heart className="w-8 h-8 text-petal-400 drop-shadow-sm" />
            <div className="absolute inset-0 bg-petal-400/20 rounded-full blur-lg"></div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-petal-600 to-lavender-600 bg-clip-text text-transparent">
            分享你的心情
          </h2>
        </motion.div>
        <p className="text-sky-600 text-lg leading-relaxed">在这里记录你的情绪，让心灵得到温柔的释放</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 情绪选择 */}
        <div>
          <label className="block text-base font-semibold text-sky-700 mb-4">
            选择你的情绪
          </label>
          <div className="grid grid-cols-5 gap-3">
            {emotionTypes.map((emotion) => (
              <motion.button
                key={emotion}
                type="button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedEmotion(emotion)}
                className={`p-4 rounded-2xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                  selectedEmotion === emotion
                    ? 'bg-gradient-to-br from-petal-100 to-petal-200 text-petal-800 ring-2 ring-petal-300 shadow-soft'
                    : 'bg-white/60 text-sky-700 hover:bg-white/80 hover:shadow-soft border border-warm-200'
                }`}
              >
                <div className={`w-2 h-2 rounded-full mb-1 mx-auto ${
                  emotion === 'happy' ? 'bg-yellow-400' :
                  emotion === 'sad' ? 'bg-blue-400' :
                  emotion === 'angry' ? 'bg-red-400' :
                  emotion === 'anxious' ? 'bg-purple-400' :
                  emotion === 'calm' ? 'bg-green-400' :
                  emotion === 'love' ? 'bg-pink-400' :
                  emotion === 'excited' ? 'bg-orange-400' :
                  emotion === 'tired' ? 'bg-gray-400' :
                  emotion === 'grateful' ? 'bg-indigo-400' : 'bg-yellow-400'
                }`}></div>
                {EMOTION_LABELS[emotion]}
                {selectedEmotion === emotion && (
                  <motion.div
                    layoutId="selectedEmotion"
                    className="absolute inset-0 bg-petal-400/10 rounded-2xl"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* 文本输入 */}
        <div>
          <label htmlFor="emotion-text" className="block text-base font-semibold text-sky-700 mb-3">
            描述你的感受
          </label>
          <textarea
            id="emotion-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className="w-full px-5 py-4 border-2 border-warm-200 rounded-2xl focus:ring-3 focus:ring-petal-300 focus:border-petal-400 resize-none transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-700 placeholder-warm-400 shadow-soft focus:shadow-gentle"
            placeholder="今天发生了什么？你的感受如何？在这里倾诉你的心声..."
            required
          />
        </div>

        {/* 提交按钮 */}
        <motion.button
          type="submit"
          disabled={isSubmitting || !text.trim()}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-petal-400 via-petal-500 to-lavender-500 text-white py-4 px-8 rounded-2xl font-semibold text-lg shadow-warm hover:shadow-gentle transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden flex items-center justify-center space-x-3"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>正在记录...</span>
            </>
          ) : (
            <>
              <span>记录心情</span>
              <Heart className="w-5 h-5" />
            </>
          )}
          {!isSubmitting && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          )}
        </motion.button>
      </form>

      {/* 感谢动画 */}
      {showThankYou && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.6, repeat: 2 }}
            className="bg-gradient-to-br from-white/95 to-warm-50/95 rounded-3xl p-10 text-center shadow-2xl border border-warm-200 backdrop-blur-lg"
          >
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: 2 }}
              className="text-7xl mb-6"
            >
              🙏
            </motion.div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-petal-600 to-lavender-600 bg-clip-text text-transparent mb-3">
              感谢分享
            </h3>
            <p className="text-sky-600 text-lg leading-relaxed">你的心声已被温柔记录，愿每一天都充满温暖与力量</p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmotionInput;