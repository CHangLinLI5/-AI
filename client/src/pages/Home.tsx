// SkinAI 主页面 — 整合所有区域
// 设计风格：极简医疗美学 | 深森绿 + 玫瑰金 + 米白

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import UploadSection from '@/components/UploadSection';
import ResultSection from '@/components/ResultSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';
import type { SkinAnalysisResult } from '@/lib/skinAnalysis';

type PageState = 'landing' | 'result';

export default function Home() {
  const [pageState, setPageState] = useState<PageState>('landing');
  const [analysisResult, setAnalysisResult] = useState<SkinAnalysisResult | null>(null);
  const [analysisImageUrl, setAnalysisImageUrl] = useState<string>('');

  const handleAnalysisComplete = (result: SkinAnalysisResult, imageUrl: string) => {
    setAnalysisResult(result);
    setAnalysisImageUrl(imageUrl);
    setPageState('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setPageState('landing');
    setAnalysisResult(null);
    setAnalysisImageUrl('');
    // 滚动到上传区域
    setTimeout(() => {
      document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (pageState === 'result' && analysisResult) {
    return (
      <div className="min-h-screen bg-[#FAF8F5]">
        <Navbar />
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

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <UploadSection onAnalysisComplete={handleAnalysisComplete} />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
