import Anthropic from "@anthropic-ai/sdk";
import { Router, json } from "express";

const router = Router();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
  baseURL: process.env.ANTHROPIC_BASE_URL || undefined,
});

const SYSTEM_PROMPT = `你是芯颜 AI 的专业皮肤护理顾问。你的职责是：
1. 基于用户的皮肤检测数据，给出个性化护肤建议
2. 回答用户关于护肤、皮肤问题、护肤品成分的问题
3. 推荐适合的护肤产品（中国市场常见品牌）
4. 解释皮肤检测报告中的各项指标含义

规则：
- 用简洁友好的中文回答
- 回答要专业但易懂
- 推荐产品时给出价格范围（人民币）
- 如果问题超出皮肤护理范畴，礼貌说明你只擅长皮肤相关问题
- 不要给出医疗诊断，严重问题建议看皮肤科医生
- 回答尽量控制在 200 字以内，除非用户要求详细解释`;

router.post("/chat", json(), async (req, res) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes("placeholder")) {
      return res.status(500).json({ error: "服务未配置" });
    }

    const { messages, skinContext } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "缺少消息" });
    }

    // 构建包含皮肤数据上下文的系统提示
    let systemPrompt = SYSTEM_PROMPT;
    if (skinContext) {
      systemPrompt += `\n\n用户最新的皮肤检测数据：
- 肤质：${skinContext.skinType}
- 综合评分：${skinContext.overallScore}/100
- 检测时间：${skinContext.analysisTime}
- 各项指标：${skinContext.metrics?.map((m: any) => `${m.label}: ${m.score}分(${m.level})`).join('、')}
- 发现的问题：${skinContext.issues?.map((i: any) => `${i.name}(${i.severity})`).join('、')}

请基于以上数据给出个性化建议。`;
    }

    // 格式化消息（只保留最近 20 条）
    const formattedMessages = messages.slice(-20).map((m: any) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    // 设置 SSE 流式响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: formattedMessages,
    });

    stream.on('text', (text) => {
      res.write(`data: ${JSON.stringify({ type: 'text', content: text })}\n\n`);
    });

    stream.on('end', () => {
      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();
    });

    stream.on('error', (error) => {
      console.error('[聊天] 流式错误:', error.message);
      res.write(`data: ${JSON.stringify({ type: 'error', message: '回复中断，请重试' })}\n\n`);
      res.end();
    });

    // 客户端断开连接时中止流
    req.on('close', () => {
      stream.abort();
    });

  } catch (error: any) {
    console.error("[聊天] 错误:", error.message);
    if (!res.headersSent) {
      return res.status(500).json({ error: "聊天失败", message: error.message });
    }
  }
});

export default router;
