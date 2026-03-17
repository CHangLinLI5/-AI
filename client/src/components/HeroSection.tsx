// SkinAI HeroSection — 极简医疗美学
// 非对称布局：文字左置，图片右置，米白背景

import { ArrowRight, Shield, Zap, Star } from 'lucide-react';

const HERO_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/309924522100821332/mfrG97Li6QqEizj9zKToc6/hero-bg-Kr95RtWHsDazEYa6N6wRof.webp';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#FAF8F5] overflow-hidden flex items-center">
      {/* 背景装饰圆 */}
      <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-[#E8F0EC]/60 -translate-y-1/4 translate-x-1/4 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#F5EDE4]/50 translate-y-1/3 -translate-x-1/3 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 w-full pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 左侧文字区 */}
          <div className="space-y-8">
            {/* 标签 */}
            <div className="inline-flex items-center gap-2 bg-[#E8F0EC] text-[#1C3A2E] text-xs font-sans-sc px-4 py-1.5 rounded-full animate-fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1C3A2E] animate-pulse" />
              AI 驱动 · 秒级分析 · 专业建议
            </div>

            {/* 主标题 */}
            <div className="animate-fade-up-delay-1">
              <h1 className="font-serif-sc text-5xl lg:text-6xl font-bold text-[#1A1A1A] leading-tight">
                了解你的
                <br />
                <span className="text-[#1C3A2E]">皮肤状态</span>
              </h1>
              <p className="font-playfair italic text-[#C9956A] text-2xl mt-2">
                AI-Powered Skin Analysis
              </p>
            </div>

            {/* 描述 */}
            <p className="font-sans-sc text-[#5A5A5A] text-lg leading-relaxed animate-fade-up-delay-2">
              上传一张脸部照片，SkinAI 将在 3 秒内完成深度皮肤检测，
              分析痘痘、毛孔、油脂、色斑等 12 项皮肤指标，
              为你定制专属护肤方案。
            </p>

            {/* 信任指标 */}
            <div className="flex items-center gap-6 animate-fade-up-delay-2">
              {[
                { icon: Shield, text: '隐私保护' },
                { icon: Zap, text: '3秒出结果' },
                { icon: Star, text: '98%好评率' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-sm text-[#5A5A5A]">
                  <Icon className="w-4 h-4 text-[#1C3A2E]" />
                  <span className="font-sans-sc">{text}</span>
                </div>
              ))}
            </div>

            {/* CTA 按钮 */}
            <div className="flex items-center gap-4 animate-fade-up-delay-3">
              <a
                href="#upload"
                className="inline-flex items-center gap-2 bg-[#1C3A2E] text-[#FAF8F5] font-sans-sc font-medium px-8 py-4 rounded-full hover:bg-[#2A5040] transition-all duration-300 hover:shadow-lg hover:shadow-[#1C3A2E]/20 group"
              >
                立即免费检测
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 text-[#1C3A2E] font-sans-sc text-sm hover:underline underline-offset-4 transition-all"
              >
                了解更多
              </a>
            </div>

            {/* 用户数据 */}
            <div className="flex items-center gap-8 pt-4 border-t border-[#E8E0D8] animate-fade-up-delay-4">
              {[
                { number: '50万+', label: '用户信赖' },
                { number: '12项', label: '检测维度' },
                { number: '98%', label: '准确率' },
              ].map(({ number, label }) => (
                <div key={label}>
                  <div className="font-serif-sc text-2xl font-bold text-[#1C3A2E]">{number}</div>
                  <div className="font-sans-sc text-xs text-[#8A8A8A] mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧图片区 */}
          <div className="relative animate-fade-up-delay-2">
            {/* 主图片 */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#1C3A2E]/15">
              <img
                src={HERO_IMAGE}
                alt="AI 皮肤检测示例"
                className="w-full h-[520px] object-cover"
              />
              {/* 图片上的数据标签 */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-sans-sc text-xs text-[#1A1A1A] font-medium">AI 正在分析中...</span>
                </div>
                <div className="mt-1.5 space-y-1">
                  {['水分: 78%', '油脂: 适中', '弹性: 良好'].map((item) => (
                    <div key={item} className="font-sans-sc text-xs text-[#5A5A5A]">{item}</div>
                  ))}
                </div>
              </div>

              {/* 综合评分标签 */}
              <div className="absolute bottom-6 right-6 bg-[#1C3A2E] rounded-2xl px-5 py-4 shadow-lg">
                <div className="font-playfair text-3xl font-bold text-[#C9956A]">82</div>
                <div className="font-sans-sc text-xs text-[#FAF8F5]/80 mt-0.5">综合评分</div>
              </div>
            </div>

            {/* 浮动卡片 */}
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 bg-white rounded-2xl p-4 shadow-xl shadow-[#1C3A2E]/10 hidden lg:block">
              <div className="font-sans-sc text-xs text-[#8A8A8A] mb-2">检测项目</div>
              {['痘痘检测', '毛孔分析', '色斑识别', '肤色均匀'].map((item, i) => (
                <div key={item} className="flex items-center gap-2 py-1">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: i < 3 ? '#1C3A2E' : '#E8E0D8' }}
                  />
                  <span className="font-sans-sc text-xs text-[#3A3A3A]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 底部渐变过渡 */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAF8F5] to-transparent pointer-events-none" />
    </section>
  );
}
