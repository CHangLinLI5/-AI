// 芯颜 AI ResultSection — 分析结果展示页面
// 卡片式 UI，深森绿 + 玫瑰金配色

import { useState } from 'react';
import {
  ArrowLeft,
  RefreshCw,
  Share2,
  Download,
  ChevronRight,
  Droplets,
  Sun,
  Layers,
  Palette,
  Activity,
  Shield,
} from 'lucide-react';
import type { SkinAnalysisResult } from '@/lib/skinAnalysis';
import {
  getLevelColor,
  getLevelLabel,
  getSeverityColor,
  getSeverityLabel,
} from '@/lib/skinAnalysis';
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
  const color = score >= 80 ? '#1C3A2E' : score >= 60 ? '#C9956A' : '#E57373';

  return (
    <div className="relative w-28 h-28">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#F0EDE8" strokeWidth="6" />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-playfair text-3xl font-bold" style={{ color }}>{score}</span>
        <span className="font-sans-sc text-xs text-[#8A8A8A]">综合评分</span>
      </div>
    </div>
  );
}

function MetricBar({ label, score, level, description, icon: Icon }: {
  label: string;
  score: number;
  level: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const barColor = level === 'excellent' ? '#1C3A2E' : level === 'good' ? '#4A8C6A' : level === 'fair' ? '#C9956A' : '#E57373';

  return (
    <div className="p-4 bg-white rounded-2xl border border-[#F0EDE8] hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#E8F0EC] flex items-center justify-center">
            <Icon className="w-4 h-4 text-[#1C3A2E]" />
          </div>
          <div>
            <div className="font-sans-sc text-sm font-medium text-[#1A1A1A]">{label}</div>
            <div className="font-sans-sc text-xs text-[#8A8A8A]">{description}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-playfair text-xl font-bold" style={{ color: barColor }}>{score}</div>
          <div className={`font-sans-sc text-xs ${getLevelColor(level as any)}`}>
            {getLevelLabel(level as any)}
          </div>
        </div>
      </div>
      <div className="h-2 bg-[#F0EDE8] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${score}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}

export default function ResultSection({ result, imageUrl, onReset }: ResultSectionProps) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'advice' | 'products'>('analysis');

  const handleShare = () => {
    toast.success('链接已复制到剪贴板', {
      description: '快分享给朋友吧！',
    });
  };

  const handleDownload = () => {
    toast.info('报告下载功能即将上线', {
      description: '敬请期待 PDF 报告导出功能',
    });
  };

  return (
    <section className="min-h-screen bg-[#FAF8F5] py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* 顶部操作栏 */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-[#5A5A5A] hover:text-[#1C3A2E] font-sans-sc text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            重新检测
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-sm font-sans-sc text-[#5A5A5A] hover:text-[#1C3A2E] transition-colors px-3 py-2 rounded-xl hover:bg-[#E8F0EC]"
            >
              <Share2 className="w-4 h-4" />
              分享
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 text-sm font-sans-sc text-[#5A5A5A] hover:text-[#1C3A2E] transition-colors px-3 py-2 rounded-xl hover:bg-[#E8F0EC]"
            >
              <Download className="w-4 h-4" />
              下载报告
            </button>
          </div>
        </div>

        {/* 综合评分卡 */}
        <div className="bg-[#1C3A2E] rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            {/* 用户照片 */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#C9956A]/40">
                <img src={imageUrl} alt="您的照片" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#C9956A] flex items-center justify-center">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
            </div>

            {/* 评分 */}
            <div className="flex-1 text-center md:text-left">
              <p className="font-sans-sc text-sm text-white/60 mb-1">检测完成 · {result.analysisTime}</p>
              <h2 className="font-serif-sc text-2xl font-bold text-[#FAF8F5] mb-2">
                {result.skinType}
              </h2>
              <p className="font-sans-sc text-sm text-white/70 leading-relaxed max-w-md">
                {result.skinTypeDescription}
              </p>
            </div>

            {/* 环形评分 */}
            <div className="flex-shrink-0">
              <ScoreRing score={result.overallScore} />
            </div>
          </div>
        </div>

        {/* Tab 切换 */}
        <div className="flex gap-1 bg-[#F0EDE8] p-1 rounded-2xl mb-8">
          {[
            { key: 'analysis', label: '皮肤分析' },
            { key: 'advice', label: '护肤建议' },
            { key: 'products', label: '产品推荐' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex-1 py-2.5 rounded-xl font-sans-sc text-sm font-medium transition-all duration-200 ${
                activeTab === key
                  ? 'bg-white text-[#1C3A2E] shadow-sm'
                  : 'text-[#8A8A8A] hover:text-[#5A5A5A]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 皮肤分析 Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-6 animate-fade-up">
            {/* 指标网格 */}
            <div>
              <h3 className="font-serif-sc text-lg font-semibold text-[#1A1A1A] mb-4">
                皮肤健康指标
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.metrics.map((metric, index) => {
                  const Icon = METRIC_ICONS[index % METRIC_ICONS.length];
                  return (
                    <MetricBar
                      key={metric.label}
                      label={metric.label}
                      score={metric.score}
                      level={metric.level}
                      description={metric.description}
                      icon={Icon}
                    />
                  );
                })}
              </div>
            </div>

            {/* 皮肤问题 */}
            {result.issues.length > 0 && (
              <div>
                <h3 className="font-serif-sc text-lg font-semibold text-[#1A1A1A] mb-4">
                  发现的皮肤问题
                </h3>
                <div className="space-y-3">
                  {result.issues.map((issue) => (
                    <div
                      key={issue.name}
                      className={`p-4 rounded-2xl border ${getSeverityColor(issue.severity)}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-serif-sc font-semibold text-sm">{issue.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-current/10 font-sans-sc">
                            {getSeverityLabel(issue.severity)}
                          </span>
                        </div>
                        <span className="font-sans-sc text-xs opacity-70">{issue.area}</span>
                      </div>
                      <p className="font-sans-sc text-xs opacity-80 leading-relaxed">{issue.tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 护肤建议 Tab */}
        {activeTab === 'advice' && (
          <div className="space-y-4 animate-fade-up">
            <h3 className="font-serif-sc text-lg font-semibold text-[#1A1A1A] mb-4">
              个性化护肤方案
            </h3>
            {result.recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex gap-4 p-5 bg-white rounded-2xl border border-[#F0EDE8] hover:shadow-md transition-all duration-300 card-hover"
              >
                <div className="w-8 h-8 rounded-full bg-[#1C3A2E] text-[#FAF8F5] flex items-center justify-center flex-shrink-0 font-playfair text-sm font-bold">
                  {index + 1}
                </div>
                <p className="font-sans-sc text-sm text-[#3A3A3A] leading-relaxed pt-1">{rec}</p>
              </div>
            ))}

            {/* 护肤步骤 */}
            <div className="mt-8 p-6 bg-[#1C3A2E] rounded-3xl">
              <h4 className="font-serif-sc text-lg font-semibold text-[#FAF8F5] mb-4">
                推荐护肤步骤
              </h4>
              <div className="space-y-3">
                {[
                  { step: '早晨', items: ['洁面 → 爽肤水 → 精华 → 防晒'] },
                  { step: '晚间', items: ['卸妆 → 洁面 → 爽肤水 → 精华 → 面霜'] },
                  { step: '每周', items: ['1-2次去角质 / 1-2次面膜'] },
                ].map(({ step, items }) => (
                  <div key={step} className="flex gap-4">
                    <span className="font-sans-sc text-xs text-[#C9956A] font-medium w-12 flex-shrink-0 pt-0.5">
                      {step}
                    </span>
                    <span className="font-sans-sc text-sm text-white/80">{items[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 产品推荐 Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fade-up">
            {/* 产品图 */}
            <div className="rounded-3xl overflow-hidden h-48 relative">
              <img
                src={PRODUCTS_IMAGE}
                alt="推荐护肤产品"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1C3A2E]/80 to-transparent flex items-center px-8">
                <div>
                  <p className="font-sans-sc text-sm text-white/70 mb-1">基于您的皮肤分析</p>
                  <h3 className="font-serif-sc text-2xl font-bold text-[#FAF8F5]">专属产品推荐</h3>
                </div>
              </div>
            </div>

            {/* 产品卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-[#F0EDE8] overflow-hidden hover:shadow-lg transition-all duration-300 card-hover"
                >
                  <div className="flex gap-4 p-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F5F2EE] flex-shrink-0">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-sans-sc text-xs text-[#8A8A8A]">{product.brand}</p>
                          <h4 className="font-serif-sc text-sm font-semibold text-[#1A1A1A] mt-0.5">
                            {product.name}
                          </h4>
                        </div>
                        <span className="font-sans-sc text-sm font-bold text-[#1C3A2E] flex-shrink-0">
                          {product.price}
                        </span>
                      </div>
                      <p className="font-sans-sc text-xs text-[#6A6A6A] mt-2 leading-relaxed line-clamp-2">
                        {product.reason}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {product.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-sans-sc text-xs bg-[#E8F0EC] text-[#1C3A2E] px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <button className="w-full py-2 border border-[#1C3A2E] text-[#1C3A2E] rounded-xl font-sans-sc text-sm hover:bg-[#1C3A2E] hover:text-white transition-all duration-200 flex items-center justify-center gap-1">
                      查看详情
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 底部重新检测 */}
        <div className="mt-12 text-center">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 text-[#5A5A5A] hover:text-[#1C3A2E] font-sans-sc text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            重新上传照片检测
          </button>
        </div>
      </div>
    </section>
  );
}
