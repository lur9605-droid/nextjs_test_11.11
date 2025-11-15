'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Heart, Sparkles, Bot, User, X, ChevronDown, ChevronUp } from 'lucide-react';
import { EmotionType } from '@/types/emotion';
import { generateAIResponse } from '@/services/kimiService';
import { analyzeEmotion } from '@/utils/emotionAnalyzer';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  emotion?: EmotionType;
}

interface AIHealingAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmotion?: EmotionType;
  contextText?: string;
}

const AIHealingAssistant = ({ isOpen, onClose, currentEmotion, contextText }: AIHealingAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 初始化欢迎消息
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: getWelcomeMessage(currentEmotion, contextText),
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, currentEmotion, contextText]);

  // 智能检测情绪并提供主动帮助
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type === 'user') {
        const userText = lastMessage.content.toLowerCase();
        
        // 检测负面情绪词汇
        const negativeWords = ['难过', '痛苦', '绝望', '无助', '孤独', '焦虑', '抑郁', '想死', '自杀'];
        const hasNegativeEmotion = negativeWords.some(word => userText.includes(word));
        
        if (hasNegativeEmotion && !isTyping) {
          // 延迟2秒后提供额外支持
          setTimeout(() => {
            const supportMessage: Message = {
              id: Date.now().toString(),
              type: 'assistant',
              content: '我感受到你现在可能正在经历一些困难。记住，你并不孤单，我在这里陪伴你。如果你觉得情绪很难承受，也可以考虑联系专业的心理咨询师或拨打心理援助热线。',
              timestamp: new Date()
            };
            setMessages(prev => [...prev, supportMessage]);
          }, 2000);
        }
      }
    }
  }, [messages, isTyping]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 聚焦输入框
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  const getWelcomeMessage = (emotion?: EmotionType, context?: string) => {
    if (emotion && context) {
      return `我注意到你现在的情绪是${getEmotionLabel(emotion)}，你说："${context}"\n\n我是你的AI疗愈助手，专门来这里陪伴和支持你的。你可以和我聊聊你的感受，我会用心倾听并提供温暖的建议。`;
    } else if (emotion) {
      return `我感受到你现在的情绪是${getEmotionLabel(emotion)}。我是你的AI疗愈助手，专门来这里陪伴和支持你的。想聊聊发生了什么吗？`;
    }
    return '你好！我是你的AI疗愈助手 🤗\n\n我专门设计来帮助你理解和调节情绪。无论你正在经历什么，我都在这里陪伴你、支持你。请随时和我分享你的感受！';
  };

  const getEmotionLabel = (emotion: EmotionType): string => {
    const labels = {
      happy: '快乐',
      sad: '悲伤',
      angry: '愤怒',
      anxious: '焦虑',
      calm: '平静',
      love: '爱',
      confused: '困惑',
      excited: '兴奋',
      tired: '疲惫',
      grateful: '感恩'
    };
    return labels[emotion] || '未知';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      emotion: currentEmotion
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // 分析用户输入的情绪
      const detectedEmotion = analyzeEmotion(inputMessage);
      
      // 构建对话上下文
      const recentMessages = messages.slice(-3); // 获取最近3条消息
      const conversationContext = recentMessages.map(msg => 
        `${msg.type === 'user' ? '用户' : '疗愈师'}: ${msg.content}`
      ).join('\n');
      
      const fullContext = `对话历史:\n${conversationContext}\n用户最新消息: ${inputMessage}`;
      
      // 生成AI回复
      const aiResponse = await generateAIResponse(detectedEmotion || 'calm', fullContext, true);

      // 添加AI回复
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI回复生成失败:', error);
      
      // 添加错误回复
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: '很抱歉，我暂时无法回复你的消息。但请记得，你的感受很重要，如果情绪困扰持续，建议寻求专业的心理健康支持。我在这里陪伴你。💝',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center pb-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 ${isMinimized ? 'h-16' : 'h-96'} flex flex-col overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="bg-gradient-to-r from-sky-400 to-pink-400 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold">AI疗愈助手</h3>
              <p className="text-xs opacity-90">
                {isTyping ? '正在输入...' : '我在这里陪伴你'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* 消息区域 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-end space-x-2 max-w-xs ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${message.type === 'user' ? 'bg-sky-400' : 'bg-pink-400'}`}>
                        {message.type === 'user' ? <User className="w-3 h-3 text-white" /> : <Heart className="w-3 h-3 text-white" />}
                      </div>
                      <div>
                        <div className={`p-3 rounded-2xl ${message.type === 'user' ? 'bg-sky-100 text-sky-800' : 'bg-pink-50 text-pink-800'} break-words`}>
                          {message.content.split('\n').map((line, index) => (
                            <p key={index} className="mb-1 last:mb-0">{line}</p>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-1 px-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-end space-x-2">
                    <div className="w-6 h-6 rounded-full bg-pink-400 flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-pink-50 p-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* 输入区域 */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-end space-x-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="和我聊聊你的感受..."
                    className="w-full p-3 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-300 focus:border-sky-300 outline-none transition-colors"
                    disabled={isTyping}
                  />
                  <Sparkles className="w-4 h-4 text-gray-400 absolute right-3 top-3.5" />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-3 bg-gradient-to-r from-sky-400 to-pink-400 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AIHealingAssistant;