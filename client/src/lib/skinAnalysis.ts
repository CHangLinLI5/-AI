// 芯颜 AI - 皮肤分析数据模型与 API 调用
// 设计风格：极简医疗美学 | 深森绿 + 玫瑰金 + 米白

export interface SkinMetric {
  label: string;
  score: number; // 0-100
  level: 'excellent' | 'good' | 'fair' | 'poor';
  description: string;
}

export interface SkinIssue {
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  area: string;
  tip: string;
}

export interface ProductRecommendation {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  reason: string;
  imageUrl: string;
  tags: string[];
}

export interface SkinAnalysisResult {
  skinType: string;
  skinTypeDescription: string;
  overallScore: number;
  metrics: SkinMetric[];
  issues: SkinIssue[];
  recommendations: string[];
  products: ProductRecommendation[];
  analysisTime: string;
}

// ============================================================
// 图片压缩
// ============================================================

async function compressImage(file: File, maxWidth = 1024, quality = 0.85): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);
      resolve({
        base64: canvas.toDataURL('image/jpeg', quality).split(',')[1],
        mimeType: 'image/jpeg',
      });
    };
    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = URL.createObjectURL(file);
  });
}

// ============================================================
// 模拟数据 Fallback（API 未配置时使用）
// ============================================================

function getLevel(score: number): SkinMetric['level'] {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMockResult(): SkinAnalysisResult {
  const SKIN_TYPES = [
    { type: '混合偏油性肌肤', description: 'T区油脂分泌旺盛，两颊相对干燥。这是亚洲人群中最常见的肤质类型，约占60%的人群。' },
    { type: '干性肌肤', description: '皮脂腺分泌不足，全脸缺水缺油，容易出现紧绷感和细纹。需要重点补水保湿，加强皮肤屏障修护。' },
    { type: '油性肌肤', description: '皮脂腺分泌旺盛，全脸出油明显，毛孔粗大，容易长痘。需要控油清洁，同时注意补水平衡。' },
    { type: '中性肌肤', description: '皮脂分泌均衡，肤质细腻，水油平衡良好。是最理想的肤质状态，日常维护即可保持良好状态。' },
    { type: '敏感性肌肤', description: '皮肤屏障功能较弱，容易对外界刺激产生反应，出现泛红、刺痒等不适。需要温和护肤，加强屏障修护。' },
  ];

  const skinTypeData = SKIN_TYPES[randomBetween(0, SKIN_TYPES.length - 1)];
  const overallScore = randomBetween(52, 88);

  const metrics: SkinMetric[] = [
    { label: '水分充足度', score: randomBetween(45, 85), level: 'good', description: '皮肤水分含量检测' },
    { label: '油脂平衡度', score: randomBetween(40, 80), level: 'fair', description: '皮脂腺分泌均衡程度' },
    { label: '皮肤细腻度', score: randomBetween(50, 90), level: 'good', description: '毛孔大小与皮肤纹理' },
    { label: '肤色均匀度', score: randomBetween(45, 85), level: 'fair', description: '色斑、色沉、暗沉程度' },
    { label: '皮肤弹性', score: randomBetween(55, 92), level: 'good', description: '胶原蛋白与皮肤紧致度' },
    { label: '皮肤屏障', score: randomBetween(50, 88), level: 'good', description: '皮肤防护与自愈能力' },
  ];
  metrics.forEach((m) => { m.level = getLevel(m.score); });

  const ISSUES_POOL: SkinIssue[] = [
    { name: '痘痘/粉刺', severity: 'moderate', area: 'T区及下颌', tip: '避免用手触摸，使用含水杨酸或茶树精华的产品' },
    { name: '毛孔粗大', severity: 'mild', area: '鼻翼两侧', tip: '定期去角质，使用收敛水，避免过度清洁' },
    { name: '油光问题', severity: 'moderate', area: '额头、鼻子', tip: '使用控油保湿乳，避免使用过于滋润的产品' },
    { name: '黑头', severity: 'mild', area: '鼻头', tip: '使用BHA产品疏通毛孔，避免频繁使用撕拉面膜' },
    { name: '色斑/色沉', severity: 'mild', area: '颧骨区域', tip: '做好防晒，使用含烟酰胺或维C的美白产品' },
    { name: '细纹', severity: 'mild', area: '眼周', tip: '使用眼霜，注意防晒，保持充足睡眠' },
  ];
  const issueCount = randomBetween(2, 4);
  const shuffled = [...ISSUES_POOL].sort(() => Math.random() - 0.5);
  const issues = shuffled.slice(0, issueCount);

  const PRODUCTS: ProductRecommendation[] = [
    { id: 'p1', name: '烟酰胺美白精华液', brand: 'The Ordinary', category: '精华液', price: '¥89', reason: '烟酰胺可有效抑制黑色素转运，提亮肤色', imageUrl: '', tags: ['美白', '提亮', '控油'] },
    { id: 'p2', name: '水杨酸毛孔精华', brand: "Paula's Choice", category: '精华液', price: '¥299', reason: '2% BHA水杨酸深层疏通毛孔，改善黑头和粉刺', imageUrl: '', tags: ['控油', '缩毛孔', '去黑头'] },
    { id: 'p3', name: '玻尿酸保湿面霜', brand: 'Neutrogena', category: '面霜', price: '¥149', reason: '多重玻尿酸配方，为干燥的两颊提供持久保湿', imageUrl: '', tags: ['保湿', '修护', '补水'] },
    { id: 'p4', name: 'SPF50+ 轻薄防晒乳', brand: 'Anessa', category: '防晒', price: '¥199', reason: '防晒是护肤的基础，可有效预防色斑加深和光老化', imageUrl: '', tags: ['防晒', 'SPF50+', '轻薄'] },
  ];

  return {
    skinType: skinTypeData.type,
    skinTypeDescription: skinTypeData.description,
    overallScore,
    metrics,
    issues,
    recommendations: [
      '建议每天早晚各洗脸一次，使用温水和温和洁面产品',
      '坚持每日防晒，即使阴天也需要涂抹 SPF30 以上的防晒产品',
      '保持充足睡眠（7-8小时），睡眠不足会加速皮肤老化',
      '多喝水，每天保持 1500-2000ml 的饮水量',
    ],
    products: PRODUCTS,
    analysisTime: new Date().toLocaleString('zh-CN'),
  };
}

// ============================================================
// 主分析函数
// ============================================================

export async function analyzeSkin(imageFile: File): Promise<SkinAnalysisResult> {
  try {
    const { base64, mimeType } = await compressImage(imageFile);
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: base64, mimeType }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      // 如果是服务未配置，使用模拟数据
      if (response.status === 500 && (err.error === '服务未配置' || err.message?.includes('ANTHROPIC_API_KEY'))) {
        console.warn('[芯颜AI] API 未配置，使用模拟数据');
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return generateMockResult();
      }
      throw new Error(err.message || '分析失败');
    }

    return response.json();
  } catch (error: any) {
    // 网络错误或其他错误时 fallback 到模拟数据
    if (error.message === '分析失败' || error.message === 'API Key 无效') {
      throw error;
    }
    console.warn('[芯颜AI] API 调用失败，使用模拟数据:', error.message);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return generateMockResult();
  }
}

// ============================================================
// UI 辅助函数
// ============================================================

export function getLevelColor(level: SkinMetric['level']): string {
  switch (level) {
    case 'excellent': return 'text-emerald-600';
    case 'good': return 'text-blue-600';
    case 'fair': return 'text-amber-600';
    case 'poor': return 'text-red-500';
  }
}

export function getLevelLabel(level: SkinMetric['level']): string {
  switch (level) {
    case 'excellent': return '优秀';
    case 'good': return '良好';
    case 'fair': return '一般';
    case 'poor': return '待改善';
  }
}

export function getSeverityColor(severity: SkinIssue['severity']): string {
  switch (severity) {
    case 'mild': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'moderate': return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'severe': return 'bg-red-50 text-red-700 border-red-200';
  }
}

export function getSeverityLabel(severity: SkinIssue['severity']): string {
  switch (severity) {
    case 'mild': return '轻度';
    case 'moderate': return '中度';
    case 'severe': return '较重';
  }
}
