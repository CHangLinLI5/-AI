// 芯颜 AI HeroSection v3 — 全屏分页式
// 暖灰白底 | 深炭黑文字 | 砖赭红强调 | 非对称布局

import { ArrowRight, Shield, Zap, Star } from 'lucide-react';

const HERO_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/309924522100821332/mfrG97Li6QqEizj9zKToc6/hero-bg-Kr95RtWHsDazEYa6N6wRof.webp';

interface HeroSectionProps {
  onStartDetect?: () => void;
}

export default function HeroSection({ onStartDetect }: HeroSectionProps) {
  return (
    <section className="relative w-full h-full bg-[#F7F6F4] overflow-hidden flex items-center">
      {/* 极淡背景纹理圆 */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-[#EFEDE9] -translate-y-1/3 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#F2E8E3]/50 translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-8 w-full pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* 左侧文字 */}
          <div className="space-y-9">
            {/* 标签 */}
            <div className="inline-flex items-center gap-2 border border-[#E4E2DF] text-[#6B6B6B] text-xs font-sans-sc px-4 py-1.5 rounded-sm animate-fade-up tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B85C38]" />
              AI 驱动 · 秒级分析 · 专业建议
            </div>

            {/* 主标题 */}
            <div className="animate-fade-up-delay-1">
              <h1 className="font-serif-sc text-5xl lg:text-[3.6rem] font-bold text-[#1A1A1A] leading-[1.15] tracking-tight">
                了解你的<br />皮肤状态
              </h1>
              <p className="font-playfair italic text-[#B85C38] text-xl mt-3 tracking-wide opacity-80">
                AI-Powered Skin Analysis
              </p>
            </div>

            {/* 描述 */}
            <p className="font-sans-sc text-[#4A4A4A] text-base leading-[1.9] animate-fade-up-delay-2 max-w-md">
              上传一张脸部照片，芯颜 AI 将在 3 秒内完成深度皮肤检测，
              分析痘痘、毛孔、油脂、色斑等 12 项皮肤指标，为你定制专属护肤方案。
            </p>

            {/* 信任指标 */}
            <div className="flex items-center gap-7 animate-fade-up-delay-2">
              {[
                { icon: Shield, text: '隐私保护' },
                { icon: Zap, text: '3秒出结果' },
                { icon: Star, text: '98% 好评' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-sm text-[#6B6B6B]">
                  <Icon className="w-3.5 h-3.5 text-[#B85C38]" strokeWidth={1.5} />
                  <span className="font-sans-sc">{text}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-5 animate-fade-up-delay-3">
              <button
                onClick={onStartDetect}
                className="inline-flex items-center gap-2.5 bg-[#1A1A1A] text-[#F7F6F4] font-sans-sc text-sm px-8 py-3.5 rounded-sm hover:bg-[#B85C38] transition-colors duration-250 group tracking-wide"
              >
                立即免费检测
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
              </button>
              <a
                href="#how-it-works"
                className="font-sans-sc text-sm text-[#4A4A4A] hover:text-[#1A1A1A] underline underline-offset-4 decoration-[#C8C5C0] hover:decoration-[#1A1A1A] transition-all tracking-wide"
              >
                了解更多
              </a>
            </div>

            {/* 数据 */}
            <div className="flex items-center gap-10 pt-5 border-t border-[#E4E2DF] animate-fade-up-delay-4">
              {[
                { number: '50万+', label: '用户信赖' },
                { number: '12项', label: '检测维度' },
                { number: '98%', label: '准确率' },
              ].map(({ number, label }) => (
                <div key={label}>
                  <div className="font-serif-sc text-2xl font-bold text-[#1A1A1A]">{number}</div>
                  <div className="font-sans-sc text-xs text-[#8A8A8A] mt-0.5 tracking-wide">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧图片 */}
          <div className="relative animate-fade-up-delay-2">
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={HERO_IMAGE}
                alt="AI 皮肤检测示例"
                className="w-full h-[460px] object-cover"
              />
              {/* 图片遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/10 to-transparent" />

              {/* 数据浮层 */}
              <div className="absolute top-5 left-5 bg-white/92 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm border border-[#E4E2DF]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B85C38] animate-pulse" />
                  <span className="font-sans-sc text-xs text-[#1A1A1A] font-medium tracking-wide">AI 正在分析中</span>
                </div>
                {['水分: 78%', '油脂: 适中', '弹性: 良好'].map((item) => (
                  <div key={item} className="font-sans-sc text-xs text-[#6B6B6B] leading-5">{item}</div>
                ))}
              </div>

              {/* 评分角标 */}
              <div className="absolute bottom-5 right-5 bg-[#1A1A1A] rounded-xl px-5 py-4">
                <div className="font-playfair text-3xl font-bold text-[#B85C38]">82</div>
                <div className="font-sans-sc text-xs text-white/60 mt-0.5 tracking-wide">综合评分</div>
              </div>
            </div>

            {/* 侧边浮卡 */}
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 bg-white rounded-xl p-4 shadow-md border border-[#E4E2DF] hidden lg:block">
              <div className="font-sans-sc text-xs text-[#8A8A8A] mb-2.5 tracking-wide">检测项目</div>
              {['痘痘检测', '毛孔分析', '色斑识别', '肤色均匀'].map((item, i) => (
                <div key={item} className="flex items-center gap-2 py-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: i < 3 ? '#B85C38' : '#E4E2DF' }} />
                  <span className="font-sans-sc text-xs text-[#3A3A3A]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
