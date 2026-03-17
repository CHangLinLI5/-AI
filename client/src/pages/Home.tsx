// 芯颜 AI 主页面 v3 — 全屏分页式
// 首次访问显示 Landing Page，回访直接跳转 /app
import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'wouter';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';
import FullPageScroller from '@/components/FullPageScroller';
import { isFirstVisit, markVisited, getHistory } from '@/lib/storage';

// 页面定义（landing 状态下的全屏分页）— 移除了 upload 页面
const PAGES = [
  { id: 'hero',         label: '首页',     dark: false },
  { id: 'features',     label: '核心功能', dark: false },
  { id: 'how-it-works', label: '使用流程', dark: true  },
  { id: 'testimonials', label: '用户评价', dark: false },
  { id: 'footer',       label: '关于我们', dark: true  },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [navDark, setNavDark] = useState(false);
  const [shouldShowLanding, setShouldShowLanding] = useState<boolean | null>(null);

  // 判断是否需要显示 Landing Page
  useEffect(() => {
    const firstVisit = isFirstVisit();
    const hasHistory = getHistory().length > 0;

    if (!firstVisit || hasHistory) {
      // 回访用户，直接跳转到 App
      setLocation('/app');
    } else {
      // 首次访问，显示 Landing Page
      setShouldShowLanding(true);
    }
  }, [setLocation]);

  const handleStartDetect = useCallback(() => {
    markVisited();
    setLocation('/app');
  }, [setLocation]);

  const handlePageChange = useCallback((_index: number, dark: boolean) => {
    setNavDark(dark);
  }, []);

  // 等待判断完成
  if (shouldShowLanding === null) {
    return null;
  }

  // Landing 页：全屏分页式
  const pages = PAGES.map((p) => {
    let component;
    switch (p.id) {
      case 'hero':         component = <HeroSection onStartDetect={handleStartDetect} />; break;
      case 'features':     component = <FeaturesSection onStartDetect={handleStartDetect} />; break;
      case 'how-it-works': component = <HowItWorksSection onStartDetect={handleStartDetect} />; break;
      case 'testimonials': component = <TestimonialsSection onStartDetect={handleStartDetect} />; break;
      case 'footer':       component = <Footer />; break;
      default:             component = null;
    }
    return { ...p, component };
  });

  return (
    <>
      <Navbar dark={navDark} />
      <FullPageScroller pages={pages} onPageChange={handlePageChange} />
    </>
  );
}
