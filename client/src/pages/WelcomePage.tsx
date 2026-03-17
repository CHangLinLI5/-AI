import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { markVisited } from '@/lib/storage';

const features = [
  {
    icon: '◎',
    title: 'AI 皮肤深度检测',
    desc: '12 项指标，像素级精准分析',
  },
  {
    icon: '◈',
    title: '皮肤专家实时问答',
    desc: '随时咨询，AI 给出专属建议',
  },
  {
    icon: '▦',
    title: '护肤日历记录',
    desc: 'AI 读取日历，建议更精准',
  },
];

export default function WelcomePage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // 预加载字体等资源
  }, []);

  const handleStart = () => {
    markVisited();
    setLocation('/app');
  };

  return (
    <div className="app-shell flex flex-col" style={{ background: 'var(--app-bg)' }}>
      {/* 状态栏占位 */}
      <div style={{ height: 'env(safe-area-inset-top, 44px)', minHeight: 44 }} />

      {/* 主体内容 */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-8 gap-0">

        {/* Logo */}
        <div
          className="animate-logo-float"
          style={{
            width: 88, height: 88,
            borderRadius: 28,
            background: 'linear-gradient(145deg, #c96442 0%, #a04830 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 40,
            marginBottom: 28,
            boxShadow: '0 8px 32px rgba(201,100,66,0.32), 0 2px 8px rgba(201,100,66,0.2)',
          }}
        >
          <span style={{ color: '#fff', fontWeight: 300, fontSize: 36, letterSpacing: -2 }}>✦</span>
        </div>

        {/* 问候语 */}
        <div
          className="animate-fade-up"
          style={{
            fontSize: 30, fontWeight: 700,
            color: 'var(--app-text)',
            textAlign: 'center',
            lineHeight: 1.22,
            letterSpacing: -0.8,
            marginBottom: 10,
            animationDelay: '0.05s',
          }}
        >
          你好，我是<br />芯颜皮肤 AI
        </div>

        <div
          className="animate-fade-up"
          style={{
            fontSize: 15,
            color: 'var(--app-text2)',
            textAlign: 'center',
            lineHeight: 1.65,
            marginBottom: 36,
            animationDelay: '0.12s',
          }}
        >
          专业 AI 皮肤检测顾问<br />上传照片，3 秒获得专属皮肤报告
        </div>

        {/* 功能列表 */}
        <div
          className="animate-fade-up w-full flex flex-col gap-3"
          style={{ marginBottom: 36, animationDelay: '0.2s' }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px',
                background: 'var(--app-surface)',
                borderRadius: 16,
                border: '1px solid var(--app-border)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              }}
            >
              <div
                style={{
                  width: 40, height: 40,
                  borderRadius: 12,
                  background: 'var(--app-accent-bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20,
                  color: 'var(--app-accent)',
                  flexShrink: 0,
                  fontWeight: 300,
                }}
              >
                {f.icon}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text)', marginBottom: 2 }}>
                  {f.title}
                </div>
                <div style={{ fontSize: 12, color: 'var(--app-text3)' }}>
                  {f.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA 按钮 */}
        <button
          className="pressable animate-fade-up w-full"
          onClick={handleStart}
          style={{
            height: 54,
            background: 'var(--app-accent)',
            color: '#fff',
            border: 'none',
            borderRadius: 17,
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: -0.2,
            boxShadow: '0 4px 20px rgba(201,100,66,0.38)',
            animationDelay: '0.28s',
          }}
        >
          开始检测
        </button>

        <div
          className="animate-fade-up"
          style={{ fontSize: 12, color: 'var(--app-text3)', marginTop: 14, animationDelay: '0.34s' }}
        >
          照片仅用于本地分析，不会上传至服务器
        </div>
      </div>
    </div>
  );
}
