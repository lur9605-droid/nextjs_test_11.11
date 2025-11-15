import { EmotionType, EMOTION_LABELS } from '@/types/emotion';

const API_KEY = process.env.KIMI_API_KEY || process.env.NEXT_PUBLIC_KIMI_API_KEY;
const API_URL = 'https://api.moonshot.cn/v1/chat/completions';

interface KimiResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const generateAIResponse = async (
  emotion: EmotionType, 
  text: string,
  isConversation: boolean = false
): Promise<string> => {
  try {
    // 检查API密钥是否配置
    if (!API_KEY) {
      console.error('Kimi API密钥未配置，请在.env.local文件中设置KIMI_API_KEY或NEXT_PUBLIC_KIMI_API_KEY');
      return getDefaultComfortMessage(emotion);
    }

    const emotionLabel = EMOTION_LABELS[emotion];
    
    let prompt: string;
    
    if (isConversation) {
      prompt = `你是一位专业的AI疗愈助手，正在与用户进行情绪对话。请基于以下对话上下文，给予温暖、理解、专业的回复：

${text}

作为AI疗愈助手，请：
1. 认真倾听和理解用户的感受
2. 提供情绪调节的具体建议
3. 给予温暖的支持和鼓励
4. 必要时引导用户寻求专业帮助

回复要自然、温暖、有同理心，像一位真正的疗愈师那样与用户对话。`;
    } else {
      prompt = `你是一位温柔的心理咨询师。用户现在感到${emotionLabel}，他们说："${text}"。

请根据用户的情绪和表达的内容，给予温暖、理解、有建设性的回应。回应应该：
1. 表达理解和共情
2. 提供情绪支持
3. 给出温和的建议或鼓励
4. 保持温暖、治愈的语调
5. 回应要简洁，50-100字左右

请用中文回应，让用户感受到被理解和关怀。`;
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: isConversation ? 'moonshot-v1-8k' : 'kimi-k2-turbo-preview',
        messages: [
          {
            role: 'system',
            content: isConversation 
              ? '你是一位温柔、专业的AI疗愈师，擅长情绪对话和持续的心理支持。回复要自然、温暖、有深度，能够与用户建立真正的情感连接。'
              : '你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。你是一位温柔、理解、专业的心理咨询师，专门提供情绪支持和心理疏导。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: isConversation ? 0.8 : 0.7,
        max_tokens: isConversation ? 500 : 200
      })
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data: KimiResponse = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content.trim();
    } else {
      throw new Error('API返回格式错误');
    }
  } catch (error) {
    console.error('Kimi API调用失败:', error);
    // 如果API调用失败，返回默认的安慰语
    return getDefaultComfortMessage(emotion);
  }
};

const getDefaultComfortMessage = (emotion: EmotionType): string => {
  const defaultMessages: Record<EmotionType, string[]> = {
    happy: [
      '你的快乐很有感染力！继续保持这份美好的心情，让阳光照进生活的每个角落。',
      '看到你开心，我也感到温暖。愿这份快乐成为你内心的力量。'
    ],
    sad: [
      '我感受到你的悲伤，这种感觉一定很难受。请记住，你不是一个人，我会一直在这里陪伴你。悲伤是暂时的，就像雨后的天空，总会放晴。',
      '每个人都会有低落的时候，这很正常。允许自己感受这些情绪，给自己一些时间和空间。你比你想象的更坚强。'
    ],
    angry: [
      '我理解你的愤怒，这种感觉一定让你很难受。愤怒背后往往藏着受伤的心，让我们一起找到平静的方法。深呼吸，给自己一些时间。',
      '愤怒是可以理解的，它在告诉你有些事情需要改变。让我们一起找到更好的方式来表达和处理这种情绪。'
    ],
    anxious: [
      '我感受到你的焦虑，这种感觉一定让你很不安。焦虑是大脑在试图保护你，让我们一起找到让内心平静的方法。深呼吸，一切都会好起来的。',
      '担心和焦虑是可以理解的，它们说明你关心重要的事情。让我们一起一步一步地面对，你不需要独自承担。'
    ],
    calm: [
      '内心的平静是如此珍贵。继续保持这份宁静，让它成为你面对生活的力量。',
      '平静不是没有风暴，而是学会在风暴中心找到宁静。你做得很好！'
    ],
    love: [
      '爱是世界上最美好的力量。愿你的爱被温柔回应，也愿你能感受到来自世界的温暖。',
      '能够去爱本身就是一种幸福。珍惜这份美好的情感，让爱成为你内心的光。'
    ],
    confused: [
      '困惑是成长的开始。每一个疑问都是通向理解的路标，让我们一起慢慢找到答案。',
      '不知道答案也没关系，探索的过程本身就是一种收获。相信自己的内心，答案会渐渐清晰。'
    ],
    excited: [
      '你的兴奋和热情很有感染力！享受这份激动，让积极的能量带你创造更多美好。',
      '看到你充满激情，真为你高兴。愿这份兴奋成为你追求梦想的动力。'
    ],
    tired: [
      '我感受到你的疲惫，这种感觉一定让你很难受。累了就休息一下吧，照顾好自己是最重要的。你值得被温柔对待。',
      '疲惫是身体在提醒你需要休息。慢一点，给自己一些喘息的空间。休息是为了走更远的路。'
    ],
    grateful: [
      '感恩的心让生活充满阳光。继续保持这份感恩，你会发现生活中有更多值得珍惜的美好。',
      '能够感恩本身就是一种幸福。你的感激之情让人感受到温暖，也提醒我们要珍惜身边的一切。'
    ]
  };

  const messages = defaultMessages[emotion];
  return messages[Math.floor(Math.random() * messages.length)];
};