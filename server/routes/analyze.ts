import Anthropic from "@anthropic-ai/sdk";
import { Router, json } from "express";
import multer from "multer";
import fs from "fs";

const router = Router();
const upload = multer({ dest: '/tmp/xinyan-uploads/', limits: { fileSize: 15 * 1024 * 1024 } });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
  baseURL: process.env.ANTHROPIC_BASE_URL || undefined,
});

const SKIN_ANALYSIS_PROMPT = `你是一位专业的皮肤科 AI 分析助手。请仔细分析这张脸部照片，给出详细的皮肤状态报告。

请从以下 6 个维度进行评分（0-100分）：
1. 水分充足度 2. 油脂平衡度 3. 皮肤细腻度 4. 肤色均匀度 5. 皮肤弹性 6. 皮肤屏障

等级标准：80-100="excellent", 60-79="good", 40-59="fair", 0-39="poor"

肤质从以下选择：混合偏油性肌肤、干性肌肤、油性肌肤、中性肌肤、敏感性肌肤

请严格返回 JSON 格式（不要 markdown），结构如下：
{
  "skinType": "肤质类型",
  "skinTypeDescription": "2-3句描述",
  "overallScore": 75,
  "metrics": [
    {"label":"水分充足度","score":70,"level":"good","description":"皮肤水分含量检测"},
    {"label":"油脂平衡度","score":55,"level":"fair","description":"皮脂腺分泌均衡程度"},
    {"label":"皮肤细腻度","score":65,"level":"good","description":"毛孔大小与皮肤纹理"},
    {"label":"肤色均匀度","score":60,"level":"good","description":"色斑、色沉、暗沉程度"},
    {"label":"皮肤弹性","score":80,"level":"excellent","description":"胶原蛋白与皮肤紧致度"},
    {"label":"皮肤屏障","score":72,"level":"good","description":"皮肤防护与自愈能力"}
  ],
  "issues": [{"name":"问题","severity":"mild/moderate/severe","area":"区域","tip":"建议"}],
  "recommendations": ["建议1","建议2","建议3","建议4"],
  "products": [{"id":"p1","name":"名称","brand":"品牌","category":"类别","price":"¥XX","reason":"理由","imageUrl":"","tags":["标签"]}]
}

要求：评分基于实际照片、问题2-4个、产品推荐4个（中国市场常见品牌）、建议4-5条`;

// 模拟数据（API 未配置时使用）
function generateMockResult() {
  const r = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const getLevel = (s: number) => s >= 80 ? 'excellent' : s >= 60 ? 'good' : s >= 40 ? 'fair' : 'poor';
  const score = r(55, 88);
  const metrics = [
    { label: '水分充足度', score: r(45, 85), description: '皮肤水分含量检测' },
    { label: '油脂平衡度', score: r(40, 80), description: '皮脂腺分泌均衡程度' },
    { label: '皮肤细腻度', score: r(50, 90), description: '毛孔大小与皮肤纹理' },
    { label: '肤色均匀度', score: r(45, 85), description: '色斑、色沉、暗沉程度' },
    { label: '皮肤弹性', score: r(55, 92), description: '胶原蛋白与皮肤紧致度' },
    { label: '皮肤屏障', score: r(50, 88), description: '皮肤防护与自愈能力' },
  ].map(m => ({ ...m, level: getLevel(m.score) }));

  return {
    skinType: '混合偏油性肌肤',
    skinTypeDescription: 'T区油脂分泌旺盛，两颊相对干燥。这是亚洲人群中最常见的肤质类型。',
    overallScore: score,
    metrics,
    issues: [
      { name: '毛孔粗大', severity: 'mild', area: '鼻翼两侧', tip: '定期去角质，使用收敛水' },
      { name: '油光问题', severity: 'moderate', area: '额头、鼻子', tip: '使用控油保湿乳' },
      { name: '色斑/色沉', severity: 'mild', area: '颧骨区域', tip: '做好防晒，使用含烟酰胺产品' },
    ],
    recommendations: [
      '建议每天早晚各洗脸一次，使用温和洁面产品',
      '坚持每日防晒，即使阴天也需要涂抹 SPF30 以上的防晒产品',
      '保持充足睡眠（7-8小时），睡眠不足会加速皮肤老化',
      '多喝水，每天保持 1500-2000ml 的饮水量',
      '建议使用含烟酰胺的精华液改善肤色不均',
    ],
    products: [
      { id: 'p1', name: '烟酰胺美白精华液', brand: 'The Ordinary', category: '精华液', price: '¥89', reason: '烟酰胺可有效提亮肤色', imageUrl: '', tags: ['美白', '提亮'] },
      { id: 'p2', name: '水杨酸毛孔精华', brand: "Paula's Choice", category: '精华液', price: '¥299', reason: '深层疏通毛孔，改善黑头', imageUrl: '', tags: ['控油', '缩毛孔'] },
      { id: 'p3', name: '玻尿酸保湿面霜', brand: 'Neutrogena', category: '面霜', price: '¥149', reason: '多重玻尿酸持久保湿', imageUrl: '', tags: ['保湿', '补水'] },
      { id: 'p4', name: 'SPF50+ 轻薄防晒乳', brand: 'Anessa', category: '防晒', price: '¥199', reason: '防晒是护肤的基础', imageUrl: '', tags: ['防晒', 'SPF50+'] },
    ],
    analysisTime: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
  };
}

