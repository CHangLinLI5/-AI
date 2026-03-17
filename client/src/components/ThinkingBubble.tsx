export default function ThinkingBubble() {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
      {/* AI 头像 */}
      <div
        style={{
          width: 32, height: 32,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #c96442, #a04830)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(201,100,66,0.25)',
          animation: 'pulseGlow 2s ease-in-out infinite',
        }}
      >
        <span style={{ color: '#fff', fontSize: 14, fontWeight: 300 }}>✦</span>
      </div>

      {/* 思考气泡 */}
      <div
        style={{
          background: 'var(--app-surface)',
          border: '1px solid var(--app-border)',
          borderRadius: 18,
          borderBottomLeftRadius: 5,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
        }}
      >
        {/* 旋转圆环 */}
        <div
          style={{
            width: 20, height: 20,
            borderRadius: '50%',
            border: '2.5px solid var(--app-border)',
            borderTopColor: 'var(--app-accent)',
            animation: 'spinRing 0.85s linear infinite',
            flexShrink: 0,
          }}
        />

        <div>
          <div style={{ fontSize: 13, color: 'var(--app-text3)', marginBottom: 6 }}>
            正在分析皮肤状态...
          </div>
          {/* 弹跳点 */}
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            {[0, 0.18, 0.36].map((delay, i) => (
              <div
                key={i}
                style={{
                  width: 7, height: 7,
                  borderRadius: '50%',
                  background: 'var(--app-accent-l)',
                  animation: `thinkBounce 1.3s ease-in-out ${delay}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
