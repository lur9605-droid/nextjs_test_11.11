export interface EmotionEntry {
  id: string;
  text: string;
  emotion: EmotionType;
  timestamp: Date;
  color: string;
  aiResponse?: string;
}

export type EmotionType = 
  | 'happy' 
  | 'sad' 
  | 'angry' 
  | 'anxious' 
  | 'calm' 
  | 'love' 
  | 'confused' 
  | 'excited' 
  | 'tired' 
  | 'grateful';

export const EMOTION_COLORS: Record<EmotionType, string> = {
  happy: 'bg-emotion-happy',
  sad: 'bg-emotion-sad',
  angry: 'bg-emotion-angry',
  anxious: 'bg-emotion-anxious',
  calm: 'bg-emotion-calm',
  love: 'bg-emotion-love',
  confused: 'bg-yellow-400',
  excited: 'bg-orange-400',
  tired: 'bg-gray-400',
  grateful: 'bg-emotion-grateful'
};

export const EMOTION_LABELS: Record<EmotionType, string> = {
  happy: '😊 快乐',
  sad: '😢 悲伤',
  angry: '😠 愤怒',
  anxious: '😰 焦虑',
  calm: '😌 平静',
  love: '❤️ 爱',
  confused: '🤔 困惑',
  excited: '🤗 兴奋',
  tired: '😴 疲惫',
  grateful: '🙏 感恩'
};

export const EMOTION_EMOJIS: Record<EmotionType, string> = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  anxious: '😰',
  calm: '😌',
  love: '❤️',
  confused: '🤔',
  excited: '🤗',
  tired: '😴',
  grateful: '🙏'
};