import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { getLog, saveLog, getLogDates, todayKey, type SkinLog } from '@/lib/storage';

const MORNING_STEPS = ['洁面', '爽肤水', '精华', '眼霜', '面霜', '防晒'];
const EVENING_STEPS = ['卸妆', '洁面', '精华', '眼霜', '面霜', '面膜', '去角质'];
const SKIN_STATUS   = ['状态不错', 'T区出油', '干燥紧绷', '泛红敏感', '长痘', '色斑明显', '暗沉'];

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export default function CalendarPage() {
  const [, setLocation] = useLocation();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [logDates, setLogDates] = useState<Set<string>>(new Set());
  const [log, setLog] = useState<SkinLog>({
    date: todayKey(),
    morning: [],
    evening: [],
    skinStatus: [],
    note: '',
    updatedAt: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLogDates(getLogDates());
  }, []);

  useEffect(() => {
    const existing = getLog(selectedDate);
    if (existing) {
      setLog(existing);
    } else {
      setLog({ date: selectedDate, morning: [], evening: [], skinStatus: [], note: '', updatedAt: '' });
    }
    setSaved(false);
  }, [selectedDate]);

  const toggleTag = (field: 'morning' | 'evening' | 'skinStatus', tag: string) => {
    setLog(prev => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(tag) ? arr.filter(t => t !== tag) : [...arr, tag],
      };
    });
    setSaved(false);
  };

  const handleSave = () => {
    saveLog(log);
    setLogDates(getLogDates());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // 生成日历格
  const buildCalendar = () => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prevDays = new Date(viewYear, viewMonth, 0).getDate();
    const cells: { day: number; cur: boolean; dateKey: string }[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      const d = prevDays - i;
      const m = viewMonth === 0 ? 11 : viewMonth - 1;
      const y = viewMonth === 0 ? viewYear - 1 : viewYear;
      cells.push({ day: d, cur: false, dateKey: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}` });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, cur: true, dateKey: `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}` });
    }
    const remaining = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7);
    for (let d = 1; d <= remaining; d++) {
      const m = viewMonth === 11 ? 0 : viewMonth + 1;
      const y = viewMonth === 11 ? viewYear + 1 : viewYear;
      cells.push({ day: d, cur: false, dateKey: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}` });
    }
    return cells;
  };

  const cells = buildCalendar();
  const todayStr = todayKey();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const isToday = selectedDate === todayStr;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--app-bg)' }}>
      {/* 顶部导航 */}
      <div style={{ height: 52, padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--app-border)', flexShrink: 0 }}>
        <div style={{ width: 34 }} />
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--app-text)', letterSpacing: -0.3 }}>护肤日历</span>
        <button
          className="pressable"
          onClick={() => setLocation('/app')}
          style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--app-accent-bg)', border: '1px solid var(--app-accent-l)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: 'var(--app-accent)' }}
        >
          💬
        </button>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
        {/* 月份导航 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 8px' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--app-text)', letterSpacing: -0.3 }}>
            {viewYear}年 {viewMonth + 1}月
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[{ fn: prevMonth, icon: '‹' }, { fn: nextMonth, icon: '›' }].map((btn, i) => (
              <button
                key={i}
                className="pressable"
                onClick={btn.fn}
                style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--app-bg2)', border: '1px solid var(--app-border)', fontSize: 18, color: 'var(--app-text2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {btn.icon}
              </button>
            ))}
          </div>
        </div>

        {/* 星期标题 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '0 14px', marginBottom: 4 }}>
          {WEEKDAYS.map(w => (
            <div key={w} style={{ textAlign: 'center', fontSize: 11, color: 'var(--app-text3)', fontWeight: 600, padding: '4px 0' }}>{w}</div>
          ))}
        </div>

        {/* 日历格 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '0 14px', gap: 3 }}>
          {cells.map((cell, i) => {
            const isSelected = cell.dateKey === selectedDate;
            const isTodayCell = cell.dateKey === todayStr;
            const hasLog = logDates.has(cell.dateKey);
            return (
              <button
                key={i}
                className="pressable"
                onClick={() => cell.cur && setSelectedDate(cell.dateKey)}
                style={{
                  aspectRatio: '1',
                  borderRadius: 10,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 2,
                  background: isSelected ? 'var(--app-accent)' : isTodayCell ? 'var(--app-accent-bg)' : 'transparent',
                  border: isTodayCell && !isSelected ? '1.5px solid var(--app-accent-l)' : '1.5px solid transparent',
                  cursor: cell.cur ? 'pointer' : 'default',
                  position: 'relative',
                }}
              >
                <span style={{
                  fontSize: 14, lineHeight: 1,
                  color: isSelected ? '#fff' : cell.cur ? 'var(--app-text)' : 'var(--app-text3)',
                  opacity: cell.cur ? 1 : 0.35,
                  fontWeight: isTodayCell ? 700 : 400,
                }}>
                  {cell.day}
                </span>
                {hasLog && (
                  <span style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--app-accent)',
                    position: 'absolute', bottom: 4,
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* AI 读取提示 */}
        <div style={{ margin: '12px 16px 0', padding: '10px 14px', background: 'var(--app-accent-bg)', border: '1px solid var(--app-accent-l)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--app-accent)' }}>
          <span style={{ fontSize: 14 }}>✦</span>
          <span>AI 会读取你的护肤日历，给出更精准的个性化建议</span>
        </div>

        {/* 日志卡片 */}
        <div style={{ margin: '12px 16px 0', background: 'var(--app-surface)', borderRadius: 20, border: '1px solid var(--app-border)', padding: 18, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--app-text)' }}>
              {isToday ? '今日护肤记录' : `${selectedDate.slice(5).replace('-', '月')}日`}
            </div>
            <div style={{ fontSize: 12, color: 'var(--app-text3)' }}>
              {selectedDate}
            </div>
          </div>

          {/* 早间 */}
          <RoutineSection
            label="早间护肤"
            icon="☀️"
            steps={MORNING_STEPS}
            selected={log.morning}
            onToggle={tag => toggleTag('morning', tag)}
          />

          {/* 晚间 */}
          <RoutineSection
            label="晚间护肤"
            icon="🌙"
            steps={EVENING_STEPS}
            selected={log.evening}
            onToggle={tag => toggleTag('evening', tag)}
          />

          {/* 皮肤状态 */}
          <RoutineSection
            label="皮肤状态"
            icon="◎"
            steps={SKIN_STATUS}
            selected={log.skinStatus}
            onToggle={tag => toggleTag('skinStatus', tag)}
          />

          {/* 备注 */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--app-text3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
              📝 备注
            </div>
            <textarea
              value={log.note}
              onChange={e => { setLog(prev => ({ ...prev, note: e.target.value })); setSaved(false); }}
              placeholder="记录今天的护肤心得、产品感受..."
              style={{
                width: '100%', height: 72,
                background: 'var(--app-bg2)',
                border: '1.5px solid var(--app-border)',
                borderRadius: 12,
                padding: '10px 12px',
                fontSize: 13,
                color: 'var(--app-text)',
                fontFamily: 'inherit',
                resize: 'none',
                outline: 'none',
                lineHeight: 1.55,
              }}
            />
          </div>

          {/* 保存按钮 */}
          <button
            className="pressable"
            onClick={handleSave}
            style={{
              width: '100%', height: 46,
              background: saved ? 'var(--app-green)' : 'var(--app-accent)',
              color: '#fff', border: 'none',
              borderRadius: 14,
              fontSize: 14.5, fontWeight: 600,
              fontFamily: 'inherit',
              transition: 'background 0.3s',
              boxShadow: '0 2px 12px rgba(201,100,66,0.25)',
            }}
          >
            {saved ? '✓ 已保存' : '保存今日记录'}
          </button>
        </div>
      </div>
    </div>
  );
}

function RoutineSection({
  label, icon, steps, selected, onToggle,
}: {
  label: string; icon: string; steps: string[]; selected: string[]; onToggle: (t: string) => void;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--app-text3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
        {icon} {label}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
        {steps.map(step => {
          const on = selected.includes(step);
          return (
            <button
              key={step}
              className="pressable"
              onClick={() => onToggle(step)}
              style={{
                padding: '6px 13px',
                borderRadius: 20,
                fontSize: 12.5,
                border: `1.5px solid ${on ? 'var(--app-accent)' : 'var(--app-border)'}`,
                background: on ? 'var(--app-accent-bg)' : 'var(--app-bg2)',
                color: on ? 'var(--app-accent)' : 'var(--app-text2)',
                fontFamily: 'inherit',
                fontWeight: on ? 600 : 400,
                transition: 'all 0.15s',
              }}
            >
              {step}
            </button>
          );
        })}
      </div>
    </div>
  );
}
