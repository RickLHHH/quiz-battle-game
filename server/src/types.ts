// 从 shared 目录复制的类型定义

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

// Socket 事件类型
export interface ServerToClientEvents {
  'room:joined': (data: { room: Room; playerId: string }) => void;
  'room:playerJoined': (data: { player: Player }) => void;
  'room:playerLeft': (data: { playerId: string }) => void;
  'room:playerReady': (data: { playerId: string; categories: string[] }) => void;
  'game:started': (data: { room: Room }) => void;
  'round:started': (data: { question: Question; round: number; totalRounds: number }) => void;
  'round:countdown': (data: { count: number }) => void;
  'round:go': () => void;
  'buzzer:pressed': (data: { playerId: string; playerName: string }) => void;
  'answer:result': (data: {
    correct: boolean;
    correctAnswer: number;
    scores: { playerId: string; score: number }[];
    isSecondChance?: boolean;
    explanation?: string;
  }) => void;
  'round:ended': (data: {
    scores: { playerId: string; score: number }[];
    nextRound?: number;
  }) => void;
  'game:ended': (data: {
    winner: Player | null;
    finalScores: { playerId: string; score: number }[];
    stats: GameStats;
  }) => void;
  'error': (data: { message: string }) => void;
}

export interface ClientToServerEvents {
  'room:create': (data: { playerName: string }) => void;
  'room:join': (data: { roomId: string; playerName: string }) => void;
  'room:leave': () => void;
  'player:ready': (data: { categories: string[] }) => void;
  'buzzer:press': () => void;
  'answer:submit': (data: { answer: number }) => void;
  'game:restart': () => void;
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
