// 芯颜 AI — AI 护肤顾问聊天页面
// 流式输出 + 预设问题 + 皮肤数据上下文

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { getLatestRecord, getChatHistory, saveChatHistory, type ChatMessage } from '@/lib/storage';

const QUICK_QUESTIONS = [
  '我的皮肤适合什么护肤品？',
  '如何改善毛孔粗大？',
  '帮我制定晚间护肤步骤',
  '推荐控油保湿产品',
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasUserSent, setHasUserSent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const latestRecord = getLatestRecord();

  // 加载历史聊天记录
  useEffect(() => {
    const saved = getChatHistory();
    if (saved.length > 0) {
      setMessages(saved);
      setHasUserSent(true);
    } else {
      // 首次进入，AI 发送欢迎消息
      const welcomeMsg: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: latestRecord
          ? `你好！我是芯颜 AI 护肤顾问。我已经看到你最近的皮肤检测结果——综合评分 ${latestRecord.overallScore} 分，${latestRecord.skinType}。有什么护肤问题想问我吗？`
          : '你好！我是芯颜 AI 护肤顾问。你可以问我任何护肤相关的问题，比如护肤品推荐、护肤步骤、皮肤问题解决方案等。如果你先做一次皮肤检测，我可以给出更有针对性的建议哦！',
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMsg]);
    }
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isStreaming) return;

    setHasUserSent(true);
    const userMsg: ChatMessage = {
      id: Date.now().toString(36),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsStreaming(true);

    // 创建 AI 消息占位
    const aiMsgId = (Date.now() + 1).toString(36);
    const aiMsg: ChatMessage = {
      id: aiMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, aiMsg]);

    try {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.filter(m => m.id !== 'welcome').map(m => ({
            role: m.role,
            content: m.content,
          })),
          skinContext: latestRecord ? {
            skinType: latestRecord.skinType,
            overallScore: latestRecord.overallScore,
            analysisTime: latestRecord.analysisTime,
            metrics: latestRecord.metrics,
            issues: latestRecord.issues,
          } : null,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error === '服务未配置' ? 'AI 服务未配置，请在 .env 中设置 ANTHROPIC_API_KEY' : (err.message || '请求失败'));
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'text') {
              fullContent += data.content;
              setMessages(prev =>
                prev.map(m => m.id === aiMsgId ? { ...m, content: fullContent } : m)
              );
            } else if (data.type === 'done') {
              // 保存聊天记录
              setMessages(prev => {
                const final = prev.map(m => m.id === aiMsgId ? { ...m, content: fullContent } : m);
                saveChatHistory(final);
                return final;
              });
            } else if (data.type === 'error') {
              setMessages(prev =>
                prev.map(m => m.id === aiMsgId ? { ...m, content: data.message || '回复中断，请重试' } : m)
              );
            }
          } catch {
            // 忽略解析错误
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') return;
      setMessages(prev =>
        prev.map(m => m.id === aiMsgId ? { ...m, content: `抱歉，${error.message || '发生了错误，请重试'}` } : m)
      );
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [messages, isStreaming, latestRecord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const formatTime = (timestamp: string) => {
    const d = new Date(timestamp);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-screen bg-[#F7F6F4]">
      {/* 顶部栏 */}
      <div className="sticky top-0 z-40 bg-[#F7F6F4]/95 backdrop-blur-sm px-5 pt-5 pb-3 border-b border-[#E4E2DF]">
        <div className="flex items-center justify-between">
          <h1 className="font-serif-sc text-lg font-bold text-[#1A1A1A]">AI 护肤顾问</h1>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-sans-sc text-xs text-emerald-600">在线</span>
          </div>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-[140px] space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-1' : 'order-1'}`}>
              <div
                className={`px-4 py-3 text-sm leading-relaxed font-sans-sc ${
                  msg.role === 'user'
                    ? 'bg-[#1A1A1A] text-white rounded-2xl rounded-br-md'
                    : 'bg-white text-[#1A1A1A] rounded-2xl rounded-bl-md border border-[#E4E2DF]'
                }`}
              >
                {msg.content || (
                  <span className="inline-flex items-center gap-1 text-[#8A8A8A]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B85C38] animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B85C38] animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B85C38] animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </span>
                )}
                {isStreaming && msg.role === 'assistant' && msg === messages[messages.length - 1] && msg.content && (
                  <span className="inline-block w-0.5 h-4 bg-[#B85C38] ml-0.5 animate-pulse align-text-bottom" />
                )}
              </div>
              <p className={`font-sans-sc text-[10px] text-[#A0A0A0] mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 快捷问题 */}
      {!hasUserSent && (
        <div className="fixed bottom-[130px] left-0 right-0 px-4">
          <div className="grid grid-cols-2 gap-2 max-w-lg mx-auto">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="flex items-center gap-2 p-3 bg-white rounded-xl border border-[#E4E2DF] hover:border-[#B85C38] transition-colors text-left"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B85C38] flex-shrink-0" strokeWidth={1.5} />
                <span className="font-sans-sc text-xs text-[#4A4A4A] line-clamp-1">{q}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 底部输入栏 */}
      <div className="fixed bottom-14 left-0 right-0 bg-[#F7F6F4] border-t border-[#E4E2DF] px-4 py-3">
        <div className="h-[env(safe-area-inset-bottom)]" />
        <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-lg mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="问我任何护肤问题..."
            disabled={isStreaming}
            className="flex-1 bg-white border border-[#E4E2DF] rounded-full px-4 py-2.5 font-sans-sc text-sm text-[#1A1A1A] placeholder:text-[#A0A0A0] focus:outline-none focus:border-[#B85C38] transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center hover:bg-[#B85C38] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-4 h-4 text-white" strokeWidth={1.5} />
          </button>
        </form>
      </div>
    </div>
  );
}
