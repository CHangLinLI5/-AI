// SkinAI Navbar — 极简医疗美学
// 深森绿品牌色，透明背景滚动变实色

import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Sparkles } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-sm border-b border-[#E8E0D8]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-[#1C3A2E] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-[#C9956A]" />
          </div>
          <span className="font-serif-sc text-[#1C3A2E] text-lg font-semibold tracking-wide">
            SkinAI
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: '功能介绍', href: '#features' },
            { label: '使用流程', href: '#how-it-works' },
            { label: '用户评价', href: '#testimonials' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-sans-sc text-[#4A4A4A] hover:text-[#1C3A2E] transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#upload"
          className="hidden md:inline-flex items-center gap-2 bg-[#1C3A2E] text-[#FAF8F5] text-sm font-sans-sc px-5 py-2 rounded-full hover:bg-[#2A5040] transition-colors duration-200"
        >
          <Sparkles className="w-3.5 h-3.5" />
          免费检测
        </a>
      </div>
    </header>
  );
}
