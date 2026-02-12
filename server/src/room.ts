import type { Player, Room, Question, GameStats, Category } from './types.js';
import { getRandomQuestions, categories } from './questions.js';

// 房间存储
const rooms = new Map<string, Room>();
const playerRooms = new Map<string, string>();

// 生成6位数字房间号
function generateRoomId(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 生成玩家ID
function generatePlayerId(): string {
  return Math.random().toString(36).substring(2, 10);
}

// 获取随机头像
function getRandomAvatar(): string {
  const avatars = ['🦁', '🐯', '🐻', '🐨', '🐼', '🐸', '🐙', '🦄', '🐲', '🦊'];
  return avatars[Math.floor(Math.random() * avatars.length)];
}

// 创建房间
export function createRoom(playerName: string): { room: Room; playerId: string } {
  const roomId = generateRoomId();
  const playerId = generatePlayerId();
  
  const player: Player = {
    id: playerId,
    name: playerName,
    avatar: getRandomAvatar(),
    score: 0,
    selectedCategories: [],
    isReady: false,
  };

  const room: Room = {
    id: roomId,
    players: [player],
    status: 'waiting',
    currentRound: 0,
    totalRounds: 10,
    currentQuestion: null,
    categoryPool: [],
    questions: [],
    buzzerWinner: null,
    roundStartTime: 0,
  };

  rooms.set(roomId, room);
  playerRooms.set(playerId, roomId);

  return { room, playerId };
}

// 加入房间
export function joinRoom(roomId: string, playerName: string): { room: Room; playerId: string } | null {
  const room = rooms.get(roomId);
  if (!room || room.players.length >= 2) {
    return null;
  }

  const playerId = generatePlayerId();
  const player: Player = {
    id: playerId,
    name: playerName,
    avatar: getRandomAvatar(),
    score: 0,
    selectedCategories: [],
    isReady: false,
  };

  room.players.push(player);
  playerRooms.set(playerId, roomId);

  return { room, playerId };
}

// 离开房间
export function leaveRoom(playerId: string): Room | null {
  const roomId = playerRooms.get(playerId);
  if (!roomId) return null;

  const room = rooms.get(roomId);
  if (!room) return null;

  room.players = room.players.filter(p => p.id !== playerId);
  playerRooms.delete(playerId);

  if (room.players.length === 0) {
    rooms.delete(roomId);
    return null;
  }

  return room;
}

// 玩家准备
export function playerReady(playerId: string, selectedCategories: string[]): boolean {
  const roomId = playerRooms.get(playerId);
  if (!roomId) return false;

  const room = rooms.get(roomId);
  if (!room) return false;

  const player = room.players.find(p => p.id === playerId);
  if (!player) return false;

  player.selectedCategories = selectedCategories;
  player.isReady = true;

  // 如果两个玩家都准备了，开始游戏
  if (room.players.length === 2 && room.players.every(p => p.isReady)) {
    startGame(roomId);
  }

  return true;
}

// 开始游戏
function startGame(roomId: string): void {
  const room = rooms.get(roomId);
  if (!room) return;

  // 合并双方选择的类别
  const categoryPool = new Set<string>();
  room.players.forEach(p => {
    p.selectedCategories.forEach(c => categoryPool.add(c));
  });

  // 如果没有选择，默认使用所有类别
  if (categoryPool.size === 0) {
    categories.forEach(c => categoryPool.add(c.id));
  }

  room.categoryPool = Array.from(categoryPool);
  room.questions = getRandomQuestions(room.categoryPool, room.totalRounds);
  room.status = 'playing';
  room.currentRound = 1;
}

// 获取房间
export function getRoom(roomId: string): Room | undefined {
  return rooms.get(roomId.toUpperCase());
}

// 获取房间通过玩家ID
export function getRoomByPlayerId(playerId: string): Room | undefined {
  const roomId = playerRooms.get(playerId);
  if (!roomId) return undefined;
  return rooms.get(roomId);
}

// 获取下一题
export function getNextQuestion(roomId: string): Question | null {
  const room = rooms.get(roomId);
  if (!room || room.currentRound > room.totalRounds) return null;

  const question = room.questions[room.currentRound - 1];
  room.currentQuestion = question;
  room.buzzerWinner = null;
  room.roundStartTime = Date.now();
  
  return question;
}

// 处理抢答
export function handleBuzzer(roomId: string, playerId: string): { success: boolean; playerName?: string } {
  const room = rooms.get(roomId);
  if (!room || room.buzzerWinner) return { success: false };

  const player = room.players.find(p => p.id === playerId);
  if (!player) return { success: false };

  room.buzzerWinner = playerId;
  return { success: true, playerName: player.name };
}

// 处理答题
export function handleAnswer(
  roomId: string, 
  playerId: string, 
  answer: number
): { 
  correct: boolean; 
  scores: { playerId: string; score: number }[]; 
  correctAnswer: number;
} {
  const room = rooms.get(roomId);
  if (!room || !room.currentQuestion) {
    return { correct: false, scores: [], correctAnswer: -1 };
  }

  const question = room.currentQuestion;
  const isCorrect = answer === question.correctAnswer;

  // 更新分数
  if (isCorrect) {
    const player = room.players.find(p => p.id === playerId);
    if (player) {
      player.score += 10;
    }
  }

  return {
    correct: isCorrect,
    scores: room.players.map(p => ({ playerId: p.id, score: p.score })),
    correctAnswer: question.correctAnswer,
  };
}

// 进入下一轮
export function nextRound(roomId: string): { hasMore: boolean; round?: number } {
  const room = rooms.get(roomId);
  if (!room) return { hasMore: false };

  room.currentRound++;
  room.buzzerWinner = null;
  room.currentQuestion = null;

  if (room.currentRound > room.totalRounds) {
    room.status = 'finished';
    return { hasMore: false };
  }

  return { hasMore: true, round: room.currentRound };
}

// 获取游戏结果
export function getGameResult(roomId: string): {
  winner: Player | null;
  finalScores: { playerId: string; score: number }[];
  stats: GameStats;
} | null {
  const room = rooms.get(roomId);
  if (!room) return null;

  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0].score > sortedPlayers[1].score ? sortedPlayers[0] : null;

  return {
    winner,
    finalScores: room.players.map(p => ({ playerId: p.id, score: p.score })),
    stats: {
      totalQuestions: room.totalRounds,
      playerStats: room.players.map(p => ({
        playerId: p.id,
        correctAnswers: Math.floor(p.score / 10),
        avgResponseTime: 0,
        fastestBuzz: 0,
      })),
    },
  };
}

// 重新开始游戏
export function restartGame(roomId: string): boolean {
  const room = rooms.get(roomId);
  if (!room) return false;

  room.players.forEach(p => {
    p.score = 0;
    p.isReady = false;
    p.selectedCategories = [];
  });
  room.status = 'waiting';
  room.currentRound = 0;
  room.currentQuestion = null;
  room.buzzerWinner = null;
  room.questions = [];
  room.categoryPool = [];

  return true;
}
