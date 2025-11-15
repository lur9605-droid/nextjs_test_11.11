'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { EmotionEntry, EmotionType, EMOTION_LABELS, EMOTION_COLORS } from '@/types/emotion';
import { getEmotionStats, groupEntriesByDate } from '@/utils/storage';

interface EmotionChartsProps {
  entries: EmotionEntry[];
}

const EmotionCharts = ({ entries }: EmotionChartsProps) => {
  // 情绪统计
  const emotionStats = useMemo(() => getEmotionStats(entries), [entries]);
  
  // 饼图数据
  const pieData = useMemo(() => {
    return Object.entries(emotionStats).map(([emotion, count]) => ({
      name: EMOTION_LABELS[emotion as EmotionType],
      value: count,
      emotion: emotion as EmotionType
    }));
  }, [emotionStats]);

  // 趋势数据（最近7天）
  const trendData = useMemo(() => {
    const grouped = groupEntriesByDate(entries);
    const today = new Date();
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const dayEntries = grouped[dateKey] || [];
      
      // 计算当天的情绪分布
      const dayStats = getEmotionStats(dayEntries);
      
      last7Days.push({
        date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
        total: dayEntries.length,
        happy: dayStats.happy || 0,
        sad: dayStats.sad || 0,
        calm: dayStats.calm || 0,
        anxious: dayStats.anxious || 0,
        angry: dayStats.angry || 0
      });
    }
    
    return last7Days;
  }, [entries]);

  // 情绪颜色映射
  const COLORS = {
    happy: '#fbbf24',
    sad: '#60a5fa',
    angry: '#f87171',
    anxious: '#a78bfa',
    calm: '#34d399',
    love: '#f472b6',
    confused: '#f59e0b',
    excited: '#fb923c',
    tired: '#9ca3af',
    grateful: '#10b981'
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-gentle border border-gray-200">
          <p className="font-medium text-gray-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (entries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-gentle p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-sky-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">暂无数据</h3>
          <p className="text-gray-600">记录一些情绪数据后，这里会显示美丽的图表！</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 概览卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft p-6 text-center">
          <div className="text-3xl font-bold text-sky-600">{entries.length}</div>
          <div className="text-sm text-gray-600 mt-1">总记录数</div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft p-6 text-center">
          <div className="text-3xl font-bold text-pink-600">
            {Object.keys(emotionStats).length}
          </div>
          <div className="text-sm text-gray-600 mt-1">情绪类型</div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft p-6 text-center">
          <div className="text-3xl font-bold text-green-600">
            {emotionStats.happy || 0}
          </div>
          <div className="text-sm text-gray-600 mt-1">快乐次数</div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">
            {new Set(entries.map(e => e.timestamp.toDateString())).size}
          </div>
          <div className="text-sm text-gray-600 mt-1">活跃天数</div>
        </div>
      </motion.div>

      {/* 图表网格 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 情绪分布饼图 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">情绪分布</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.emotion]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* 情绪统计柱状图 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">情绪统计</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pieData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.emotion]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* 7天趋势图 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft p-6 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">最近7天情绪趋势</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="happy" 
                stroke={COLORS.happy} 
                strokeWidth={3}
                dot={{ fill: COLORS.happy, strokeWidth: 2, r: 4 }}
                name="快乐"
              />
              <Line 
                type="monotone" 
                dataKey="sad" 
                stroke={COLORS.sad} 
                strokeWidth={3}
                dot={{ fill: COLORS.sad, strokeWidth: 2, r: 4 }}
                name="悲伤"
              />
              <Line 
                type="monotone" 
                dataKey="calm" 
                stroke={COLORS.calm} 
                strokeWidth={3}
                dot={{ fill: COLORS.calm, strokeWidth: 2, r: 4 }}
                name="平静"
              />
              <Line 
                type="monotone" 
                dataKey="anxious" 
                stroke={COLORS.anxious} 
                strokeWidth={3}
                dot={{ fill: COLORS.anxious, strokeWidth: 2, r: 4 }}
                name="焦虑"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default EmotionCharts;