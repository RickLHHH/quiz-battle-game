import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Room, AnswerResultData } from './types.js';
import {
  createRoom,
  joinRoom,
  leaveRoom,
  playerReady,
  getRoomByPlayerId,
  getNextQuestion,
  handleBuzzer,
  nextRound,
  getGameResult,
  restartGame,
} from './room.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// 健康检查端点（放在静态文件之前）
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 静态文件服务 - 指向 client/dist 目录
const staticPath = path.join(__dirname, '../../client/dist');
app.use(express.static(staticPath));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// 存储玩家 socket 映射
const playerSockets = new Map<string, string>();

// 存储答题状态
interface AnswerState {
  firstPlayerId: string | null;
  firstAnswer: number | null;
  hasSecondChance: boolean;
}
const answerStates = new Map<string, AnswerState>();

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // 创建房间
  socket.on('room:create', ({ playerName }: { playerName: string }) => {
    const { room, playerId } = createRoom(playerName);
    playerSockets.set(playerId, socket.id);
    socket.join(room.id);
    
    socket.emit('room:joined', { room, playerId });
    console.log(`Room created: ${room.id} by ${playerName}`);
  });

  // 加入房间
  socket.on('room:join', ({ roomId, playerName }: { roomId: string; playerName: string }) => {
    console.log(`Join request: roomId=${roomId}, playerName=${playerName}`);
    const result = joinRoom(roomId, playerName);
    if (!result) {
      console.log(`Join failed: room ${roomId} not found or full`);
      socket.emit('error', { message: '房间不存在或已满' });
      return;
    }

    const { room, playerId } = result;
    playerSockets.set(playerId, socket.id);
    socket.join(room.id);

    // 先通知加入者
    socket.emit('room:joined', { room, playerId });
    console.log(`${playerName} (${playerId}) joined room ${room.id}`);
    
    // 再通知房间内的其他玩家（房主）
    const newPlayer = room.players.find(p => p.id === playerId);
    if (newPlayer) {
      socket.to(room.id).emit('room:playerJoined', { player: newPlayer });
      console.log(`Notified room ${room.id} about new player: ${newPlayer.name}`);
    }
  });

  // 玩家准备
  socket.on('player:ready', ({ categories }: { categories: string[] }) => {
    const playerId = getPlayerIdFromSocket(socket.id);
    if (!playerId) return;

    const room = getRoomByPlayerId(playerId);
    if (!room) return;

    // 更新玩家状态
    const player = room.players.find(p => p.id === playerId);
    if (!player || player.isReady) return;

    player.selectedCategories = categories;
    player.isReady = true;

    // 通知房间内所有人（包括自己）
    io.to(room.id).emit('room:playerReady', { playerId, categories });
    console.log(`Player ${player.name} (${playerId}) is ready in room ${room.id}`);
    
    // 检查是否可以开始游戏
    if (room.players.length === 2 && room.players.every((p) => p.isReady)) {
      console.log(`All players ready in room ${room.id}, starting game...`);
      setTimeout(() => startGame(room.id), 1500);
    }
  });

  // 抢答
  socket.on('buzzer:press', () => {
    const playerId = getPlayerIdFromSocket(socket.id);
    if (!playerId) return;

    const room = getRoomByPlayerId(playerId);
    if (!room || room.status !== 'playing') return;

    const result = handleBuzzer(room.id, playerId);
    if (result.success) {
      // 初始化答题状态
      answerStates.set(room.id, {
        firstPlayerId: null,
        firstAnswer: null,
        hasSecondChance: false,
      });
      io.to(room.id).emit('buzzer:pressed', { playerId, playerName: result.playerName! });
    }
  });

  // 提交答案
  socket.on('answer:submit', ({ answer }: { answer: number }) => {
    const playerId = getPlayerIdFromSocket(socket.id);
    if (!playerId) return;

    const room = getRoomByPlayerId(playerId);
    if (!room || !room.currentQuestion) return;

    const question = room.currentQuestion;
    const state = answerStates.get(room.id);
    
    // 检查是否是第一个答题的人
    if (!state || state.firstPlayerId === null) {
      // 第一个答题
      const isCorrect = answer === question.correctAnswer;
      
      if (isCorrect) {
        // 答对了，直接得分
        const player = room.players.find((p) => p.id === playerId);
        if (player) player.score += 10;
        
        const resultData: AnswerResultData = {
          correct: true,
          correctAnswer: question.correctAnswer,
          scores: room.players.map((p) => ({ playerId: p.id, score: p.score })),
        };
        io.to(room.id).emit('answer:result', resultData);
        
        answerStates.delete(room.id);
        
        // 3秒后进入下一轮
        setTimeout(() => proceedToNextRound(room), 3000);
      } else {
        // 答错了，给对手机会
        answerStates.set(room.id, {
          firstPlayerId: playerId,
          firstAnswer: answer,
          hasSecondChance: true,
        });
        
        // 通知第一个玩家答错了
        const resultData: AnswerResultData = {
          correct: false,
          correctAnswer: -1,
          scores: room.players.map((p) => ({ playerId: p.id, score: p.score })),
          isSecondChance: true,
        };
        io.to(room.id).emit('answer:result', resultData);
        
        // 切换抢答权给对手
        const opponent = room.players.find((p) => p.id !== playerId);
        if (opponent) {
          room.buzzerWinner = opponent.id;
          setTimeout(() => {
            io.to(room.id).emit('buzzer:pressed', { 
              playerId: opponent.id, 
              playerName: opponent.name 
            });
          }, 1000);
        }
      }
    } else if (state.firstPlayerId !== playerId && state.hasSecondChance) {
      // 第二个答题（对手的机会）
      const isCorrect = answer === question.correctAnswer;
      
      if (isCorrect) {
        // 对手答对了
        const player = room.players.find((p) => p.id === playerId);
        if (player) player.score += 10;
      }
      
      // 显示最终结果
      const resultData: AnswerResultData = {
        correct: isCorrect,
        correctAnswer: question.correctAnswer,
        scores: room.players.map((p) => ({ playerId: p.id, score: p.score })),
        isSecondChance: false,
      };
      io.to(room.id).emit('answer:result', resultData);
      
      answerStates.delete(room.id);
      
      // 3秒后进入下一轮
      setTimeout(() => proceedToNextRound(room), 3000);
    }
  });

  // 重新开始游戏
  socket.on('game:restart', () => {
    const playerId = getPlayerIdFromSocket(socket.id);
    if (!playerId) return;

    const room = getRoomByPlayerId(playerId);
    if (!room) return;

    restartGame(room.id);
    io.to(room.id).emit('game:started', { room });
  });

  // 断开连接
  socket.on('disconnect', () => {
    const playerId = getPlayerIdFromSocket(socket.id);
    if (playerId) {
      const room = leaveRoom(playerId);
      if (room) {
        socket.to(room.id).emit('room:playerLeft', { playerId });
      }
      playerSockets.delete(playerId);
    }
    console.log(`Player disconnected: ${socket.id}`);
  });
});

