// 芯颜 AI — 底部 Tab 导航栏
// 4 个 Tab：首页、检测、聊天、我的

import { Home, ScanFace, MessageCircle, User } from 'lucide-react';

const TABS = [
  { icon: Home, label: '首页' },
  { icon: ScanFace, label: '检测' },
  { icon: MessageCircle, label: '聊天' },
  { icon: User, label: '我的' },
];

interface TabBarProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
}

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E4E2DF]">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {TABS.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === index;
          return (
            <button
              key={tab.label}
              onClick={() => onTabChange(index)}
              className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors duration-200"
            >
              <Icon
                className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-[#B85C38]' : 'text-[#8A8A8A]'}`}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span
                className={`font-sans-sc text-[10px] transition-colors duration-200 ${isActive ? 'text-[#B85C38] font-medium' : 'text-[#8A8A8A]'}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      {/* iOS 安全区域适配 */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
