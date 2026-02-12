# 答题大乱斗 - Knowledge Battle Arena

一个支持两人实时对战的答题游戏，采用 WebSocket 实现实时联机对战。

[🎮 在线体验](https://quiz-battle-game.vercel.app) | [📱 项目截图](#截图)

## 游戏特色

- ⚡ **实时对战**：基于 WebSocket 的毫秒级响应
- 🎮 **抢答机制**：倒计时结束后比拼手速抢答
- 📚 **题库选择**：双方各自选择擅长的题库，系统随机出题
- 🎨 **赛博霓虹风格**：深色主题 + 霓虹灯效果，沉浸式游戏体验
- 📱 **移动端优先**：完美适配手机竖屏操作

## 技术栈

### 前端
- React 18 + TypeScript
- Tailwind CSS 3
- Zustand (状态管理)
- Socket.io-client

### 后端
- Node.js + Express
- Socket.io (WebSocket)
- TypeScript

## 快速开始

### 本地开发

```bash
# 克隆项目
git clone https://github.com/YOUR_USERNAME/quiz-battle-game.git
cd quiz-battle-game

# 安装并启动后端
cd server
npm install
npm run dev

# 新终端：安装并启动前端
cd client
npm install
npm run dev

# 访问 http://localhost:3000
```

## 部署指南

### Railway 部署后端

1. 访问 [Railway](https://railway.app/) 并登录
2. 创建新项目 → 从 GitHub 导入
3. 选择 `quiz-battle-game` 仓库
4. Railway 会自动识别 `railway.json` 配置
5. 部署完成后获得后端地址：`https://xxx.up.railway.app`

### Vercel 部署前端

1. 访问 [Vercel](https://vercel.com/) 并登录
2. 添加新项目 → 导入 GitHub 仓库
3. 配置：
   - **Framework**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
4. 添加环境变量：
   - `VITE_SOCKET_URL`: `https://你的Railway地址`
5. 部署

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

| 类别 | 数量 | 难度分布 |
|------|------|----------|
| 影视娱乐 | 50题 | 简单30 / 中等15 / 困难5 |
| 生活常识 | 50题 | 简单30 / 中等15 / 困难5 |

## 项目结构

```
quiz-battle-game/
├── client/              # React 前端
│   ├── src/
│   │   ├── pages/       # 页面组件
│   │   ├── hooks/       # 自定义 Hooks
│   │   └── stores/      # 状态管理
│   └── package.json
├── server/              # Node.js 后端
│   ├── src/
│   │   ├── questions.ts # 题库数据
│   │   ├── room.ts      # 房间管理
│   │   └── index.ts     # 服务器入口
│   └── package.json
├── shared/              # 共享类型
│   └── types.ts
├── railway.json         # Railway 部署配置
└── README.md
```

## 环境变量

### 前端 (.env)
```
VITE_SOCKET_URL=http://localhost:3001
```

### 后端 (.env)
```
PORT=3001
```

## 贡献

欢迎提交 Issue 和 PR！

## License

MIT
