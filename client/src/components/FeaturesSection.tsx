// 芯颜 AI FeaturesSection — 功能介绍区域
// 深森绿卡片 + 米白背景，交错布局

import { Droplets, ScanFace, FlaskConical, ShoppingBag, Brain, Lock } from 'lucide-react';

const ANALYSIS_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/309924522100821332/mfrG97Li6QqEizj9zKToc6/skin-analysis-visual-A5MqxXgoxpLKiXH6hWUVmR.webp';

const FEATURES = [
  {
    icon: ScanFace,
    title: '深度皮肤扫描',
    description: '采用计算机视觉技术，对脸部图像进行像素级分析，识别肉眼难以察觉的皮肤问题',
    color: '#1C3A2E',
  },
  {
    icon: Brain,
    title: 'AI 智能诊断',
    description: '基于百万级皮肤数据训练的模型，准确识别痘痘、毛孔、色斑、细纹等 12 项皮肤指标',
    color: '#C9956A',
  },
  {
    icon: Droplets,
    title: '水油平衡分析',
    description: '精准检测 T 区与 U 区的水分和油脂分布，判断肤质类型，给出针对性护肤建议',
    color: '#1C3A2E',
  },
  {
    icon: FlaskConical,
    title: '成分精准推荐',
    description: '根据您的皮肤问题，推荐适合的护肤成分（如烟酰胺、玻尿酸、水杨酸等）',
    color: '#C9956A',
  },
  {
    icon: ShoppingBag,
    title: '产品个性化推荐',
    description: '结合皮肤分析结果，从数千款产品中筛选最适合您的护肤品，附带使用建议',
    color: '#1C3A2E',
  },
  {
    icon: Lock,
    title: '隐私安全保障',
    description: '照片仅用于本次分析，分析完成后立即删除，不存储任何个人图像数据',
    color: '#C9956A',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-6">
        {/* 标题区 */}
        <div className="text-center mb-16">
          <p className="font-sans-sc text-sm text-[#1C3A2E] tracking-widest uppercase mb-3">
            核心功能
          </p>
          <h2 className="font-serif-sc text-4xl font-bold text-[#1A1A1A] mb-4">
            专业级皮肤检测
            <br />
            <span className="text-[#1C3A2E]">触手可及</span>
          </h2>
          <div className="divider-gold w-24 mx-auto mt-6" />
        </div>

        {/* 主要展示区：图片 + 功能列表 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* 左侧：AI 分析可视化图 */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-[#1C3A2E]/20">
              <img
                src={ANALYSIS_IMAGE}
                alt="AI 皮肤分析可视化"
                className="w-full h-[420px] object-cover"
              />
            </div>
            {/* 数据标签 */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 shadow-xl shadow-[#1C3A2E]/10">
              <div className="font-sans-sc text-xs text-[#8A8A8A] mb-3">实时检测指标</div>
              <div className="space-y-2">
                {[
                  { label: '皮肤水分', value: 72, color: '#1C3A2E' },
                  { label: '油脂分泌', value: 58, color: '#C9956A' },
                  { label: '皮肤弹性', value: 85, color: '#1C3A2E' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="font-sans-sc text-xs text-[#5A5A5A] w-16">{label}</span>
                    <div className="flex-1 h-1.5 bg-[#F0EDE8] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${value}%`, backgroundColor: color }}
                      />
                    </div>
                    <span className="font-sans-sc text-xs font-medium" style={{ color }}>
                      {value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧：功能列表 */}
          <div className="space-y-6">
            {FEATURES.slice(0, 3).map(({ icon: Icon, title, description, color }) => (
              <div
                key={title}
                className="flex gap-4 p-5 rounded-2xl bg-white hover:shadow-md transition-all duration-300 card-hover border border-[#F0EDE8]"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <h3 className="font-serif-sc font-semibold text-[#1A1A1A] mb-1">{title}</h3>
                  <p className="font-sans-sc text-sm text-[#6A6A6A] leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部功能卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.slice(3).map(({ icon: Icon, title, description, color }) => (
            <div
              key={title}
              className="p-6 rounded-2xl bg-white border border-[#F0EDE8] hover:shadow-lg transition-all duration-300 card-hover"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <h3 className="font-serif-sc font-semibold text-[#1A1A1A] mb-2">{title}</h3>
              <p className="font-sans-sc text-sm text-[#6A6A6A] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
