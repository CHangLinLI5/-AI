interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
}

interface AppTabBarProps {
  active: string;
  onChange: (id: string) => void;
}

const ChatIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3C7.03 3 3 6.58 3 11c0 2.1.87 4.01 2.3 5.47L4 21l4.8-1.56A9.4 9.4 0 0012 20c4.97 0 9-3.58 9-9s-4.03-9-9-9z"
      fill={active ? 'var(--app-accent)' : 'none'}
      stroke={active ? 'var(--app-accent)' : 'var(--app-text3)'}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

const CalIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect
      x="3" y="5" width="18" height="16" rx="3"
      stroke={active ? 'var(--app-accent)' : 'var(--app-text3)'}
      strokeWidth="1.8"
      fill={active ? 'var(--app-accent-bg)' : 'none'}
    />
    <path
      d="M8 3v4M16 3v4M3 10h18"
      stroke={active ? 'var(--app-accent)' : 'var(--app-text3)'}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="8" cy="15" r="1.2" fill={active ? 'var(--app-accent)' : 'var(--app-text3)'} />
    <circle cx="12" cy="15" r="1.2" fill={active ? 'var(--app-accent)' : 'var(--app-text3)'} />
    <circle cx="16" cy="15" r="1.2" fill={active ? 'var(--app-accent)' : 'var(--app-text3)'} />
  </svg>
);

const HistoryIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3a9 9 0 100 18A9 9 0 0012 3z"
      stroke={active ? 'var(--app-accent)' : 'var(--app-text3)'}
      strokeWidth="1.8"
      fill={active ? 'var(--app-accent-bg)' : 'none'}
    />
    <path
      d="M12 7v5l3.5 2"
      stroke={active ? 'var(--app-accent)' : 'var(--app-text3)'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TABS: Tab[] = [
  {
    id: 'chat',
    label: 'AI 顾问',
    icon: <ChatIcon active={false} />,
    activeIcon: <ChatIcon active={true} />,
  },
  {
    id: 'calendar',
    label: '护肤日历',
    icon: <CalIcon active={false} />,
    activeIcon: <CalIcon active={true} />,
  },
  {
    id: 'history',
    label: '历史记录',
    icon: <HistoryIcon active={false} />,
    activeIcon: <HistoryIcon active={true} />,
  },
];

export default function AppTabBar({ active, onChange }: AppTabBarProps) {
  return (
    <div
      style={{
        height: 72,
        background: 'rgba(249,247,244,0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--app-border)',
        display: 'flex',
        alignItems: 'flex-start',
        paddingTop: 10,
        flexShrink: 0,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {TABS.map(tab => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="pressable"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '2px 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {isActive ? tab.activeIcon : tab.icon}
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--app-accent)' : 'var(--app-text3)',
                letterSpacing: 0.2,
                transition: 'color 0.2s',
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
