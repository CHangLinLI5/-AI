// 芯颜 AI — localStorage 数据管理
// 管理检测历史、聊天记录、护肤日历

import type { SkinAnalysisResult } from './skinAnalysis';

// ============================================================
// 检测历史
// ============================================================

export interface HistoryRecord {
  id: string;
  date: string;           // ISO string
  overallScore: number;
  skinType: string;
  skinTypeDescription: string;
  metrics: SkinAnalysisResult['metrics'];
  issues: SkinAnalysisResult['issues'];
  recommendations: string[];
  products: SkinAnalysisResult['products'];
  thumbnail: string;      // base64 缩略图（压缩后）
  analysisTime: string;
}

const HISTORY_KEY     = 'xinyan_history';
const FIRST_VISIT_KEY = 'xinyan_first_visit';
const CHAT_KEY        = 'xinyan_chat_history';
const LOGS_KEY        = 'xinyan_skin_logs';

export function getHistory(): HistoryRecord[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addHistory(result: SkinAnalysisResult, thumbnail: string): HistoryRecord {
  const record: HistoryRecord = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    date: new Date().toISOString(),
    overallScore: result.overallScore,
    skinType: result.skinType,
    skinTypeDescription: result.skinTypeDescription,
    metrics: result.metrics,
    issues: result.issues,
    recommendations: result.recommendations,
    products: result.products,
    thumbnail,
    analysisTime: result.analysisTime,
  };

  const history = getHistory();
  history.unshift(record);
  if (history.length > 30) history.length = 30;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return record;
}

export function getHistoryById(id: string): HistoryRecord | null {
  return getHistory().find(h => h.id === id) || null;
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

export function getLatestRecord(): HistoryRecord | null {
  const history = getHistory();
  return history.length > 0 ? history[0] : null;
}

export function getLast7DaysScores(): { date: string; score: number }[] {
  const history = getHistory();
  const now = new Date();
  const result: { date: string; score: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
    const record = history.find(h => h.date.startsWith(dateStr));
    result.push({ date: dayLabel, score: record ? record.overallScore : 0 });
  }
  return result;
}

// ============================================================
// 首次访问
// ============================================================

export function isFirstVisit(): boolean {
  return !localStorage.getItem(FIRST_VISIT_KEY);
}

export function markVisited(): void {
  localStorage.setItem(FIRST_VISIT_KEY, 'true');
}

// ============================================================
// 聊天记录
// ============================================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  type?: 'text' | 'image' | 'result-card';
  imageUrl?: string;
  reportId?: string;
}

export function getChatHistory(): ChatMessage[] {
  try {
    const data = localStorage.getItem(CHAT_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveChatHistory(messages: ChatMessage[]): void {
  localStorage.setItem(CHAT_KEY, JSON.stringify(messages.slice(-100)));
}

export function clearChatHistory(): void {
  localStorage.removeItem(CHAT_KEY);
}

// ============================================================
// 护肤日历
// ============================================================

export interface SkinLog {
  date: string;          // YYYY-MM-DD
  morning: string[];     // 早间护肤步骤
  evening: string[];     // 晚间护肤步骤
  skinStatus: string[];  // 皮肤状态标签
  note: string;          // 备注
  updatedAt: string;     // ISO string
}

export function getAllLogs(): Record<string, SkinLog> {
  try {
    return JSON.parse(localStorage.getItem(LOGS_KEY) || '{}');
  } catch { return {}; }
}

export function getLog(date: string): SkinLog | null {
  return getAllLogs()[date] || null;
}

export function saveLog(log: SkinLog): void {
  const all = getAllLogs();
  all[log.date] = { ...log, updatedAt: new Date().toISOString() };
  localStorage.setItem(LOGS_KEY, JSON.stringify(all));
}

export function clearLogs(): void {
  localStorage.removeItem(LOGS_KEY);
}

/** 获取有日志的日期集合（用于日历标记） */
export function getLogDates(): Set<string> {
  return new Set(Object.keys(getAllLogs()));
}

/** 获取最近 N 天的日志摘要（供 AI 读取） */
export function getRecentLogsSummary(days = 7): string {
  const all = getAllLogs();
  const result: string[] = [];
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const log = all[key];
    if (log) {
      const parts: string[] = [`${key}：`];
      if (log.morning.length) parts.push(`早间(${log.morning.join('、')})`);
      if (log.evening.length) parts.push(`晚间(${log.evening.join('、')})`);
      if (log.skinStatus.length) parts.push(`状态(${log.skinStatus.join('、')})`);
      if (log.note) parts.push(`备注：${log.note}`);
      result.push(parts.join(' '));
    }
  }
  return result.length ? result.join('\n') : '暂无护肤记录';
}

// ============================================================
// 生成缩略图
// ============================================================

export function generateThumbnail(imageUrl: string, size = 120): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      const minDim = Math.min(img.width, img.height);
      const sx = (img.width - minDim) / 2;
      const sy = (img.height - minDim) / 2;
      ctx?.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
      resolve(canvas.toDataURL('image/jpeg', 0.6));
    };
    img.onerror = () => resolve('');
    img.src = imageUrl;
  });
}

// ============================================================
// 工具
// ============================================================

export function todayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function clearAll(): void {
  [HISTORY_KEY, FIRST_VISIT_KEY, CHAT_KEY, LOGS_KEY].forEach(k =>
    localStorage.removeItem(k)
  );
}
