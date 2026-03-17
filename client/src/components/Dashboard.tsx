// 芯颜 AI — Dashboard 首页仪表盘
// 最新检测结果 + 7天趋势 + 快捷操作 + 历史记录

import { useState } from 'react';
import { ScanFace, MessageCircle, ChevronRight, Calendar } from 'lucide-react';
import { getHistory, getLatestRecord, getLast7DaysScores, type HistoryRecord } from '@/lib/storage';
import { getLevelColor, getLevelLabel } from '@/lib/skinAnalysis';
import ResultSection from './ResultSection';
import type { SkinAnalysisResult } from '@/lib/skinAnalysis';

interface DashboardProps {
  onNavigate: (tab: number) => void;
}

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size / 2) - 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#1A1A1A' : score >= 60 ? '#B85C38' : '#E57373';
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#EFEDE9" strokeWidth="5" />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-playfair text-xl font-bold" style={{ color }}>{score}</span>
        <span className="font-sans-sc text-[9px] text-[#8A8A8A]">评分</span>
      </div>
    </div>
  );
}

function TrendChart({ data }: { data: { date: string; score: number }[] }) {
  const maxScore = Math.max(...data.map(d => d.score), 1);
  const today = new Date().getDay();
  const dayLabels = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="bg-white rounded-xl border border-[#E4E2DF] p-5">
      <h3 className="font-serif-sc text-sm font-semibold text-[#1A1A1A] mb-4">7 天趋势</h3>
      <div className="flex items-end justify-between gap-2 h-28">
        {data.map((d, i) => {
          const height = d.score > 0 ? Math.max((d.score / 100) * 100, 8) : 4;
          const isToday = d.date === dayLabels[today];
          return (
            <div key={i} className="flex flex-col items-center flex-1 gap-1.5">
              {d.score > 0 && (
                <span className={`font-playfair text-[10px] font-medium ${isToday ? 'text-[#B85C38]' : 'text-[#8A8A8A]'}`}>
                  {d.score}
                </span>
              )}
              <div
                className={`w-full max-w-[28px] rounded-t-md transition-all duration-500 ${
                  isToday ? 'bg-[#B85C38]' : d.score > 0 ? 'bg-[#E4D5CE]' : 'bg-[#EFEDE9]'
                }`}
                style={{ height: `${height}%` }}
              />
              <span className={`font-sans-sc text-[10px] ${isToday ? 'text-[#B85C38] font-medium' : 'text-[#8A8A8A]'}`}>
                {d.date}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HistoryItem({ record, onClick }: { record: HistoryRecord; onClick: () => void }) {
  const date = new Date(record.date);
  const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  const topMetrics = record.metrics.slice(0, 4);
  const scoreColor = record.overallScore >= 80 ? '#1A1A1A' : record.overallScore >= 60 ? '#B85C38' : '#E57373';
  const barColors = ['#B85C38', '#4A7A5A', '#D4A574', '#8A8A8A'];

  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E4E2DF] hover:border-[#C8C5C0] transition-all duration-250 text-left">
      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${scoreColor}10` }}>
        <span className="font-playfair text-lg font-bold" style={{ color: scoreColor }}>{record.overallScore}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-sans-sc text-sm font-medium text-[#1A1A1A] truncate">{record.skinType}</span>
          <span className="font-sans-sc text-[10px] text-[#8A8A8A] flex-shrink-0">{dateStr}</span>
        </div>
        <div className="flex gap-1">
          {topMetrics.map((m, i) => (
            <div key={m.label} className="flex-1 h-1.5 rounded-full overflow-hidden bg-[#EFEDE9]">
              <div className="h-full rounded-full" style={{ width: `${m.score}%`, backgroundColor: barColors[i % barColors.length] }} />
            </div>
          ))}
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-[#C8C5C0] flex-shrink-0" strokeWidth={1.5} />
    </button>
  );
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [viewingRecord, setViewingRecord] = useState<HistoryRecord | null>(null);
  const latest = getLatestRecord();
  const history = getHistory();
  const trendData = getLast7DaysScores();

  const today = new Date();
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

  // 查看历史记录详情
  if (viewingRecord) {
    const result: SkinAnalysisResult = {
      skinType: viewingRecord.skinType,
      skinTypeDescription: viewingRecord.skinTypeDescription,
      overallScore: viewingRecord.overallScore,
      metrics: viewingRecord.metrics,
      issues: viewingRecord.issues,
      recommendations: viewingRecord.recommendations,
      products: viewingRecord.products,
      analysisTime: viewingRecord.analysisTime,
    };
    return (
      <ResultSection
        result={result}
        imageUrl={viewingRecord.thumbnail || ''}
        onReset={() => setViewingRecord(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F4] pb-[72px]">
      {/* 顶部栏 */}
      <div className="sticky top-0 z-40 bg-[#F7F6F4]/95 backdrop-blur-sm px-5 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="font-serif-sc text-xl font-bold text-[#1A1A1A]">芯颜 AI</h1>
          <div className="flex items-center gap-1.5 text-[#8A8A8A]">
            <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span className="font-sans-sc text-xs">{dateStr}</span>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-4">
        {/* 最新检测结果卡片 */}
        {latest ? (
          <div className="bg-white rounded-xl border border-[#E4E2DF] p-5">
            <p className="font-sans-sc text-[10px] text-[#8A8A8A] tracking-wider uppercase mb-3">最新检测结果</p>
            <div className="flex items-center gap-4">
              <ScoreRing score={latest.overallScore} />
              <div className="flex-1 min-w-0">
                <h3 className="font-serif-sc text-base font-semibold text-[#1A1A1A] mb-1">{latest.skinType}</h3>
                <p className="font-sans-sc text-xs text-[#6B6B6B] leading-relaxed line-clamp-2 mb-2">
                  {latest.skinTypeDescription}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {latest.metrics.slice(0, 3).map((m) => (
                    <span key={m.label} className={`font-sans-sc text-[10px] px-2 py-0.5 rounded-sm bg-[#F2E8E3] ${getLevelColor(m.level)}`}>
                      {m.label} {m.score}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E4E2DF] p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#F2E8E3] flex items-center justify-center mx-auto mb-4">
              <ScanFace className="w-8 h-8 text-[#B85C38]" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif-sc text-base font-semibold text-[#1A1A1A] mb-2">还没有检测记录</h3>
            <p className="font-sans-sc text-sm text-[#8A8A8A] mb-4">开始你的第一次皮肤检测吧</p>
            <button
              onClick={() => onNavigate(1)}
              className="inline-flex items-center gap-2 bg-[#1A1A1A] text-[#F7F6F4] font-sans-sc text-sm px-6 py-2.5 rounded-sm hover:bg-[#B85C38] transition-colors duration-250"
            >
              开始检测
            </button>
          </div>
        )}

        {/* 7 天趋势图 */}
        <TrendChart data={trendData} />

        {/* 快捷操作 */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate(1)}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#E4E2DF] hover:border-[#C8C5C0] transition-all duration-250 card-hover"
          >
            <div className="w-10 h-10 rounded-lg bg-[#F2E8E3] flex items-center justify-center">
              <ScanFace className="w-5 h-5 text-[#B85C38]" strokeWidth={1.5} />
            </div>
            <div className="text-left">
              <div className="font-serif-sc text-sm font-semibold text-[#1A1A1A]">开始检测</div>
              <div className="font-sans-sc text-[10px] text-[#8A8A8A]">上传照片分析</div>
            </div>
          </button>
          <button
            onClick={() => onNavigate(2)}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#E4E2DF] hover:border-[#C8C5C0] transition-all duration-250 card-hover"
          >
            <div className="w-10 h-10 rounded-lg bg-[#F2E8E3] flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-[#B85C38]" strokeWidth={1.5} />
            </div>
            <div className="text-left">
              <div className="font-serif-sc text-sm font-semibold text-[#1A1A1A]">问问 AI</div>
              <div className="font-sans-sc text-[10px] text-[#8A8A8A]">护肤顾问在线</div>
            </div>
          </button>
        </div>

        {/* 历史记录列表 */}
        {history.length > 0 && (
          <div>
            <h3 className="font-serif-sc text-sm font-semibold text-[#1A1A1A] mb-3">检测记录</h3>
            <div className="space-y-2">
              {history.map((record) => (
                <HistoryItem
                  key={record.id}
                  record={record}
                  onClick={() => setViewingRecord(record)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
