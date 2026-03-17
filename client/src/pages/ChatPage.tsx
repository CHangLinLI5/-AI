import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import ThinkingBubble from '@/components/ThinkingBubble';
import ResultCard from '@/components/ResultCard';
import {
  getChatHistory, saveChatHistory, addHistory,
  generateThumbnail, getRecentLogsSummary, getHistoryById,
  type ChatMessage, type HistoryRecord,
} from '@/lib/storage';
import type { SkinAnalysisResult } from '@/lib/skinAnalysis';

const QUICK_QUESTIONS = [
  '💧 如何补水保湿？',
  '🔬 推荐护肤品',
  '✨ 怎么缩小毛孔？',
  '🌙 晚间护肤步骤',
  '☀️ 防晒怎么选？',
];

const WELCOME_MSG: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: '你好！我是芯颜皮肤 AI 👋\n\n你可以**上传一张脸部照片**，我来为你做专业皮肤检测；也可以直接问我任何护肤问题。\n\n点击下方 📷 按钮开始检测 ✨',
  timestamp: new Date().toISOString(),
  type: 'text',
};

export default function ChatPage() {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const hist = getChatHistory();
    return hist.length > 0 ? hist : [WELCOME_MSG];
  });
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 滚动到底部
  const scrollToBottom = useCallback((smooth = true) => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: smooth ? 'smooth' : 'auto',
        });
      }
    }, 60);
  }, []);

  useEffect(() => {
    scrollToBottom(false);
  }, []);

  useEffect(() => {
    scrollToBottom();
    saveChatHistory(messages.filter(m => m.id !== 'welcome'));
  }, [messages, scrollToBottom]);

  // 添加消息
  const addMsg = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMsg]);
    return newMsg;
  };

  // 发送文字
  const handleSend = async () => {
    const text = input.trim();
    if (!text || isThinking) return;
    setInput('');
    addMsg({ role: 'user', content: text, type: 'text' });
    await callAI(text);
  };

  // 快捷问题
  const handleQuick = async (q: string) => {
    if (isThinking) return;
    addMsg({ role: 'user', content: q, type: 'text' });
    await callAI(q);
  };

  // 调用 AI 聊天接口
  const callAI = async (userText: string) => {
    setIsThinking(true);
    try {
      const logSummary = getRecentLogsSummary(7);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          skinLogSummary: logSummary,
        }),
      });
      const data = await res.json();
      addMsg({ role: 'assistant', content: data.reply || '抱歉，我暂时无法回答这个问题。', type: 'text' });
    } catch {
      addMsg({ role: 'assistant', content: '网络异常，请稍后再试 🙏', type: 'text' });
    } finally {
      setIsThinking(false);
    }
  };

  // 上传图片并分析
  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    const imageUrl = URL.createObjectURL(file);

    // 显示用户图片消息
    addMsg({ role: 'user', content: '', type: 'image', imageUrl });

    // 开始分析
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const logSummary = getRecentLogsSummary(7);
      formData.append('skinLogSummary', logSummary);

      const res = await fetch('/api/analyze-upload', { method: 'POST', body: formData });
      const data: { result: SkinAnalysisResult } = await res.json();

      // 保存记录
      const thumb = await generateThumbnail(imageUrl);
      const record = addHistory(data.result, thumb);

      // 显示结果卡片消息
      addMsg({
        role: 'assistant',
        content: `分析完成！你的皮肤综合评分 **${record.overallScore}** 分，肤质为**${record.skinType}**。\n\n根据你的护肤日历记录，我为你生成了专属建议 👇`,
        type: 'result-card',
        reportId: record.id,
      });

      // 追加建议消息
      setTimeout(() => {
        addMsg({
          role: 'assistant',
          content: `**主要建议：**\n${data.result.recommendations.slice(0, 3).map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n有什么想进一步了解的吗？😊`,
          type: 'text',
        });
      }, 600);

    } catch {
      addMsg({ role: 'assistant', content: '分析失败，请确保图片清晰并重试 🙏', type: 'text' });
    } finally {
      setIsAnalyzing(false);
      URL.revokeObjectURL(imageUrl);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 渲染单条消息
  const renderMessage = (msg: ChatMessage) => {
    const isUser = msg.role === 'user';

    if (msg.type === 'image' && msg.imageUrl) {
      return (
        <div key={msg.id} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div
            style={{
              width: 180, height: 180,
              borderRadius: 18,
              overflow: 'hidden',
              border: '1px solid var(--app-border)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            <img src={msg.imageUrl} alt="上传的照片" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      );
    }

    if (msg.type === 'result-card' && msg.reportId) {
      const record: HistoryRecord | null = getHistoryById(msg.reportId);
      return (
        <div key={msg.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <AiAvatar />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <TextBubble content={msg.content} isUser={false} />
            {record && (
              <ResultCard
                record={record}
                onClick={() => setLocation(`/result/${record.id}`)}
              />
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        key={msg.id}
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'flex-end',
          flexDirection: isUser ? 'row-reverse' : 'row',
        }}
      >
        {!isUser && <AiAvatar />}
        <TextBubble content={msg.content} isUser={isUser} />
      </div>
    );
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--app-bg)' }}>
      {/* 顶部导航 */}
      <div
        style={{
          height: 52,
          padding: '0 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid var(--app-border)',
          background: 'var(--app-bg)',
          flexShrink: 0,
        }}
      >
        <div style={{ width: 34 }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--app-text)', letterSpacing: -0.3 }}>
            芯颜皮肤 AI
          </div>
          <div style={{ fontSize: 11, color: 'var(--app-green)', marginTop: 1 }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--app-green)', marginRight: 4, verticalAlign: 'middle' }} />
            在线
          </div>
        </div>
        <button
          className="pressable"
          onClick={() => setLocation('/history')}
          style={{
            width: 34, height: 34,
            borderRadius: '50%',
            background: 'var(--app-bg2)',
            border: '1px solid var(--app-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="var(--app-text2)" strokeWidth="1.5"/>
            <path d="M8 5v3.5l2.5 1.5" stroke="var(--app-text2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* 消息列表 */}
      <div
        ref={scrollRef}
        className="no-scrollbar"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 16px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {messages.map(renderMessage)}
        {(isThinking || isAnalyzing) && <ThinkingBubble />}
        <div style={{ height: 4 }} />
      </div>

      {/* 快捷问题 */}
      <div
        className="no-scrollbar"
        style={{
          padding: '8px 16px 6px',
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          flexShrink: 0,
        }}
      >
        {QUICK_QUESTIONS.map((q, i) => (
          <button
            key={i}
            className="pressable"
            onClick={() => handleQuick(q)}
            style={{
              whiteSpace: 'nowrap',
              padding: '7px 13px',
              borderRadius: 20,
              border: '1.5px solid var(--app-border)',
              background: 'var(--app-surface)',
              fontSize: 12.5,
              color: 'var(--app-text)',
              flexShrink: 0,
              transition: 'all 0.15s',
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* 输入栏 */}
      <div
        style={{
          padding: '10px 16px 16px',
          background: 'var(--app-bg)',
          borderTop: '1px solid var(--app-border)',
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        {/* 上传按钮 */}
        <button
          className="pressable"
          onClick={handleUpload}
          title="上传照片检测"
          style={{
            width: 42, height: 42,
            borderRadius: '50%',
            background: 'var(--app-bg2)',
            border: '1.5px solid var(--app-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1.5" y="4.5" width="17" height="13" rx="2.5" stroke="var(--app-text2)" strokeWidth="1.5"/>
            <circle cx="10" cy="11" r="3.2" stroke="var(--app-text2)" strokeWidth="1.5"/>
            <path d="M7 4.5L8.5 2.5h3L13 4.5" stroke="var(--app-text2)" strokeWidth="1.5" strokeLinejoin="round"/>
            <circle cx="15.5" cy="7.5" r="1" fill="var(--app-text2)"/>
          </svg>
        </button>
        <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

        {/* 文字输入框 */}
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="问我任何护肤问题..."
          style={{
            flex: 1,
            height: 42,
            background: 'var(--app-surface)',
            border: '1.5px solid var(--app-border)',
            borderRadius: 21,
            padding: '0 16px',
            fontSize: 14.5,
            color: 'var(--app-text)',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />

        {/* 发送按钮 */}
        <button
          className="pressable"
          onClick={handleSend}
          disabled={!input.trim() || isThinking}
          style={{
            width: 42, height: 42,
            borderRadius: '50%',
            background: input.trim() && !isThinking ? 'var(--app-accent)' : 'var(--app-bg3)',
            border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.2s',
            boxShadow: input.trim() ? '0 2px 10px rgba(201,100,66,0.3)' : 'none',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M15.5 9L3 3.5l2.5 5.5-2.5 5.5L15.5 9z" fill={input.trim() && !isThinking ? '#fff' : 'var(--app-text3)'} />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── 子组件 ──

function AiAvatar() {
  return (
    <div
      style={{
        width: 32, height: 32,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #c96442, #a04830)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(201,100,66,0.22)',
      }}
    >
      <span style={{ color: '#fff', fontSize: 13, fontWeight: 300 }}>✦</span>
    </div>
  );
}

function TextBubble({ content, isUser }: { content: string; isUser: boolean }) {
  // 简单 markdown 粗体处理
  const html = content
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');

  return (
    <div
      style={{
        maxWidth: '76%',
        padding: '11px 14px',
        borderRadius: 18,
        fontSize: 14.5,
        lineHeight: 1.58,
        color: isUser ? '#fff' : 'var(--app-text)',
        background: isUser ? 'var(--app-text)' : 'var(--app-surface)',
        borderBottomRightRadius: isUser ? 5 : 18,
        borderBottomLeftRadius: isUser ? 18 : 5,
        boxShadow: isUser ? 'none' : '0 1px 5px rgba(0,0,0,0.07)',
        border: isUser ? 'none' : '1px solid var(--app-border)',
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
