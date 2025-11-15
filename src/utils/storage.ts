import { EmotionEntry } from '@/types/emotion';

const EMOTION_STORAGE_KEY = 'emotion_entries';

export const saveEmotionEntry = (entry: EmotionEntry): void => {
  try {
    const existingEntries = getEmotionEntries();
    const updatedEntries = [entry, ...existingEntries];
    localStorage.setItem(EMOTION_STORAGE_KEY, JSON.stringify(updatedEntries));
  } catch (error) {
    console.error('Error saving emotion entry:', error);
  }
};

export const getEmotionEntries = (): EmotionEntry[] => {
  try {
    const stored = localStorage.getItem(EMOTION_STORAGE_KEY);
    if (!stored) return [];
    
    const entries = JSON.parse(stored);
    // 恢复日期对象
    return entries.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp)
    }));
  } catch (error) {
    console.error('Error loading emotion entries:', error);
    return [];
  }
};

export const deleteEmotionEntry = (id: string): void => {
  try {
    const existingEntries = getEmotionEntries();
    const filteredEntries = existingEntries.filter(entry => entry.id !== id);
    localStorage.setItem(EMOTION_STORAGE_KEY, JSON.stringify(filteredEntries));
  } catch (error) {
    console.error('Error deleting emotion entry:', error);
  }
};

export const clearAllEmotions = (): void => {
  try {
    localStorage.removeItem(EMOTION_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing emotion entries:', error);
  }
};

// 获取情绪统计
export const getEmotionStats = (entries: EmotionEntry[]) => {
  const stats = entries.reduce((acc, entry) => {
    acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return stats;
};

// 按日期分组
export const groupEntriesByDate = (entries: EmotionEntry[]) => {
  const grouped = entries.reduce((acc, entry) => {
    const dateKey = entry.timestamp.toISOString().split('T')[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(entry);
    return acc;
  }, {} as Record<string, EmotionEntry[]>);

  return grouped;
};