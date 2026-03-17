import { useState } from 'react';
import AppTabBar from '@/components/AppTabBar';
import ChatPage from './ChatPage';
import CalendarPage from './CalendarPage';
import HistoryPage from './HistoryPage';

type TabId = 'chat' | 'calendar' | 'history';

export default function AppPage() {
  const [activeTab, setActiveTab] = useState<TabId>('chat');

  return (
    <div className="app-shell">
      {/* 状态栏占位 */}
      <div style={{ height: 'env(safe-area-inset-top, 44px)', minHeight: 44, background: 'var(--app-bg)', flexShrink: 0 }} />

      {/* 页面内容区 */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'chat'     && <ChatPage />}
        {activeTab === 'calendar' && <CalendarPage />}
        {activeTab === 'history'  && <HistoryPage />}
      </div>

      {/* 底部 Tab Bar */}
      <AppTabBar active={activeTab} onChange={(id) => setActiveTab(id as TabId)} />
    </div>
  );
}
