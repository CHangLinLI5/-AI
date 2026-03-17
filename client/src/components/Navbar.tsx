// 芯颜 AI Navbar v2 — 成熟简约
// 底色：暖灰白 | 强调：砖赭红 #B85C38 | 文字：深炭黑 #1A1A1A

import { useState, useEffect } from 'react';
import { Link } from 'wouter';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? 'bg-[#F7F6F4]/96 backdrop-blur-md border-b border-[#E4E2DF]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0 group select-none">
          <span className="font-serif-sc text-[#1A1A1A] text-[1.15rem] font-semibold tracking-wide leading-none">
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
              className="font-sans-sc text-sm text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors duration-200 tracking-wide"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#upload"
          className="hidden md:inline-flex items-center gap-2 bg-[#1A1A1A] text-[#F7F6F4] font-sans-sc text-sm px-5 py-2.5 rounded-sm hover:bg-[#B85C38] transition-colors duration-250 tracking-wide"
        >
          免费检测
        </a>
      </div>
    </header>
  );
}
