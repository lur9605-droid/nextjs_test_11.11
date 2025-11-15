import { EmotionType } from '@/types/emotion';

// 简单的关键词情绪分析
const EMOTION_KEYWORDS: Record<EmotionType, string[]> = {
  happy: ['开心', '快乐', '高兴', '兴奋', '愉快', '幸福', '满足', '喜悦', '爽', '棒', '好', '爱', '喜欢', '美好', '完美', '赞', '太好了', '哈哈', '嘻嘻', '笑'],
  sad: ['难过', '伤心', '悲伤', '痛苦', '哭', '流泪', '失望', '沮丧', '低落', '郁闷', '不开心', '难受', '心碎', '痛', '失去', '分离', '孤独', '寂寞'],
  angry: ['生气', '愤怒', '恼火', '烦躁', '讨厌', '恨', '气愤', '暴怒', '不满', '抱怨', '可恶', '混蛋', '去死', '烦死了', '气死了'],
  anxious: ['焦虑', '担心', '紧张', '不安', '害怕', '恐惧', '忧虑', '慌张', '忐忑', '心慌', '压力', '着急', '急躁', '急躁', '恐慌'],
  calm: ['平静', '安静', '淡定', '放松', '舒适', '安心', '宁静', '祥和', '悠闲', '轻松', '自然', '温和', '温柔', '稳定'],
  love: ['爱', '喜欢', '想念', '思念', '恋爱', '心动', '甜蜜', '浪漫', '温馨', '幸福', '拥抱', '亲吻', '爱人', '恋人', '心上人'],
  confused: ['困惑', '迷茫', '疑惑', '不解', '糊涂', '混乱', '复杂', '纠结', '犹豫', '不确定', '不知道', '搞不懂', '不明白'],
  excited: ['激动', '兴奋', '振奋', '热情', '激情', '热烈', '狂热', '高涨', '澎湃', '沸腾', '雀跃', '欢呼', '喝彩'],
  tired: ['累', '疲惫', '疲倦', '困', '乏力', '无力', '精疲力尽', '疲惫不堪', '困倦', '瞌睡', '没精神', '没力气'],
  grateful: ['感谢', '感恩', '感激', '谢谢', '多谢', '恩情', '恩情', '恩德', '铭记', '难忘', '感动', '感慨']
};

export const analyzeEmotion = (text: string): EmotionType | null => {
  if (!text) return null;

  const scores: Record<EmotionType, number> = {
    happy: 0, sad: 0, angry: 0, anxious: 0, calm: 0, 
    love: 0, confused: 0, excited: 0, tired: 0, grateful: 0
  };

  // 计算每个情绪的关键词匹配次数
  Object.entries(EMOTION_KEYWORDS).forEach(([emotion, keywords]) => {
    keywords.forEach(keyword => {
      const matches = (text.match(new RegExp(keyword, 'g')) || []).length;
      scores[emotion as EmotionType] += matches;
    });
  });

  // 找到得分最高的情绪
  let maxScore = 0;
  let dominantEmotion: EmotionType | null = null;

  Object.entries(scores).forEach(([emotion, score]) => {
    if (score > maxScore) {
      maxScore = score;
      dominantEmotion = emotion as EmotionType;
    }
  });

  return dominantEmotion;
};

// 获取安慰语
export const getComfortMessage = (emotion: EmotionType): string => {
  const comfortMessages: Record<EmotionType, string[]> = {
    happy: [
      '你的快乐像阳光一样温暖，继续保持这份美好！',
      '看到你开心，我也感到幸福。愿这份快乐永远伴随着你。',
      '快乐是会传染的，谢谢你分享这份正能量！'
    ],
    sad: [
      '每个人都会有低落的时候，这很正常。请记住，乌云后面总有阳光。',
      '你的感受很重要，允许自己悲伤也是一种勇气。我在这里陪伴你。',
      '虽然现在很艰难，但请相信，这一切都会过去。你比你想象的更坚强。'
    ],
    angry: [
      '愤怒是内心在告诉你有些事情需要改变。深呼吸，让我们一起找到解决的方法。',
      '你的愤怒是可以理解的。给自己一点时间，让情绪慢慢平静下来。',
      '愤怒背后往往藏着受伤的心。照顾好自己，你值得被温柔对待。'
    ],
    anxious: [
      '焦虑是大脑在试图保护你。深呼吸，一切都会好起来的。',
      '现在的担心很真实，但请记住，你已经在尽力了。一步一步来，没关系的。',
      '焦虑像海浪，会来也会走。你不需要独自面对，我在这里支持你。'
    ],
    calm: [
      '内心的平静是最珍贵的财富。继续保持这份宁静与和谐。',
      '你的平静让人感到安心。这份内在的稳定是你最好的伙伴。',
      '平静不是没有风暴，而是学会在风暴中心找到宁静。你做得很棒！'
    ],
    love: [
      '爱是这个世界上最美好的力量。愿你的爱被温柔回应。',
      '能够去爱本身就是一种幸福。珍惜这份美好的情感。',
      '爱让世界变得更美好。谢谢你的分享，愿爱永远伴随着你。'
    ],
    confused: [
      '困惑是成长的开始。每一个疑问都是通向理解的路标。',
      '不知道答案也没关系，探索的过程本身就是一种收获。',
      '迷茫的时候，不妨先停下来听听内心的声音。答案就在你心里。'
    ],
    excited: [
      '你的兴奋很有感染力！享受这份激动，让热情带你飞向更远的地方。',
      '兴奋是生活在对你微笑。抓住这份能量，创造更多美好！',
      '看到你这么有激情，真为你高兴。愿这份兴奋带来更多惊喜！'
    ],
    tired: [
      '累了就休息一下吧，照顾好自己是最重要的。你值得被温柔对待。',
      '疲惫是身体在提醒你需要休息。慢一点，给自己一些喘息的空间。',
      '每个人都会有累的时候，这很正常。休息是为了走更远的路。'
    ],
    grateful: [
      '感恩的心让生活充满阳光。继续保持这份感恩，世界会因你而更美丽。',
      '能够感恩本身就是一种幸福。谢谢你的分享，愿美好永远环绕着你。',
      '感恩是心灵的阳光。你的感激之情让人感受到温暖和希望。'
    ]
  };

  const messages = comfortMessages[emotion];
  return messages[Math.floor(Math.random() * messages.length)];
};