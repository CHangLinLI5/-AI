// 芯颜 AI 主页面 v3 — 全屏分页式
import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import UploadSection from '@/components/UploadSection';
import ResultSection from '@/components/ResultSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';
import FullPageScroller from '@/components/FullPageScroller';
import type { SkinAnalysisResult } from '@/lib/skinAnalysis';

type PageState = 'landing' | 'result';

// 页面定义（landing 状态下的全屏分页）
const PAGES = [
  { id: 'hero',         label: '首页',     dark: false },
  { id: 'features',     label: '核心功能', dark: false },
  { id: 'how-it-works', label: '使用流程', dark: true  },
  { id: 'upload',       label: '开始检测', dark: false },
  { id: 'testimonials', label: '用户评价', dark: false },
  { id: 'footer',       label: '关于我们', dark: true  },
];

export default function Home() {
  const [pageState, setPageState] = useState<PageState>('landing');
  const [analysisResult, setAnalysisResult] = useState<SkinAnalysisResult | null>(null);
  const [analysisImageUrl, setAnalysisImageUrl] = useState<string>('');
  const [navDark, setNavDark] = useState(false);

  const handleAnalysisComplete = (result: SkinAnalysisResult, imageUrl: string) => {
    setAnalysisResult(result);
    setAnalysisImageUrl(imageUrl);
    setPageState('result');
  };

  const handleReset = () => {
    setPageState('landing');
    setAnalysisResult(null);
    setAnalysisImageUrl('');
  };

  const handlePageChange = useCallback((_index: number, dark: boolean) => {
    setNavDark(dark);
  }, []);

  // 结果页：普通滚动布局
  if (pageState === 'result' && analysisResult) {
    return (
      <div className="min-h-screen bg-[#FAF8F5]">
        <Navbar dark={false} />
        <div className="pt-16">
          <ResultSection
            result={analysisResult}
            imageUrl={analysisImageUrl}
            onReset={handleReset}
          />
        </div>
        <Footer />
      </div>
    );
  }

  // Landing 页：全屏分页式
  const pages = PAGES.map((p) => {
    let component;
    switch (p.id) {
      case 'hero':         component = <HeroSection />; break;
      case 'features':     component = <FeaturesSection />; break;
      case 'how-it-works': component = <HowItWorksSection />; break;
      case 'upload':       component = <UploadSection onAnalysisComplete={handleAnalysisComplete} />; break;
      case 'testimonials': component = <TestimonialsSection />; break;
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
