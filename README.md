# 芯颜 AI — AI 智能皮肤检测网站

> 面向中国用户的 AI 皮肤检测平台，上传脸部照片即可获得专业皮肤分析报告与护肤建议。

---

## 项目预览

**设计风格**：极简医疗美学 — 深森绿 + 玫瑰金 + 米白色系，参考高端医美品牌视觉语言。

**核心功能**：
- 首页 Landing Page（苹果风格，非对称布局）
- 图片拖拽/点击上传 + 实时预览
- AI 皮肤深度分析（12 项指标）
- 卡片式结果展示（分析 / 建议 / 产品推荐三 Tab）
- 分析加载动画（环形进度条 + 逐步提示）

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 19 + TypeScript |
| 路由 | Wouter |
| 样式 | Tailwind CSS 4 |
| UI 组件 | shadcn/ui + Radix UI |
| 动画 | Framer Motion + CSS Animation |
| 构建工具 | Vite 7 |
| 包管理 | pnpm |
| 字体 | Noto Serif SC + Noto Sans SC + Playfair Display |

---

## 本地运行

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0（推荐）或 npm >= 9.0.0

### 安装 pnpm（如未安装）

```bash
npm install -g pnpm
```

### 克隆并运行

```bash
# 1. 进入项目目录
cd skin-ai

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev
```

浏览器访问：[http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
# 构建
pnpm build

# 本地预览生产版本
pnpm preview
```

---

## 项目结构

```
skin-ai/
├── client/
│   ├── index.html              # HTML 入口（含 Google Fonts）
│   └── src/
│       ├── App.tsx             # 路由 + 主题配置
│       ├── index.css           # 全局样式 + 设计系统
│       ├── main.tsx            # React 入口
│       ├── components/
│       │   ├── Navbar.tsx          # 导航栏（滚动变色）
│       │   ├── HeroSection.tsx     # 首页英雄区（非对称布局）
│       │   ├── FeaturesSection.tsx # 功能介绍区
│       │   ├── HowItWorksSection.tsx # 使用流程说明
│       │   ├── UploadSection.tsx   # 图片上传区（拖拽支持）
│       │   ├── AnalyzingOverlay.tsx # 分析中动画覆盖层
│       │   ├── ResultSection.tsx   # 结果展示页（三 Tab）
│       │   ├── TestimonialsSection.tsx # 用户评价
│       │   └── Footer.tsx          # 页脚
│       ├── lib/
│       │   └── skinAnalysis.ts     # AI 分析逻辑 + 数据模型
│       └── pages/
│           └── Home.tsx            # 主页面（状态管理）
├── server/
│   └── index.ts                # Express 静态文件服务器
├── package.json
├── vite.config.ts
└── README.md
```

---

## 接入真实 AI 接口

当前使用模拟数据，替换 `client/src/lib/skinAnalysis.ts` 中的 `analyzeSkin` 函数即可接入真实 AI。

### 方案一：接入阿里云视觉智能 API

```typescript
// client/src/lib/skinAnalysis.ts

export async function analyzeSkin(imageFile: File): Promise<SkinAnalysisResult> {
  // 1. 将图片转为 Base64
  const base64 = await fileToBase64(imageFile);
  
  // 2. 调用后端 API（避免跨域和密钥泄露）
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64: base64 }),
  });
  
  const data = await response.json();
  
  // 3. 转换为 SkinAnalysisResult 格式
  return transformApiResponse(data);
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
```

### 方案二：接入 OpenAI Vision API

```typescript
export async function analyzeSkin(imageFile: File): Promise<SkinAnalysisResult> {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await fetch('/api/analyze-skin', {
    method: 'POST',
    body: formData,
  });
  
  return response.json();
}
```

### 后端 API 路由示例（server/routes/analyze.ts）

```typescript
import express from 'express';
import OpenAI from 'openai';

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/api/analyze-skin', async (req, res) => {
  try {
    const imageBase64 = req.body.imageBase64;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
            },
            {
              type: 'text',
              text: `请分析这张脸部照片的皮肤状态，返回 JSON 格式，包含：
              - skinType: 皮肤类型
              - overallScore: 综合评分(0-100)
              - metrics: 各项指标评分
              - issues: 发现的皮肤问题
              - recommendations: 护肤建议`,
            },
          ],
        },
      ],
    });
    
    res.json(JSON.parse(response.choices[0].message.content!));
  } catch (error) {
    res.status(500).json({ error: '分析失败' });
  }
});

export default router;
```

---

## 阿里云服务器部署

### 方式一：直接部署（推荐）

```bash
# 1. 在服务器上安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. 安装 pnpm
npm install -g pnpm

# 3. 上传项目到服务器（使用 scp 或 git）
git clone https://github.com/your-repo/skin-ai.git
cd skin-ai

# 4. 安装依赖并构建
pnpm install
pnpm build

# 5. 启动生产服务器
node dist/index.js
# 或使用 PM2 守护进程
npm install -g pm2
pm2 start dist/index.js --name skin-ai
pm2 save
pm2 startup
```

### 方式二：Docker 部署

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
RUN npm install --production
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

```bash
# 构建并运行 Docker 镜像
docker build -t skin-ai .
docker run -d -p 3000:3000 --name skin-ai skin-ai
```

### 方式三：Nginx 反向代理

```nginx
# /etc/nginx/sites-available/skin-ai
server {
    listen 80;
    server_name your-domain.com;
    
    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/skin-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 环境变量配置

```bash
# .env.production
PORT=3000
NODE_ENV=production

# AI 接口密钥（接入真实 AI 时填写）
OPENAI_API_KEY=your_key_here
ALIYUN_ACCESS_KEY_ID=your_key_here
ALIYUN_ACCESS_KEY_SECRET=your_secret_here
```

---

## 后续扩展建议

| 功能 | 实现方案 |
|------|---------|
| 真实 AI 分析 | 接入 OpenAI GPT-4o Vision 或阿里云视觉智能 |
| 用户账户系统 | 添加 JWT 认证 + 数据库（MySQL/PostgreSQL） |
| 历史记录 | 存储用户历史检测记录 |
| 产品电商跳转 | 接入淘宝/京东联盟 API |
| 微信小程序 | 使用 Taro 框架复用业务逻辑 |
| 皮肤变化追踪 | 对比多次检测结果，展示改善趋势 |

---

## 开发脚本

```bash
pnpm dev        # 启动开发服务器（热重载）
pnpm build      # 构建生产版本
pnpm preview    # 预览生产版本
pnpm check      # TypeScript 类型检查
pnpm format     # Prettier 代码格式化
```

---

## 许可证

MIT License © 2025 芯颜 AI
