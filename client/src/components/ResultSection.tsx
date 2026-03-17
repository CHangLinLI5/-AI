// 芯颜 AI ResultSection v2 — 成熟简约
// 暖灰白底 | 白色卡片 | 砖赭红强调

import { useState } from 'react';
import { ArrowLeft, RefreshCw, Share2, Download, ChevronRight, Droplets, Sun, Layers, Palette, Activity, Shield } from 'lucide-react';
import type { SkinAnalysisResult } from '@/lib/skinAnalysis';
import { getLevelColor, getLevelLabel, getSeverityColor, getSeverityLabel } from '@/lib/skinAnalysis';
import { toast } from 'sonner';

const PRODUCTS_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/309924522100821332/mfrG97Li6QqEizj9zKToc6/skincare-products-V4gggNxPH23YfdSJyvpkWY.webp';
const METRIC_ICONS = [Droplets, Sun, Layers, Palette, Activity, Shield];

interface ResultSectionProps {
  result: SkinAnalysisResult;
  imageUrl: string;
  onReset: () => void;
}

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#1A1A1A' : score >= 60 ? '#B85C38' : '#E57373';
  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#EFEDE9" strokeWidth="5" />
        <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-playfair text-2xl font-bold" style={{ color }}>{score}</span>
        <span className="font-sans-sc text-[10px] text-[#8A8A8A]">综合评分</span>
      </div>
    </div>
  );
}

function MetricBar({ label, score, level, description, icon: Icon }: {
  label: string; score: number; level: string; description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}) {
  const barColor = level === 'excellent' ? '#1A1A1A' : level === 'good' ? '#4A7A5A' : level === 'fair' ? '#B85C38' : '#E57373';
  return (
    <div className="p-4 bg-white rounded-xl border border-[#E4E2DF] hover:border-[#C8C5C0] transition-all duration-250">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#F2E8E3] flex items-center justify-center">
            <Icon className="w-4 h-4 text-[#B85C38]" strokeWidth={1.5} />
          </div>
          <div>
            <div className="font-sans-sc text-sm font-medium text-[#1A1A1A]">{label}</div>
            <div className="font-sans-sc text-xs text-[#8A8A8A]">{description}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-playfair text-xl font-bold" style={{ color: barColor }}>{score}</div>
          <div className={`font-sans-sc text-xs ${getLevelColor(level as any)}`}>{getLevelLabel(level as any)}</div>
        </div>
      </div>
      <div className="h-1.5 bg-[#EFEDE9] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${score}%`, backgroundColor: barColor }} />
      </div>
    </div>
  );
}

