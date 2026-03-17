// 芯颜 AI HowItWorksSection — 使用流程说明
// 三步骤横向布局，深森绿主色

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
    <section id="how-it-works" className="py-24 bg-[#1C3A2E] relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/3 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/3 translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* 标题 */}
        <div className="text-center mb-16">
          <p className="font-sans-sc text-sm text-[#C9956A] tracking-widest uppercase mb-3">
            使用流程
          </p>
          <h2 className="font-serif-sc text-4xl font-bold text-[#FAF8F5] mb-4">
            三步完成
            <br />
            <span className="text-[#C9956A]">专业皮肤检测</span>
          </h2>
          <div className="w-24 h-px bg-[#C9956A]/40 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* 左侧：步骤列表 */}
          <div className="space-y-8">
            {STEPS.map(({ step, icon: Icon, title, description, tips }, index) => (
              <div key={step} className="flex gap-6 group">
                {/* 步骤编号 + 连接线 */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-[#C9956A]/50 flex items-center justify-center flex-shrink-0 group-hover:border-[#C9956A] group-hover:bg-[#C9956A]/10 transition-all duration-300">
                    <Icon className="w-5 h-5 text-[#C9956A]" />
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="w-px flex-1 bg-[#C9956A]/20 mt-3 min-h-[32px]" />
                  )}
                </div>

                {/* 内容 */}
                <div className="pb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-playfair text-[#C9956A]/60 text-sm">{step}</span>
                    <h3 className="font-serif-sc text-xl font-semibold text-[#FAF8F5]">{title}</h3>
                  </div>
                  <p className="font-sans-sc text-[#FAF8F5]/70 text-sm leading-relaxed mb-3">
                    {description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tips.map((tip) => (
                      <span
                        key={tip}
                        className="font-sans-sc text-xs bg-white/10 text-[#FAF8F5]/80 px-3 py-1 rounded-full"
                      >
                        {tip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 右侧：手机插图 */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-72 h-72 rounded-full bg-white/5 flex items-center justify-center">
                <div className="w-56 h-56 rounded-full bg-white/5 flex items-center justify-center">
                  <img
                    src={UPLOAD_ILLUSTRATION}
                    alt="上传照片示意"
                    className="w-48 h-48 object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
              {/* 浮动标签 */}
              <div className="absolute top-4 -right-4 bg-white rounded-xl px-4 py-2 shadow-lg">
                <div className="font-sans-sc text-xs text-[#1C3A2E] font-medium">✓ 隐私安全</div>
              </div>
              <div className="absolute bottom-8 -left-8 bg-[#C9956A] rounded-xl px-4 py-2 shadow-lg">
                <div className="font-sans-sc text-xs text-white font-medium">3秒出结果</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
