import type { HistoryRecord } from '@/lib/storage';

interface ResultCardProps {
  record: HistoryRecord;
  onClick?: () => void;
}

export default function ResultCard({ record, onClick }: ResultCardProps) {
  const topIssues = (record.issues || []).slice(0, 3);

  return (
    <div
      className="pressable animate-scale-in"
      onClick={onClick}
      style={{
        background: 'var(--app-surface)',
        border: '1px solid var(--app-border)',
        borderRadius: 18,
        padding: '16px 18px',
        maxWidth: 250,
        boxShadow: '0 2px 14px rgba(0,0,0,0.09)',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {/* 标题行 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: 'var(--app-text3)', letterSpacing: 0.3 }}>
          皮肤检测报告
        </div>
        {onClick && (
          <div style={{ fontSize: 11, color: 'var(--app-accent)', display: 'flex', alignItems: 'center', gap: 2 }}>
            查看详情
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4.5 2.5L8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>

      {/* 评分 */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
        <span style={{ fontSize: 44, fontWeight: 800, color: 'var(--app-text)', lineHeight: 1, letterSpacing: -2 }}>
          {record.overallScore}
        </span>
        <span style={{ fontSize: 14, color: 'var(--app-text3)', fontWeight: 400 }}>/ 100</span>
      </div>

      {/* 肤质 */}
      <div style={{ fontSize: 13, color: 'var(--app-text2)', marginBottom: 12 }}>
        {record.skinType}
      </div>

      {/* 问题标签 */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {topIssues.map((issue, i) => (
          <span
            key={i}
            style={{
              padding: '3px 9px',
              borderRadius: 20,
              fontSize: 11,
              background: 'var(--app-accent-bg)',
              color: 'var(--app-accent)',
              border: '1px solid var(--app-accent-l)',
            }}
          >
            {issue.name}
          </span>
        ))}
      </div>
    </div>
  );
}
