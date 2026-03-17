// 芯颜 AI AnalyzingOverlay v2 — 深炭黑背景 + 砖赭红进度

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
    const stepInterval = setInterval(() => setCurrentStep((p) => Math.min(p + 1, ANALYSIS_STEPS.length - 1)), stepDuration);
    const progressInterval = setInterval(() => setProgress((p) => Math.min(p + 1, 100)), 28);
    return () => { clearInterval(stepInterval); clearInterval(progressInterval); };
  }, []);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1A1A]/97 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center space-y-8 max-w-sm px-6">
        {/* 环形进度 */}
        <div className="relative w-28 h-28 mx-auto">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
            <circle
              cx="50" cy="50" r="45" fill="none"
              stroke="#B85C38" strokeWidth="3" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-playfair text-3xl font-bold text-[#B85C38]">{progress}</span>
            <span className="font-sans-sc text-xs text-white/40">%</span>
          </div>
        </div>

        <div>
          <h3 className="font-serif-sc text-xl font-bold text-white mb-2">AI 深度分析中</h3>
          <p className="font-sans-sc text-sm text-white/40">正在处理您的皮肤数据，请稍候...</p>
        </div>

        <div className="space-y-2.5 text-left">
          {ANALYSIS_STEPS.map((step, index) => (
            <div key={step} className={`flex items-center gap-3 transition-all duration-300 ${index < currentStep ? 'opacity-30' : index === currentStep ? 'opacity-100' : 'opacity-15'}`}>
              <div className={`w-1 h-1 rounded-full flex-shrink-0 ${index <= currentStep ? 'bg-[#B85C38]' : 'bg-white/20'} ${index === currentStep ? 'animate-pulse' : ''}`} />
              <span className="font-sans-sc text-sm text-white/70">{step}</span>
              {index < currentStep && <span className="ml-auto text-[#B85C38] text-xs">✓</span>}
            </div>
          ))}
        </div>

        <div className="w-full h-px bg-white/8" />
        <p className="font-sans-sc text-xs text-white/25">您的照片仅用于本次分析，不会被存储</p>
      </div>
    </div>
  );
}
