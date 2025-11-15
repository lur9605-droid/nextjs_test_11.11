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
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-gentle p-6 max-w-2xl mx-auto"
    >
      <div className="text-center mb-6">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center space-x-2 mb-2"
        >
          <Heart className="w-6 h-6 text-pink-400" />
          <h2 className="text-2xl font-semibold text-gray-800">分享你的心情</h2>
        </motion.div>
        <p className="text-gray-600">在这里记录你的情绪，让心灵得到释放</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 情绪选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            选择你的情绪
          </label>
          <div className="grid grid-cols-5 gap-2">
            {emotionTypes.map((emotion) => (
              <motion.button
                key={emotion}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedEmotion(emotion)}
                className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedEmotion === emotion
                    ? 'bg-sky-100 text-sky-700 ring-2 ring-sky-300'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {EMOTION_LABELS[emotion]}
              </motion.button>
            ))}
          </div>
        </div>

        {/* 文本输入 */}
        <div>
          <label htmlFor="emotion-text" className="block text-sm font-medium text-gray-700 mb-2">
            描述你的感受
          </label>
          <textarea
            id="emotion-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="今天发生了什么？你的感受如何？"
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-300 focus:border-sky-300 resize-none transition-all duration-200"
            rows={4}
            required
          />
        </div>

        {/* 提交按钮 */}
        <motion.button
          type="submit"
          disabled={isSubmitting || !text.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-sky-400 to-pink-300 text-white py-3 px-6 rounded-xl font-medium shadow-soft hover:shadow-gentle transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>分析中...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>分享心情</span>
            </>
          )}
        </motion.button>
      </form>

      {/* 感谢界面 */}
      {showThankYou && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="bg-white rounded-3xl p-8 text-center max-w-sm mx-4 shadow-2xl border border-pink-100"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <Heart className="w-10 h-10 text-white" />
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-bold text-gray-800 mb-3"
            >
              谢谢你的分享
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-gray-600 text-lg leading-relaxed"
            >
              你的情绪已经被温柔地记录下来了
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 flex justify-center space-x-2"
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9 + i * 0.1, type: "spring" }}
                  className="w-2 h-2 bg-pink-400 rounded-full"
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmotionInput;