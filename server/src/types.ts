// 服务器端类型定义 - 简化版

export interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  selectedCategories: string[];
  isReady: boolean;
}

export interface Room {
  id: string;
  players: Player[];
  status: 'waiting' | 'selecting' | 'playing' | 'finished';
  currentRound: number;
  totalRounds: number;
  currentQuestion: Question | null;
  categoryPool: string[];
  questions: Question[];
  buzzerWinner: string | null;
  roundStartTime: number;
}

export interface Question {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 1 | 2 | 3;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface GameStats {
  totalQuestions: number;
  playerStats: {
    playerId: string;
    correctAnswers: number;
    avgResponseTime: number;
    fastestBuzz: number;
  }[];
}

// 事件数据类型
export interface RoomJoinedData {
  room: Room;
  playerId: string;
}

export interface PlayerJoinedData {
  player: Player;
}

export interface PlayerLeftData {
  playerId: string;
}

export interface PlayerReadyData {
  playerId: string;
  categories: string[];
}

export interface GameStartedData {
  room: Room;
}

export interface RoundStartedData {
  question: Question;
  round: number;
  totalRounds: number;
}

export interface CountdownData {
  count: number;
}

export interface BuzzerPressedData {
  playerId: string;
  playerName: string;
}

export interface AnswerResultData {
  correct: boolean;
  correctAnswer: number;
  scores: { playerId: string; score: number }[];
  isSecondChance?: boolean;
  explanation?: string;
}

export interface RoundEndedData {
  scores: { playerId: string; score: number }[];
  nextRound?: number;
}

export interface GameEndedData {
  winner: Player | null;
  finalScores: { playerId: string; score: number }[];
  stats: GameStats;
}

export interface ErrorData {
  message: string;
}

// 客户端发送的事件数据
export interface CreateRoomData {
  playerName: string;
}

export interface JoinRoomData {
  roomId: string;
  playerName: string;
}

export interface PlayerReadyInput {
  categories: string[];
}

export interface AnswerSubmitData {
  answer: number;
}
