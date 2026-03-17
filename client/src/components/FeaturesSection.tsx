// 芯颜 AI FeaturesSection v3 — 全屏分页式
// 暖灰白底 | 白色卡片 | 砖赭红图标强调

import { Droplets, ScanFace, FlaskConical, ShoppingBag, Brain, Lock, ArrowRight } from 'lucide-react';

const ANALYSIS_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/309924522100821332/mfrG97Li6QqEizj9zKToc6/skin-analysis-visual-A5MqxXgoxpLKiXH6hWUVmR.webp';

const FEATURES = [
  { icon: ScanFace,     title: '深度皮肤扫描',   description: '采用计算机视觉技术，对脸部图像进行像素级分析，识别肉眼难以察觉的皮肤问题' },
  { icon: Brain,        title: 'AI 智能诊断',    description: '基于百万级皮肤数据训练的模型，准确识别痘痘、毛孔、色斑、细纹等 12 项皮肤指标' },
  { icon: Droplets,     title: '水油平衡分析',   description: '精准检测 T 区与 U 区的水分和油脂分布，判断肤质类型，给出针对性护肤建议' },
  { icon: FlaskConical, title: '成分精准推荐',   description: '根据您的皮肤问题，推荐适合的护肤成分（如烟酰胺、玻尿酸、水杨酸等）' },
  { icon: ShoppingBag,  title: '产品个性化推荐', description: '结合皮肤分析结果，从数千款产品中筛选最适合您的护肤品，附带使用建议' },
  { icon: Lock,         title: '隐私安全保障',   description: '照片仅用于本次分析，分析完成后立即删除，不存储任何个人图像数据' },
];

interface FeaturesSectionProps {
  onStartDetect?: () => void;
}

export default function FeaturesSection({ onStartDetect }: FeaturesSectionProps) {
  return (
    <section id="features" className="w-full h-full bg-[#F7F6F4] overflow-y-auto">
      <div className="max-w-6xl mx-auto px-8 py-16">

        {/* 标题 */}
        <div className="mb-8">
          <p className="font-sans-sc text-xs text-[#B85C38] tracking-[0.2em] uppercase mb-4">核心功能</p>
          <h2 className="font-serif-sc text-4xl font-bold text-[#1A1A1A] leading-tight">
            专业级皮肤检测<br />触手可及
          </h2>
          <div className="divider-accent w-16 mt-6" />
        </div>

        {/* 主展示区 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-10">
          {/* 左：AI 分析图 */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden">
              <img src={ANALYSIS_IMAGE} alt="AI 皮肤分析可视化" className="w-full h-[280px] object-cover" />
            </div>
            {/* 数据卡 */}
            <div className="absolute -bottom-5 -right-5 bg-white rounded-xl p-5 shadow-sm border border-[#E4E2DF]">
              <div className="font-sans-sc text-xs text-[#8A8A8A] mb-3 tracking-wide">实时检测指标</div>
              <div className="space-y-2.5">
                {[
                  { label: '皮肤水分', value: 72, color: '#B85C38' },
                  { label: '油脂分泌', value: 58, color: '#6B6B6B' },
                  { label: '皮肤弹性', value: 85, color: '#B85C38' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="font-sans-sc text-xs text-[#4A4A4A] w-16">{label}</span>
                    <div className="flex-1 h-1 bg-[#EFEDE9] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
                    </div>
                    <span className="font-sans-sc text-xs font-medium" style={{ color }}>{value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右：功能列表 */}
          <div className="space-y-4">
            {FEATURES.slice(0, 3).map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-4 p-5 bg-white rounded-xl border border-[#E4E2DF] hover:border-[#C8C5C0] hover:shadow-sm transition-all duration-250 card-hover">
                <div className="w-9 h-9 rounded-lg bg-[#F2E8E3] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-[#B85C38]" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-serif-sc font-semibold text-[#1A1A1A] text-sm mb-1">{title}</h3>
                  <p className="font-sans-sc text-xs text-[#6B6B6B] leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {FEATURES.slice(3).map(({ icon: Icon, title, description }) => (
            <div key={title} className="p-6 bg-white rounded-xl border border-[#E4E2DF] hover:border-[#C8C5C0] hover:shadow-sm transition-all duration-250 card-hover">
              <div className="w-10 h-10 rounded-lg bg-[#F2E8E3] flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-[#B85C38]" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif-sc font-semibold text-[#1A1A1A] mb-2 text-sm">{title}</h3>
              <p className="font-sans-sc text-xs text-[#6B6B6B] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        {onStartDetect && (
          <div className="text-center">
            <button
              onClick={onStartDetect}
              className="inline-flex items-center gap-2.5 bg-[#1A1A1A] text-[#F7F6F4] font-sans-sc text-sm px-8 py-3.5 rounded-sm hover:bg-[#B85C38] transition-colors duration-250 group tracking-wide"
            >
              开始检测我的皮肤
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
