// 芯颜 AI — 个人中心页面
// 统计数据 + 设置操作 + 关于信息

import { useState } from 'react';
import { User, Trash2, MessageCircle, Info, ChevronRight, AlertTriangle } from 'lucide-react';
import { getHistory, clearHistory, clearChatHistory } from '@/lib/storage';

export default function ProfilePage() {
  const [showConfirm, setShowConfirm] = useState<'history' | 'chat' | null>(null);
  const [showAbout, setShowAbout] = useState(false);
  const [, forceUpdate] = useState(0);

  const history = getHistory();
  const totalTests = history.length;
  const highestScore = history.length > 0 ? Math.max(...history.map(h => h.overallScore)) : 0;
  const avgScore = history.length > 0 ? Math.round(history.reduce((sum, h) => sum + h.overallScore, 0) / history.length) : 0;

  const handleClearHistory = () => {
    clearHistory();
    setShowConfirm(null);
    forceUpdate(n => n + 1);
  };

  const handleClearChat = () => {
    clearChatHistory();
    setShowConfirm(null);
    forceUpdate(n => n + 1);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F4] pb-[72px]">
      {/* 顶部栏 */}
      <div className="sticky top-0 z-40 bg-[#F7F6F4]/95 backdrop-blur-sm px-5 pt-5 pb-3">
        <h1 className="font-serif-sc text-lg font-bold text-[#1A1A1A]">我的</h1>
      </div>

      <div className="px-5 space-y-4">
        {/* 头像区域 */}
        <div className="flex flex-col items-center py-6">
          <div className="w-20 h-20 rounded-full bg-[#F2E8E3] flex items-center justify-center mb-3">
            <User className="w-10 h-10 text-[#B85C38]" strokeWidth={1.5} />
          </div>
          <h2 className="font-serif-sc text-base font-semibold text-[#1A1A1A]">芯颜 AI 用户</h2>
          <p className="font-sans-sc text-xs text-[#8A8A8A] mt-1">本地数据模式</p>
        </div>

        {/* 检测统计 */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '总检测', value: totalTests.toString(), unit: '次' },
            { label: '最高评分', value: highestScore.toString(), unit: '分' },
            { label: '平均评分', value: avgScore.toString(), unit: '分' },
          ].map(({ label, value, unit }) => (
            <div key={label} className="bg-white rounded-xl border border-[#E4E2DF] p-4 text-center">
              <div className="flex items-baseline justify-center gap-0.5">
                <span className="font-playfair text-2xl font-bold text-[#1A1A1A]">{value}</span>
                <span className="font-sans-sc text-xs text-[#8A8A8A]">{unit}</span>
              </div>
              <p className="font-sans-sc text-[10px] text-[#8A8A8A] mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* 操作列表 */}
        <div className="bg-white rounded-xl border border-[#E4E2DF] overflow-hidden">
          <button
            onClick={() => setShowConfirm('history')}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-[#F7F6F4] transition-colors border-b border-[#E4E2DF]"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-4 h-4 text-[#8A8A8A]" strokeWidth={1.5} />
              <span className="font-sans-sc text-sm text-[#1A1A1A]">清除检测记录</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#C8C5C0]" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setShowConfirm('chat')}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-[#F7F6F4] transition-colors border-b border-[#E4E2DF]"
          >
            <div className="flex items-center gap-3">
              <MessageCircle className="w-4 h-4 text-[#8A8A8A]" strokeWidth={1.5} />
              <span className="font-sans-sc text-sm text-[#1A1A1A]">清除聊天记录</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#C8C5C0]" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setShowAbout(!showAbout)}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-[#F7F6F4] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 text-[#8A8A8A]" strokeWidth={1.5} />
              <span className="font-sans-sc text-sm text-[#1A1A1A]">关于芯颜 AI</span>
            </div>
            <ChevronRight className={`w-4 h-4 text-[#C8C5C0] transition-transform ${showAbout ? 'rotate-90' : ''}`} strokeWidth={1.5} />
          </button>
        </div>

        {/* 关于信息 */}
        {showAbout && (
          <div className="bg-white rounded-xl border border-[#E4E2DF] p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-sans-sc text-sm text-[#4A4A4A]">版本</span>
              <span className="font-sans-sc text-sm text-[#8A8A8A]">v2.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-sans-sc text-sm text-[#4A4A4A]">技术栈</span>
              <span className="font-sans-sc text-sm text-[#8A8A8A]">React 19 + TypeScript</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-sans-sc text-sm text-[#4A4A4A]">AI 引擎</span>
              <span className="font-sans-sc text-sm text-[#8A8A8A]">Claude Sonnet</span>
            </div>
          </div>
        )}

        {/* 底部声明 */}
        <div className="text-center pt-4 pb-8">
          <p className="font-sans-sc text-[10px] text-[#A0A0A0] leading-relaxed">
            芯颜 AI 仅供参考，不构成医疗建议<br />
            如有严重皮肤问题，请咨询专业皮肤科医生
          </p>
          <p className="font-sans-sc text-[10px] text-[#C8C5C0] mt-2">
            MIT License &copy; 2025 芯颜 AI
          </p>
        </div>
      </div>

      {/* 确认弹窗 */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-8">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-serif-sc text-base font-semibold text-[#1A1A1A]">
                  {showConfirm === 'history' ? '清除检测记录' : '清除聊天记录'}
                </h3>
                <p className="font-sans-sc text-xs text-[#8A8A8A]">此操作不可撤销</p>
              </div>
            </div>
            <p className="font-sans-sc text-sm text-[#4A4A4A] mb-5">
              {showConfirm === 'history'
                ? '确定要清除所有皮肤检测记录吗？清除后将无法恢复。'
                : '确定要清除所有聊天记录吗？清除后将无法恢复。'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(null)}
                className="flex-1 py-2.5 border border-[#E4E2DF] rounded-lg font-sans-sc text-sm text-[#4A4A4A] hover:bg-[#F7F6F4] transition-colors"
              >
                取消
              </button>
              <button
                onClick={showConfirm === 'history' ? handleClearHistory : handleClearChat}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-lg font-sans-sc text-sm hover:bg-red-600 transition-colors"
              >
                确认清除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
