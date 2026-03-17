// 芯颜 AI HowItWorksSection v2 — 成熟简约
// 深炭黑背景区块 | 砖赭红步骤强调

import { Upload, Cpu, Sparkles } from 'lucide-react';

const UPLOAD_ILLUSTRATION = 'https://d2xsxph8kpxj0f.cloudfront.net/309924522100821332/mfrG97Li6QqEizj9zKToc6/upload-illustration-J2k8gzeLUFjJwLHczjKhvG.webp';

const STEPS = [
  {
    step: '01',
    icon: Upload,
    title: '上传照片',
    description: '拍摄或上传一张清晰的脸部正面照片，确保光线充足、无遮挡',
    tips: ['支持 JPG、PNG 格式', '建议自然光拍摄', '正面免妆效果最佳'],
  },
  {
    step: '02',
    icon: Cpu,
    title: 'AI 深度分析',
    description: '芯颜 AI 将在 3 秒内完成 12 项皮肤指标的深度检测与评估',
    tips: ['12 项皮肤指标', '像素级精准分析', '数据实时处理'],
  },
  {
    step: '03',
    icon: Sparkles,
    title: '获取专属方案',
    description: '查看详细的皮肤报告，获取个性化护肤建议和产品推荐',
    tips: ['详细皮肤报告', '个性化护肤建议', '精准产品推荐'],
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-28 bg-[#1A1A1A] relative overflow-hidden">
      {/* 极淡纹理 */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <div className="max-w-6xl mx-auto px-8 relative">
        {/* 标题 */}
        <div className="mb-18">
          <p className="font-sans-sc text-xs text-[#B85C38] tracking-[0.2em] uppercase mb-4">使用流程</p>
          <h2 className="font-serif-sc text-4xl font-bold text-white leading-tight">
            三步完成<br />
            <span className="text-[#B85C38]">专业皮肤检测</span>
          </h2>
          <div className="w-16 h-px bg-[#B85C38] opacity-40 mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* 左：步骤 */}
          <div className="space-y-0">
            {STEPS.map(({ step, icon: Icon, title, description, tips }, index) => (
              <div key={step} className="flex gap-6 group">
                {/* 步骤线 */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-sm border border-white/15 flex items-center justify-center flex-shrink-0 group-hover:border-[#B85C38]/60 group-hover:bg-[#B85C38]/8 transition-all duration-250">
                    <Icon className="w-4 h-4 text-[#B85C38]" strokeWidth={1.5} />
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="w-px flex-1 bg-white/8 mt-3 min-h-[36px]" />
                  )}
                </div>

                {/* 内容 */}
                <div className="pb-10">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-playfair text-[#B85C38]/50 text-xs tracking-widest">{step}</span>
                    <h3 className="font-serif-sc text-lg font-semibold text-white">{title}</h3>
                  </div>
                  <p className="font-sans-sc text-sm text-white/55 leading-relaxed mb-3">{description}</p>
                  <div className="flex flex-wrap gap-2">
                    {tips.map((tip) => (
                      <span key={tip} className="font-sans-sc text-xs border border-white/10 text-white/45 px-3 py-1 rounded-sm">
                        {tip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 右：插图 */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-64 h-64 rounded-full border border-white/8 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border border-white/5 flex items-center justify-center">
                  <img src={UPLOAD_ILLUSTRATION} alt="上传示意" className="w-40 h-40 object-contain drop-shadow-2xl" />
                </div>
              </div>
              <div className="absolute top-2 -right-6 bg-white/8 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2">
                <div className="font-sans-sc text-xs text-white/70">✓ 隐私安全</div>
              </div>
              <div className="absolute bottom-6 -left-8 bg-[#B85C38] rounded-lg px-4 py-2">
                <div className="font-sans-sc text-xs text-white font-medium">3秒出结果</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
