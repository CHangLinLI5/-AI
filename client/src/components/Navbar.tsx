// 芯颜 AI Navbar v3 — 全屏分页式
// 支持 dark 模式（暗色背景页时文字变白）
// 底色：暖灰白 | 强调：砖赭红 #B85C38 | 文字：深炭黑 #1A1A1A

import { Link, useLocation } from 'wouter';
import { markVisited } from '@/lib/storage';

interface NavbarProps {
  dark?: boolean;
}

export default function Navbar({ dark = false }: NavbarProps) {
  const [, setLocation] = useLocation();

  const handleCTA = (e: React.MouseEvent) => {
    e.preventDefault();
    markVisited();
    setLocation('/app');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        dark
          ? 'bg-transparent'
          : 'bg-[#F7F6F4]/96 backdrop-blur-md border-b border-[#E4E2DF]'
      }`}
    >
      <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0 group select-none">
          <span
            className={`font-serif-sc text-[1.15rem] font-semibold tracking-wide leading-none transition-colors duration-300 ${
              dark ? 'text-white' : 'text-[#1A1A1A]'
            }`}
          >
            芯颜
          </span>
          <span className="font-serif-sc text-[#B85C38] text-[1.15rem] font-semibold tracking-wide leading-none ml-0.5">
            AI
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-10">
          {[
            { label: '功能介绍', href: '#features' },
            { label: '使用流程', href: '#how-it-works' },
            { label: '用户评价', href: '#testimonials' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`font-sans-sc text-sm transition-colors duration-200 tracking-wide ${
                dark
                  ? 'text-white/70 hover:text-white'
                  : 'text-[#4A4A4A] hover:text-[#1A1A1A]'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <button
          onClick={handleCTA}
          className={`hidden md:inline-flex items-center gap-2 font-sans-sc text-sm px-5 py-2.5 rounded-sm transition-colors duration-250 tracking-wide ${
            dark
              ? 'bg-white/10 text-white hover:bg-[#B85C38] border border-white/20'
              : 'bg-[#1A1A1A] text-[#F7F6F4] hover:bg-[#B85C38]'
          }`}
        >
          免费检测
        </button>
      </div>
    </header>
  );
}
