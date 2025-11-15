'use client';

import { motion } from 'framer-motion';
import { Heart, Sparkles, Users, Target, Gift, Coffee } from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: Heart,
      title: '情绪记录',
      description: '简单直观地记录每日情绪变化，用文字表达内心感受'
    },
    {
      icon: Sparkles,
      title: 'AI 智能回复',
      description: '集成 Kimi AI，为每个情绪提供温暖、理解的智能回应'
    },
    {
      icon: Users,
      title: '情绪墙',
      description: '以美丽的气泡形式展示所有情绪记录，支持筛选和回顾'
    },
    {
      icon: Target,
      title: '数据洞察',
      description: '通过图表分析情绪趋势，了解自己的情绪模式和变化'
    }
  ];

  const values = [
    {
      icon: Gift,
      title: '免费使用',
      description: '完全免费的情绪管理工具，让每个人都能关注心理健康'
    },
    {
      icon: Coffee,
      title: '温暖治愈',
      description: '用温柔的方式陪伴你度过每一个情绪波动，给予理解和支持'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 头部介绍 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center space-x-2 mb-6"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-pink-300 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800">心情小屋</h1>
        </motion.div>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          一个温暖、治愈的情绪记录空间。在这里，每一个情绪都值得被温柔对待，
          每一份感受都能找到理解和陪伴。
        </p>
      </motion.div>

      {/* 核心理念 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-gentle p-8 mb-8"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">我们的理念</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.2, duration: 0.5 }}
                className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-sky-50 to-pink-50"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-pink-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 主要功能 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-gentle p-8 mb-8"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">主要功能</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="p-6 rounded-xl border border-gray-100 hover:shadow-soft transition-all duration-200"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-pink-300 rounded-full flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 技术说明 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-gentle p-8 mb-8"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">技术特色</h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="p-4">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="font-semibold text-gray-800 mb-2">治愈系设计</h3>
            <p className="text-gray-600 text-sm">采用温暖的色彩搭配和柔和的动画效果，营造舒适的使用体验</p>
          </div>
          <div className="p-4">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-semibold text-gray-800 mb-2">响应式布局</h3>
            <p className="text-gray-600 text-sm">完美适配移动端和桌面端，随时随地记录情绪</p>
          </div>
          <div className="p-4">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold text-gray-800 mb-2">隐私保护</h3>
            <p className="text-gray-600 text-sm">所有数据本地存储，保护用户隐私安全</p>
          </div>
        </div>
      </motion.div>

      {/* 创作者信息 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="bg-gradient-to-r from-sky-100 to-pink-100 rounded-2xl shadow-gentle p-8 text-center"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">创作者的话</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          在这个快节奏的时代，我们常常忽略了内心的声音。创建这个应用的初衷，
          是希望能为每个人提供一个温柔的空间，让情绪得到释放和理解。
        </p>
        <p className="text-gray-700 leading-relaxed">
          愿这个小小的"心情小屋"能成为你心灵的避风港，
          在这里，每一个情绪都值得被温柔对待。❤️
        </p>
        
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-6"
        >
          <div className="inline-flex items-center space-x-2 text-pink-500">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">用爱打造的情绪空间</span>
            <Heart className="w-4 h-4" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutPage;