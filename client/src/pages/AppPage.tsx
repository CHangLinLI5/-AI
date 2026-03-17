// 芯颜 AI — 主应用页面
// 含底部 Tab 导航 + 4 个子页面
// 检测完成后自动保存到历史记录

import { useState, useCallback } from 'react';
import TabBar from '@/components/TabBar';
import Dashboard from '@/components/Dashboard';
import UploadSection from '@/components/UploadSection';
import ResultSection from '@/components/ResultSection';
import ChatPage from '@/components/ChatPage';
import ProfilePage from '@/components/ProfilePage';
import { addHistory, generateThumbnail } from '@/lib/storage';
import type { SkinAnalysisResult } from '@/lib/skinAnalysis';

export default function AppPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<SkinAnalysisResult | null>(null);
  const [analysisImageUrl, setAnalysisImageUrl] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleAnalysisComplete = useCallback(async (result: SkinAnalysisResult, imageUrl: string) => {
    // 保存到历史记录
    const thumbnail = await generateThumbnail(imageUrl);
    addHistory(result, thumbnail);

    setAnalysisResult(result);
    setAnalysisImageUrl(imageUrl);
    setShowResult(true);
  }, []);

  const handleResetDetect = useCallback(() => {
    setShowResult(false);
    setAnalysisResult(null);
    setAnalysisImageUrl('');
  }, []);

  const handleGoToTab = useCallback((tab: number) => {
    setActiveTab(tab);
    if (tab !== 1) setShowResult(false); // 切走检测 tab 时重置
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F6F4]">
      {/* 页面内容 */}
      <div className="pb-14">
        {activeTab === 0 && <Dashboard onNavigate={handleGoToTab} />}
        {activeTab === 1 && (
          showResult && analysisResult ? (
            <ResultSection result={analysisResult} imageUrl={analysisImageUrl} onReset={handleResetDetect} />
          ) : (
            <UploadSection onAnalysisComplete={handleAnalysisComplete} />
          )
        )}
        {activeTab === 2 && <ChatPage />}
        {activeTab === 3 && <ProfilePage />}
      </div>

      {/* 底部 Tab */}
      <TabBar activeTab={activeTab} onTabChange={handleGoToTab} />
    </div>
  );
}
