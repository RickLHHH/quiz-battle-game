import { create } from 'zustand';
import type { Room, Player, Question, GameStats } from '../../../shared/types';

type GameStatus = 'home' | 'lobby' | 'selecting' | 'waiting' | 'countdown' | 'playing' | 'result' | 'ended';

interface GameState {
  // 连接状态
  isConnected: boolean;
  connectionError: string | null;
  
  // 玩家信息
  playerId: string | null;
  playerName: string;
  
  // 房间信息
  room: Room | null;
  
  // 游戏状态
  status: GameStatus;
  
  // 游戏数据
  currentQuestion: Question | null;
  currentRound: number;
  totalRounds: number;
  countdown: number;
  buzzerWinner: string | null;
  answerResult: {
    correct: boolean;
    correctAnswer: number;
    scores: { playerId: string; score: number }[];
    isSecondChance?: boolean;
  } | null;
  
  // 游戏结果
  gameResult: {
    winner: Player | null;
    finalScores: { playerId: string; score: number }[];
    stats: GameStats;
  } | null;

  // Actions
  setConnected: (connected: boolean) => void;
  setConnectionError: (error: string | null) => void;
  setPlayerId: (id: string | null) => void;
  setPlayerName: (name: string) => void;
  setRoom: (room: Room | null) => void;
  setStatus: (status: GameStatus) => void;
  setCurrentQuestion: (question: Question | null) => void;
  setCurrentRound: (round: number) => void;
  setTotalRounds: (rounds: number) => void;
  setCountdown: (count: number) => void;
  setBuzzerWinner: (playerId: string | null) => void;
  setAnswerResult: (result: GameState['answerResult']) => void;
  setGameResult: (result: GameState['gameResult']) => void;
  updatePlayerScore: (playerId: string, score: number) => void;
  reset: () => void;
}

const initialState = {
  isConnected: false,
  connectionError: null,
  playerId: null,
  playerName: '',
  room: null,
  status: 'home' as GameStatus,
  currentQuestion: null,
  currentRound: 0,
  totalRounds: 10,
  countdown: 0,
  buzzerWinner: null,
  answerResult: null,
  gameResult: null,
};

export const useGameStore = create<GameState>((set) => ({
  ...initialState,

  setConnected: (connected) => set({ isConnected: connected }),
  setConnectionError: (error) => set({ connectionError: error }),
  setPlayerId: (id) => set({ playerId: id }),
  setPlayerName: (name) => set({ playerName: name }),
  setRoom: (room) => set({ room }),
  setStatus: (status) => set({ status }),
  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  setCurrentRound: (round) => set({ currentRound: round }),
  setTotalRounds: (rounds) => set({ totalRounds: rounds }),
  setCountdown: (count) => set({ countdown: count }),
  setBuzzerWinner: (playerId) => set({ buzzerWinner: playerId }),
  setAnswerResult: (result) => set({ answerResult: result }),
  setGameResult: (result) => set({ gameResult: result }),
  
  updatePlayerScore: (playerId, score) => set((state) => {
    if (!state.room) return state;
    const newRoom = { ...state.room };
    const player = newRoom.players.find(p => p.id === playerId);
    if (player) {
      player.score = score;
    }
    return { room: newRoom };
  }),

  reset: () => set(initialState),
}));
