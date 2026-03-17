// 芯颜 AI Footer v2 — 深炭黑背景，砖赭红 AI 后缀

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] py-12">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-0 select-none">
            <span className="font-serif-sc text-white text-base font-semibold tracking-wide">芯颜</span>
            <span className="font-serif-sc text-[#B85C38] text-base font-semibold tracking-wide ml-0.5">AI</span>
          </div>

          {/* 链接 */}
          <div className="flex items-center gap-8">
            {['隐私政策', '使用条款', '联系我们', '关于我们'].map((item) => (
              <a key={item} href="#" className="font-sans-sc text-sm text-white/35 hover:text-white/65 transition-colors tracking-wide">
                {item}
              </a>
            ))}
          </div>

          {/* 版权 */}
          <p className="font-sans-sc text-sm text-white/25 tracking-wide">
            © 2025 芯颜 AI
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-white/8 text-center">
          <p className="font-sans-sc text-xs text-white/20">
            本产品仅供参考，不构成医疗建议。如有皮肤问题，请咨询专业皮肤科医生。
          </p>
        </div>
      </div>
    </footer>
  );
}