// ── 处理 JSON base64 上传（旧接口）──
router.post("/analyze", json({ limit: "15mb" }), async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64) return res.status(400).json({ error: "缺少图片" });

    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes("placeholder")) {
      await new Promise(r => setTimeout(r, 2200));
      return res.json(generateMockResult());
    }

    const actualMimeType = (mimeType || "image/jpeg") as any;
    const response = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 4096,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: actualMimeType, data: imageBase64 } },
          { type: "text", text: SKIN_ANALYSIS_PROMPT },
        ],
      }],
    });

    const textContent = response.content.find(b => b.type === "text");
    if (!textContent || textContent.type !== "text") throw new Error("AI 未返回文本");

    let raw = textContent.text.trim().replace(/^```json\s*/,'').replace(/^```\s*/,'').replace(/\s*```$/,'').trim();
    const result = JSON.parse(raw);
    result.analysisTime = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
    return res.json(result);
  } catch (error: any) {
    console.error("[分析-JSON] 错误:", error.message);
    if (error.status === 401) return res.status(500).json({ error: "认证失败" });
    if (error.status === 429) return res.status(429).json({ error: "请求频繁" });
    return res.status(500).json({ error: "分析失败", message: error.message });
  }
});

// ── 处理 multipart/form-data 上传（新接口）──
router.post("/analyze-upload", upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "缺少图片" });

    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes("placeholder")) {
      fs.unlinkSync(req.file.path);
      await new Promise(r => setTimeout(r, 2200));
      return res.json({ result: generateMockResult() });
    }

    const imageData = fs.readFileSync(req.file.path);
    const base64 = imageData.toString('base64');
    const mimeType = (req.file.mimetype || 'image/jpeg') as any;
    fs.unlinkSync(req.file.path);

    const response = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 4096,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mimeType, data: base64 } },
          { type: "text", text: SKIN_ANALYSIS_PROMPT },
        ],
      }],
    });

    const textContent = response.content.find(b => b.type === "text");
    if (!textContent || textContent.type !== "text") throw new Error("AI 未返回文本");

    let raw = textContent.text.trim().replace(/^```json\s*/,'').replace(/^```\s*/,'').replace(/\s*```$/,'').trim();
    const result = JSON.parse(raw);
    result.analysisTime = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
    return res.json({ result });
  } catch (error: any) {
    if (req.file?.path) { try { fs.unlinkSync(req.file.path); } catch {} }
    console.error("[分析-Upload] 错误:", error.message);
    return res.status(500).json({ error: "分析失败", message: error.message });
  }
});

export default router;
