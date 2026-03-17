import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { getHistoryById, type HistoryRecord } from '@/lib/storage';

const SEVERITY_COLORS: Record<string, string> = {
  mild: 'var(--app-yellow)',
  moderate: 'var(--app-accent)',
  severe: 'var(--app-red)',
};
const SEVERITY_LABELS: Record<string, string> = {
  mild: '轻度',
  moderate: '中度',
  severe: '较重',
};

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [record, setRecord] = useState<HistoryRecord | null>(null);

  useEffect(() => {
    if (id) {
      const r = getHistoryById(id);
      setRecord(r);
    }
  }, [id]);

  if (!record) {
    return (
      <div className="app-shell" style={{ alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ fontSize: 32 }}>😕</div>
        <div style={{ fontSize: 16, color: 'var(--app-text2)' }}>找不到该记录</div>
        <button className="pressable" onClick={() => history.back()} style={{ padding: '10px 24px', background: 'var(--app-accent)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}>
          返回
        </button>
      </div>
    );
  }

  const scoreColor = record.overallScore >= 80 ? 'var(--app-green)' : record.overallScore >= 60 ? 'var(--app-yellow)' : 'var(--app-red)';
  const date = new Date(record.date);
  const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

  return (
    <div className="app-shell page-fade">
      {/* 状态栏占位 */}
      <div style={{ height: 'env(safe-area-inset-top, 44px)', minHeight: 44, background: '#1a1310', flexShrink: 0 }} />

      {/* 顶部深色区域 */}
      <div style={{ background: 'linear-gradient(160deg, #2d1f1a 0%, #1a1310 100%)', padding: '0 20px 24px', flexShrink: 0 }}>
        {/* 导航 */}
        <div style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            className="pressable"
            onClick={() => history.back()}
            style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 4.5L7 10l5.5 5.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>皮肤检测报告</span>
          <div style={{ width: 36 }} />
        </div>

        {/* 评分圆环 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 12 }}>
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <svg width="110" height="110" viewBox="0 0 110 110">
              <circle cx="55" cy="55" r="46" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <circle
                cx="55" cy="55" r="46"
                fill="none"
                stroke="url(#scoreGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 46}`}
                strokeDashoffset={`${2 * Math.PI * 46 * (1 - record.overallScore / 100)}`}
                transform="rotate(-90 55 55)"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#e8b49a" />
                  <stop offset="100%" stopColor="#c96442" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: -1 }}>{record.overallScore}</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>综合评分</span>
            </div>
          </div>

          <div style={{ padding: '5px 18px', background: 'rgba(232,180,154,0.18)', border: '1px solid rgba(232,180,154,0.35)', borderRadius: 20, color: '#e8b49a', fontSize: 13, fontWeight: 600 }}>
            {record.skinType}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>{dateStr}</div>
        </div>
      </div>

      {/* 内容区 */}
      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 24px' }}>

        {/* 指标网格 */}
        <SectionTitle>检测指标</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
          {record.metrics.slice(0, 8).map((m, i) => (
            <MetricCard key={i} metric={m} />
          ))}
        </div>

        {/* 皮肤问题 */}
        <SectionTitle>皮肤问题</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {record.issues.map((issue, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--app-surface)', borderRadius: 14, border: '1px solid var(--app-border)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: SEVERITY_COLORS[issue.severity] || 'var(--app-accent)', flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--app-text)' }}>{issue.name}</div>
              <div style={{ fontSize: 12, color: SEVERITY_COLORS[issue.severity] || 'var(--app-text3)', fontWeight: 600 }}>{SEVERITY_LABELS[issue.severity] ?? issue.severity}</div>
            </div>
          ))}
        </div>

        {/* 护肤建议 */}
        <SectionTitle>专家建议</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {record.recommendations.map((r, i) => (
            <div key={i} style={{ padding: '12px 14px', background: 'var(--app-accent-bg)', borderRadius: 14, fontSize: 13.5, color: 'var(--app-text)', lineHeight: 1.6, borderLeft: '3px solid var(--app-accent)' }}>
              {r}
            </div>
          ))}
        </div>
      </div>

      {/* 底部操作 */}
      <div style={{ padding: '12px 16px', paddingBottom: 'max(16px, env(safe-area-inset-bottom))', borderTop: '1px solid var(--app-border)', display: 'flex', gap: 10, flexShrink: 0, background: 'var(--app-bg)' }}>
        <button
          className="pressable"
          onClick={() => setLocation('/history')}
          style={{ flex: 1, height: 48, background: 'var(--app-bg2)', border: '1.5px solid var(--app-border)', borderRadius: 14, fontSize: 14, fontWeight: 600, color: 'var(--app-text)', fontFamily: 'inherit' }}
        >
          查看历史
        </button>
        <button
          className="pressable"
          onClick={() => setLocation('/app')}
          style={{ flex: 2, height: 48, background: 'var(--app-accent)', border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 600, color: '#fff', fontFamily: 'inherit', boxShadow: '0 2px 12px rgba(201,100,66,0.3)' }}
        >
          继续咨询专家
        </button>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--app-text3)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10 }}>
      {children}
    </div>
  );
}

function MetricCard({ metric }: { metric: HistoryRecord['metrics'][0] }) {
  const pct = typeof metric.score === 'number' ? metric.score : 50;
  const levelColorMap: Record<string, string> = {
    excellent: 'var(--app-green)',
    good: 'var(--app-green)',
    fair: 'var(--app-yellow)',
    poor: 'var(--app-red)',
  };
  const statusColor = levelColorMap[metric.level] || 'var(--app-text2)';
  const levelLabelMap: Record<string, string> = { excellent: '优秀', good: '良好', fair: '一般', poor: '待改善' };

  return (
    <div style={{ background: 'var(--app-surface)', borderRadius: 14, padding: '13px 14px', border: '1px solid var(--app-border)' }}>
      <div style={{ fontSize: 12, color: 'var(--app-text3)', marginBottom: 8 }}>{metric.label}</div>
      <div style={{ height: 5, background: 'var(--app-bg3)', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, var(--app-accent), var(--app-accent-l))`, borderRadius: 3, transition: 'width 0.8s ease' }} />
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: statusColor }}>{levelLabelMap[metric.level] ?? metric.level}</div>
    </div>
  );
}
