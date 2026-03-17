import "dotenv/config";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import analyzeRouter from "./routes/analyze.js";
import chatRouter from "./routes/chat.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // API 路由
  app.use("/api", analyzeRouter);
  app.use("/api", chatRouter);

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      hasApiKey: !!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.includes("placeholder"),
    });
  });

  // 静态文件
  const staticPath = process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "public")
    : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));
  app.get("*", (_req, res) => res.sendFile(path.join(staticPath, "index.html")));

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`\n🧴 芯颜 AI 服务器已启动: http://localhost:${port}/`);
    console.log(`   AI: ${process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.includes("placeholder") ? "✅" : "❌ 未配置"}\n`);
  });
}

startServer().catch(console.error);
