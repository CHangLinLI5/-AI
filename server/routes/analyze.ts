import Anthropic from "@anthropic-ai/sdk";
import { Router, json } from "express";

const router = Router();

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

router.post("/analyze", json({ limit: "15mb" }), async (req, res) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes("placeholder")) {
      return res.status(500).json({ error: "服务未配置", message: "请在 .env 中设置 ANTHROPIC_API_KEY" });
    }
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64) return res.status(400).json({ error: "缺少图片", message: "请上传一张脸部照片" });

    const actualMimeType = mimeType || "image/jpeg";
    console.log(`[分析] 收到图片: ${actualMimeType}`);

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: actualMimeType as any, data: imageBase64 } },
          { type: "text", text: SKIN_ANALYSIS_PROMPT },
        ],
      }],
    });

    const textContent = response.content.find(b => b.type === "text");
    if (!textContent || textContent.type !== "text") throw new Error("AI 未返回文本");

    let raw = textContent.text.trim();
    if (raw.startsWith("```json")) raw = raw.slice(7);
    if (raw.startsWith("```")) raw = raw.slice(3);
    if (raw.endsWith("```")) raw = raw.slice(0, -3);
    raw = raw.trim();

    const result = JSON.parse(raw);
    result.analysisTime = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
    return res.json(result);
  } catch (error: any) {
    console.error("[分析] 错误:", error.message);
    if (error.status === 401) return res.status(500).json({ error: "认证失败", message: "API Key 无效" });
    if (error.status === 429) return res.status(429).json({ error: "请求频繁", message: "请稍后再试" });
    return res.status(500).json({ error: "分析失败", message: error.message || "请稍后重试" });
  }
});

export default router;
