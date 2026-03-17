// SkinAI AnalyzingOverlay — AI 分析中动画覆盖层
// 全屏遮罩 + 环形进度 + 逐步提示文字

import { useEffect, useState } from 'react';

const ANALYSIS_STEPS = [
  '正在识别面部轮廓...',
  '检测皮肤纹理与毛孔...',
  '分析水油平衡状态...',
  '识别色斑与暗沉区域...',
  '评估皮肤弹性指数...',
  '生成个性化护肤方案...',
];

export default function AnalyzingOverlay() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepDuration = 2800 / ANALYSIS_STEPS.length;
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, ANALYSIS_STEPS.length - 1));
    }, stepDuration);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100));
    }, 28);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 bg-[#1C3A2E]/95 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center space-y-8 max-w-sm px-6">
        {/* 环形进度条 */}
        <div className="relative w-32 h-32 mx-auto">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* 背景圆 */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
            />
            {/* 进度圆 */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#C9956A"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.1s ease' }}
            />
          </svg>
          {/* 中心数字 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-playfair text-3xl font-bold text-[#C9956A]">{progress}</span>
            <span className="font-sans-sc text-xs text-white/60">%</span>
          </div>
        </div>

        {/* 标题 */}
        <div>
          <h3 className="font-serif-sc text-2xl font-bold text-[#FAF8F5] mb-2">
            AI 深度分析中
          </h3>
          <p className="font-sans-sc text-sm text-white/60">
            正在处理您的皮肤数据，请稍候...
          </p>
        </div>

        {/* 步骤提示 */}
        <div className="space-y-2">
          {ANALYSIS_STEPS.map((step, index) => (
            <div
              key={step}
              className={`flex items-center gap-3 transition-all duration-300 ${
                index < currentStep
                  ? 'opacity-40'
                  : index === currentStep
                  ? 'opacity-100'
                  : 'opacity-20'
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  index < currentStep
                    ? 'bg-[#C9956A]'
                    : index === currentStep
                    ? 'bg-[#C9956A] animate-pulse'
                    : 'bg-white/30'
                }`}
              />
              <span className="font-sans-sc text-sm text-white/80">{step}</span>
              {index < currentStep && (
                <span className="ml-auto text-[#C9956A] text-xs">✓</span>
              )}
            </div>
          ))}
        </div>

        {/* 扫描线装饰 */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C9956A]/40 to-transparent" />
        <p className="font-sans-sc text-xs text-white/40">
          您的照片仅用于本次分析，不会被存储
        </p>
      </div>
    </div>
  );
}