export default function ResultSection({ result, imageUrl, onReset }: ResultSectionProps) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'advice' | 'products'>('analysis');

  return (
    <section className="min-h-screen bg-[#F7F6F4] py-8">
      <div className="max-w-4xl mx-auto px-8">

        {/* 顶部操作栏 */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onReset} className="flex items-center gap-2 text-[#6B6B6B] hover:text-[#1A1A1A] font-sans-sc text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />重新检测
          </button>
          <div className="flex items-center gap-1">
            {[
              { icon: Share2, label: '分享', action: () => toast.success('链接已复制', { description: '快分享给朋友吧！' }) },
              { icon: Download, label: '下载报告', action: () => toast.info('即将上线', { description: '敬请期待 PDF 报告导出' }) },
            ].map(({ icon: Icon, label, action }) => (
              <button key={label} onClick={action} className="flex items-center gap-1.5 text-sm font-sans-sc text-[#6B6B6B] hover:text-[#1A1A1A] px-3 py-2 rounded-lg hover:bg-[#EFEDE9] transition-all">
                <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />{label}
              </button>
            ))}
          </div>
        </div>

        {/* 综合评分卡 */}
        <div className="bg-[#1A1A1A] rounded-2xl p-7 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/3 -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex flex-col md:flex-row items-center gap-7">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10">
                <img src={imageUrl} alt="您的照片" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-sm bg-[#B85C38] flex items-center justify-center">
                <span className="text-white text-[9px] font-bold font-sans-sc">AI</span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="font-sans-sc text-xs text-white/40 mb-1 tracking-wide">检测完成 · {result.analysisTime}</p>
              <h2 className="font-serif-sc text-xl font-bold text-white mb-2">{result.skinType}</h2>
              <p className="font-sans-sc text-sm text-white/55 leading-relaxed max-w-md">{result.skinTypeDescription}</p>
            </div>
            <div className="flex-shrink-0"><ScoreRing score={result.overallScore} /></div>
          </div>
        </div>

        {/* Tab */}
        <div className="flex gap-0 border border-[#E4E2DF] rounded-lg overflow-hidden mb-8 bg-white">
          {[
            { key: 'analysis', label: '皮肤分析' },
            { key: 'advice',   label: '护肤建议' },
            { key: 'products', label: '产品推荐' },
          ].map(({ key, label }, i) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex-1 py-3 font-sans-sc text-sm tracking-wide transition-all duration-200 border-r last:border-r-0 border-[#E4E2DF] ${
                activeTab === key ? 'bg-[#1A1A1A] text-white' : 'text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F7F6F4]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 皮肤分析 */}
        {activeTab === 'analysis' && (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h3 className="font-serif-sc text-lg font-semibold text-[#1A1A1A] mb-4">皮肤健康指标</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.metrics.map((metric, index) => {
                  const Icon = METRIC_ICONS[index % METRIC_ICONS.length];
                  return <MetricBar key={metric.label} label={metric.label} score={metric.score} level={metric.level} description={metric.description} icon={Icon} />;
                })}
              </div>
            </div>
            {result.issues.length > 0 && (
              <div>
                <h3 className="font-serif-sc text-lg font-semibold text-[#1A1A1A] mb-4">发现的皮肤问题</h3>
                <div className="space-y-3">
                  {result.issues.map((issue) => (
                    <div key={issue.name} className={`p-4 rounded-xl border ${getSeverityColor(issue.severity)}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-serif-sc font-semibold text-sm">{issue.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-sm bg-current/10 font-sans-sc">{getSeverityLabel(issue.severity)}</span>
                        </div>
                        <span className="font-sans-sc text-xs opacity-60">{issue.area}</span>
                      </div>
                      <p className="font-sans-sc text-xs opacity-75 leading-relaxed">{issue.tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 护肤建议 */}
        {activeTab === 'advice' && (
          <div className="space-y-4 animate-fade-up">
            <h3 className="font-serif-sc text-lg font-semibold text-[#1A1A1A] mb-4">个性化护肤方案</h3>
            {result.recommendations.map((rec, index) => (
              <div key={index} className="flex gap-4 p-5 bg-white rounded-xl border border-[#E4E2DF] hover:border-[#C8C5C0] transition-all duration-250 card-hover">
                <div className="w-7 h-7 rounded-sm bg-[#1A1A1A] text-white flex items-center justify-center flex-shrink-0 font-playfair text-xs font-bold">{index + 1}</div>
                <p className="font-sans-sc text-sm text-[#3A3A3A] leading-relaxed pt-0.5">{rec}</p>
              </div>
            ))}
            <div className="mt-6 p-6 bg-[#1A1A1A] rounded-2xl">
              <h4 className="font-serif-sc text-base font-semibold text-white mb-4">推荐护肤步骤</h4>
              <div className="space-y-3">
                {[
                  { step: '早晨', items: '洁面 → 爽肤水 → 精华 → 防晒' },
                  { step: '晚间', items: '卸妆 → 洁面 → 爽肤水 → 精华 → 面霜' },
                  { step: '每周', items: '1-2次去角质 / 1-2次面膜' },
                ].map(({ step, items }) => (
                  <div key={step} className="flex gap-4">
                    <span className="font-sans-sc text-xs text-[#B85C38] font-medium w-10 flex-shrink-0 pt-0.5">{step}</span>
                    <span className="font-sans-sc text-sm text-white/60">{items}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 产品推荐 */}
        {activeTab === 'products' && (
          <div className="space-y-5 animate-fade-up">
            <div className="rounded-2xl overflow-hidden h-44 relative">
              <img src={PRODUCTS_IMAGE} alt="推荐护肤产品" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/80 to-transparent flex items-center px-8">
                <div>
                  <p className="font-sans-sc text-xs text-white/55 mb-1 tracking-wide">基于您的皮肤分析</p>
                  <h3 className="font-serif-sc text-2xl font-bold text-white">专属产品推荐</h3>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl border border-[#E4E2DF] overflow-hidden hover:border-[#C8C5C0] hover:shadow-sm transition-all duration-250 card-hover">
                  <div className="flex gap-4 p-4">
                    <div className="w-18 h-18 rounded-lg overflow-hidden bg-[#F7F6F4] flex-shrink-0 w-[72px] h-[72px]">
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-sans-sc text-xs text-[#8A8A8A]">{product.brand}</p>
                          <h4 className="font-serif-sc text-sm font-semibold text-[#1A1A1A] mt-0.5">{product.name}</h4>
                        </div>
                        <span className="font-sans-sc text-sm font-bold text-[#B85C38] flex-shrink-0">{product.price}</span>
                      </div>
                      <p className="font-sans-sc text-xs text-[#6B6B6B] mt-1.5 leading-relaxed line-clamp-2">{product.reason}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {product.tags.map((tag) => (
                          <span key={tag} className="font-sans-sc text-xs bg-[#F2E8E3] text-[#B85C38] px-2 py-0.5 rounded-sm">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <button className="w-full py-2 border border-[#1A1A1A] text-[#1A1A1A] rounded-sm font-sans-sc text-xs hover:bg-[#1A1A1A] hover:text-white transition-all duration-200 flex items-center justify-center gap-1 tracking-wide">
                      查看详情<ChevronRight className="w-3 h-3" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <button onClick={onReset} className="inline-flex items-center gap-2 text-[#6B6B6B] hover:text-[#1A1A1A] font-sans-sc text-sm transition-colors">
            <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.5} />重新上传照片检测
          </button>
        </div>
      </div>
    </section>
  );
}