// 辅助函数：从 socket id 获取 player id
function getPlayerIdFromSocket(socketId: string): string | undefined {
  for (const [playerId, sid] of playerSockets.entries()) {
    if (sid === socketId) return playerId;
  }
  return undefined;
}

// 进行下一轮
function proceedToNextRound(room: Room) {
  const roundResult = nextRound(room.id);
  if (roundResult.hasMore) {
    io.to(room.id).emit('round:ended', {
      scores: room.players.map((p) => ({ playerId: p.id, score: p.score })),
      nextRound: roundResult.round,
    });
    setTimeout(() => startRound(room.id), 2000);
  } else {
    endGame(room.id);
  }
}

// 开始游戏
async function startGame(roomId: string) {
  const room = getRoomByPlayerId(roomId);
  if (!room) return;

  io.to(roomId).emit('game:started', { room });
  
  // 延迟后开始第一轮
  setTimeout(() => startRound(roomId), 2000);
}

// 开始一轮
async function startRound(roomId: string) {
  const room = getRoomByPlayerId(roomId);
  if (!room) return;

  const question = getNextQuestion(roomId);
  if (!question) {
    endGame(roomId);
    return;
  }

  // 倒计时 3-2-1
  for (let i = 3; i >= 1; i--) {
    io.to(roomId).emit('round:countdown', { count: i });
    await sleep(1000);
  }

  // GO!
  io.to(roomId).emit('round:go');
  io.to(roomId).emit('round:started', {
    question,
    round: room.currentRound,
    totalRounds: room.totalRounds,
  });

  // 5秒无人抢答自动进入下一轮
  setTimeout(() => {
    if (room.buzzerWinner === null) {
      nextRound(roomId);
      if (room.currentRound <= room.totalRounds) {
        io.to(room.id).emit('round:ended', {
          scores: room.players.map((p) => ({ playerId: p.id, score: p.score })),
          nextRound: room.currentRound,
        });
        setTimeout(() => startRound(roomId), 2000);
      } else {
        endGame(roomId);
      }
    }
  }, 5000);
}

// 结束游戏
function endGame(roomId: string) {
  const result = getGameResult(roomId);
  if (result) {
    io.to(roomId).emit('game:ended', result);
  }
}

// 睡眠函数
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
