import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { getHistory, getLast7DaysScores, type HistoryRecord } from '@/lib/storage';

export default function HistoryPage() {
  const [, setLocation] = useLocation();
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [trendData, setTrendData] = useState<{ date: string; score: number }[]>([]);

  useEffect(() => {
    setRecords(getHistory());
    setTrendData(getLast7DaysScores());
  }, []);

  const maxScore = Math.max(...trendData.map(d => d.score), 1);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--app-bg)' }}>
      {/* 顶部导航 */}
      <div style={{ height: 52, padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--app-border)', flexShrink: 0 }}>
        <div style={{ width: 34 }} />
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--app-text)', letterSpacing: -0.3 }}>检测历史</span>
        <button
          className="pressable"
          onClick={() => setLocation('/app')}
          style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--app-bg2)', border: '1px solid var(--app-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: 'var(--app-text2)' }}
        >
          📷
        </button>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 16px' }}>
        {/* 趋势图 */}
        {trendData.some(d => d.score > 0) && (
          <div style={{ background: 'var(--app-surface)', borderRadius: 20, border: '1px solid var(--app-border)', padding: '16px 18px', marginBottom: 14, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--app-text2)', marginBottom: 14 }}>近 7 天评分趋势</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 60 }}>
              {trendData.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div
                    style={{
                      width: '100%',
                      height: d.score > 0 ? `${(d.score / maxScore) * 52}px` : 4,
                      borderRadius: '4px 4px 0 0',
                      background: d.score > 0
                        ? `linear-gradient(to top, var(--app-accent), var(--app-accent-l))`
                        : 'var(--app-bg3)',
                      transition: 'height 0.5s ease',
                    }}
                  />
                  <span style={{ fontSize: 10, color: i === 6 ? 'var(--app-accent)' : 'var(--app-text3)', fontWeight: i === 6 ? 700 : 400 }}>
                    {d.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 记录列表 */}
        {records.length === 0 ? (
          <EmptyState onStart={() => setLocation('/app')} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {records.map(r => (
              <HistoryCard key={r.id} record={r} onClick={() => setLocation(`/result/${r.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryCard({ record, onClick }: { record: HistoryRecord; onClick: () => void }) {
  const date = new Date(record.date);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  const dateLabel = diffDays === 0 ? '今天' : diffDays === 1 ? '昨天' : `${diffDays}天前`;
  const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`;

  const scoreColor = record.overallScore >= 80 ? 'var(--app-green)' : record.overallScore >= 60 ? 'var(--app-yellow)' : 'var(--app-red)';

  return (
    <div
      className="pressable"
      onClick={onClick}
      style={{
        background: 'var(--app-surface)',
        borderRadius: 18,
        border: '1px solid var(--app-border)',
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 14,
        boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
      }}
    >
      {/* 缩略图 */}
      <div style={{
        width: 54, height: 54,
        borderRadius: 14,
        overflow: 'hidden',
        flexShrink: 0,
        background: 'var(--app-accent-bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {record.thumbnail ? (
          <img src={record.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: 24 }}>🤳</span>
        )}
      </div>

      {/* 信息 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: 'var(--app-text3)', marginBottom: 3 }}>
          {dateStr} · {dateLabel}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 5 }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: scoreColor, letterSpacing: -0.5, lineHeight: 1 }}>
            {record.overallScore}
          </span>
          <span style={{ fontSize: 13, color: 'var(--app-text2)' }}>{record.skinType}</span>
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {record.issues.slice(0, 3).map((issue, i) => (
            <span key={i} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: 'var(--app-accent-bg)', color: 'var(--app-accent)' }}>
              {issue.name}
            </span>
          ))}
        </div>
      </div>

      {/* 箭头 */}
      <svg width="8" height="14" viewBox="0 0 8 14" fill="none" style={{ flexShrink: 0 }}>
        <path d="M1.5 1.5L6.5 7l-5 5.5" stroke="var(--app-border)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

function EmptyState({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 32px', gap: 16 }}>
      <div style={{ width: 72, height: 72, borderRadius: 24, background: 'var(--app-accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
        📊
      </div>
      <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--app-text)', textAlign: 'center' }}>
        暂无检测记录
      </div>
      <div style={{ fontSize: 14, color: 'var(--app-text3)', textAlign: 'center', lineHeight: 1.6 }}>
        上传一张脸部照片<br />开始你的第一次皮肤检测
      </div>
      <button
        className="pressable"
        onClick={onStart}
        style={{ padding: '12px 28px', background: 'var(--app-accent)', color: '#fff', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 600, fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(201,100,66,0.3)' }}
      >
        立即检测
      </button>
    </div>
  );
}
