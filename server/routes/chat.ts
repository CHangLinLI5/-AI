import Anthropic from "@anthropic-ai/sdk";
import { Router, json } from "express";

const router = Router();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
  baseURL: process.env.ANTHROPIC_BASE_URL || undefined,
});

const SYSTEM_PROMPT = `你是芯颜 AI 的专业皮肤护理顾问，名字叫"芯颜专家"。你的职责是：
1. 基于用户的皮肤检测数据和护肤日历记录，给出个性化护肤建议
2. 回答用户关于护肤、皮肤问题、护肤品成分的问题
3. 推荐适合的护肤产品（中国市场常见品牌）
4. 解释皮肤检测报告中的各项指标含义

规则：
- 用简洁友好的中文回答，语气亲切自然
- 回答要专业但易懂，避免过于学术
- 推荐产品时给出价格范围（人民币）
- 如果问题超出皮肤护理范畴，礼貌说明你只擅长皮肤相关问题
- 不要给出医疗诊断，严重问题建议看皮肤科医生
- 回答尽量控制在 200 字以内，除非用户要求详细解释
- 适当使用 emoji 让回复更生动`;

// 简单的模拟回复（API 未配置时使用）
function getMockReply(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('补水') || lower.includes('保湿')) {
    return '补水保湿是护肤的基础 💧\n\n建议早晚使用含玻尿酸或甘油的保湿精华，再叠加锁水面霜。每周可以做 1-2 次补水面膜。\n\n另外，多喝水、保证睡眠质量也对皮肤补水很有帮助 ✨';
  }
  if (lower.includes('毛孔') || lower.includes('缩毛孔')) {
    return '缩小毛孔需要多管齐下 🔬\n\n1. 使用含水杨酸（BHA）的产品，帮助疏通毛孔\n2. 定期温和去角质，避免角质堆积\n3. 做好控油，油脂过多会撑大毛孔\n4. 防晒很重要，紫外线会让毛孔变粗\n\n坚持 4-6 周才能看到明显效果 😊';
  }
  if (lower.includes('防晒')) {
    return '防晒是护肤中最重要的一步 ☀️\n\n建议选择 SPF50+/PA+++ 的防晒产品，每天早上洁面护肤后涂抹，户外每 2-3 小时补涂一次。\n\n推荐：安耐晒金瓶（¥199）、理肤泉特护防晒乳（¥149），轻薄不油腻 ✨';
  }
  if (lower.includes('晚间') || lower.includes('夜间') || lower.includes('步骤')) {
    return '晚间护肤步骤 🌙\n\n1. 卸妆（如有化妆）\n2. 洁面\n3. 爽肤水/化妆水\n4. 精华液（功效型）\n5. 眼霜\n6. 面霜/乳液\n\n晚间是皮肤修护的黄金时间，可以使用含视黄醇、烟酰胺等成分的精华 ✨';
  }
  return '感谢你的提问！作为你的皮肤顾问，我建议你可以上传一张脸部照片，让我为你做专业的皮肤检测，这样我能给出更精准的个性化建议 📸\n\n你也可以告诉我你最近的护肤困扰，我来帮你分析 😊';
}

router.post("/chat", json(), async (req, res) => {
  try {
    // 支持两种调用方式
    const { message, skinLogSummary, messages, skinContext } = req.body;

    // 新接口：单条消息 + 日历摘要
    if (message) {
      if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes("placeholder")) {
        // 模拟延迟
        await new Promise(r => setTimeout(r, 1200));
        return res.json({ reply: getMockReply(message) });
      }

      let systemPrompt = SYSTEM_PROMPT;
      if (skinLogSummary && skinLogSummary !== '暂无护肤记录') {
        systemPrompt += `\n\n用户最近 7 天的护肤日历记录：\n${skinLogSummary}\n\n请结合以上记录给出更有针对性的建议。`;
      }

      const response = await anthropic.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 512,
        system: systemPrompt,
        messages: [{ role: 'user', content: message }],
      });

      const reply = response.content[0].type === 'text' ? response.content[0].text : '抱歉，我暂时无法回答。';
      return res.json({ reply });
    }

    // 旧接口：消息数组 + 皮肤上下文（流式）
    if (messages && Array.isArray(messages)) {
      if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes("placeholder")) {
        return res.status(500).json({ error: "服务未配置" });
      }

      let systemPrompt = SYSTEM_PROMPT;
      if (skinContext) {
        systemPrompt += `\n\n用户最新的皮肤检测数据：
- 肤质：${skinContext.skinType}
- 综合评分：${skinContext.overallScore}/100
- 各项指标：${skinContext.metrics?.map((m: any) => `${m.label}: ${m.score}分`).join('、')}
- 发现的问题：${skinContext.issues?.map((i: any) => `${i.name}`).join('、')}`;
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const stream = anthropic.messages.stream({
        model: "claude-opus-4-5",
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.slice(-20).map((m: any) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      });

      stream.on('text', (text) => {
        res.write(`data: ${JSON.stringify({ type: 'text', content: text })}\n\n`);
      });
      stream.on('end', () => {
        res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
        res.end();
      });
      stream.on('error', () => {
        res.write(`data: ${JSON.stringify({ type: 'error', message: '回复中断，请重试' })}\n\n`);
        res.end();
      });
      req.on('close', () => stream.abort());
      return;
    }

    return res.status(400).json({ error: "缺少必要参数" });

  } catch (error: any) {
    console.error("[聊天] 错误:", error.message);
    if (!res.headersSent) {
      return res.status(500).json({ error: "聊天失败", message: error.message });
    }
  }
});

export default router;
