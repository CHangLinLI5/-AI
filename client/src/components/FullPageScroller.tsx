// 芯颜 AI FullPageScroller — 全屏分页式容器
// 每屏占满整个浏览器窗口，通过点击箭头或圆点导航翻页
import { useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface Page {
  id: string;
  label: string;
  component: ReactNode;
  dark?: boolean;
}

interface FullPageScrollerProps {
  pages: Page[];
  onPageChange?: (index: number, dark: boolean) => void;
}

export default function FullPageScroller({ pages, onPageChange }: FullPageScrollerProps) {
  const [current, setCurrent] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    const idx = pages.findIndex((p) => p.id === hash);
    return idx >= 0 ? idx : 0;
  });
  const [pageHeight, setPageHeight] = useState(window.innerHeight);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const isTransitioning = useRef(false);
  const pagesRef = useRef(pages);
  const onPageChangeRef = useRef(onPageChange);
  pagesRef.current = pages;
  onPageChangeRef.current = onPageChange;

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => setPageHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const goTo = useCallback((index: number) => {
    const ps = pagesRef.current;
    if (index < 0 || index >= ps.length) return;
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setCurrent(index);
    onPageChangeRef.current?.(index, !!ps[index].dark);
    const newHash = index === 0 ? '' : `#${ps[index].id}`;
    window.history.replaceState(null, '', window.location.pathname + newHash);
    setTimeout(() => { isTransitioning.current = false; }, 700);
  }, []);

  const goNext = useCallback(() => {
    if (isTransitioning.current) return;
    setCurrent((c) => {
      const next = c + 1;
      if (next >= pagesRef.current.length) return c;
      isTransitioning.current = true;
      onPageChangeRef.current?.(next, !!pagesRef.current[next].dark);
      const newHash = `#${pagesRef.current[next].id}`;
      window.history.replaceState(null, '', window.location.pathname + newHash);
      setTimeout(() => { isTransitioning.current = false; }, 700);
      return next;
    });
  }, []);

  const goPrev = useCallback(() => {
    if (isTransitioning.current) return;
    setCurrent((c) => {
      const prev = c - 1;
      if (prev < 0) return c;
      isTransitioning.current = true;
      onPageChangeRef.current?.(prev, !!pagesRef.current[prev].dark);
      const newHash = prev === 0 ? '' : `#${pagesRef.current[prev].id}`;
      window.history.replaceState(null, '', window.location.pathname + newHash);
      setTimeout(() => { isTransitioning.current = false; }, 700);
      return prev;
    });
  }, []);

  // 全局拦截所有 href="#pageId" 的点击，阻止浏览器默认锚点滚动
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute('href') || '';
      const hash = href.replace('#', '');
      if (!hash) return;
      const idx = pagesRef.current.findIndex((p) => p.id === hash);
      if (idx >= 0) {
        e.preventDefault();
        e.stopPropagation();
        isTransitioning.current = false; // 外部跳转强制允许
        goTo(idx);
      }
    };
    document.addEventListener('click', handleClick, true); // capture phase
    return () => document.removeEventListener('click', handleClick, true);
  }, [goTo]);

  // 确保 fixed 容器的 scrollTop 始终为 0（防止浏览器自动滚动）
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const resetScroll = () => {
      if (el.scrollTop !== 0) el.scrollTop = 0;
    };
    el.addEventListener('scroll', resetScroll);
    return () => el.removeEventListener('scroll', resetScroll);
  }, []);

  // 键盘导航
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') goNext();
      if (e.key === 'ArrowUp' || e.key === 'PageUp') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  // 鼠标滚轮导航
  useEffect(() => {
    let lastWheel = 0;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheel < 800) return;
      lastWheel = now;
      if (e.deltaY > 30) goNext();
      else if (e.deltaY < -30) goPrev();
    };
    const el = containerRef.current;
    el?.addEventListener('wheel', handler, { passive: false });
    return () => el?.removeEventListener('wheel', handler);
  }, [goNext, goPrev]);

  // 触摸滑动导航
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null) return;
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) > 50) {
        if (delta > 0) goNext();
        else goPrev();
      }
      touchStartY.current = null;
    };
    const el = containerRef.current;
    el?.addEventListener('touchstart', handleTouchStart, { passive: true });
    el?.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      el?.removeEventListener('touchstart', handleTouchStart);
      el?.removeEventListener('touchend', handleTouchEnd);
    };
  }, [goNext, goPrev]);

  const translateY = -(current * pageHeight);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
      style={{ touchAction: 'none' }}
    >
      {/* 页面滑动轨道 */}
      <div
        className="will-change-transform"
        style={{
          transform: `translateY(${translateY}px)`,
          transition: 'transform 0.65s cubic-bezier(0.77, 0, 0.175, 1)',
        }}
      >
        {pages.map((page) => (
          <div
            key={page.id}
            style={{ width: '100vw', height: `${pageHeight}px`, overflowY: 'auto' }}
          >
            {page.component}
          </div>
        ))}
      </div>

      {/* 右侧圆点导航 */}
      <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {pages.map((page, i) => (
          <button
            key={page.id}
            onClick={() => goTo(i)}
            aria-label={page.label}
            title={page.label}
            className="group relative flex items-center justify-end"
          >
            <span className="absolute right-6 font-sans-sc text-xs whitespace-nowrap px-2 py-1 rounded bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {page.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-3 h-3 bg-[#B85C38]'
                  : 'w-2 h-2 bg-[#B85C38]/30 hover:bg-[#B85C38]/60'
              }`}
            />
          </button>
        ))}
      </nav>

      {/* 底部向下箭头（最后一页隐藏） */}
      {current < pages.length - 1 && (
        <button
          onClick={goNext}
          aria-label="下一页"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1 group"
        >
          <ChevronDown
            className="w-7 h-7 text-[#B85C38] opacity-70 group-hover:opacity-100 transition-opacity animate-bounce"
            strokeWidth={1.5}
          />
        </button>
      )}
    </div>
  );
}
