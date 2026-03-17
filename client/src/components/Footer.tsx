// 芯颜 AI Footer v4 — 全屏分页式，内容完全居中

export default function Footer() {
  return (
    <footer className="w-full h-full bg-[#1A1A1A] flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl mx-auto px-8 flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-0 select-none">
          <span className="font-serif-sc text-white text-2xl font-semibold tracking-widest">芯颜</span>
          <span className="font-serif-sc text-[#B85C38] text-2xl font-semibold tracking-widest ml-1">AI</span>
        </div>

        {/* 标语 */}
        <p className="font-sans-sc text-sm text-white/40 tracking-widest text-center">
          AI 驱动 · 秒级分析 · 专业护肤建议
        </p>

        {/* 分割线 */}
        <div className="w-16 h-px bg-[#B85C38]/40" />

        {/* 链接 */}
        <div className="flex items-center gap-8 flex-wrap justify-center">
          {['隐私政策', '使用条款', '联系我们', '关于我们'].map((item) => (
            <a
              key={item}
              href="#"
              className="font-sans-sc text-sm text-white/35 hover:text-white/70 transition-colors tracking-wide"
            >
              {item}
            </a>
          ))}
        </div>

        {/* 版权 */}
        <p className="font-sans-sc text-xs text-white/20 tracking-wide">
          © 2025 芯颜 AI · 本产品仅供参考，不构成医疗建议
        </p>
      </div>
    </footer>
  );
}
