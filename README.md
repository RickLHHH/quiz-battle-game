# 答题大乱斗 - Knowledge Battle Arena

一个支持两人实时对战的答题游戏，采用 WebSocket 实现实时联机对战。

## 游戏特色

- ⚡ **实时对战**：基于 WebSocket 的毫秒级响应
- 🎮 **抢答机制**：倒计时结束后比拼手速抢答
- 📚 **题库选择**：双方各自选择擅长的题库，系统随机出题
- 🎨 **赛博霓虹风格**：深色主题 + 霓虹灯效果，沉浸式游戏体验
- 📱 **移动端优先**：完美适配手机竖屏操作

## 技术栈

### 前端
- React + TypeScript
- Tailwind CSS
- Zustand (状态管理)
- Socket.io-client

### 后端
- Node.js + Express
- Socket.io (WebSocket)
- TypeScript

## 项目结构

```
quiz-battle-game/
├── client/                 # React 前端
│   ├── src/
│   │   ├── components/     # 组件
│   │   ├── pages/          # 页面
│   │   ├── hooks/          # 自定义 Hooks
│   │   ├── stores/         # 状态管理
│   │   └── App.tsx         # 主应用
│   └── package.json
├── server/                 # Node.js 后端
│   ├── src/
│   │   ├── questions.ts    # 题库数据 (100题)
│   │   ├── room.ts         # 房间管理逻辑
│   │   └── index.ts        # 服务器入口
│   └── package.json
└── shared/
    └── types.ts            # 共享类型定义
```

## 快速开始

### 1. 安装依赖

```bash
# 后端
cd server
npm install

# 前端
cd client
npm install
```

### 2. 启动服务

```bash
# 启动后端 (端口 3001)
cd server
npm run dev

# 启动前端 (端口 3000)
cd client
npm run dev
```

### 3. 访问游戏

打开浏览器访问 `http://localhost:3000`

## 游戏玩法

1. **创建/加入房间**：一人创建房间获得6位房间号，另一人输入房间号加入
2. **选择题库**：双方各自选择擅长的题库（影视娱乐 / 生活常识）
3. **准备开始**：双方准备后游戏自动开始
4. **抢答答题**：
   - 每题倒计时 3-2-1-GO 后点击"抢答"
   - 抢答成功者获得答题权
   - 答对 +10 分，都答错不计分
5. **胜负判定**：10题结束后分数高者获胜

## 题库内容

- **影视娱乐** (50题)：电影、动画、明星相关
- **生活常识** (50题)：健康、日常、科学小知识

难度分布：简单 60% / 中等 30% / 困难 10%

## 部署建议

### 后端部署
建议使用支持 WebSocket 的平台：
- Railway
- Render
- AWS Elastic Beanstalk

### 前端部署
- Vercel
- Netlify
- GitHub Pages

## License

MIT
