// 芯颜 AI Footer — 简洁页脚

import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1C3A2E] py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#C9956A]/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#C9956A]" />
            </div>
            <span className="font-serif-sc text-[#FAF8F5] text-lg font-semibold">芯颜 AI</span>
          </div>

          {/* 链接 */}
          <div className="flex items-center gap-6">
            {['隐私政策', '使用条款', '联系我们', '关于我们'].map((item) => (
              <a
                key={item}
                href="#"
                className="font-sans-sc text-sm text-white/50 hover:text-white/80 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          {/* 版权 */}
          <p className="font-sans-sc text-sm text-white/40">
            © 2025 芯颜 AI. 保留所有权利
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="font-sans-sc text-xs text-white/30">
            本产品仅供参考，不构成医疗建议。如有皮肤问题，请咨询专业皮肤科医生。
          </p>
        </div>
      </div>
    </footer>
  );
}
